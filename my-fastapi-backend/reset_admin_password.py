"""
Update admin password using API's hash function
"""
import sqlite3
import sys
sys.path.insert(0, 'app')

from auth import get_password_hash

# Connect to database
conn = sqlite3.connect('dispatchums.db')
cursor = conn.cursor()

# Get all admin users
cursor.execute("SELECT id, dispatcher_id, email, role FROM users WHERE role='admin'")
admins = cursor.fetchall()

print("Current admin accounts:")
for admin in admins:
    print(f"  ID: {admin[1]}, Email: {admin[2]}")

# Update password for admin@hums.edu.my to Admin123
new_password = "Admin123"
hashed = get_password_hash(new_password)

cursor.execute("""
    UPDATE users 
    SET hashed_password = ? 
    WHERE email = 'admin@hums.edu.my'
""", (hashed,))

conn.commit()

# Verify update
cursor.execute("SELECT dispatcher_id, email FROM users WHERE email='admin@hums.edu.my'")
updated_admin = cursor.fetchone()

if updated_admin:
    print(f"\n✓ Password updated successfully!")
    print("\n" + "="*50)
    print("LOGIN CREDENTIALS:")
    print("="*50)
    print(f"\nOption 1 - Login with Email:")
    print(f"  Email: {updated_admin[1]}")
    print(f"  Password: {new_password}")
    print(f"\nOption 2 - Login with Dispatcher ID:")
    print(f"  ID: {updated_admin[0]}")
    print(f"  Password: {new_password}")
    print("="*50)
else:
    print("\n✗ Admin account not found!")

conn.close()
