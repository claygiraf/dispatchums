"""
Add temporary_password column to users table
"""
import sqlite3
import os

# Database path
db_path = os.path.join(os.path.dirname(__file__), 'dispatchums.db')

print(f"Connecting to database: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if temporary_password column already exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'temporary_password' in columns:
        print("✓ temporary_password column already exists")
    else:
        print("Adding temporary_password column...")
        cursor.execute("ALTER TABLE users ADD COLUMN temporary_password VARCHAR(50) NULL")
        conn.commit()
        print("✓ temporary_password column added successfully")
    
    conn.close()
    print("\n✓ Migration completed!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    if conn:
        conn.rollback()
        conn.close()
