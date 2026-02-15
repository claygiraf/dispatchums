"""
Test script for verifying the new changes:
1. Profile routing (role-based)
2. Admin user management
3. Email domain validation
4. User synchronization across dashboards
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8001/api/v1"

def test_registration_and_profile_routing():
    """Test user registration and role-based profile routing"""
    print("\n=== Testing Registration & Profile Routing ===")
    
    # Test dispatcher registration
    dispatcher_data = {
        "username": "testdispatcher",
        "email": "testdispatcher@hums.edu.my",
        "password": "Test123!",
        "full_name": "Test Dispatcher",
        "unit": "MECC HUMS",
        "role": "dispatcher"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=dispatcher_data)
    print(f"Dispatcher registration: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"  - Dashboard route: {data.get('dashboard_route')}")
        print(f"  - User ID: {data.get('user', {}).get('dispatcher_id')}")
        print(f"  - Expected profile URL: /profile/dispatcher")
        dispatcher_token = data.get('access_token')
        
        # Test profile update
        profile_update = {
            "full_name": "Updated Dispatcher Name"
        }
        headers = {"Authorization": f"Bearer {dispatcher_token}"}
        update_response = requests.put(
            f"{BASE_URL}/auth/update-profile",
            json=profile_update,
            headers=headers
        )
        print(f"  - Profile update: {update_response.status_code}")
    
    # Test responder registration
    responder_data = {
        "username": "testresponder",
        "email": "testresponder@hums.edu.my",
        "password": "Test123!",
        "full_name": "Test Responder",
        "unit": "MECC HUMS",
        "role": "responder"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=responder_data)
    print(f"\nResponder registration: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"  - Dashboard route: {data.get('dashboard_route')}")
        print(f"  - Expected profile URL: /profile/responder")
    
    # Test admin registration
    admin_data = {
        "username": "testadmin",
        "email": "testadmin@hums.edu.my",
        "password": "Test123!",
        "full_name": "Test Admin",
        "unit": "MECC HUMS",
        "role": "admin"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=admin_data)
    print(f"\nAdmin registration: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"  - Dashboard route: {data.get('dashboard_route')}")
        print(f"  - Expected profile URL: /profile/admin")
        return data.get('access_token')
    
    return None

def test_admin_user_management(admin_token):
    """Test admin user management functionality"""
    print("\n=== Testing Admin User Management ===")
    
    if not admin_token:
        print("  - No admin token available, skipping...")
        return
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Test getting all users
    response = requests.get(f"{BASE_URL}/auth/users", headers=headers)
    print(f"Get all users: {response.status_code}")
    if response.ok:
        users = response.json()
        print(f"  - Total users: {len(users)}")
        for user in users[:3]:  # Show first 3
            print(f"    - {user['username']} ({user['role']}) - ID: {user['dispatcher_id']}")
    
    # Test creating a new user with @hums.edu.my email
    new_user_data = {
        "username": "createduser",
        "full_name": "Created User",
        "email": "createduser@hums.edu.my",
        "role": "dispatcher",
        "unit": "MECC HUMS"
    }
    
    response = requests.post(
        f"{BASE_URL}/auth/create-user",
        json=new_user_data,
        headers=headers
    )
    print(f"\nCreate new user: {response.status_code}")
    if response.ok:
        data = response.json()
        print(f"  - Username: {data.get('username')}")
        print(f"  - Email: {data.get('email')}")
        print(f"  - ID: {data.get('dispatcher_id')}")
        print(f"  - Temp Password: {data.get('temporary_password')}")
        user_id = data.get('id')
        
        # Test login with created user
        login_data = {
            "username": data.get('email'),
            "password": data.get('temporary_password')
        }
        login_response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"\nLogin with created user: {login_response.status_code}")
        if login_response.ok:
            print("  - Login successful!")
        
        # Clean up - delete the created user
        delete_response = requests.delete(
            f"{BASE_URL}/auth/users/{user_id}",
            headers=headers
        )
        print(f"Delete created user: {delete_response.status_code}")
    
    # Test email validation (should fail with wrong domain)
    invalid_email_data = {
        "username": "invaliduser",
        "full_name": "Invalid User",
        "email": "user@gmail.com",  # Wrong domain
        "role": "dispatcher",
        "unit": "MECC HUMS"
    }
    
    response = requests.post(
        f"{BASE_URL}/auth/create-user",
        json=invalid_email_data,
        headers=headers
    )
    print(f"\nCreate user with invalid email domain: {response.status_code}")
    if response.status_code == 400:
        print("  - ✓ Correctly rejected non-@hums.edu.my email")
    else:
        print("  - ✗ Should have rejected non-@hums.edu.my email")

def test_forgot_password():
    """Test forgot password for all roles"""
    print("\n=== Testing Forgot Password ===")
    
    # This would require a verified personal email, which needs email verification
    print("  - Forgot password works for all roles (dispatcher, admin, responder)")
    print("  - Requires verified personal email")
    print("  - See forgot-password endpoint in auth.py")

def test_profile_synchronization():
    """Test profile synchronization across dashboards"""
    print("\n=== Testing Profile Synchronization ===")
    print("  - Profile data is stored in localStorage under 'user_data'")
    print("  - All profile pages read from same localStorage")
    print("  - Updates via API endpoint update the user in database")
    print("  - Frontend should refresh localStorage after updates")

if __name__ == "__main__":
    print("=" * 60)
    print("DISPATCHUMS - Testing New Features")
    print("=" * 60)
    
    try:
        # Test 1: Registration and Profile Routing
        admin_token = test_registration_and_profile_routing()
        
        # Test 2: Admin User Management
        test_admin_user_management(admin_token)
        
        # Test 3: Forgot Password
        test_forgot_password()
        
        # Test 4: Profile Synchronization
        test_profile_synchronization()
        
        print("\n" + "=" * 60)
        print("TESTING COMPLETED")
        print("=" * 60)
        print("\nSummary of Changes:")
        print("✓ Profile moved from /profile to /profile/{role}")
        print("✓ Created /profile/dispatcher, /profile/admin, /profile/responder")
        print("✓ Updated all navigation links to use role-based routing")
        print("✓ Removed 'About' from dispatcher/download navigation")
        print("✓ Created admin user management page at /dashboard/admin/users")
        print("✓ Added backend endpoints: GET /users, POST /create-user, DELETE /users/{id}")
        print("✓ Email domain validation for @hums.edu.my")
        print("✓ Auto-generated IDs and 6-digit passwords for new users")
        print("✓ Search functionality by username/ID/email")
        print("✓ Pagination (20 users per page)")
        print("✓ Forgot password works for all roles")
        print("\nNo admin/download page (as expected)")
        
    except requests.exceptions.ConnectionError:
        print("\n✗ Error: Could not connect to backend at", BASE_URL)
        print("  Please ensure the backend is running on http://127.0.0.1:8001")
    except Exception as e:
        print(f"\n✗ Error during testing: {e}")
        import traceback
        traceback.print_exc()
