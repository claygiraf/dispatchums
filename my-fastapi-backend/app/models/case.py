from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, Float
from sqlalchemy.sql import func
from app.database.database import Base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Case(Base):
    """
    SQLAlchemy model for emergency dispatch cases
    """
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), unique=True, index=True)
    
    # Location information
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    # Contact information
    phone_number = Column(String(50), nullable=False)
    contact_name = Column(String(100), nullable=True)
    language = Column(String(50), nullable=True)
    
    # Case details
    protocol_id = Column(String(10), nullable=True)  # e.g., "6" for Breathing Problems
    protocol_name = Column(String(100), nullable=True)  # e.g., "Breathing Problems"
    problem_description = Column(Text, nullable=True)
    chief_complaint = Column(Text, nullable=True)
    
    # Patient information
    patient_age = Column(String(10), nullable=True)
    patient_gender = Column(String(20), nullable=True)
    is_conscious = Column(Boolean, nullable=True)
    is_breathing = Column(Boolean, nullable=True)
    with_patient = Column(String(10), nullable=True)  # Yes/No/Unknown
    num_hurt = Column(Integer, nullable=True)
    
    # Key Questions responses (stored as JSON-like text)
    kq_responses = Column(Text, nullable=True)  # JSON string of KQ answers
    
    # Dispatch information
    determinant_code = Column(String(20), nullable=True)  # e.g., "6-E-1"
    dispatch_priority = Column(String(10), nullable=True)  # E, D, C, B, A
    dispatched_units = Column(Text, nullable=True)  # JSON array of unit IDs
    
    # Additional information
    hazards = Column(Text, nullable=True)
    weapons = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Status tracking
    status = Column(String(50), default="active")  # active, completed, cancelled
    
    # Dispatcher information
    dispatcher_name = Column(String(100), nullable=True)
    dispatcher_id = Column(String(50), nullable=True)
    dispatcher_unit = Column(String(50), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

# Pydantic models for API serialization

class CaseBase(BaseModel):
    """Base case model with common fields"""
    location: str
    phone_number: str
    contact_name: Optional[str] = None
    language: Optional[str] = None
    protocol_id: Optional[str] = None
    protocol_name: Optional[str] = None
    problem_description: Optional[str] = None
    chief_complaint: Optional[str] = None
    patient_age: Optional[str] = None
    patient_gender: Optional[str] = None
    is_conscious: Optional[bool] = None
    is_breathing: Optional[bool] = None
    with_patient: Optional[str] = None
    num_hurt: Optional[int] = None
    hazards: Optional[str] = None
    weapons: Optional[str] = None
    notes: Optional[str] = None

class CaseCreate(CaseBase):
    """Model for creating a new case"""
    pass

class CaseUpdate(BaseModel):
    """Model for updating an existing case"""
    location: Optional[str] = None
    phone_number: Optional[str] = None
    contact_name: Optional[str] = None
    language: Optional[str] = None
    protocol_id: Optional[str] = None
    protocol_name: Optional[str] = None
    problem_description: Optional[str] = None
    chief_complaint: Optional[str] = None
    patient_age: Optional[str] = None
    patient_gender: Optional[str] = None
    is_conscious: Optional[bool] = None
    is_breathing: Optional[bool] = None
    with_patient: Optional[str] = None
    num_hurt: Optional[int] = None
    kq_responses: Optional[str] = None
    determinant_code: Optional[str] = None
    dispatch_priority: Optional[str] = None
    dispatched_units: Optional[str] = None
    hazards: Optional[str] = None
    weapons: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    dispatcher_name: Optional[str] = None
    dispatcher_id: Optional[str] = None
    dispatcher_unit: Optional[str] = None

class CaseResponse(CaseBase):
    """Model for case responses"""
    id: int
    case_number: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    kq_responses: Optional[str] = None
    determinant_code: Optional[str] = None
    dispatch_priority: Optional[str] = None
    dispatched_units: Optional[str] = None
    status: str
    dispatcher_name: Optional[str] = None
    dispatcher_id: Optional[str] = None
    dispatcher_unit: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class KQResponse(BaseModel):
    """Model for Key Questions responses"""
    question1: Optional[str] = None  # Alert status
    question2: Optional[str] = None  # Difficulty speaking
    question2a: Optional[str] = None  # Color change description
    question2i: Optional[str] = None  # Tracheostomy distress
    question3: Optional[str] = None  # Changing color
    question3a: Optional[str] = None  # Color change description
    question4: Optional[str] = None  # Clammy/cold sweats
    question5: Optional[str] = None  # Asthma/lung problems
    question5a: Optional[str] = None  # Prescribed inhaler
    question5i: Optional[str] = None  # Inhaler used
    question6: Optional[str] = None  # Special equipment
    question6a: Optional[str] = None  # Equipment used

class DispatchRequest(BaseModel):
    """Model for dispatch requests"""
    case_id: int
    determinant_code: str
    dispatch_priority: str
    dispatched_units: list[str]
    kq_responses: Optional[KQResponse] = None