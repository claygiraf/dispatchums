import requests

# Login as admin
login = requests.post('http://localhost:8001/api/v1/auth/login', 
                     json={'identifier': 'admin@hums.edu.my', 'password': 'Admin123'})
token = login.json()['access_token']

# Get all users
users = requests.get('http://localhost:8001/api/v1/auth/users', 
                    headers={'Authorization': f'Bearer {token}'}).json()

print("All Users and Their Password Status:")
print("=" * 80)
for user in users:
    temp_pwd = user.get('temporary_password', 'None')
    changed = user.get('password_changed_by_user', 'N/A')
    print(f"ID: {user['dispatcher_id']:6} | Email: {user['email']:30} | Temp: {str(temp_pwd):10} | Changed: {changed}")
