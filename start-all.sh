#!/usr/bin/env bash
set -e
ROOT="$(dirname "$0")"
echo "Starting backend…"
bash "$ROOT/start-backend.sh" &
BACKEND_PID=$!
echo "Starting frontend…"
bash "$ROOT/start-frontend.sh" &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
