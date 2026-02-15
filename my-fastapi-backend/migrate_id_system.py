"""
Migration script to update the ID system and feedback tables
- Updates user IDs to new format (1001+ dispatcher, 2001+ responder, 3001+ admin)
- Adds sender_dispatcher_id to feedback_messages
- Adds is_admin_conversation to feedback_conversations
"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dispatchums.db")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def migrate():
    db = SessionLocal()
    try:
        print("Starting ID system migration...")
        
        # 1. Add new column to feedback_messages if it doesn't exist
        print("Adding sender_dispatcher_id column to feedback_messages...")
        try:
            db.execute(text("""
                ALTER TABLE feedback_messages 
                ADD COLUMN sender_dispatcher_id VARCHAR(20)
            """))
            db.commit()
            print("✓ Added sender_dispatcher_id column")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                print("✓ sender_dispatcher_id column already exists")
                db.rollback()
            else:
                print(f"Error adding sender_dispatcher_id: {e}")
                db.rollback()
        
        # 2. Add is_admin_conversation column to feedback_conversations
        print("Adding is_admin_conversation column to feedback_conversations...")
        try:
            db.execute(text("""
                ALTER TABLE feedback_conversations 
                ADD COLUMN is_admin_conversation BOOLEAN DEFAULT 0
            """))
            db.commit()
            print("✓ Added is_admin_conversation column")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower():
                print("✓ is_admin_conversation column already exists")
                db.rollback()
            else:
                print(f"Error adding is_admin_conversation: {e}")
                db.rollback()
        
        # 3. Update existing feedback messages with sender_dispatcher_id from users table
        print("Updating existing feedback messages with sender_dispatcher_id...")
        try:
            db.execute(text("""
                UPDATE feedback_messages 
                SET sender_dispatcher_id = (
                    SELECT dispatcher_id FROM users WHERE users.id = feedback_messages.sender_id
                )
                WHERE sender_dispatcher_id IS NULL
            """))
            db.commit()
            print("✓ Updated existing feedback messages")
        except Exception as e:
            print(f"Error updating feedback messages: {e}")
            db.rollback()
        
        # 4. Migrate existing user IDs to new format
        print("\nMigrating user IDs to new format...")
        print("NOTE: This will update dispatcher_id for all users based on their role")
        print("Existing users will get new IDs starting from 1001 (dispatcher), 2001 (responder), 3001 (admin)")
        
        # Get all users grouped by role
        users = db.execute(text("""
            SELECT id, role, dispatcher_id 
            FROM users 
            ORDER BY role, id
        """)).fetchall()
        
        role_counters = {
            'dispatcher': 1001,
            'responder': 2001,
            'admin': 3001
        }
        
        for user in users:
            user_id, role, old_dispatcher_id = user
            role_lower = (role or 'dispatcher').lower()
            
            # Get the appropriate counter for this role
            if role_lower not in role_counters:
                role_lower = 'dispatcher'  # default
            
            new_dispatcher_id = str(role_counters[role_lower])
            role_counters[role_lower] += 1
            
            # Update the user's dispatcher_id
            db.execute(text("""
                UPDATE users 
                SET dispatcher_id = :new_id 
                WHERE id = :user_id
            """), {"new_id": new_dispatcher_id, "user_id": user_id})
            
            print(f"✓ Updated user {user_id} ({role}): {old_dispatcher_id} → {new_dispatcher_id}")
        
        db.commit()
        print("\n✓ Migration completed successfully!")
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    migrate()
