-- +migrate Up
CREATE TABLE IF NOT EXISTS call_sessions (
    call_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES candidates(candidate_id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(job_id) ON DELETE SET NULL,
    twilio_call_sid VARCHAR(64) UNIQUE,
    call_start_time TIMESTAMP,
    call_end_time TIMESTAMP,
    call_status VARCHAR(20) DEFAULT 'queued',
    recording_url TEXT,
    transcript_text TEXT,
    ai_confidence DECIMAL(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_call_sessions_candidate ON call_sessions(candidate_id);
CREATE INDEX IF NOT EXISTS idx_call_sessions_status ON call_sessions(call_status);
CREATE INDEX IF NOT EXISTS idx_call_sessions_twilio_sid ON call_sessions(twilio_call_sid);

-- +migrate Down
-- DROP TABLE IF EXISTS call_sessions;
