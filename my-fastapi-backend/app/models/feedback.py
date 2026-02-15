from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database.database import Base
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class FeedbackConversation(Base):
    """
    SQLAlchemy model for feedback conversation threads
    - For dispatcher/responder: one conversation per case number with all admins
    - For admin: one conversation per case number with specific dispatcher/responder
    """
    __tablename__ = "feedback_conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # Creator of conversation
    case_number = Column(String(50), nullable=False, index=True)
    is_admin_conversation = Column(Boolean, default=False)  # True if created by admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class FeedbackMessage(Base):
    """
    SQLAlchemy model for individual messages in a feedback conversation
    """
    __tablename__ = "feedback_messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey('feedback_conversations.id'), nullable=False)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    sender_name = Column(String(100), nullable=False)
    sender_role = Column(String(20), nullable=False)  # dispatcher, responder, or admin
    sender_dispatcher_id = Column(String(20), nullable=True)  # The user's dispatcher_id (1001+, 2001+, 3001+)
    message = Column(Text, nullable=False)
    photo_url = Column(String(500), nullable=True)  # Optional photo attachment
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Feedback(Base):
    """
    SQLAlchemy model for user feedback (legacy - kept for compatibility)
    """
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    username = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(20), default="pending")  # pending, reviewed, resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Trash(Base):
    """
    SQLAlchemy model for deleted cases (soft delete)
    """
    __tablename__ = "trash"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    case_id = Column(Integer, nullable=False)  # Original case ID
    case_data = Column(Text, nullable=False)  # JSON string of full case data
    deleted_at = Column(DateTime(timezone=True), server_default=func.now())
    auto_delete_at = Column(DateTime(timezone=True), nullable=False)  # 3 months from deletion

# Pydantic models
class TrashCaseCreate(BaseModel):
    case_id: int
    case_data: dict

class FeedbackMessageCreate(BaseModel):
    case_number: str
    message: str
    photo_url: Optional[str] = None

class FeedbackMessageResponse(BaseModel):
    id: int
    conversation_id: int
    sender_id: int
    sender_name: str
    sender_role: str
    sender_dispatcher_id: Optional[str] = None
    message: str
    photo_url: Optional[str] = None
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class FeedbackConversationResponse(BaseModel):
    id: int
    user_id: int
    case_number: str
    created_at: datetime
    updated_at: datetime
    messages: List[FeedbackMessageResponse] = []
    unread_count: int = 0
    
    class Config:
        from_attributes = True

class FeedbackCreate(BaseModel):
    subject: str
    message: str

class FeedbackResponse(BaseModel):
    id: int
    user_id: int
    username: str
    email: str
    subject: str
    message: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class TrashResponse(BaseModel):
    id: int
    user_id: int
    case_id: int
    case_data: str
    deleted_at: datetime
    auto_delete_at: datetime
    
    class Config:
        from_attributes = True
