import sqlite3

# Connect to the database
conn = sqlite3.connect('dispatchums.db')
cursor = conn.cursor()

try:
    # Update all NULL password_changed_by_user values to False (0 in SQLite)
    cursor.execute("""
        UPDATE users 
        SET password_changed_by_user = 0 
        WHERE password_changed_by_user IS NULL
    """)
    
    rows_updated = cursor.rowcount
    conn.commit()
    
    print(f"✓ Updated {rows_updated} users with NULL password_changed_by_user to False")
    
    # Verify the update
    cursor.execute("""
        SELECT dispatcher_id, email, password_changed_by_user 
        FROM users 
        LIMIT 5
    """)
    
    print("\nSample users after update:")
    for row in cursor.fetchall():
        print(f"  ID: {row[0]} | Email: {row[1]} | Changed: {row[2]}")
    
except Exception as e:
    print(f"✗ Error: {e}")
    conn.rollback()
finally:
    conn.close()
