"""
Test script to verify case deletion and trash functionality
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8001/api/v1"

def test_case_deletion_to_trash():
    print("Testing Case Deletion to Trash...")
    print("=" * 60)
    
    # Login
    print("\n1. Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/auth/login",
        json={
            "username": "clayderman",
            "password": "123abc"
        }
    )
    
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        user_id = login_response.json()["user"]["id"]
        print("✅ Login successful!")
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        return
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    # Get cases
    print("\n2. Fetching cases...")
    cases_response = requests.get(
        f"{BASE_URL}/cases/",
        headers=headers
    )
    
    if cases_response.status_code == 200:
        cases = cases_response.json()
        print(f"✅ Found {len(cases)} case(s)")
        
        if len(cases) > 0:
            test_case = cases[0]
            print(f"   Using case #{test_case['case_number']} for testing")
            
            # Move to trash
            print("\n3. Moving case to trash...")
            trash_response = requests.post(
                f"{BASE_URL}/feedback/trash/move-case",
                headers=headers,
                json={
                    "case_id": test_case['id'],
                    "case_data": test_case
                }
            )
            
            if trash_response.status_code == 200:
                trash_data = trash_response.json()
                print("✅ Case moved to trash successfully!")
                print(f"   Auto-delete date: {trash_data['auto_delete_at']}")
                
                # Check trash
                print("\n4. Checking trash...")
                trash_list_response = requests.get(
                    f"{BASE_URL}/feedback/trash/my-trash",
                    headers=headers
                )
                
                if trash_list_response.status_code == 200:
                    trash_items = trash_list_response.json()
                    print(f"✅ Found {len(trash_items)} item(s) in trash")
                    
                    # Verify our case is there
                    found = False
                    for item in trash_items:
                        if item['case_id'] == test_case['id']:
                            found = True
                            print(f"✅ Case #{test_case['case_number']} found in trash!")
                            break
                    
                    if not found:
                        print(f"❌ Case not found in trash")
                else:
                    print(f"❌ Failed to fetch trash: {trash_list_response.status_code}")
            else:
                print(f"❌ Failed to move to trash: {trash_response.status_code}")
                print(trash_response.text)
        else:
            print("⚠️  No cases available for testing")
    else:
        print(f"❌ Failed to fetch cases: {cases_response.status_code}")
    
    print("\n" + "=" * 60)
    print("✅ Test completed!")

if __name__ == "__main__":
    test_case_deletion_to_trash()
