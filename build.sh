#!/bin/bash
# Run backend and frontend concurrently from the root

# Build the frontend
cd frontend
./node_modules/.bin/ng build --configuration production
cd ..

if [ -f backend/.env ]; then
    sed -i 's/^ENV=.*/ENV=prod/' backend/.env
else
    echo "ENV=prod" > backend/.env
fi

# Start the backend
cd backend
pipenv run python manage.py runserver &
BACKEND_PID=$!

# Wait for both processes
wait $BACKEND_PID
