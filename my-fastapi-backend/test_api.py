import requests
import json

# Test the registration API endpoint
def test_register():
    url = "http://127.0.0.1:8000/api/v1/auth/register"
    
    test_user = {
        "username": "john_dispatcher",
        "email": "john@dispatchums.com",
        "password": "secure123",
        "full_name": "John Dispatcher",
        "dispatcher_id": "DISP001",
        "unit": "MECC HUMS",
        "role": "dispatcher"
    }
    
    try:
        response = requests.post(url, json=test_user)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Registration successful!")
        else:
            print("❌ Registration failed!")
            
    except Exception as e:
        print(f"Error: {e}")

def test_login():
    url = "http://127.0.0.1:8000/api/v1/auth/login"
    
    credentials = {
        "username": "john_dispatcher",
        "password": "secure123"
    }
    
    try:
        response = requests.post(url, json=credentials)
        print(f"\nLogin Status Code: {response.status_code}")
        print(f"Login Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ Login successful!")
            return response.json()['access_token']
        else:
            print("❌ Login failed!")
            return None
            
    except Exception as e:
        print(f"Login Error: {e}")
        return None

def test_get_users(token):
    url = "http://127.0.0.1:8000/api/v1/auth/users"
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        print(f"\nGet Users Status Code: {response.status_code}")
        print(f"Get Users Response: {json.dumps(response.json(), indent=2)}")
        
    except Exception as e:
        print(f"Get Users Error: {e}")

if __name__ == "__main__":
    print("Testing Dispatchums API...")
    print("=" * 50)
    
    # Test registration
    test_register()
    
    # Test login
    token = test_login()
    
    # Test getting users (if login successful)
    if token:
        test_get_users(token)