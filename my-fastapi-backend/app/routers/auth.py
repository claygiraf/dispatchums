from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import timedelta, datetime
import logging
import traceback

from app.database.database import get_db
from app.models.user import User, UserCreate, UserResponse, UserLogin, Token
from app.auth import (
    get_password_hash, 
    authenticate_user, 
    create_access_token,
    get_user_by_username,
    get_user_by_email,
    get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={404: {"description": "Not found"}},
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def generate_dispatcher_id(db: Session) -> str:
    """Generate next available dispatcher ID starting from PED001"""
    # Get the highest existing dispatcher ID
    result = db.execute(
        text("SELECT dispatcher_id FROM users WHERE dispatcher_id LIKE 'PED%' ORDER BY dispatcher_id DESC LIMIT 1")
    ).fetchone()
    
    if result and result[0]:
        # Extract number from PED001 format and increment
        current_num = int(result[0][3:])  # Remove 'PED' prefix
        next_num = current_num + 1
    else:
        # First dispatcher
        next_num = 1
    
    return f"PED{next_num:03d}"  # Format as PED001, PED002, etc.

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user/dispatcher with comprehensive error handling
    """
    try:
        logger.info(f"Registration attempt for username: {user.username}, email: {user.email}")
        
        # Check if username already exists
        existing_user_by_username = get_user_by_username(db, user.username)
        if existing_user_by_username:
            logger.warning(f"Registration failed: Username {user.username} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )
        
        # Check if email already exists
        existing_user_by_email = get_user_by_email(db, user.email)
        if existing_user_by_email:
            logger.warning(f"Registration failed: Email {user.email} already exists")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Validate unit is provided
        if not user.unit:
            logger.warning("Registration failed: Unit selection is required")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unit selection is required"
            )
        
        # Auto-generate dispatcher ID
        logger.info("Generating dispatcher ID...")
        auto_dispatcher_id = generate_dispatcher_id(db)
        logger.info(f"Generated dispatcher ID: {auto_dispatcher_id}")
        
        # Hash password
        logger.info("Hashing password...")
        hashed_password = get_password_hash(user.password)
        logger.info("Password hashed successfully")
        
        # Create new user
        logger.info("Creating user object...")
        db_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hashed_password,
            full_name=user.full_name,
            dispatcher_id=auto_dispatcher_id,  # Auto-assigned
            unit=user.unit,  # Required
            role=user.role,
            is_active=True,
            is_verified=False  # You might want email verification
        )
        
        # Save to database
        logger.info("Adding user to database...")
        db.add(db_user)
        
        logger.info("Committing transaction...")
        db.commit()
        
        logger.info("Refreshing user object...")
        db.refresh(db_user)
        
        logger.info(f"Registration successful for user ID: {db_user.id}, dispatcher ID: {db_user.dispatcher_id}")
        return db_user
        
    except HTTPException:
        # Re-raise HTTP exceptions (validation errors)
        raise
    except Exception as e:
        # Log the full error for debugging
        logger.error(f"Unexpected error during registration: {str(e)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        
        # Rollback transaction
        db.rollback()
        
        # Return a generic 500 error to the client
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed due to server error: {str(e)}"
        )

@router.post("/login", response_model=Token)
def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login user and return JWT token
    """
    user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """
    Get current user information
    """
    return current_user

@router.get("/users", response_model=list[UserResponse])
def get_all_users(
    skip: int = 0, 
    limit: int = 100,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get all users (admin/supervisor only)
    """
    if current_user.role not in ["admin", "supervisor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Get user by ID (admin/supervisor only or own profile)
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Allow users to see their own profile or admin/supervisor to see any
    if current_user.id != user_id and current_user.role not in ["admin", "supervisor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    return user

@router.post("/logout")
def logout_user(current_user: User = Depends(get_current_active_user)):
    """
    Logout user (client should delete the token)
    """
    return {"message": "Successfully logged out"}

@router.get("/validate-token")
def validate_token(current_user: User = Depends(get_current_active_user)):
    """
    Validate if token is still valid
    """
    return {"valid": True, "user": current_user.username}