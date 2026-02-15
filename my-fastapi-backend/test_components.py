#!/usr/bin/env python3
"""
Simple test to check what's causing the 500 error
"""
import sys
import os
import traceback

# Add the current directory to the Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def test_imports():
    """Test if all imports work"""
    try:
        print("Testing imports...")
        
        # Test database
        print("- Testing database import...")
        from app.database.database import get_db, create_tables
        
        # Test models
        print("- Testing models import...")
        from app.models.user import User, UserCreate, UserResponse
        
        # Test auth functions
        print("- Testing auth import...")
        from app.auth import get_password_hash, get_user_by_username
        
        print("✅ All imports successful!")
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        traceback.print_exc()
        return False

def test_database():
    """Test database connection"""
    try:
        print("\nTesting database...")
        
        from app.database.database import get_db, create_tables
        from app.models.user import User
        
        # Create tables
        print("- Creating tables...")
        create_tables()
        
        # Test database session
        print("- Testing database session...")
        db_gen = get_db()
        db = next(db_gen)
        
        # Test a simple query
        print("- Testing query...")
        users = db.query(User).all()
        print(f"  Found {len(users)} existing users")
        
        db.close()
        print("✅ Database test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        traceback.print_exc()
        return False

def test_auth_functions():
    """Test auth functions"""
    try:
        print("\nTesting auth functions...")
        
        from app.auth import get_password_hash
        
        # Test password hashing
        print("- Testing password hashing...")
        hashed = get_password_hash("testpass123")
        print(f"  Hashed password: {hashed[:20]}...")
        
        print("✅ Auth functions test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Auth functions error: {e}")
        traceback.print_exc()
        return False

def test_registration_logic():
    """Test the registration logic step by step"""
    try:
        print("\nTesting registration logic...")
        
        from app.database.database import get_db
        from app.models.user import User, UserCreate
        from app.auth import get_password_hash, get_user_by_username, get_user_by_email
        from app.routers.auth import generate_dispatcher_id
        
        # Get database session
        db_gen = get_db()
        db = next(db_gen)
        
        # Test user data
        test_data = UserCreate(
            username="testuser999",
            email="test999@example.com",
            password="testpass123",
            full_name="Test User",
            unit="MECC HUMS"
        )
        
        print(f"- Testing with user: {test_data.username}")
        
        # Check if username exists
        print("- Checking username...")
        existing_user = get_user_by_username(db, test_data.username)
        if existing_user:
            print(f"  Username already exists: {existing_user.username}")
        else:
            print("  Username available")
        
        # Check if email exists  
        print("- Checking email...")
        existing_email = get_user_by_email(db, test_data.email)
        if existing_email:
            print(f"  Email already exists: {existing_email.email}")
        else:
            print("  Email available")
        
        # Test dispatcher ID generation
        print("- Generating dispatcher ID...")
        dispatcher_id = generate_dispatcher_id(db)
        print(f"  Generated ID: {dispatcher_id}")
        
        # Test password hashing
        print("- Hashing password...")
        hashed_password = get_password_hash(test_data.password)
        print(f"  Password hashed successfully")
        
        db.close()
        print("✅ Registration logic test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Registration logic error: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("=== Backend Component Test ===")
    
    # Change to the correct directory
    backend_dir = r"C:\Users\User\Documents\dispatchums use this\my-fastapi-backend"
    os.chdir(backend_dir)
    print(f"Working directory: {os.getcwd()}")
    
    all_tests_passed = True
    
    if not test_imports():
        all_tests_passed = False
    
    if not test_database():
        all_tests_passed = False
        
    if not test_auth_functions():
        all_tests_passed = False
        
    if not test_registration_logic():
        all_tests_passed = False
    
    if all_tests_passed:
        print("\n🎉 All tests passed! The issue might be elsewhere...")
    else:
        print("\n❌ Some tests failed. Check the errors above.")