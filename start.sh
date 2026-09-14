#!/bin/bash
set -e

# Check if psql is installed
if ! command -v psql >/dev/null 2>&1; then
  echo "❌ Postgres (psql) is not installed. Please install it first."
  echo "   macOS: brew install postgresql"
  echo "   Ubuntu: sudo apt install postgresql postgresql-contrib"
  exit 1
fi

# ==============================
# Configuration
# ==============================
#Use .env variables
DB_NAME="mind_for_minds_db"
source backend/.env

echo "🚀 Setting up local development environment..."

# Install the backend project dependencies
cd backend
pipenv install --dev

cd ..


# Create the app user if missing
psql -U $(whoami) -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
  psql -U $(whoami) -d postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"

psql -U $(whoami) -d postgres -c "ALTER ROLE $DB_USER CREATEDB;"

# Create the database if missing
psql -U $(whoami) -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
  psql -U $(whoami) -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"


# ==============================
# Run migrations
# ==============================
cd backend

echo "📂 Running migrations..."
pipenv run python manage.py migrate

# ==============================
# Create default admin
# ==============================
echo "👤 Ensuring local admin exists..."
pipenv run python manage.py create_local_admin \
  --email admin@admin.com \
  --password admin@123 \
  --first-name admin \
  --last-name admin

echo "✅ Setup complete!"
