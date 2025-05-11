#!/bin/bash

# Start backend
cd backend && go run main.go &

# Start frontend
cd frontend && yarn dev &

# Wait for both processes to finish (they won't, but this keeps them running)
wait