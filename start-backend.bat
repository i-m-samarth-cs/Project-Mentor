@echo off
cd /d "%~dp0backend"
echo Starting Project Mentor API on http://localhost:8000
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause
