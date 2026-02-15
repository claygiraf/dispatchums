"""
Add timeline timestamp columns to cases table
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

# Add missing timeline timestamp columns
if 'case_entry_time' not in columns:
    print("Adding case_entry_time column...")
    cursor.execute("ALTER TABLE cases ADD COLUMN case_entry_time TIMESTAMP")
    print("✓ Added case_entry_time column")

if 'key_questions_time' not in columns:
    print("Adding key_questions_time column...")
    cursor.execute("ALTER TABLE cases ADD COLUMN key_questions_time TIMESTAMP")
    print("✓ Added key_questions_time column")

if 'pdi_time' not in columns:
    print("Adding pdi_time column...")
    cursor.execute("ALTER TABLE cases ADD COLUMN pdi_time TIMESTAMP")
    print("✓ Added pdi_time column")

if 'dls_time' not in columns:
    print("Adding dls_time column...")
    cursor.execute("ALTER TABLE cases ADD COLUMN dls_time TIMESTAMP")
    print("✓ Added dls_time column")

conn.commit()
conn.close()

print("\n✅ Timeline columns migration completed successfully!")
