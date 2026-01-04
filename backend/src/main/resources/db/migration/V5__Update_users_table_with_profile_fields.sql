-- Update users table with profile fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS gender VARCHAR(20),
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS profile_picture_url VARCHAR(500),
ADD COLUMN IF NOT EXISTS college VARCHAR(200),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50);

-- Create index on country for filtering
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);

