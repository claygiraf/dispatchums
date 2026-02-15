from app.database.database import Base, engine, SessionLocal
from app.models.user import User
from app.auth import get_password_hash

# Create tables
print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created!")

# Create test users
db = SessionLocal()

users_data = [
    {
        "username": "admin",
        "email": "admin@hums.edu.my",
        "password": "Admin123",
        "full_name": "Admin User",
        "dispatcher_id": "3001",
        "unit": "MECC HUMS",
        "role": "admin"
    },
    {
        "username": "dispatcher",
        "email": "dispatcher@hums.edu.my",
        "password": "Disp123",
        "full_name": "Dispatcher User",
        "dispatcher_id": "1001",
        "unit": "MECC HUMS",
        "role": "dispatcher"
    },
    {
        "username": "responder",
        "email": "responder@hums.edu.my",
        "password": "Resp123",
        "full_name": "Responder User",
        "dispatcher_id": "2001",
        "unit": "MECC HUMS",
        "role": "responder"
    }
]

print("\nCreating users...")
for user_data in users_data:
    # Check if user exists
    existing = db.query(User).filter(User.email == user_data["email"]).first()
    if existing:
        print(f"  User {user_data['email']} already exists")
        continue
    
    new_user = User(
        username=user_data["username"],
        email=user_data["email"],
        hashed_password=get_password_hash(user_data["password"]),
        full_name=user_data["full_name"],
        dispatcher_id=user_data["dispatcher_id"],
        unit=user_data["unit"],
        role=user_data["role"],
        is_active=True,
        is_verified=True
    )
    db.add(new_user)
    print(f"  ✅ Created: {user_data['email']} (ID: {user_data['dispatcher_id']})")

db.commit()
db.close()

print("\n✅ Database setup complete!")
print("\nLogin credentials:")
print("  Admin: admin@hums.edu.my / Admin123")
print("  Dispatcher: dispatcher@hums.edu.my / Disp123")
print("  Responder: responder@hums.edu.my / Resp123")
