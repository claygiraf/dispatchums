import requests
import json

# Login
print("=" * 60)
print("Testing Login and Token")
print("=" * 60)

login_response = requests.post('http://localhost:8001/api/v1/auth/login', 
                               json={'identifier': 'admin@hums.edu.my', 'password': 'Admin123'})

if login_response.status_code == 200:
    data = login_response.json()
    token = data['access_token']
    user = data['user']
    
    print(f"\n✓ Login successful")
    print(f"  User ID: {user['id']}")
    print(f"  Dispatcher ID: {user['dispatcher_id']}")
    print(f"  Email: {user['email']}")
    print(f"  Role: {user['role']}")
    print(f"  Dashboard: {data['dashboard_route']}")
    
    # Test getting current user with token
    print("\n" + "=" * 60)
    print("Testing /auth/me endpoint")
    print("=" * 60)
    
    me_response = requests.get('http://localhost:8001/api/v1/auth/me',
                               headers={'Authorization': f'Bearer {token}'})
    
    if me_response.status_code == 200:
        me_data = me_response.json()
        print(f"\n✓ Token validation successful")
        print(f"  User ID: {me_data['id']}")
        print(f"  Dispatcher ID: {me_data['dispatcher_id']}")
        print(f"  Email: {me_data['email']}")
        print(f"  Role: {me_data['role']}")
    else:
        print(f"\n✗ Token validation failed: {me_response.status_code}")
        print(json.dumps(me_response.json(), indent=2))
    
    # Test getting users list
    print("\n" + "=" * 60)
    print("Testing /auth/users endpoint (admin only)")
    print("=" * 60)
    
    users_response = requests.get('http://localhost:8001/api/v1/auth/users',
                                  headers={'Authorization': f'Bearer {token}'})
    
    if users_response.status_code == 200:
        users = users_response.json()
        print(f"\n✓ Admin access successful - {len(users)} users found")
    else:
        print(f"\n✗ Admin access failed: {users_response.status_code}")
        print(json.dumps(users_response.json(), indent=2))
    
    # Test creating a user
    print("\n" + "=" * 60)
    print("Testing /auth/create-user endpoint (admin only)")
    print("=" * 60)
    
    create_response = requests.post('http://localhost:8001/api/v1/auth/create-user',
                                   headers={'Authorization': f'Bearer {token}'},
                                   json={
                                       'first_name': 'Test',
                                       'last_name': 'User',
                                       'email': 'testuser999@hums.edu.my',
                                       'role': 'dispatcher',
                                       'password': '123456',
                                       'dispatcher_id': '1999',
                                       'unit': 'MECC HUMS'
                                   })
    
    if create_response.status_code == 200:
        print(f"\n✓ User creation successful")
        print(json.dumps(create_response.json(), indent=2))
    else:
        print(f"\n✗ User creation failed: {create_response.status_code}")
        print(json.dumps(create_response.json(), indent=2))
        
else:
    print(f"\n✗ Login failed: {login_response.status_code}")
    print(json.dumps(login_response.json(), indent=2))
