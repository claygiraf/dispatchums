# Dispatchums FastAPI Backend

A FastAPI backend for the Dispatchums emergency case management system.

## Project Structure

```
my-fastapi-backend/
├── venv/                   # Virtual environment
├── app/
│   ├── __init__.py
│   ├── main.py            # FastAPI application entry point
│   ├── database/
│   │   ├── __init__.py
│   │   └── database.py    # Database configuration
│   ├── models/
│   │   ├── __init__.py
│   │   └── case.py        # Case model and Pydantic schemas
│   └── routers/
│       ├── __init__.py
│       └── cases.py       # Case management API endpoints
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables
├── .gitignore
├── start_server.bat       # Windows startup script
└── README.md             # This file
```

## Features

- **Case Management**: Create, read, update, delete emergency cases
- **Key Questions (KQ)**: Support for Protocol 6 - Breathing Problems
- **Dispatch System**: Determinant calculation and unit dispatch
- **SQLite Database**: Development database (easily switchable to PostgreSQL)
- **FastAPI**: Modern, fast web framework with automatic API documentation
- **CORS Support**: Configured for Next.js frontend integration

## Setup Instructions

### Prerequisites

- Python 3.13.3 (installed)
- VS Code (installed)
- Required VS Code Extensions (installed):
  - Python (Microsoft)
  - Python Debugger (Microsoft)
  - SQLite Viewer (alexcvzz)
  - Thunder Client (RanganK)
  - REST Client (Huachao Mao)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd "c:\Users\User\Documents\dispatchums use this\my-fastapi-backend"
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the server:**
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

   Or simply double-click `start_server.bat`

## API Endpoints

### Base URL: `http://127.0.0.1:8000`

### Health & Info
- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

### Case Management (`/api/v1/cases`)
- `POST /api/v1/cases/` - Create a new case
- `GET /api/v1/cases/` - Get all cases (with pagination and filtering)
- `GET /api/v1/cases/{case_id}` - Get a specific case
- `PUT /api/v1/cases/{case_id}` - Update a case
- `DELETE /api/v1/cases/{case_id}` - Delete a case (soft delete)

### Key Questions
- `POST /api/v1/cases/{case_id}/kq-responses` - Update KQ responses
- `GET /api/v1/cases/{case_id}/kq-responses` - Get KQ responses

### Dispatch
- `POST /api/v1/cases/{case_id}/dispatch` - Dispatch units for a case
- `POST /api/v1/cases/{case_id}/complete` - Mark case as completed

### Search
- `GET /api/v1/cases/search/by-location?location={location}` - Search by location
- `GET /api/v1/cases/search/by-status?status={status}` - Filter by status
- `GET /api/v1/cases/protocols/{protocol_id}` - Get cases by protocol

## Database Schema

The main `Case` model includes:

### Case Information
- `id`: Primary key
- `case_number`: Unique case identifier (auto-generated)
- `location`: Emergency location
- `phone_number`: Caller's phone number
- `contact_name`: Caller's name

### Patient Information
- `patient_age`: Patient age
- `patient_gender`: Patient gender
- `is_conscious`: Consciousness status
- `is_breathing`: Breathing status
- `num_hurt`: Number of people hurt/sick

### Protocol & Dispatch
- `protocol_id`: Protocol number (e.g., "6")
- `protocol_name`: Protocol name (e.g., "Breathing Problems")
- `kq_responses`: Key Questions responses (JSON)
- `determinant_code`: Dispatch determinant (e.g., "6-E-1")
- `dispatch_priority`: Priority level (E, D, C, B, A)
- `dispatched_units`: Units dispatched (JSON array)

### Timestamps
- `created_at`: Case creation time
- `updated_at`: Last update time
- `completed_at`: Case completion time

## Environment Variables

Create/modify `.env` file:

```env
# Database Configuration
DATABASE_URL=sqlite:///./dispatchums.db

# Security Configuration
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=Dispatchums API

# CORS Settings
BACKEND_CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

## Frontend Integration

The frontend (`http://localhost:3000`) is configured to connect to this backend. The API client is available in `frontend/lib/api.ts`.

## Development Tools

### Thunder Client (VS Code Extension)
Test API endpoints directly in VS Code with Thunder Client.

### SQLite Viewer (VS Code Extension)
View and edit the SQLite database directly in VS Code.

### Interactive API Documentation
Visit `http://127.0.0.1:8000/docs` for Swagger UI documentation where you can test all endpoints.

## Production Deployment

For production:

1. Change `DATABASE_URL` to PostgreSQL connection string
2. Update `SECRET_KEY` to a secure random key
3. Configure proper CORS origins
4. Use a production WSGI server like Gunicorn
5. Set up environment-specific configuration

## Case Management Workflow

1. **Create Case**: POST to `/api/v1/cases/` with initial case data
2. **Update Case**: PUT to `/api/v1/cases/{case_id}` as information is gathered
3. **Add KQ Responses**: POST to `/api/v1/cases/{case_id}/kq-responses`
4. **Dispatch**: POST to `/api/v1/cases/{case_id}/dispatch` with determinant and units
5. **Complete**: POST to `/api/v1/cases/{case_id}/complete` when case is finished

## Support

For issues or questions about the FastAPI backend, check:
- Interactive API docs at `http://127.0.0.1:8000/docs`
- Server logs in the terminal
- SQLite database using the SQLite Viewer extension