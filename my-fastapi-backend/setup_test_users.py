"""
Script to clean database and create test users
"""
import sys
from sqlalchemy.orm import Session
from app.database.database import engine, SessionLocal
from app.models.user import User
from app.auth import get_password_hash

def clean_database():
    """Remove all users without @hums.edu.my email"""
    db = SessionLocal()
    try:
        # Get all users
        all_users = db.query(User).all()
        print(f"\n📊 Total users in database: {len(all_users)}")
        
        # Find users without @hums.edu.my email
        users_to_delete = [user for user in all_users if not user.email.endswith('@hums.edu.my')]
        
        print(f"🗑️  Users to delete (non-@hums.edu.my): {len(users_to_delete)}")
        for user in users_to_delete:
            print(f"   - {user.username} ({user.email})")
        
        if users_to_delete:
            confirm = input("\n⚠️  Delete these users? (yes/no): ")
            if confirm.lower() == 'yes':
                for user in users_to_delete:
                    db.delete(user)
                db.commit()
                print(f"✅ Deleted {len(users_to_delete)} users")
            else:
                print("❌ Cancelled deletion")
        else:
            print("✅ No non-@hums.edu.my users found")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

def create_test_users():
    """Create test users for admin, dispatcher, and responder"""
    db = SessionLocal()
    try:
        test_users = [
            {
                "username": "admin_test",
                "email": "admin@hums.edu.my",
                "password": "Admin123",
                "full_name": "Test Admin",
                "role": "admin",
                "unit": "MECC HUMS",
                "dispatcher_id": "3001"
            },
            {
                "username": "dispatcher_test",
                "email": "dispatcher@hums.edu.my",
                "password": "Disp123",
                "full_name": "Test Dispatcher",
                "role": "dispatcher",
                "unit": "MECC HUMS",
                "dispatcher_id": "1001"
            },
            {
                "username": "responder_test",
                "email": "responder@hums.edu.my",
                "password": "Resp123",
                "full_name": "Test Responder",
                "role": "responder",
                "unit": "MECC HUMS",
                "dispatcher_id": "2001"
            }
        ]
        
        print("\n👥 Creating test users...")
        created_users = []
        
        for user_data in test_users:
            # Check if user already exists
            existing = db.query(User).filter(
                (User.email == user_data['email']) | 
                (User.username == user_data['username'])
            ).first()
            
            if existing:
                print(f"⚠️  User {user_data['username']} already exists, skipping...")
                continue
            
            # Create new user
            new_user = User(
                username=user_data['username'],
                email=user_data['email'],
                hashed_password=get_password_hash(user_data['password']),
                full_name=user_data['full_name'],
                role=user_data['role'],
                unit=user_data['unit'],
                dispatcher_id=user_data['dispatcher_id'],
                is_active=True,
                is_verified=True
            )
            
            db.add(new_user)
            created_users.append(user_data)
        
        db.commit()
        
        if created_users:
            print(f"\n✅ Created {len(created_users)} test users:")
            print("\n" + "="*60)
            for user in created_users:
                print(f"\n🔐 {user['role'].upper()}")
                print(f"   Email:    {user['email']}")
                print(f"   Password: {user['password']}")
                print(f"   ID:       {user['dispatcher_id']}")
            print("\n" + "="*60)
        else:
            print("\n✅ All test users already exist")
            
    except Exception as e:
        print(f"❌ Error creating users: {e}")
        db.rollback()
    finally:
        db.close()

def show_all_users():
    """Display all current users"""
    db = SessionLocal()
    try:
        users = db.query(User).all()
        print(f"\n📋 Current users in database: {len(users)}")
        print("="*60)
        for user in users:
            print(f"   {user.dispatcher_id} | {user.username:20} | {user.email:30} | {user.role}")
        print("="*60)
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("="*60)
    print("DATABASE CLEANUP & TEST USER SETUP")
    print("="*60)
    
    # Show current users
    show_all_users()
    
    # Clean database
    clean_database()
    
    # Create test users
    create_test_users()
    
    # Show final state
    show_all_users()
    
    print("\n✅ Setup complete!")
    print("\n📝 Login Credentials:")
    print("="*60)
    print("\n🔑 ADMIN:")
    print("   Email:    admin@hums.edu.my")
    print("   Password: Admin123")
    print("\n🔑 DISPATCHER:")
    print("   Email:    dispatcher@hums.edu.my")
    print("   Password: Disp123")
    print("\n🔑 RESPONDER:")
    print("   Email:    responder@hums.edu.my")
    print("   Password: Resp123")
    print("\n" + "="*60)
    print("\n💡 You can now test the application:")
    print("   1. Login as admin to test user management")
    print("   2. Login as dispatcher to test dispatcher features")
    print("   3. Login as responder to test responder features")
    print("\n🌐 Frontend: http://localhost:3000")
    print("🔧 Backend:  http://localhost:8001")
