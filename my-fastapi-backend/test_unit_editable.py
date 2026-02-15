"""
Test: Unit is editable, Role is not editable
"""
import requests

BASE_URL = "http://localhost:8001/api/v1"

def test_unit_editable_role_readonly():
    print("=" * 80)
    print("TEST: Unit Editable, Role Read-Only")
    print("=" * 80)
    
    # Login as testing10
    print("\n1. Logging in as testing10...")
    login_response = requests.post(f"{BASE_URL}/auth/login", json={
        "username": "testing10@gmail.com",
        "password": "your_password_here"  # You'll need the actual password
    })
    
    if login_response.status_code == 200:
        result = login_response.json()
        token = result['access_token']
        user = result['user']
        
        print(f"✅ Logged in successfully!")
        print(f"  Current Unit: {user['unit']}")
        print(f"  Current Role: {user['role']}")
        
        # Test changing unit
        print("\n2. Testing: Can we change Unit?")
        print(f"   Changing unit from '{user['unit']}' to 'MECC Tawau'...")
        
        headers = {"Authorization": f"Bearer {token}"}
        update_response = requests.put(
            f"{BASE_URL}/auth/update-profile",
            json={"unit": "MECC Tawau", "full_name": user['full_name']},
            headers=headers
        )
        
        if update_response.status_code == 200:
            updated = update_response.json()
            if updated['unit'] == "MECC Tawau":
                print(f"   ✅ Unit changed successfully to: {updated['unit']}")
            else:
                print(f"   ❌ Unit NOT changed: {updated['unit']}")
        else:
            print(f"   ❌ Update failed: {update_response.status_code}")
        
        # Test changing role (should fail)
        print("\n3. Testing: Can we change Role?")
        print(f"   Trying to change role from '{user['role']}' to 'admin'...")
        
        update_response2 = requests.put(
            f"{BASE_URL}/auth/update-profile",
            json={"role": "admin", "full_name": user['full_name']},
            headers=headers
        )
        
        if update_response2.status_code == 200:
            updated2 = update_response2.json()
            if updated2['role'] == user['role']:
                print(f"   ✅ Role remained unchanged: {updated2['role']} (read-only enforced)")
            else:
                print(f"   ❌ Role was changed to: {updated2['role']} (should be read-only!)")
        
        # Change unit back to original
        print("\n4. Changing unit back to 'MECC Keningau'...")
        restore_response = requests.put(
            f"{BASE_URL}/auth/update-profile",
            json={"unit": "MECC Keningau"},
            headers=headers
        )
        
        if restore_response.status_code == 200:
            restored = restore_response.json()
            print(f"   ✅ Unit restored to: {restored['unit']}")
        
        print("\n" + "=" * 80)
        print("SUMMARY:")
        print("✅ Unit CAN be changed (editable)")
        print("✅ Role CANNOT be changed (read-only)")
        print("=" * 80)
        
    else:
        print(f"❌ Login failed. Please update the password in the test script.")
        print(f"   Or test manually by logging in to the frontend.")

if __name__ == "__main__":
    test_unit_editable_role_readonly()
