-- Quick SQL queries to check your user data in DB Browser

-- 1. View all users
SELECT * FROM users;

-- 2. View user details (readable format)
SELECT 
    id,
    username,
    email,
    full_name,
    dispatcher_id,
    unit,
    role,
    is_active,
    is_verified,
    created_at
FROM users;

-- 3. Check if your specific user exists
SELECT * FROM users WHERE username = 'clayderman';

-- 4. Count total users
SELECT COUNT(*) as total_users FROM users;

-- 5. View only active users
SELECT username, email, dispatcher_id, unit FROM users WHERE is_active = 1;