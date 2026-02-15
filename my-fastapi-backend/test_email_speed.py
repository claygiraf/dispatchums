"""Test email sending speed"""
from app.email_service import send_verification_email, generate_verification_code
import time

code = generate_verification_code()
print(f'Testing 3 consecutive email sends with code: {code}')
print('='*60)

total = 0
for i in range(3):
    start = time.time()
    success = send_verification_email('clayderman03@yahoo.com', code)
    elapsed = time.time() - start
    total += elapsed
    print(f'Attempt {i+1}: {elapsed:.2f}s - {"Success" if success else "Failed"}')

print('='*60)
print(f'Average time: {total/3:.2f}s')
print(f'Min expected: ~2s, Max expected: ~5s')
