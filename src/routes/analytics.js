const express = require('express');
const { query } = require('../config/db');

const router = express.Router();

// GET /api/analytics/calls
router.get('/calls', async (req, res) => {
  const { rows } = await query(`
    SELECT
      call_status,
      COUNT(*) AS count,
      AVG(EXTRACT(EPOCH FROM (call_end_time - call_start_time))) AS avg_duration_seconds,
      AVG(ai_confidence) AS avg_ai_confidence
    FROM call_sessions
    GROUP BY call_status
    ORDER BY count DESC
  `);
  res.json({ breakdown: rows });
});

// GET /api/analytics/candidates
router.get('/candidates', async (req, res) => {
  const { rows } = await query(`
    SELECT
      question_code,
      COUNT(*) AS response_count,
      COUNT(DISTINCT call_id) AS distinct_calls
    FROM candidate_responses
    GROUP BY question_code
    ORDER BY response_count DESC
  `);
  res.json({ breakdown: rows });
});

// GET /api/reports/transcripts (mounted separately, see app.js)
router.get('/transcripts', async (req, res) => {
  const { rows } = await query(`
    SELECT call_id, candidate_id, call_status, ai_confidence,
           LENGTH(transcript_text) AS transcript_length,
           created_at
    FROM call_sessions
    WHERE transcript_text IS NOT NULL
    ORDER BY created_at DESC
    LIMIT 100
  `);
  res.json({ reports: rows });
});

module.exports = router;
