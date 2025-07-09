#!/bin/bash
# Run backend and frontend concurrently from the root

# Build the frontend
cd frontend
ng build --configuration production
cd ..

#Move static files to backend
rm -rf backend/static/*
rm -rf backend/templates/*

# Copy static files (NOT index.html) to static/
cp -r frontend/dist/mind-4-minds-app/browser/assets backend/static/assets
cp -r frontend/dist/mind-4-minds-app/browser/media backend/static/media/
cp frontend/dist/mind-4-minds-app/browser/*.js backend/static/

cp frontend/dist/mind-4-minds-app/browser/*.js backend/static/
cp frontend/dist/mind-4-minds-app/browser/*.css backend/static/

cp frontend/dist/mind-4-minds-app/browser/index.html backend/templates/

if grep -q '^ENV=' backend/.env; then
    sed -i '' 's/^ENV=.*/ENV=prod/' backend/.env
else
    echo "ENV=prod" >> backend/.env
fi

# Start the backend
source .venv1/bin/activate
python backend/manage.py runserver &
BACKEND_PID=$!

# Wait for both processes
wait $BACKEND_PID
