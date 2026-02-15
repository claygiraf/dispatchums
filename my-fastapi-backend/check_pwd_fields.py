import requests
import json
import time

time.sleep(2)  # Wait for server to be ready

# Login as admin
login = requests.post('http://localhost:8001/api/v1/auth/login', 
                     json={'identifier': 'admin@hums.edu.my', 'password': 'Admin123'})
token = login.json()['access_token']

# Get user 1234
resp = requests.get('http://localhost:8001/api/v1/auth/users', 
                   headers={'Authorization': f'Bearer {token}'})

user = [u for u in resp.json() if u['dispatcher_id'] == '1234'][0]
print(json.dumps(user, indent=2))
