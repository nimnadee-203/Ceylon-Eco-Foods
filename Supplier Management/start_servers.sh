#!/bin/bash

# Telecom WiFi Usage App - Server Startup Script

echo "🚀 Starting Telecom WiFi Usage App..."

# Start Backend Server
echo "📡 Starting Backend Server..."
cd BACKEND
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend Server
echo "🌐 Starting Frontend Server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "📡 Backend: http://localhost:5001"
echo "🌐 Frontend: http://localhost:3000"
echo ""
echo "Admin Login Credentials:"
echo "Email: admin@system.local"
echo "Password: admin123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
