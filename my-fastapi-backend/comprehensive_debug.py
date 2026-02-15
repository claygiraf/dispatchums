#!/usr/bin/env python3
"""
Comprehensive debug script to isolate the 500 error
"""
import sys
import traceback
import sqlite3
import os
from datetime import datetime

def test_database_connection():
    """Test if database file exists and is accessible"""
    db_path = "dispatchums.db"
    
    print("\n=== DATABASE CONNECTION TEST ===")
    
    if os.path.exists(db_path):
        print(f"✅ Database file exists: {db_path}")
        
        try:
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            
            # Check if users table exists
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users';")
            table_exists = cursor.fetchone()
            
            if table_exists:
                print("✅ Users table exists")
                
                # Check table structure
                cursor.execute("PRAGMA table_info(users);")
                columns = cursor.fetchall()
                print(f"✅ Table has {len(columns)} columns:")
                for col in columns:
                    print(f"   - {col[1]} ({col[2]})")
                    
                # Count existing users
                cursor.execute("SELECT COUNT(*) FROM users;")
                count = cursor.fetchone()[0]
                print(f"✅ Current user count: {count}")
                
            else:
                print("❌ Users table does not exist")
                
            conn.close()
            
        except Exception as e:
            print(f"❌ Database connection error: {e}")
            return False
            
    else:
        print(f"❌ Database file does not exist: {db_path}")
        return False
        
    return True

def test_imports():
    """Test if all required modules can be imported"""
    print("\n=== IMPORT TEST ===")
    
    modules_to_test = [
        "fastapi",
        "sqlalchemy", 
        "passlib",
        "jose",
        "bcrypt",
        "pydantic",
        "email_validator"
    ]
    
    for module in modules_to_test:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError as e:
            print(f"❌ {module}: {e}")
            return False
            
    return True

def test_password_hashing():
    """Test password hashing functionality"""
    print("\n=== PASSWORD HASHING TEST ===")
    
    try:
        from passlib.context import CryptContext
        
        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        
        test_password = "testpass123"
        print(f"Testing password: {test_password}")
        
        # Test hashing
        hashed = pwd_context.hash(test_password)
        print(f"✅ Hash created: {hashed[:50]}...")
        
        # Test verification
        is_valid = pwd_context.verify(test_password, hashed)
        print(f"✅ Verification result: {is_valid}")
        
        return True
        
    except Exception as e:
        print(f"❌ Password hashing error: {e}")
        traceback.print_exc()
        return False

def test_model_imports():
    """Test if our app models can be imported"""
    print("\n=== MODEL IMPORT TEST ===")
    
    try:
        from app.models.user import User, UserCreate, UserResponse
        print("✅ User models imported successfully")
        
        from app.database.database import get_db, create_tables, Base
        print("✅ Database components imported successfully")
        
        from app.auth import get_password_hash, get_user_by_username, get_user_by_email
        print("✅ Auth functions imported successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Model import error: {e}")
        traceback.print_exc()
        return False

def test_database_operations():
    """Test basic database operations"""
    print("\n=== DATABASE OPERATIONS TEST ===")
    
    try:
        from app.database.database import SessionLocal, create_tables
        from app.models.user import User
        from app.auth import get_password_hash
        
        # Create tables
        print("Creating tables...")
        create_tables()
        print("✅ Tables created")
        
        # Test database session
        db = SessionLocal()
        print("✅ Database session created")
        
        # Test creating a user
        test_user_data = {
            "username": "test_debug_user",
            "email": "test@debug.com",
            "password": "testpass123",
            "full_name": "Test Debug User",
            "unit": "MECC HUMS"
        }
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.username == test_user_data["username"]).first()
        if existing_user:
            print("✅ Test user already exists, deleting...")
            db.delete(existing_user)
            db.commit()
        
        # Hash password
        hashed_password = get_password_hash(test_user_data["password"])
        print("✅ Password hashed successfully")
        
        # Create user object
        db_user = User(
            username=test_user_data["username"],
            email=test_user_data["email"],
            hashed_password=hashed_password,
            full_name=test_user_data["full_name"],
            dispatcher_id="TEST001",
            unit=test_user_data["unit"],
            role="dispatcher",
            is_active=True,
            is_verified=False
        )
        
        # Add to database
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        print(f"✅ Test user created with ID: {db_user.id}")
        
        # Clean up
        db.delete(db_user)
        db.commit()
        db.close()
        
        print("✅ Test user cleaned up")
        
        return True
        
    except Exception as e:
        print(f"❌ Database operations error: {e}")
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("=== COMPREHENSIVE DEBUG SCRIPT ===")
    print(f"Current directory: {os.getcwd()}")
    print(f"Python version: {sys.version}")
    
    tests = [
        ("Import Test", test_imports),
        ("Database Connection Test", test_database_connection), 
        ("Model Import Test", test_model_imports),
        ("Password Hashing Test", test_password_hashing),
        ("Database Operations Test", test_database_operations),
    ]
    
    results = {}
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running: {test_name}")
        print('='*50)
        
        try:
            results[test_name] = test_func()
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            traceback.print_exc()
            results[test_name] = False
    
    # Summary
    print(f"\n{'='*50}")
    print("SUMMARY")
    print('='*50)
    
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    print(f"\nOverall: {'✅ ALL TESTS PASSED' if all_passed else '❌ SOME TESTS FAILED'}")
    
    if not all_passed:
        print("\n📋 Next steps:")
        print("1. Fix the failed tests above")
        print("2. Install missing dependencies")
        print("3. Check database permissions")
        print("4. Verify file paths and imports")

if __name__ == "__main__":
    main()