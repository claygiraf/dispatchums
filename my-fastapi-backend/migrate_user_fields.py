"""
Migration script to add personal_email and username_last_changed columns to users table
"""
import sqlite3
import os

# Get database path
DB_PATH = os.path.join(os.path.dirname(__file__), "dispatchums.db")

def migrate_database():
    """Add new columns to users table"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        print("Starting migration...")
        
        # Check if personal_email column exists
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add personal_email column if it doesn't exist
        if 'personal_email' not in columns:
            print("Adding personal_email column...")
            cursor.execute("""
                ALTER TABLE users 
                ADD COLUMN personal_email VARCHAR(100)
            """)
            print("✓ personal_email column added")
        else:
            print("✓ personal_email column already exists")
        
        # Add username_last_changed column if it doesn't exist
        if 'username_last_changed' not in columns:
            print("Adding username_last_changed column...")
            cursor.execute("""
                ALTER TABLE users 
                ADD COLUMN username_last_changed DATETIME
            """)
            print("✓ username_last_changed column added")
        else:
            print("✓ username_last_changed column already exists")
        
        conn.commit()
        print("\nMigration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {e}")
        conn.rollback()
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()
