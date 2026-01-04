-- Create otps table
CREATE TABLE IF NOT EXISTS otps (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    user_id BIGINT NOT NULL,
    identifier VARCHAR(100) NOT NULL,
    otp_type VARCHAR(50) NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_identifier ON otps(identifier);
CREATE INDEX IF NOT EXISTS idx_user_otp ON otps(user_id);

