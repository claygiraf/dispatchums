import requests
import json

# Test if backend is running
try:
    response = requests.get('http://localhost:8001/api/v1/units', timeout=2)
    print(f"Backend status: {response.status_code}")
except Exception as e:
    print(f"Backend not responding: {e}")
    exit(1)

# Login as admin
print("\nLogging in as admin...")
login = requests.post('http://localhost:8001/api/v1/auth/login', 
                     json={'identifier': 'admin@hums.edu.my', 'password': 'Admin123'})
if login.status_code != 200:
    print(f"Login failed: {login.json()}")
    exit(1)

token = login.json()['access_token']
print("✓ Login successful")

# Get users
print("\nFetching users from API...")
users_response = requests.get('http://localhost:8001/api/v1/auth/users',
                             headers={'Authorization': f'Bearer {token}'})

print(f"Response status: {users_response.status_code}")
if users_response.status_code == 200:
    users = users_response.json()
    print(f"Total users returned: {len(users)}")
    if len(users) > 0:
        print("\nFirst user data:")
        print(json.dumps(users[0], indent=2))
else:
    print(f"Error: {users_response.json()}")
