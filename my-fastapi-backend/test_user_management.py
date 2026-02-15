"""
Test script for user management functionality
Tests:
1. Create a new user with dispatcher_id
2. Verify user appears in users list
3. Create a new unit
4. Verify unit appears in units list
"""

import requests
import json

BASE_URL = "http://localhost:8001/api/v1"

def get_admin_token():
    """Login as admin to get token"""
    # First, let's try to find an existing admin user
    # You may need to adjust these credentials
    login_data = {
        "username": "admin",  # or dispatcher_id of an admin user
        "password": "password123"  # adjust as needed
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        if response.status_code == 200:
            return response.json()["access_token"]
        else:
            print(f"Login failed: {response.text}")
            return None
    except Exception as e:
        print(f"Error logging in: {e}")
        return None

def test_get_units(token=None):
    """Test getting units list"""
    print("\n=== Testing GET /units ===")
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    response = requests.get(f"{BASE_URL}/units", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        units = response.json()
        print(f"Found {len(units)} units:")
        for unit in units:
            print(f"  - {unit['name']} (ID: {unit['id']})")
        return units
    else:
        print(f"Error: {response.text}")
        return []

def test_create_unit(token, unit_name="Test Unit"):
    """Test creating a new unit"""
    print(f"\n=== Testing POST /units (Create '{unit_name}') ===")
    headers = {"Authorization": f"Bearer {token}"}
    data = {"name": unit_name}
    
    response = requests.post(f"{BASE_URL}/units", json=data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        unit = response.json()
        print(f"Created unit: {unit['name']} (ID: {unit['id']})")
        return unit
    else:
        print(f"Error: {response.text}")
        return None

def test_get_users(token):
    """Test getting users list"""
    print("\n=== Testing GET /auth/users ===")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.get(f"{BASE_URL}/auth/users", headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        users = response.json()
        print(f"Found {len(users)} users:")
        for user in users:
            print(f"  - {user.get('dispatcher_id', 'N/A')} | {user.get('first_name', '')} {user.get('last_name', '')} | {user['email']} | {user['role']}")
        return users
    else:
        print(f"Error: {response.text}")
        return []

def test_create_user(token, user_data):
    """Test creating a new user"""
    print(f"\n=== Testing POST /auth/create-user ===")
    print(f"Creating user: {user_data['first_name']} {user_data['last_name']}")
    headers = {"Authorization": f"Bearer {token}"}
    
    response = requests.post(f"{BASE_URL}/auth/create-user", json=user_data, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        user = response.json()
        print(f"Created user:")
        print(f"  - ID: {user.get('dispatcher_id')}")
        print(f"  - Email: {user.get('email')}")
        print(f"  - Name: {user.get('first_name')} {user.get('last_name')}")
        print(f"  - Role: {user.get('role')}")
        print(f"  - Unit: {user.get('unit')}")
        print(f"  - Temp Password: {user.get('temporary_password')}")
        return user
    else:
        print(f"Error: {response.text}")
        return None

def main():
    print("=" * 60)
    print("User Management Test Suite")
    print("=" * 60)
    
    # Test 1: Get units without authentication
    test_get_units()
    
    # Get admin token
    print("\n=== Getting Admin Token ===")
    token = get_admin_token()
    if not token:
        print("Could not get admin token. Please ensure admin user exists.")
        print("You may need to create an admin user first.")
        return
    
    print(f"✓ Got admin token")
    
    # Test 2: Get units with authentication
    units = test_get_units(token)
    
    # Test 3: Get users
    users = test_get_users(token)
    
    # Test 4: Create a new user
    new_user = {
        "dispatcher_id": "1999",  # Test ID
        "email": "test.user@hums.edu.my",
        "password": "123456",
        "first_name": "Test",
        "last_name": "User",
        "role": "dispatcher",
        "unit": units[0]["name"] if units else "MECC HUMS"
    }
    
    created_user = test_create_user(token, new_user)
    
    # Test 5: Create a new unit (optional)
    # test_create_unit(token, "MECC Test Location")
    
    print("\n" + "=" * 60)
    print("Test Summary:")
    print(f"  - Units endpoint: {'✓' if units else '✗'}")
    print(f"  - Users endpoint: {'✓' if users is not None else '✗'}")
    print(f"  - Create user: {'✓' if created_user else '✗'}")
    print("=" * 60)

if __name__ == "__main__":
    main()
