#!/bin/bash
# Run backend and frontend concurrently from the root

# Build the frontend
cd frontend
./node_modules/.bin/ng build --configuration production
cd ..

