#!/usr/bin/env bash
cd "$(dirname "$0")/backend"
source .env 2>/dev/null || true
pip install -r requirements.txt -q
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
