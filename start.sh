# Check if psql is installed
if ! command -v psql >/dev/null 2>&1; then
  echo "❌ Postgres (psql) is not installed. Please install it first."
  echo "   macOS: brew install postgresql"
  echo "   Ubuntu: sudo apt install postgresql postgresql-contrib"
  exit 1
fi

#!/bin/bash
set -e

# ==============================
# Configuration
# ==============================
ENV_FILE=".env"
DB_NAME="mind_for_minds_db"
DB_USER="django_user"
DB_PASSWORD="Mind_for_minds_app!!15"
DB_HOST="localhost"
DB_PORT="5432"

echo "🚀 Setting up local development environment..."

# ==============================
# Generate .env if missing
# ==============================

cd backend

if [ ! -f "$ENV_FILE" ]; then
  echo "⚙️  Creating $ENV_FILE..."
  DJANGO_SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

  cat > "$ENV_FILE" <<EOL
DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
ENV=dev
EOL

  echo "✅ .env file created."
else
  echo "⚠️  $ENV_FILE already exists. Skipping creation."
fi

cd ..

# ==============================
# Ensure Postgres DB exists
# ==============================
echo "📦 Ensuring Postgres database exists..."

# Create the app user if missing
psql -U $(whoami) -d postgres -tc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" | grep -q 1 || \
  psql -U $(whoami) -d postgres -c "CREATE USER django_user WITH PASSWORD '$DB_PASSWORD';"

psql -U $(whoami) -d postgres -c "ALTER ROLE $DB_USER CREATEDB;"

# Create the database if missing
psql -U $(whoami) -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1 || \
  psql -U $(whoami) -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"


# ==============================
# Activate venv & run migrations
# ==============================
echo "🐍 Activating virtual environment..."
source .venv1/bin/activate
cd backend

echo "📂 Running migrations..."
python manage.py migrate

# ==============================
# Create default admin
# ==============================
echo "👤 Ensuring local admin exists..."
python manage.py create_local_admin \
  --email admin@admin.com \
  --password admin@123 \
  --first-name admin \
  --last-name admin

echo "✅ Setup complete!"
