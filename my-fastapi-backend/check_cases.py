import sys
sys.path.insert(0, '.')

from app.database.database import SessionLocal
from app.models.case import Case

db = SessionLocal()
cases = db.query(Case).all()
print(f'\n=== Total cases in database: {len(cases)} ===\n')

if cases:
    print("Last 5 cases:")
    for c in cases[-5:]:
        print(f'  ID: {c.id}')
        print(f'  Case Number: {c.case_number}')
        print(f'  Status: {c.status}')
        print(f'  Call Date: {c.call_date}')
        print(f'  Created At: {c.created_at}')
        print(f'  Location: {c.location}')
        print('  ---')
else:
    print("No cases found in database!")

# Check completed cases specifically
completed = db.query(Case).filter(Case.status == 'completed').all()
print(f'\n=== Completed cases: {len(completed)} ===\n')

db.close()
