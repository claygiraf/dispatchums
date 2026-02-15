"""Test profile update without personal_email"""
import requests

token = "dummy_token_for_test"  # You'll need a real token

# Get a real token first
login_response = requests.post(
    'http://127.0.0.1:8001/api/v1/auth/login',
    json={'username': 'testing09', 'password': 'test123'}
)

if login_response.status_code == 200:
    token = login_response.json()['access_token']
    print("✅ Logged in successfully")
    
    # Test 1: Update profile WITHOUT personal_email (should work now)
    print("\n" + "="*60)
    print("Test 1: Update profile without personal_email")
    print("="*60)
    
    update_data = {
        "full_name": "Test User Updated",
        "gender": "Male",
        "city": "Kota Kinabalu"
    }
    
    response = requests.put(
        'http://127.0.0.1:8001/api/v1/auth/update-profile',
        json=update_data,
        headers={'Authorization': f'Bearer {token}'}
    )
    
    if response.status_code == 200:
        print("✅ Profile updated successfully without personal_email!")
    else:
        print(f"❌ Failed: {response.status_code}")
        print(response.text)
    
    # Test 2: Update with empty personal_email (should fail with current backend)
    print("\n" + "="*60)
    print("Test 2: Update profile with empty string personal_email")
    print("="*60)
    
    update_data2 = {
        "full_name": "Test User Updated 2",
        "personal_email": ""  # Empty string
    }
    
    response2 = requests.put(
        'http://127.0.0.1:8001/api/v1/auth/update-profile',
        json=update_data2,
        headers={'Authorization': f'Bearer {token}'}
    )
    
    if response2.status_code == 200:
        print("✅ Profile updated successfully with empty personal_email")
    else:
        print(f"❌ Failed (expected): {response2.status_code}")
        print(f"Error: {response2.json()['detail']}")
    
    print("\n" + "="*60)
    print("Solution: Frontend now skips personal_email if empty or invalid")
    print("="*60)
else:
    print(f"❌ Login failed: {login_response.text}")
