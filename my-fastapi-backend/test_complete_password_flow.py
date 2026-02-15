import requests
import json

# Login as admin
print("Logging in as admin...")
login = requests.post('http://localhost:8001/api/v1/auth/login', 
                     json={'identifier': 'admin@hums.edu.my', 'password': 'Admin123'})
token = login.json()['access_token']
print("✓ Logged in successfully\n")

# Create a test user with a simple password
print("Creating new user with password '123456'...")
create_response = requests.post('http://localhost:8001/api/v1/auth/create-user',
                               headers={'Authorization': f'Bearer {token}'},
                               json={
                                   'first_name': 'Test',
                                   'last_name': 'Password',
                                   'email': 'testpwd2024@hums.edu.my',
                                   'role': 'dispatcher',
                                   'password': '123456',
                                   'dispatcher_id': '1234',
                                   'unit': 'MECC HUMS'
                               })

if create_response.status_code == 200:
    print("✓ User created successfully")
    print(json.dumps(create_response.json(), indent=2))
else:
    print(f"✗ Error creating user:")
    print(json.dumps(create_response.json(), indent=2))
    exit(1)

# Get all users to see if password shows
print("\nFetching all users to check password display...")
users_response = requests.get('http://localhost:8001/api/v1/auth/users',
                             headers={'Authorization': f'Bearer {token}'})

users = users_response.json()

# Find the newly created user
print("\nSearching for newly created user (ID: 1234)...")
for user in users:
    if user['dispatcher_id'] == '1234':
        print(f"\n{'='*60}")
        print(f"NEWLY CREATED USER - ID: {user['dispatcher_id']}")
        print(f"{'='*60}")
        print(f"Email:                    {user['email']}")
        print(f"Full Name:                {user.get('full_name', 'N/A')}")
        print(f"Temporary Password:       {user.get('temporary_password', 'N/A')}")
        print(f"Password Changed By User: {user.get('password_changed_by_user', 'N/A')}")
        print(f"{'='*60}\n")
        
        # Test if user can login with the temp password
        print("Testing login with temporary password '123456'...")
        test_login = requests.post('http://localhost:8001/api/v1/auth/login',
                                  json={'identifier': '1234', 'password': '123456'})
        if test_login.status_code == 200:
            print("✓ User can login with temporary password!")
            user_token = test_login.json()['access_token']
            
            # Now change the password
            print("\nChanging password to 'newpassword123'...")
            change_pwd = requests.post('http://localhost:8001/api/v1/auth/change-password',
                                      headers={'Authorization': f'Bearer {user_token}'},
                                      json={
                                          'current_password': '123456',
                                          'new_password': 'newpassword123'
                                      })
            if change_pwd.status_code == 200:
                print("✓ Password changed successfully!")
                
                # Check if temporary password is now cleared
                print("\nFetching user list again to verify temporary password is cleared...")
                users_response2 = requests.get('http://localhost:8001/api/v1/auth/users',
                                             headers={'Authorization': f'Bearer {token}'})
                users2 = users_response2.json()
                
                for user2 in users2:
                    if user2['dispatcher_id'] == '1234':
                        print(f"\n{'='*60}")
                        print(f"AFTER PASSWORD CHANGE - ID: {user2['dispatcher_id']}")
                        print(f"{'='*60}")
                        print(f"Email:                    {user2['email']}")
                        print(f"Temporary Password:       {user2.get('temporary_password', 'N/A')}")
                        print(f"Password Changed By User: {user2.get('password_changed_by_user', 'N/A')}")
                        print(f"{'='*60}\n")
                        
                        if user2.get('temporary_password') is None and user2.get('password_changed_by_user') == True:
                            print("✅ SUCCESS! Password display feature working correctly:")
                            print("   - Temporary password shown initially: 123456")
                            print("   - After user changes password: cleared (None)")
                            print("   - Admin will now see: 'Password updated by user'")
                        break
            else:
                print(f"✗ Error changing password: {change_pwd.json()}")
        else:
            print(f"✗ Login failed: {test_login.json()}")
        break
else:
    print("✗ User not found in the list!")
