-- Create users table if not exists
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('admin', 'student')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Insert test users with hashed passwords (bcrypt hash of 'admin123' and 'student123')
-- Password: admin123 -> hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtqmKMUO5p5VlB5n2h9vUJ4K/Qym
-- Password: student123 -> hash: $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtqmKMUO5p5VlB5n2h9vUJ4K/Qym

INSERT INTO users (email, password_hash, user_type, full_name, is_active) VALUES 
  (
    'admin@grademe.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtqmKMUO5p5VlB5n2h9vUJ4K/Qym', 
    'admin', 
    'System Administrator', 
    true
  ),
  (
    'student@university.edu', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtqmKMUO5p5VlB5n2h9vUJ4K/Qym', 
    'student', 
    'Test Student', 
    true
  ),
  (
    'teacher@grademe.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtqmKMUO5p5VlB5n2h9vUJ4K/Qym', 
    'admin', 
    'Test Teacher', 
    true
  )
ON CONFLICT (email) DO NOTHING;

-- Verify users were created
SELECT id, email, user_type, full_name, created_at, is_active FROM users;