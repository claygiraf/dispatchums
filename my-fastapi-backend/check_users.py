import sqlite3

conn = sqlite3.connect('dispatchums.db')
cursor = conn.cursor()
cursor.execute('SELECT username, email, dispatcher_id, role FROM users LIMIT 5')

print('Username | Email | Dispatcher_ID | Role')
print('-' * 80)
for row in cursor.fetchall():
    print(f'{row[0]} | {row[1]} | {row[2]} | {row[3]}')

conn.close()
