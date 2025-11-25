@echo off
cd /d "%~dp0"
echo Starting FastAPI server...
echo Directory: %CD%
echo.
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
pause