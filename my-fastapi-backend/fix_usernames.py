"""Fix trailing spaces in usernames"""
from app.database.database import SessionLocal
from app.models.user import User

db = SessionLocal()

print('Fixing usernames with trailing spaces...')
print('='*60)

users = db.query(User).all()
fixed_count = 0

for user in users:
    original = user.username
    trimmed = original.strip()
    
    if original != trimmed:
        print(f'Fixing: [{original}] -> [{trimmed}]')
        user.username = trimmed
        fixed_count += 1

if fixed_count > 0:
    db.commit()
    print(f'\n✅ Fixed {fixed_count} usernames')
else:
    print('✅ All usernames are already clean')

print('='*60)

# Now test login
import requests
print('\nTesting login with "clayderman" / "123abc"...')
response = requests.post(
    'http://127.0.0.1:8001/api/v1/auth/login',
    json={
        'username': 'clayderman',
        'password': '123abc'
    }
)

if response.status_code == 200:
    print('✅ Login successful!')
else:
    print(f'❌ Login failed: {response.text}')

db.close()
