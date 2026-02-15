"""
Test script to verify role-based routing after registration and login
Tests that:
1. Registration assigns correct ID based on role
2. Login returns correct dashboard_route
3. Each role routes to their specific dashboard
"""
import requests
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:8001/api/v1"

def print_section(title):
    print("\n" + "="*60)
    print(f"  {title}")
    print("="*60)

def test_registration(role, expected_id_start):
    """Test registration for a specific role"""
    print(f"\n📝 Testing {role.upper()} registration...")
    
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    test_user = {
        "username": f"test_{role}_{timestamp}",
        "email": f"test_{role}_{timestamp}@example.com",
        "password": "Test123!",
        "full_name": f"Test {role.title()}",
        "unit": "MECC HUMS",
        "role": role
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=test_user)
        response.raise_for_status()
        result = response.json()
        
        print(f"✅ Registration successful!")
        print(f"   User ID: {result['user']['id']}")
        print(f"   Dispatcher ID: {result['user']['dispatcher_id']}")
        print(f"   Role: {result['user']['role']}")
        print(f"   Dashboard Route: {result.get('dashboard_route', 'NOT PROVIDED')}")
        
        # Verify ID starts with expected number
        dispatcher_id = result['user']['dispatcher_id']
        if dispatcher_id.startswith(expected_id_start):
            print(f"   ✅ ID format correct (starts with {expected_id_start})")
        else:
            print(f"   ❌ ERROR: ID should start with {expected_id_start}, got {dispatcher_id}")
        
        # Verify dashboard route
        expected_route = f"/dashboard/{role}" if role != "admin" else "/dashboard/admin"
        if result.get('dashboard_route') == expected_route:
            print(f"   ✅ Dashboard route correct: {expected_route}")
        else:
            print(f"   ❌ ERROR: Expected {expected_route}, got {result.get('dashboard_route')}")
        
        return result
        
    except requests.exceptions.HTTPError as e:
        print(f"❌ Registration failed: {e}")
        print(f"   Response: {e.response.text}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_login(username, password, expected_route):
    """Test login and verify dashboard routing"""
    print(f"\n🔐 Testing login for {username}...")
    
    credentials = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=credentials)
        response.raise_for_status()
        result = response.json()
        
        print(f"✅ Login successful!")
        print(f"   User: {result['user']['full_name']}")
        print(f"   Role: {result['user']['role']}")
        print(f"   Dispatcher ID: {result['user']['dispatcher_id']}")
        print(f"   Dashboard Route: {result.get('dashboard_route', 'NOT PROVIDED')}")
        
        # Verify dashboard route
        if result.get('dashboard_route') == expected_route:
            print(f"   ✅ Dashboard route correct: {expected_route}")
        else:
            print(f"   ❌ ERROR: Expected {expected_route}, got {result.get('dashboard_route')}")
        
        return result
        
    except requests.exceptions.HTTPError as e:
        print(f"❌ Login failed: {e}")
        print(f"   Response: {e.response.text}")
        return None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def main():
    print_section("ROLE-BASED ROUTING TEST")
    print("This script tests registration and login for all roles")
    print("Make sure the backend is running on http://127.0.0.1:8001")
    
    # Test Dispatcher
    print_section("TEST 1: DISPATCHER")
    dispatcher_result = test_registration("dispatcher", "100")
    if dispatcher_result:
        test_login(
            dispatcher_result['user']['username'],
            "Test123!",
            "/dashboard/dispatcher"
        )
    
    # Test Responder
    print_section("TEST 2: RESPONDER")
    responder_result = test_registration("responder", "200")
    if responder_result:
        test_login(
            responder_result['user']['username'],
            "Test123!",
            "/dashboard/responder"
        )
    
    # Test Admin
    print_section("TEST 3: ADMIN")
    admin_result = test_registration("admin", "300")
    if admin_result:
        test_login(
            admin_result['user']['username'],
            "Test123!",
            "/dashboard/admin"
        )
    
    # Summary
    print_section("TEST SUMMARY")
    print("\n✅ All tests completed!")
    print("\nNext steps:")
    print("1. Check that all IDs are in correct ranges:")
    print("   - Dispatcher: 1001-1999")
    print("   - Responder: 2001-2999")
    print("   - Admin: 3001-3999")
    print("\n2. Try logging in via the frontend:")
    print("   http://localhost:3000/login")
    print("\n3. Verify you're redirected to the correct dashboard")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Unexpected error: {e}")
