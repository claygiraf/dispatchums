from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from app.database.database import create_tables
from app.routers import cases, auth
from app.models import user  # Import to ensure User table is created

# Load environment variables
load_dotenv()

# Lifespan event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    create_tables()
    yield
    # Shutdown (if needed)

# Create FastAPI app
app = FastAPI(
    title=os.getenv("PROJECT_NAME", "Dispatchums API"),
    description="API for Dispatchums case management system",
    version="1.0.0",
    lifespan=lifespan,
    openapi_url="/api/v1/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:3001", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(cases.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to Dispatchums API", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)