const express = require('express');
const { query, withTransaction } = require('../config/db');
const { ApiError } = require('../middleware/errorHandler');
const { callInitiationLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/auth');
const twilioService = require('../services/twilioService');
const elevenLabsService = require('../services/elevenLabsService');
const assemblyAIService = require('../services/assemblyAIService');
const nlpService = require('../services/nlpService');
const calendarService = require('../services/calendarService');
const logger = require('../config/logger');

const router = express.Router();

// In-memory audio cache for TTS clips Twilio needs to <Play>.
// Swap for S3/object storage in production — this won't survive a restart
// or work across multiple server instances.
const audioCache = new Map();

// POST /api/calls/initiate (internal dashboard action — requires auth)
router.post('/initiate', requireAuth, callInitiationLimiter, async (req, res) => {
  const { candidateId, jobId } = req.body;
  if (!candidateId) throw new ApiError(400, 'candidateId is required');

  const { rows: candRows } = await query('SELECT * FROM candidates WHERE candidate_id = $1', [candidateId]);
  if (!candRows.length) throw new ApiError(404, 'Candidate not found');
  const candidate = candRows[0];

  if (jobId) {
    const { rows: jobRows } = await query('SELECT 1 FROM jobs WHERE job_id = $1', [jobId]);
    if (!jobRows.length) throw new ApiError(404, 'Job not found');
  }

  const { rows: sessionRows } = await query(
    `INSERT INTO call_sessions (candidate_id, job_id, call_status)
     VALUES ($1, $2, 'queued')
     RETURNING *`,
    [candidateId, jobId || null]
  );
  const session = sessionRows[0];

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new ApiError(500, 'BASE_URL is not configured');

  const call = await twilioService.initiateCall({
    toNumber: candidate.phone_number,
    twimlUrl: `${baseUrl}/api/calls/twiml/${session.call_id}`,
    statusCallbackUrl: `${baseUrl}/api/calls/webhook`
  });

  await query(
    `UPDATE call_sessions SET twilio_call_sid = $1, call_start_time = now(), call_status = 'initiated'
     WHERE call_id = $2`,
    [call.sid, session.call_id]
  );

  res.status(201).json({ callId: session.call_id, twilioSid: call.sid, status: call.status });
});

// POST /api/calls/twiml/:callSessionId - Twilio requests this to know what to say/do
router.post('/twiml/:callSessionId', async (req, res) => {
  const { rows } = await query(
    `SELECT cs.*, c.full_name, j.title, j.company_name, j.location, j.jd_text
     FROM call_sessions cs
     JOIN candidates c ON c.candidate_id = cs.candidate_id
     LEFT JOIN jobs j ON j.job_id = cs.job_id
     WHERE cs.call_id = $1`,
    [req.params.callSessionId]
  );
  if (!rows.length) return res.status(404).send('Call session not found');
  const session = rows[0];

  const greeting = session.title
    ? `Hi ${session.full_name}, this is an automated recruiting assistant calling about the ${session.title} role at ${session.company_name}. Do you have a moment to talk?`
    : `Hi ${session.full_name}, this is an automated recruiting assistant. Do you have a moment to talk?`;

  const baseUrl = process.env.BASE_URL;
  let playVerb = `<Say voice="Polly.Joanna">${escapeXml(greeting)}</Say>`;

  try {
    const audioBuffer = await elevenLabsService.synthesizeSpeech(greeting);
    const clipId = `${session.call_id}-greeting`;
    audioCache.set(clipId, audioBuffer);
    playVerb = `<Play>${baseUrl}/api/calls/audio/${clipId}</Play>`;
  } catch (err) {
    logger.error('ElevenLabs synthesis failed, falling back to Twilio Say', { error: err.message });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  ${playVerb}
  <Gather input="speech" action="${baseUrl}/api/calls/gather/${session.call_id}" method="POST" speechTimeout="auto" timeout="8">
  </Gather>
  <Say voice="Polly.Joanna">We didn't catch a response. A recruiter may follow up by email. Goodbye.</Say>
  <Hangup/>
</Response>`;

  res.type('text/xml').send(twiml);
});

// GET /api/calls/audio/:clipId - serves ElevenLabs-generated clips for Twilio's <Play>
router.get('/audio/:clipId', (req, res) => {
  const buf = audioCache.get(req.params.clipId);
  if (!buf) return res.status(404).send('Audio clip not found or expired');
  res.type('audio/mpeg').send(buf);
});

// POST /api/calls/gather/:callSessionId - handles the live conversational turn
router.post('/gather/:callSessionId', async (req, res) => {
  const speechResult = req.body.SpeechResult || '';
  const baseUrl = process.env.BASE_URL;

  await query(
    `INSERT INTO candidate_responses (call_id, question_code, response_text)
     VALUES ($1, 'live_turn', $2)`,
    [req.params.callSessionId, speechResult]
  );

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Thanks, that's been noted. A recruiter will review your responses and follow up regarding next steps. Have a great day!</Say>
  <Hangup/>
</Response>`;

  res.type('text/xml').send(twiml);
});

// POST /api/calls/webhook - Twilio status + recording callbacks
router.post('/webhook', async (req, res) => {
  const signature = req.headers['x-twilio-signature'];
  const fullUrl = `${process.env.BASE_URL}/api/calls/webhook`;

  if (!twilioService.validateWebhookSignature(signature, fullUrl, req.body)) {
    logger.warn('Rejected webhook with invalid Twilio signature');
    return res.status(403).send('Invalid signature');
  }

  const { CallSid, CallStatus, RecordingUrl } = req.body;

  const { rows } = await query('SELECT * FROM call_sessions WHERE twilio_call_sid = $1', [CallSid]);
  if (!rows.length) return res.status(200).send('OK'); // unknown call, ack anyway per Twilio convention
  const session = rows[0];

  if (CallStatus) {
    await query(
      `UPDATE call_sessions SET call_status = $1, call_end_time = CASE WHEN $1 = 'completed' THEN now() ELSE call_end_time END
       WHERE call_id = $2`,
      [CallStatus, session.call_id]
    );
  }

  if (RecordingUrl) {
    const recordingUrl = `${RecordingUrl}.mp3`;
    await query('UPDATE call_sessions SET recording_url = $1 WHERE call_id = $2', [recordingUrl, session.call_id]);

    // Fire-and-forget the transcription + extraction pipeline so we don't
    // hold Twilio's webhook open for a long-running job.
    processRecording(session.call_id, recordingUrl).catch(err =>
      logger.error('Post-call processing failed', { callId: session.call_id, error: err.message })
    );
  }

  res.status(200).send('OK');
});

async function processRecording(callId, recordingUrl) {
  const transcript = await assemblyAIService.transcribeFromUrl(recordingUrl);

  await query(
    `UPDATE call_sessions SET transcript_text = $1, ai_confidence = $2 WHERE call_id = $3`,
    [transcript.text, transcript.confidence, callId]
  );

  const { rows } = await query(
    `SELECT cs.*, j.title, j.company_name, j.jd_text
     FROM call_sessions cs LEFT JOIN jobs j ON j.job_id = cs.job_id
     WHERE cs.call_id = $1`,
    [callId]
  );
  const session = rows[0];

  const structured = await nlpService.extractStructuredResponses(transcript.text, {
    title: session.title,
    company: session.company_name
  });

  await withTransaction(async client => {
    for (const item of structured) {
      await client.query(
        `INSERT INTO candidate_responses (call_id, question_code, response_text, response_value)
         VALUES ($1, $2, $3, $4)`,
        [callId, item.question_code, item.response_text, item.response_value]
      );
    }
  });

  const interested = structured.find(s => s.question_code === 'interested_in_role');
  if (interested && /^(yes|true)/i.test(interested.response_value || '')) {
    logger.info('Candidate expressed interest — flagged for interview scheduling', { callId });
    // Actual scheduling is a separate deliberate action via POST /api/interviews/schedule
    // (keeps interviewer-availability selection and recruiter approval in the loop).
  }
}

// GET /api/calls/:id/status (internal dashboard action — requires auth)
router.get('/:id/status', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT call_id, call_status, call_start_time, call_end_time FROM call_sessions WHERE call_id = $1', [req.params.id]);
  if (!rows.length) throw new ApiError(404, 'Call session not found');
  res.json(rows[0]);
});

// GET /api/calls/:id/recording (internal dashboard action — requires auth)
router.get('/:id/recording', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT recording_url FROM call_sessions WHERE call_id = $1', [req.params.id]);
  if (!rows.length) throw new ApiError(404, 'Call session not found');
  if (!rows[0].recording_url) throw new ApiError(404, 'Recording not yet available');
  res.json({ recordingUrl: rows[0].recording_url });
});

// GET /api/calls/:id/transcript (internal dashboard action — requires auth)
router.get('/:id/transcript', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT transcript_text, ai_confidence FROM call_sessions WHERE call_id = $1', [req.params.id]);
  if (!rows.length) throw new ApiError(404, 'Call session not found');
  if (!rows[0].transcript_text) throw new ApiError(404, 'Transcript not yet available');
  res.json(rows[0]);
});

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]));
}

module.exports = router;
