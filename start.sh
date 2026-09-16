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


# ==============================
# Run migrations
# ==============================

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
