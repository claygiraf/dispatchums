import requests
import json

# Login as admin
login = requests.post('http://localhost:8001/api/v1/auth/login', 
                     json={'identifier': 'admin@hums.edu.my', 'password': 'Admin123'})
token = login.json()['access_token']

# Create a test user
print("Creating new user...")
create_response = requests.post('http://localhost:8001/api/v1/auth/create-user',
                               headers={'Authorization': f'Bearer {token}'},
                               json={
                                   'first_name': 'Password',
                                   'last_name': 'Test',
                                   'email': 'pwdtest999@hums.edu.my',
                                   'role': 'dispatcher',
                                   'password': '654321',
                                   'dispatcher_id': '1999',
                                   'unit': 'MECC HUMS'
                               })

print(json.dumps(create_response.json(), indent=2))

# Get all users to see if password shows
print("\n\nGetting all users...")
users_response = requests.get('http://localhost:8001/api/v1/auth/users',
                             headers={'Authorization': f'Bearer {token}'})

users = users_response.json()
# Find the newly created user
for user in users:
    if user['dispatcher_id'] == '1999':
        print(f"\nNewly created user:")
        print(f"  ID: {user['dispatcher_id']}")
        print(f"  Email: {user['email']}")
        print(f"  Temporary Password: {user.get('temporary_password', 'N/A')}")
        print(f"  Password Changed By User: {user.get('password_changed_by_user', 'N/A')}")
        break
