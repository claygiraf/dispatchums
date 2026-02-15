from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime, timedelta
from typing import List
import json

from app.database.database import get_db
from app.models.feedback import (
    Feedback, FeedbackCreate, FeedbackResponse, 
    FeedbackConversation, FeedbackMessage, FeedbackMessageCreate, 
    FeedbackMessageResponse, FeedbackConversationResponse,
    Trash, TrashResponse, TrashCaseCreate
)
from app.models.user import User
from app.auth import get_current_active_user

router = APIRouter(
    prefix="/feedback",
    tags=["feedback"],
)

@router.post("/submit", response_model=FeedbackResponse)
def submit_feedback(
    feedback: FeedbackCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Submit feedback - user-specific
    """
    db_feedback = Feedback(
        user_id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        subject=feedback.subject,
        message=feedback.message,
        status="pending"
    )
    
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    
    return db_feedback

@router.get("/my-feedbacks", response_model=List[FeedbackResponse])
def get_my_feedbacks(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all feedbacks from current user
    """
    feedbacks = db.query(Feedback).filter(Feedback.user_id == current_user.id).order_by(Feedback.created_at.desc()).all()
    return feedbacks

@router.get("/all", response_model=List[FeedbackResponse])
def get_all_feedbacks(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all feedbacks - Admin only
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    feedbacks = db.query(Feedback).order_by(Feedback.created_at.desc()).all()
    return feedbacks

@router.put("/{feedback_id}/status")
def update_feedback_status(
    feedback_id: int,
    status: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update feedback status - Admin only
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    
    feedback.status = status
    feedback.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Status updated successfully"}

# Trash endpoints
@router.post("/trash/move-case")
def move_case_to_trash(
    trash_data: TrashCaseCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Move a case to trash (soft delete) - user specific
    """
    # Calculate auto-delete date (3 months from now)
    auto_delete_date = datetime.utcnow() + timedelta(days=90)
    
    trash_item = Trash(
        user_id=current_user.id,
        case_id=trash_data.case_id,
        case_data=json.dumps(trash_data.case_data),
        auto_delete_at=auto_delete_date
    )
    
    db.add(trash_item)
    db.commit()
    
    return {"message": "Case moved to trash", "auto_delete_at": auto_delete_date}

@router.get("/trash/my-trash", response_model=List[TrashResponse])
def get_my_trash(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all trash items for current user
    """
    trash_items = db.query(Trash).filter(Trash.user_id == current_user.id).order_by(Trash.deleted_at.desc()).all()
    return trash_items

@router.delete("/trash/{trash_id}")
def permanent_delete(
    trash_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete a trash item
    """
    trash_item = db.query(Trash).filter(
        Trash.id == trash_id,
        Trash.user_id == current_user.id
    ).first()
    
    if not trash_item:
        raise HTTPException(status_code=404, detail="Trash item not found")
    
    db.delete(trash_item)
    db.commit()
    
    return {"message": "Permanently deleted"}

@router.delete("/trash/auto-clean")
def auto_clean_trash(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Automatically delete expired trash items (3 months old)
    """
    now = datetime.utcnow()
    expired_items = db.query(Trash).filter(
        Trash.user_id == current_user.id,
        Trash.auto_delete_at <= now
    ).all()
    
    count = len(expired_items)
    
    for item in expired_items:
        db.delete(item)
    
    db.commit()
    
    return {"message": f"Deleted {count} expired items"}

# Chat-based feedback endpoints
@router.post("/chat/send", response_model=FeedbackMessageResponse)
def send_feedback_message(
    message_data: FeedbackMessageCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Send a message in a feedback conversation
    - Dispatcher/Responder messages go to ALL admins
    - Admin messages go to specific dispatcher/responder who created the conversation
    """
    # Find or create conversation for this case number
    conversation = db.query(FeedbackConversation).filter(
        and_(
            FeedbackConversation.user_id == current_user.id,
            FeedbackConversation.case_number == message_data.case_number
        )
    ).first()
    
    if not conversation:
        # Create new conversation
        is_admin = current_user.role == "admin"
        conversation = FeedbackConversation(
            user_id=current_user.id,
            case_number=message_data.case_number,
            is_admin_conversation=is_admin
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    else:
        # Update conversation timestamp
        conversation.updated_at = datetime.utcnow()
        db.commit()
    
    # Create message with sender_dispatcher_id
    # Use first_name + last_name instead of username
    sender_display_name = f"{current_user.first_name} {current_user.last_name}" if current_user.first_name and current_user.last_name else (current_user.full_name or current_user.username)
    
    new_message = FeedbackMessage(
        conversation_id=conversation.id,
        sender_id=current_user.id,
        sender_name=sender_display_name,
        sender_role=current_user.role,
        sender_dispatcher_id=current_user.dispatcher_id,  # Include the user's ID (1001+, 2001+, 3001+)
        message=message_data.message,
        photo_url=message_data.photo_url
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    return new_message

@router.get("/chat/conversations", response_model=List[FeedbackConversationResponse])
def get_my_conversations(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all feedback conversations:
    - For dispatcher/responder: their own conversations
    - For admin: ALL conversations from dispatchers and responders
    """
    if current_user.role == "admin":
        # Admins see ALL conversations from dispatchers and responders
        conversations = db.query(FeedbackConversation).filter(
            FeedbackConversation.is_admin_conversation == False
        ).order_by(FeedbackConversation.updated_at.desc()).all()
    else:
        # Dispatchers and responders see only their own conversations
        conversations = db.query(FeedbackConversation).filter(
            FeedbackConversation.user_id == current_user.id
        ).order_by(FeedbackConversation.updated_at.desc()).all()
    
    result = []
    for conv in conversations:
        messages = db.query(FeedbackMessage).filter(
            FeedbackMessage.conversation_id == conv.id
        ).order_by(FeedbackMessage.created_at.asc()).all()
        
        # Count unread messages
        if current_user.role == "admin":
            # For admin: count unread messages from dispatchers/responders
            unread_count = db.query(FeedbackMessage).filter(
                and_(
                    FeedbackMessage.conversation_id == conv.id,
                    FeedbackMessage.sender_role.in_(["dispatcher", "responder"]),
                    FeedbackMessage.is_read == False
                )
            ).count()
        else:
            # For dispatcher/responder: count unread messages from admins
            unread_count = db.query(FeedbackMessage).filter(
                and_(
                    FeedbackMessage.conversation_id == conv.id,
                    FeedbackMessage.sender_role == "admin",
                    FeedbackMessage.is_read == False
                )
            ).count()
        
        result.append(FeedbackConversationResponse(
            id=conv.id,
            user_id=conv.user_id,
            case_number=conv.case_number,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            messages=messages,
            unread_count=unread_count
        ))
    
    return result

@router.get("/chat/conversation/{case_number}", response_model=FeedbackConversationResponse)
def get_conversation_by_case(
    case_number: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific conversation by case number
    """
    conversation = db.query(FeedbackConversation).filter(
        and_(
            FeedbackConversation.user_id == current_user.id,
            FeedbackConversation.case_number == case_number
        )
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(FeedbackMessage).filter(
        FeedbackMessage.conversation_id == conversation.id
    ).order_by(FeedbackMessage.created_at.asc()).all()
    
    # Mark admin messages as read
    db.query(FeedbackMessage).filter(
        and_(
            FeedbackMessage.conversation_id == conversation.id,
            FeedbackMessage.sender_role == "admin",
            FeedbackMessage.is_read == False
        )
    ).update({"is_read": True})
    db.commit()
    
    unread_count = 0  # All marked as read now
    
    return FeedbackConversationResponse(
        id=conversation.id,
        user_id=conversation.user_id,
        case_number=conversation.case_number,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=messages,
        unread_count=unread_count
    )

@router.delete("/chat/conversation/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a feedback conversation (for current user only, not for other party)
    - For dispatcher/responder: marks conversation as deleted for them
    - For admin: admin can fully delete conversations
    Note: This is a soft delete - conversation still visible to other party
    """
    conversation = db.query(FeedbackConversation).filter(
        FeedbackConversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Only creator or admin can delete
    if conversation.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this conversation")
    
    # For now, hard delete for simplicity
    # In production, you might want to implement soft delete
    db.query(FeedbackMessage).filter(
        FeedbackMessage.conversation_id == conversation_id
    ).delete()
    
    db.delete(conversation)
    db.commit()
    
    return {"message": "Conversation deleted successfully"}

@router.delete("/chat/message/{message_id}")
def delete_message(
    message_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Delete a specific message from a conversation
    Only the sender can delete their own messages
    Deletion is synchronized - message is removed for both sides
    """
    message = db.query(FeedbackMessage).filter(
        FeedbackMessage.id == message_id
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    # Only sender or admin can delete message
    if message.sender_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this message")
    
    db.delete(message)
    db.commit()
    
    return {"message": "Message deleted successfully"}

# Admin endpoints for chat
@router.get("/chat/admin/all-conversations", response_model=List[FeedbackConversationResponse])
def get_all_conversations_admin(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all feedback conversations - Admin only
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    conversations = db.query(FeedbackConversation).order_by(
        FeedbackConversation.updated_at.desc()
    ).all()
    
    result = []
    for conv in conversations:
        messages = db.query(FeedbackMessage).filter(
            FeedbackMessage.conversation_id == conv.id
        ).order_by(FeedbackMessage.created_at.asc()).all()
        
        # Count unread messages from dispatchers
        unread_count = db.query(FeedbackMessage).filter(
            and_(
                FeedbackMessage.conversation_id == conv.id,
                FeedbackMessage.sender_role == "dispatcher",
                FeedbackMessage.is_read == False
            )
        ).count()
        
        result.append(FeedbackConversationResponse(
            id=conv.id,
            user_id=conv.user_id,
            case_number=conv.case_number,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            messages=messages,
            unread_count=unread_count
        ))
    
    return result

@router.post("/chat/admin/reply/{conversation_id}", response_model=FeedbackMessageResponse)
def admin_reply_to_conversation(
    conversation_id: int,
    message: str,
    photo_url: str = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Admin reply to a feedback conversation
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    conversation = db.query(FeedbackConversation).filter(
        FeedbackConversation.id == conversation_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Update conversation timestamp
    conversation.updated_at = datetime.utcnow()
    
    # Create admin message - use first_name + last_name instead of username
    sender_display_name = f"{current_user.first_name} {current_user.last_name}" if current_user.first_name and current_user.last_name else (current_user.full_name or current_user.username)
    
    admin_message = FeedbackMessage(
        conversation_id=conversation.id,
        sender_id=current_user.id,
        sender_name=sender_display_name,
        sender_role="admin",
        message=message,
        photo_url=photo_url
    )
    
    db.add(admin_message)
    
    # Mark dispatcher messages in this conversation as read
    db.query(FeedbackMessage).filter(
        and_(
            FeedbackMessage.conversation_id == conversation_id,
            FeedbackMessage.sender_role == "dispatcher",
            FeedbackMessage.is_read == False
        )
    ).update({"is_read": True})
    
    db.commit()
    db.refresh(admin_message)
    
    return admin_message
