import sys
sys.path.insert(0, 'c:\\Users\\User\\Documents\\dispatchums use this\\my-fastapi-backend')

from app.database.database import SessionLocal
from app.auth import authenticate_user, create_access_token
from datetime import timedelta

db = SessionLocal()

try:
    print("Testing authentication...")
    user = authenticate_user(db, "admin@hums.edu.my", "Admin123")
    
    if user:
        print(f"✅ User authenticated: {user.email}")
        print(f"   Dispatcher ID: {user.dispatcher_id}")
        print(f"   Role: {user.role}")
        
        print("\nTesting token creation...")
        token = create_access_token(
            data={"sub": user.dispatcher_id},
            expires_delta=timedelta(minutes=30)
        )
        print(f"✅ Token created: {token[:50]}...")
    else:
        print("❌ Authentication failed")
        
except Exception as e:
    print(f"❌ ERROR: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
