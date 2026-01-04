-- Create external_profiles table
CREATE TABLE IF NOT EXISTS external_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    username VARCHAR(100) NOT NULL,
    rating INTEGER,
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, platform)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_external_profiles_user_id ON external_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_external_profiles_platform ON external_profiles(platform);

