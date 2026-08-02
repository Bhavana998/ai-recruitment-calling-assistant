-- +migrate Up
CREATE TABLE IF NOT EXISTS candidate_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_id UUID NOT NULL REFERENCES call_sessions(call_id) ON DELETE CASCADE,
    question_code VARCHAR(50) NOT NULL,
    response_text TEXT,
    response_value VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_candidate_responses_call ON candidate_responses(call_id);
CREATE INDEX IF NOT EXISTS idx_candidate_responses_question ON candidate_responses(question_code);

-- +migrate Down
-- DROP TABLE IF EXISTS candidate_responses;
