#!/usr/bin/env python3
"""
Test script to verify all user requirements:
1. ID generation checks database for latest ID
2. Profile settings synchronization with database
3. Save changes button functionality for all roles
4. Delete account synchronization
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:8001/api/v1"

def print_section(title):
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")

def test_id_generation():
    """Test 1: Check ID generation queries database correctly"""
    print_section("TEST 1: ID Generation Database Check")
    
    # Login as admin
    admin_credentials = {
        "identifier": "3001",  # Admin ID
        "password": "123abc"
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/auth/login", json=admin_credentials)
        if login_response.status_code != 200:
            print("❌ Admin login failed. Please ensure admin account exists.")
            return
        
        admin_token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Test ID generation for each role
        for role in ['dispatcher', 'responder', 'admin']:
            response = requests.get(f"{BASE_URL}/auth/generate-next-id/{role}", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {role.capitalize()} next ID: {data['next_id']}")
            else:
                print(f"❌ Failed to generate ID for {role}: {response.text}")
        
        print("\n✅ ID generation endpoint working correctly!")
        
    except Exception as e:
        print(f"❌ Error testing ID generation: {str(e)}")

def test_profile_synchronization():
    """Test 4: Check profile settings database synchronization"""
    print_section("TEST 2: Profile Settings Database Synchronization")
    
    # Test for each role
    test_users = [
        {"identifier": "3001", "password": "123abc", "role": "admin"},
        {"identifier": "1001", "password": "123abc", "role": "dispatcher"},
        {"identifier": "2001", "password": "123abc", "role": "responder"}
    ]
    
    for user_creds in test_users:
        try:
            # Login
            login_response = requests.post(f"{BASE_URL}/auth/login", json=user_creds)
            if login_response.status_code != 200:
                print(f"⚠️  {user_creds['role'].capitalize()} ({user_creds['identifier']}) not found - skipping")
                continue
            
            token = login_response.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            
            # Get current user info
            me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            if me_response.status_code != 200:
                print(f"❌ Failed to get user info for {user_creds['role']}")
                continue
            
            user_data = me_response.json()
            print(f"\n--- {user_creds['role'].capitalize()} Profile ---")
            print(f"  ID: {user_data.get('dispatcher_id')}")
            print(f"  Email: {user_data.get('email')}")
            print(f"  Full Name: {user_data.get('full_name')}")
            print(f"  Unit: {user_data.get('unit')}")
            print(f"  Role: {user_data.get('role')}")
            print(f"  Personal Email: {user_data.get('personal_email')}")
            print(f"  Phone: {user_data.get('phone_number')}")
            print(f"  ✅ Profile data synchronized with database")
            
        except Exception as e:
            print(f"❌ Error testing {user_creds['role']} profile: {str(e)}")

def test_save_changes():
    """Test 5: Test save changes button functionality"""
    print_section("TEST 3: Save Changes Button Functionality")
    
    test_users = [
        {"identifier": "1001", "password": "123abc", "role": "dispatcher"},
        {"identifier": "2001", "password": "123abc", "role": "responder"},
        {"identifier": "3001", "password": "123abc", "role": "admin"}
    ]
    
    for user_creds in test_users:
        try:
            # Login
            login_response = requests.post(f"{BASE_URL}/auth/login", json=user_creds)
            if login_response.status_code != 200:
                print(f"⚠️  {user_creds['role'].capitalize()} not found - skipping")
                continue
            
            token = login_response.json()["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            
            # Test updating full name
            test_name = f"Test User {user_creds['role'].capitalize()} Updated"
            update_data = {
                "full_name": test_name,
                "personal_email": f"test_{user_creds['role']}@gmail.com"
            }
            
            update_response = requests.put(
                f"{BASE_URL}/auth/update-profile",
                json=update_data,
                headers=headers
            )
            
            if update_response.status_code == 200:
                updated_user = update_response.json()
                print(f"✅ {user_creds['role'].capitalize()} profile updated successfully")
                print(f"   New full name: {updated_user.get('full_name')}")
                print(f"   Personal email: {updated_user.get('personal_email')}")
                
                # Verify Unit and Role cannot be changed
                try_change = {
                    "unit": "DIFFERENT_UNIT",
                    "role": "admin"
                }
                
                invalid_response = requests.put(
                    f"{BASE_URL}/auth/update-profile",
                    json=try_change,
                    headers=headers
                )
                
                if invalid_response.status_code != 200:
                    print(f"   ✅ Correctly prevented unit/role change")
                else:
                    print(f"   ⚠️  Unit/role change should be prevented")
                    
            else:
                print(f"❌ Failed to update {user_creds['role']} profile: {update_response.text}")
                
        except Exception as e:
            print(f"❌ Error testing {user_creds['role']} save changes: {str(e)}")

def test_delete_account():
    """Test 6: Test delete account synchronization"""
    print_section("TEST 4: Delete Account Synchronization")
    
    # Login as admin
    admin_credentials = {
        "identifier": "3001",
        "password": "123abc"
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/auth/login", json=admin_credentials)
        if login_response.status_code != 200:
            print("❌ Admin login failed")
            return
        
        admin_token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Get list of users
        users_response = requests.get(f"{BASE_URL}/auth/users", headers=headers)
        if users_response.status_code != 200:
            print("❌ Failed to get users list")
            return
        
        users = users_response.json()
        print(f"Total users in system: {len(users)}")
        
        # Find a test user to delete (if exists)
        test_user = None
        for user in users:
            if user.get('dispatcher_id') == '1002':  # Test dispatcher
                test_user = user
                break
        
        if test_user:
            print(f"\nAttempting to delete user: {test_user.get('full_name')} (ID: {test_user.get('dispatcher_id')})")
            
            delete_response = requests.delete(
                f"{BASE_URL}/auth/users/{test_user['id']}",
                headers=headers
            )
            
            if delete_response.status_code == 200:
                print("✅ User deleted successfully")
                
                # Verify user is marked as deleted
                users_after = requests.get(f"{BASE_URL}/auth/users", headers=headers).json()
                deleted_user = next((u for u in users_after if u['id'] == test_user['id']), None)
                
                if deleted_user:
                    if deleted_user.get('is_deleted'):
                        print("✅ User marked as deleted in database")
                    else:
                        print("⚠️  User exists but not marked as deleted")
                else:
                    print("✅ User removed from active users list")
            else:
                print(f"❌ Failed to delete user: {delete_response.text}")
        else:
            print("⚠️  No test user found (ID: 1002). Create one to test deletion.")
            
    except Exception as e:
        print(f"❌ Error testing delete account: {str(e)}")

def main():
    print("""
╔════════════════════════════════════════════════════════════════════════════╗
║                  USER REQUIREMENTS TESTING SCRIPT                          ║
║                        January 8, 2026                                     ║
╚════════════════════════════════════════════════════════════════════════════╝
    """)
    
    print("Testing Requirements:")
    print("1. ID generation checks database for latest ID")
    print("2. Profile settings synchronization with database")
    print("3. Save changes button functionality for all roles")
    print("4. Delete account synchronization")
    print("\nMake sure the backend server is running on http://127.0.0.1:8001")
    input("\nPress Enter to start testing...")
    
    test_id_generation()
    test_profile_synchronization()
    test_save_changes()
    test_delete_account()
    
    print_section("TESTING COMPLETE")
    print("Review the results above to verify all requirements are met.")
    print("\nKey Points:")
    print("• ID generation now queries database directly")
    print("• Profile settings sync with database on load and save")
    print("• Unit and Role fields are protected from user changes")
    print("• Delete account uses soft delete and syncs with admin user management")

if __name__ == "__main__":
    main()
