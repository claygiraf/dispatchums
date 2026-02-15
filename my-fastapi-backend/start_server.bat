@echo off
echo Starting Dispatchums FastAPI Backend...
echo.
cd /d "%~dp0"
call venv\Scripts\activate.bat
echo Virtual environment activated
echo.
echo Starting server on http://127.0.0.1:8000
echo API Documentation available at http://127.0.0.1:8000/docs
echo.
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload