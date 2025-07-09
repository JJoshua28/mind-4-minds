#!/bin/bash

if grep -q '^ENV=' backend/.env; then
    sed -i '' 's/^ENV=.*/ENV=dev/' backend/.env
else
    echo "ENV=dev" >> backend/.env
fi

source .venv1/bin/activate
python backend/manage.py runserver &
BACKEND_PID=$!

# Start the frontend
cd frontend
ng serve &

# Wait for both processes
wait $BACKEND_PID
