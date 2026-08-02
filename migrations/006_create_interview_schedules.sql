-- +migrate Up
CREATE TABLE IF NOT EXISTS interview_schedules (
    schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    interview_date DATE NOT NULL,
    interview_time TIME NOT NULL,
    interviewer_name VARCHAR(150),
    interviewer_email VARCHAR(150),
    calendar_event_id VARCHAR(150),
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interview_schedules_candidate ON interview_schedules(candidate_id);
CREATE INDEX IF NOT EXISTS idx_interview_schedules_status ON interview_schedules(status);

-- +migrate Down
-- DROP TABLE IF EXISTS interview_schedules;
