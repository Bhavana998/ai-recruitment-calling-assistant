-- +migrate Up
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS candidates (
    candidate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(150),
    source VARCHAR(50) DEFAULT 'ATS',
    ats_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidates_ats_id ON candidates(ats_id);
CREATE INDEX IF NOT EXISTS idx_candidates_phone ON candidates(phone_number);

-- +migrate Down
-- DROP TABLE IF EXISTS candidates;
