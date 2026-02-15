"""Test forgot password flow"""
import requests
import json

print('Testing forgot password flow...')
print('='*60)

# Test with verified email
response = requests.post(
    'http://127.0.0.1:8001/api/v1/auth/forgot-password',
    json={'personal_email': 'clayderman3111@gmail.com'}
)

print(f'Status: {response.status_code}')
if response.status_code == 200:
    result = response.json()
    print(f'✅ Success!')
    print(f'Message: {result.get("message")}')
    print(f'Temp Password (DEV ONLY): {result.get("temp_password")}')
    print('='*60)
    print('✅ Email should have been sent to: clayderman3111@gmail.com')
    print('Check your inbox!')
else:
    print(f'❌ Failed: {response.text}')

print('='*60)
