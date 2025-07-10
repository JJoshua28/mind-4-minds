#!/bin/bash
# Run backend and frontend concurrently from the root

# Build the frontend
cd frontend
ng build --configuration production
cd ..

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
