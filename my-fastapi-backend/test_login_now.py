"""
Test login with admin credentials
"""
import requests
import json

API_URL = "http://127.0.0.1:8001/api/v1"

print("=" * 60)
print("TESTING LOGIN")
print("=" * 60)

# Test login
login_data = {
    "username": "admin@hums.edu.my",
    "password": "Admin123"
}

print(f"\n1. Attempting login...")
print(f"   URL: {API_URL}/auth/login")
print(f"   Username: {login_data['username']}")
print(f"   Password: {login_data['password']}")

try:
    response = requests.post(
        f"{API_URL}/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\n2. Response Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ LOGIN SUCCESSFUL!")
        print(f"   Token: {data['access_token'][:50]}...")
        print(f"   User Email: {data['user']['email']}")
        print(f"   User Role: {data['user']['role']}")
        print(f"   Dispatcher ID: {data['user']['dispatcher_id']}")
        
        # Test getting current user
        token = data['access_token']
        print(f"\n3. Testing /auth/me endpoint...")
        me_response = requests.get(
            f"{API_URL}/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if me_response.status_code == 200:
            print("✅ /auth/me endpoint works!")
            print(f"   User: {me_response.json()['email']}")
        else:
            print(f"❌ /auth/me failed: {me_response.status_code}")
            print(f"   {me_response.text}")
    else:
        print(f"\n❌ LOGIN FAILED!")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.text}")
        
except Exception as e:
    print(f"\n❌ ERROR: {e}")

print("\n" + "=" * 60)
