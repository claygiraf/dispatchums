import requests
import json

def test_updated_registration():
    """Test the updated registration with auto-assigned dispatcher ID and required unit"""
    url = "http://127.0.0.1:8000/api/v1/auth/register"
    
    # Test user data - note no dispatcher_id field
    test_user = {
        "username": "jane_dispatcher",
        "email": "jane@dispatchums.com", 
        "password": "secure123",
        "full_name": "Jane Dispatcher",
        "unit": "MECC Tawau",  # Required field with dropdown option
        "role": "dispatcher"
    }
    
    try:
        print("🧪 Testing updated registration system...")
        print(f"📤 Sending: {json.dumps(test_user, indent=2)}")
        
        response = requests.post(url, json=test_user)
        print(f"📨 Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Registration successful!")
            print(f"📋 Response: {json.dumps(result, indent=2)}")
            print(f"🆔 Auto-assigned Dispatcher ID: {result.get('dispatcher_id')}")
            print(f"🏢 Unit: {result.get('unit')}")
        else:
            print("❌ Registration failed!")
            try:
                error = response.json()
                print(f"📋 Error: {json.dumps(error, indent=2)}")
            except:
                print(f"📋 Error: {response.text}")
                
    except Exception as e:
        print(f"💥 Error: {e}")

def test_missing_unit():
    """Test registration without unit (should fail)"""
    url = "http://127.0.0.1:8000/api/v1/auth/register"
    
    test_user = {
        "username": "missing_unit_test",
        "email": "missing@test.com",
        "password": "secure123",
        "full_name": "Missing Unit Test"
        # Note: no unit field
    }
    
    try:
        print("\n🧪 Testing registration without unit (should fail)...")
        response = requests.post(url, json=test_user)
        print(f"📨 Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print("✅ Correctly rejected registration without unit!")
            try:
                error = response.json()
                print(f"📋 Error message: {error.get('detail')}")
            except:
                print(f"📋 Error: {response.text}")
        else:
            print("❌ Should have failed but didn't!")
                
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    print("Testing Updated Registration System")
    print("=" * 50)
    
    # Test successful registration
    test_updated_registration()
    
    # Test validation
    test_missing_unit()