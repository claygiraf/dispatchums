"""
Add all missing columns to users table
"""
import sqlite3
import os

# Database path
db_path = os.path.join(os.path.dirname(__file__), 'dispatchums.db')

print(f"Connecting to database: {db_path}")

# Define all columns that should exist
columns_to_add = [
    ("personal_email", "VARCHAR(100) NULL"),
    ("username_last_changed", "TIMESTAMP NULL"),
    ("gender", "VARCHAR(20) NULL"),
    ("dob", "VARCHAR(20) NULL"),
    ("address", "VARCHAR(255) NULL"),
    ("city", "VARCHAR(100) NULL"),
    ("state", "VARCHAR(100) NULL"),
    ("postcode", "VARCHAR(20) NULL"),
    ("phone_number", "VARCHAR(50) NULL"),
    ("profile_picture", "TEXT NULL"),
]

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Get existing columns
    cursor.execute("PRAGMA table_info(users)")
    existing_columns = [column[1] for column in cursor.fetchall()]
    
    print(f"\nExisting columns: {len(existing_columns)}")
    
    # Add missing columns
    added_count = 0
    for col_name, col_def in columns_to_add:
        if col_name not in existing_columns:
            print(f"Adding column: {col_name}...")
            cursor.execute(f"ALTER TABLE users ADD COLUMN {col_name} {col_def}")
            added_count += 1
        else:
            print(f"✓ Column {col_name} already exists")
    
    conn.commit()
    
    print(f"\n✓ Migration completed! Added {added_count} new columns")
    
    # Verify final schema
    cursor.execute("PRAGMA table_info(users)")
    final_columns = cursor.fetchall()
    print(f"\nFinal schema ({len(final_columns)} columns):")
    for col in final_columns:
        print(f"  {col[1]} ({col[2]})")
    
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    if conn:
        conn.rollback()
        conn.close()
