-- Create login_challenges table
CREATE TABLE IF NOT EXISTS login_challenges (
    id BIGSERIAL PRIMARY KEY,
    challenge_token VARCHAR(255) NOT NULL UNIQUE,
    challenge_type VARCHAR(50) NOT NULL,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    options TEXT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    attempt_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_challenge_token ON login_challenges(challenge_token);
CREATE INDEX IF NOT EXISTS idx_expiry ON login_challenges(expiry_date);

