"""
Add username column to users table as nullable
"""
import sqlite3
import os

# Database path
db_path = os.path.join(os.path.dirname(__file__), 'dispatchums.db')

print(f"Connecting to database: {db_path}")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if username column already exists
    cursor.execute("PRAGMA table_info(users)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'username' in columns:
        print("✓ Username column already exists")
    else:
        print("Adding username column...")
        cursor.execute("ALTER TABLE users ADD COLUMN username VARCHAR(50) NULL")
        conn.commit()
        print("✓ Username column added successfully")
    
    # Verify the change
    cursor.execute("PRAGMA table_info(users)")
    columns_after = cursor.fetchall()
    
    print("\nCurrent table schema:")
    for col in columns_after:
        print(f"  {col[1]} ({col[2]}) - Nullable: {col[3] == 0}")
    
    conn.close()
    print("\n✓ Migration completed successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    if conn:
        conn.rollback()
        conn.close()
