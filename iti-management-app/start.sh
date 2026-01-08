#!/bin/bash
# ITI Management App - Startup Script
# This script starts both backend and frontend servers

echo "🚀 ITI Management Application Startup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo "${BLUE}Installing backend dependencies...${NC}"
    cd backend
    npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "${BLUE}Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "${GREEN}✅ All dependencies ready!${NC}"
echo ""
echo "Starting servers..."
echo ""
echo "${BLUE}Starting Backend on http://localhost:5000${NC}"
echo "${BLUE}Starting Frontend on http://localhost:3000${NC}"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Start both servers
cd backend
npm start &
BACKEND_PID=$!

cd ../frontend
npm start &
FRONTEND_PID=$!

# Handle cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

# Wait for processes
wait
