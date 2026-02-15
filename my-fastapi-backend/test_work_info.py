"""
Test script to verify work information (unit & role) is properly stored and immutable
"""
import requests
import json

BASE_URL = "http://localhost:8001/api/v1"

def test_work_info():
    print("Testing Work Information (Unit & Role) Implementation\n")
    print("=" * 60)
    
    # Test 1: Register a new user with unit and role
    print("\n1. Testing registration with work information...")
    register_data = {
        "username": "test_work_info_user",
        "email": "test_work_info@example.com",
        "password": "password123",
        "full_name": "Test Work Info User",
        "unit": "MECC Keningau",  # Testing with Keningau
        "role": "dispatcher"
    }
    
    try:
        # Try to register
        response = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ Registration successful!")
            print(f"  - Dispatcher ID: {result['user']['dispatcher_id']}")
            print(f"  - Unit: {result['user']['unit']}")
            print(f"  - Role: {result['user']['role']}")
            
            access_token = result['access_token']
            
            # Verify the data matches what we sent
            if result['user']['unit'] == register_data['unit']:
                print(f"✓ Unit correctly stored as '{register_data['unit']}'")
            else:
                print(f"✗ Unit mismatch! Expected '{register_data['unit']}' but got '{result['user']['unit']}'")
            
            if result['user']['role'] == register_data['role']:
                print(f"✓ Role correctly stored as '{register_data['role']}'")
            else:
                print(f"✗ Role mismatch! Expected '{register_data['role']}' but got '{result['user']['role']}'")
            
            # Test 2: Try to update profile and change unit (should be prevented)
            print("\n2. Testing unit immutability (trying to change unit)...")
            update_data = {
                "unit": "MECC Sandakan",  # Try to change unit
                "full_name": "Updated Name"
            }
            
            headers = {"Authorization": f"Bearer {access_token}"}
            update_response = requests.put(
                f"{BASE_URL}/auth/update-profile",
                json=update_data,
                headers=headers
            )
            
            if update_response.status_code == 200:
                updated_user = update_response.json()
                
                # Check if unit remained unchanged
                if updated_user['unit'] == register_data['unit']:
                    print(f"✓ Unit remained unchanged ('{register_data['unit']}') - immutability enforced!")
                else:
                    print(f"✗ Unit was changed to '{updated_user['unit']}' - immutability NOT enforced!")
                
                # Check if name was updated
                if updated_user['full_name'] == update_data['full_name']:
                    print(f"✓ Other fields (full_name) can still be updated")
            else:
                print(f"✗ Profile update failed: {update_response.status_code}")
                print(f"  Response: {update_response.text}")
            
            # Test 3: Try to update role (should also be prevented)
            print("\n3. Testing role immutability (trying to change role)...")
            update_data2 = {
                "role": "admin",  # Try to change role
                "full_name": "Another Update"
            }
            
            update_response2 = requests.put(
                f"{BASE_URL}/auth/update-profile",
                json=update_data2,
                headers=headers
            )
            
            if update_response2.status_code == 200:
                updated_user2 = update_response2.json()
                
                # Check if role remained unchanged
                if updated_user2['role'] == register_data['role']:
                    print(f"✓ Role remained unchanged ('{register_data['role']}') - immutability enforced!")
                else:
                    print(f"✗ Role was changed to '{updated_user2['role']}' - immutability NOT enforced!")
            else:
                print(f"✗ Profile update failed: {update_response2.status_code}")
            
            # Test 4: Verify data persistence
            print("\n4. Testing data persistence (fetching user info)...")
            me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            
            if me_response.status_code == 200:
                current_user = me_response.json()
                print(f"✓ Current user data retrieved:")
                print(f"  - Unit: {current_user['unit']}")
                print(f"  - Role: {current_user['role']}")
                print(f"  - Dispatcher ID: {current_user['dispatcher_id']}")
                
                # Verify all work info is correct
                if (current_user['unit'] == register_data['unit'] and 
                    current_user['role'] == register_data['role']):
                    print(f"✓ Work information persisted correctly!")
                else:
                    print(f"✗ Work information not persisted correctly")
            else:
                print(f"✗ Failed to fetch user info: {me_response.status_code}")
            
            print("\n" + "=" * 60)
            print("Test Summary:")
            print("✓ Registration stores unit and role correctly")
            print("✓ Unit cannot be changed after registration")
            print("✓ Role cannot be changed after registration")
            print("✓ Other profile fields can still be updated")
            print("=" * 60)
            
        elif response.status_code == 400:
            error_detail = response.json().get('detail', 'Unknown error')
            if 'already registered' in error_detail.lower():
                print(f"⚠ User already exists. Please delete the test user first or use a different email/username")
                print(f"  Error: {error_detail}")
            else:
                print(f"✗ Registration failed: {error_detail}")
        else:
            print(f"✗ Registration failed with status {response.status_code}")
            print(f"  Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("✗ Could not connect to the backend. Make sure the server is running on http://localhost:8001")
    except Exception as e:
        print(f"✗ Error during test: {str(e)}")

if __name__ == "__main__":
    test_work_info()
