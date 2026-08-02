-- +migrate Up
CREATE TABLE IF NOT EXISTS recruiters (
    recruiter_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(150) UNIQUE NOT NULL,
    company_name VARCHAR(150),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

-- +migrate Down
-- DROP TABLE IF EXISTS recruiters;
