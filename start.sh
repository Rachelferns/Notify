#!/bin/bash

if [ -z "$MONGO_URL" ]; then
  echo "ERROR: MONGO_URL environment variable is not set. Please add your MongoDB connection string as a secret."
  exit 1
fi

echo "Starting Notice Service on port 5001..."
PORT=5001 node notice-service/server.js &
NOTICE_PID=$!

echo "Starting Auth Service on port 5002..."
PORT=5002 node auth-service/server.js &
AUTH_PID=$!

sleep 2

echo "Starting Gateway on port 5003..."
PORT=5003 node gateway/server.js &
GATEWAY_PID=$!

sleep 1

echo "Starting Frontend on port 5000..."
cd frontend && npm start

wait
