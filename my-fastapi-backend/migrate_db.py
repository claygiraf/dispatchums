"""
Add missing columns to cases table
"""
import sqlite3
import os

db_path = "dispatchums.db"

if not os.path.exists(db_path):
    print(f"Database {db_path} does not exist yet. Will be created on first run.")
    exit(0)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Check if columns exist
cursor.execute("PRAGMA table_info(cases)")
columns = [row[1] for row in cursor.fetchall()]

# Add missing columns
if 'time_to_dispatch' not in columns:
    print("Adding time_to_dispatch column...")
    cursor.execute("ALTER TABLE cases ADD COLUMN time_to_dispatch INTEGER")
    print("✓ Added time_to_dispatch column")

if 'dispatch_time' not in columns:
    print("Adding dispatch_time column...")
    cursor.execute("ALTER TABLE cases ADD COLUMN dispatch_time TIMESTAMP")
    print("✓ Added dispatch_time column")

if 'case_summary' not in columns:
    print("Adding case_summary column...")
    cursor.execute("ALTER TABLE cases ADD COLUMN case_summary TEXT")
    print("✓ Added case_summary column")

conn.commit()
conn.close()

print("\n✅ Database migration completed successfully!")
