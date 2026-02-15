"""Test password update"""
from app.database.database import SessionLocal
from app.auth import get_password_hash, verify_password
from app.models.user import User

db = SessionLocal()

# Find the clayderman user (with space at end)
user = db.query(User).filter(User.username.like("clayderman%")).first()

if user:
    print(f"Testing password for user: {user.username}")
    print(f"Current hashed password: {user.hashed_password[:50]}...")
    
    # Test if "123abc" matches
    test_password = "123abc"
    matches = verify_password(test_password, user.hashed_password)
    print(f"\nDoes '123abc' match? {matches}")
    
    # Let's manually set the password to "123abc" and test
    print("\n" + "="*60)
    print("Setting password to '123abc'...")
    new_hash = get_password_hash(test_password)
    user.hashed_password = new_hash
    db.commit()
    print("Password updated in database!")
    
    # Verify it works
    db.refresh(user)
    matches_now = verify_password(test_password, user.hashed_password)
    print(f"Does '123abc' match now? {matches_now}")
    
    print("\n" + "="*60)
    print("You can now login with:")
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print(f"Password: 123abc")
else:
    print("User 'clayderman' not found")

db.close()
