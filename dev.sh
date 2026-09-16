#!/bin/bash

npm i

if grep -q '^ENV=' backend/.env; then
    sed -i '' 's/^ENV=.*/ENV=dev/' backend/.env
else
    echo "ENV=dev" >> backend/.env
fi
cd backend
pipenv run python manage.py runserver &
BACKEND_PID=$!

# Start the frontend
cd ../frontend
npm install
./node_modules/.bin/ng serve &

# Wait for both processes
wait $BACKEND_PID