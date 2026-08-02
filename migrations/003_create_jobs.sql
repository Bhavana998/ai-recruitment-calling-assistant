-- +migrate Up
CREATE TABLE IF NOT EXISTS jobs (
    job_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    company_name VARCHAR(150) NOT NULL,
    location VARCHAR(150),
    employment_type VARCHAR(50),
    salary_range VARCHAR(50),
    jd_text TEXT,
    ats_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_jobs_ats_id ON jobs(ats_id);

-- +migrate Down
-- DROP TABLE IF EXISTS jobs;
