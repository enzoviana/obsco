#!/bin/bash

echo "🚀 Démarrage du Backend..."
cd Backend && npm start &
BACKEND_PID=$!

sleep 3

echo "🎨 Démarrage du Frontend..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Backend: http://localhost:5001"
echo "✅ Frontend: http://localhost:3000"
echo ""
echo "Pour arrêter: Ctrl+C"

wait
