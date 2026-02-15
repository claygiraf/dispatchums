"""
Test login functionality
"""
import requests
import json

# Test user credentials
test_data = {
    "username": "test@hums.edu.my",  # Using email
    "password": "Test123"
}

print("Testing login endpoint...")
print(f"URL: http://127.0.0.1:8000/api/v1/auth/login")
print(f"Credentials: {test_data}")

try:
    response = requests.post(
        "http://127.0.0.1:8000/api/v1/auth/login",
        json=test_data
    )
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ LOGIN SUCCESSFUL!")
        data = response.json()
        print(f"Token: {data.get('access_token', 'N/A')[:50]}...")
        print(f"User: {data.get('user', {}).get('email', 'N/A')}")
    else:
        print("\n❌ LOGIN FAILED!")
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")
