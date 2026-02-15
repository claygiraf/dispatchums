import requests
import json

# Login as admin
login = requests.post('http://localhost:8001/api/v1/auth/login', 
                     json={'identifier': '3003', 'password': 'admin123'})
token = login.json()['access_token']

# Get all users
response = requests.get('http://localhost:8001/api/v1/auth/users', 
                       headers={'Authorization': f'Bearer {token}'})
users = response.json()

print(f'Total users: {len(users)}')
print('\nAll users:')
for u in users:
    print(f"  ID: {u['dispatcher_id']}, Name: {u['first_name']} {u['last_name']}, Email: {u['email']}, Role: {u['role']}")

print(f'\nStatus: {response.status_code}')
