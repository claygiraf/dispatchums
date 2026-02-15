import sqlite3

conn = sqlite3.connect('dispatchums.db')
cursor = conn.cursor()

# Check total users
cursor.execute('SELECT COUNT(*) FROM users WHERE is_deleted = 0')
print(f'Total active users: {cursor.fetchone()[0]}')

# Check first 5 users
cursor.execute('SELECT dispatcher_id, email, role, is_deleted FROM users LIMIT 10')
print('\nAll users in database:')
for row in cursor.fetchall():
    print(f'  ID: {row[0]} | Email: {row[1]} | Role: {row[2]} | Deleted: {row[3]}')

conn.close()
