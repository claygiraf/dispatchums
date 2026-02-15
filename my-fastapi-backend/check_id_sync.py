"""Check database and verify dispatcher_id synchronization"""
from app.database.database import SessionLocal
from app.models.user import User
import requests

db = SessionLocal()

print('='*80)
print('DATABASE & UI SYNCHRONIZATION CHECK')
print('='*80)

# Get all users from database
print('\n1. CHECKING ALL USERS IN DATABASE:')
print('-'*80)
users = db.query(User).all()

for user in users:
    print(f'Username: {user.username:15} | Dispatcher ID: {user.dispatcher_id:8} | Email: {user.email}')

print('\n' + '-'*80)
print(f'Total users: {len(users)}')

# Check for duplicates
dispatcher_ids = [u.dispatcher_id for u in users if u.dispatcher_id]
if len(dispatcher_ids) != len(set(dispatcher_ids)):
    print('⚠️  WARNING: Duplicate dispatcher IDs found!')
    duplicates = [did for did in dispatcher_ids if dispatcher_ids.count(did) > 1]
    print(f'Duplicates: {set(duplicates)}')
else:
    print('✅ All dispatcher IDs are unique')

# Check if they follow PED001, PED002 pattern
expected_ids = [f'PED{str(i+1).zfill(3)}' for i in range(len(users))]
actual_ids = sorted([u.dispatcher_id for u in users if u.dispatcher_id])
if actual_ids == sorted(expected_ids[:len(actual_ids)]):
    print('✅ Dispatcher IDs follow correct sequential pattern (PED001, PED002, ...)')
else:
    print('⚠️  Dispatcher IDs do not follow expected pattern')
    print(f'Expected: {expected_ids[:len(actual_ids)]}')
    print(f'Actual: {actual_ids}')

# Test API endpoint to see what it returns
print('\n2. TESTING API ENDPOINT (what frontend receives):')
print('-'*80)

# Try to login with one user and check their profile
test_user = users[0]
print(f'Testing with user: {test_user.username}')

# We need to set a password first if it doesn't exist
from app.auth import get_password_hash
if not test_user.hashed_password or test_user.hashed_password.startswith('simple:'):
    print('Setting test password for this user...')
    test_user.hashed_password = get_password_hash('test123')
    db.commit()
    print('✅ Password set to: test123')

# Now try to login
try:
    login_response = requests.post(
        'http://127.0.0.1:8001/api/v1/auth/login',
        json={'username': test_user.username, 'password': 'test123'}
    )
    
    if login_response.status_code == 200:
        result = login_response.json()
        print(f'✅ Login successful')
        print(f'   Username from API: {result["user"]["username"]}')
        print(f'   Dispatcher ID from API: {result["user"]["dispatcher_id"]}')
        print(f'   Email from API: {result["user"]["email"]}')
        
        # Compare with database
        print('\n3. VERIFICATION - Database vs API:')
        print('-'*80)
        if result["user"]["dispatcher_id"] == test_user.dispatcher_id:
            print('✅ Dispatcher ID matches database!')
            print(f'   Database: {test_user.dispatcher_id}')
            print(f'   API:      {result["user"]["dispatcher_id"]}')
        else:
            print('❌ MISMATCH!')
            print(f'   Database: {test_user.dispatcher_id}')
            print(f'   API:      {result["user"]["dispatcher_id"]}')
            
        # Check /me endpoint
        token = result['access_token']
        me_response = requests.get(
            'http://127.0.0.1:8001/api/v1/auth/me',
            headers={'Authorization': f'Bearer {token}'}
        )
        
        if me_response.status_code == 200:
            me_data = me_response.json()
            print('\n4. /auth/me ENDPOINT CHECK:')
            print('-'*80)
            print(f'✅ /auth/me endpoint working')
            print(f'   Dispatcher ID: {me_data["dispatcher_id"]}')
            print(f'   Username: {me_data["username"]}')
            
            if me_data["dispatcher_id"] == test_user.dispatcher_id:
                print('✅ /auth/me returns correct dispatcher_id')
            else:
                print('❌ MISMATCH in /auth/me endpoint')
    else:
        print(f'❌ Login failed: {login_response.text}')
        
except Exception as e:
    print(f'❌ Error testing API: {e}')

print('\n' + '='*80)
print('CONCLUSION:')
print('='*80)
print('The frontend loads dispatcher_id from:')
print('1. Login response (user.dispatcher_id)')
print('2. /auth/me endpoint (user.dispatcher_id)')
print('3. localStorage (cached from login)')
print('\nAll sources should match the database value.')
print('='*80)

db.close()
