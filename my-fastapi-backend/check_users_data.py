import sqlite3

conn = sqlite3.connect('dispatchums.db')
cursor = conn.cursor()

cursor.execute('SELECT username, email, dispatcher_id, personal_email FROM users LIMIT 3')
users = cursor.fetchall()

print('Username | Email | Dispatcher ID | Personal Email')
print('-' * 80)
for user in users:
    print(f'{user[0]} | {user[1]} | {user[2]} | {user[3]}')

conn.close()
