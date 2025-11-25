from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from app.database.database import Base
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(Base):
    """
    SQLAlchemy model for users/dispatchers
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=True)
    
    # Dispatcher specific fields
    dispatcher_id = Column(String(20), unique=True, nullable=True)
    unit = Column(String(50), nullable=True)  # e.g., "MECC HUMS"
    role = Column(String(50), default="dispatcher")  # dispatcher, supervisor, admin
    
    # Status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

# Pydantic models for API serialization

class UserBase(BaseModel):
    """Base user model with common fields"""
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    dispatcher_id: Optional[str] = None
    unit: Optional[str] = None
    role: str = "dispatcher"

class UserCreate(BaseModel):
    """Model for creating a new user"""
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    unit: str  # Required field
    role: str = "dispatcher"

class UserUpdate(BaseModel):
    """Model for updating user information"""
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    dispatcher_id: Optional[str] = None
    unit: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None

class UserResponse(UserBase):
    """Model for user responses (without password)"""
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    """Model for user login"""
    username: str
    password: str

class Token(BaseModel):
    """Model for authentication token response"""
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    """Model for token data"""
    username: Optional[str] = None