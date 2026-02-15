"""
Check and update admin account password
"""
import sqlite3
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
hashed = pwd_context.hash(new_password)

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
    print(f"\n✓ Password updated for:")
    print(f"  Email: {updated_admin[1]}")
    print(f"  Dispatcher ID: {updated_admin[0]}")
    print(f"  Password: {new_password}")
else:
    print("\n✗ Admin account not found!")

conn.close()

print("\n" + "="*50)
print("LOGIN CREDENTIALS:")
print("="*50)
print(f"Email: admin@hums.edu.my")
print(f"Password: Admin123")
print(f"\nOR use Dispatcher ID:")
print(f"ID: {updated_admin[0] if updated_admin else 'N/A'}")
print(f"Password: Admin123")
