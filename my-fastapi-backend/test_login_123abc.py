"""Test login with password 123abc"""
import requests

print('Testing login with password "123abc"...')
print('='*60)

# Try logging in with the password we set
response = requests.post(
    'http://127.0.0.1:8001/api/v1/auth/login',
    json={
        'username': 'clayderman',
        'password': '123abc'
    }
)

print(f'Status: {response.status_code}')
if response.status_code == 200:
    result = response.json()
    print(f'✅ Login successful!')
    print(f'Token: {result["access_token"][:50]}...')
    print(f'User: {result["user"]["username"]}')
else:
    print(f'❌ Login failed')
    print(f'Response: {response.text}')

print('='*60)
