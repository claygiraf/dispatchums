"""Comprehensive verification flow test"""
from app.database.database import SessionLocal
from app.models.user import User
import requests

db = SessionLocal()

print('='*80)
print('EMAIL VERIFICATION & PASSWORD RESET FLOW TEST')
print('='*80)

# Check all users with verified emails
print('\n1. CHECKING VERIFIED USERS IN DATABASE:')
print('-'*80)
users = db.query(User).all()
verified_users = [u for u in users if u.is_verified]

if not verified_users:
    print('❌ NO VERIFIED USERS FOUND!')
    print('\nTo verify an email:')
    print('1. Login to dashboard')
    print('2. Go to Profile Settings')
    print('3. Enter personal email')
    print('4. Click "Verify"')
    print('5. Enter the code sent to your email')
else:
    for u in verified_users:
        print(f'✅ User: {u.username}')
        print(f'   Work Email: {u.email}')
        print(f'   Personal Email: {u.personal_email}')
        print(f'   Verified: {u.is_verified}')
        print()

# Test forgot password for verified users
if verified_users:
    print('\n2. TESTING FORGOT PASSWORD:')
    print('-'*80)
    for u in verified_users:
        print(f'\nTesting for {u.username} ({u.personal_email})...')
        try:
            response = requests.post(
                'http://127.0.0.1:8001/api/v1/auth/forgot-password',
                json={'personal_email': u.personal_email}
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f'✅ SUCCESS!')
                print(f'   Message: {result["message"]}')
                print(f'   Temp Password: {result["temp_password"]}')
                print(f'   📧 Email sent to: {u.personal_email}')
            else:
                print(f'❌ FAILED: {response.status_code}')
                print(f'   Error: {response.text}')
        except Exception as e:
            print(f'❌ ERROR: {e}')

# Test with unverified user
print('\n3. TESTING WITH UNVERIFIED EMAIL (should fail):')
print('-'*80)
unverified = [u for u in users if not u.is_verified and u.personal_email]
if unverified:
    u = unverified[0]
    print(f'Testing for {u.username} ({u.personal_email})...')
    response = requests.post(
        'http://127.0.0.1:8001/api/v1/auth/forgot-password',
        json={'personal_email': u.personal_email}
    )
    if response.status_code == 403:
        print(f'✅ Correctly rejected unverified email')
        print(f'   Error: {response.json()["detail"]}')
    else:
        print(f'❌ Should have been rejected but got: {response.status_code}')

print('\n' + '='*80)
print('TEST COMPLETE')
print('='*80)

db.close()
