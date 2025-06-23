#!/bin/bash
# Run backend and frontend concurrently from the root

# Start the backend
source .venv1/bin/activate
python backend/manage.py runserver &
BACKEND_PID=$!

# Start the frontend
cd frontend
ng serve &

# Wait for both processes
wait $BACKEND_PID
