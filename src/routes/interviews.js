const express = require('express');
const { query } = require('../config/db');
const { ApiError } = require('../middleware/errorHandler');
const calendarService = require('../services/calendarService');

const router = express.Router();

// GET /api/interviews/availability?interviewerEmail=...&timeMin=...&timeMax=...
router.get('/availability', async (req, res) => {
  const { interviewerEmail, timeMin, timeMax } = req.query;
  if (!interviewerEmail || !timeMin || !timeMax) {
    throw new ApiError(400, 'interviewerEmail, timeMin, and timeMax are required');
  }

  const busy = await calendarService.checkAvailability({ interviewerEmail, timeMin, timeMax });
  res.json({ interviewerEmail, busy });
});

// POST /api/interviews/schedule
router.post('/schedule', async (req, res) => {
  const {
    candidateId,
    jobId,
    interviewDate,
    interviewTime,
    interviewerName,
    interviewerEmail,
    durationMinutes = 30,
    timeZone = 'UTC'
  } = req.body;

  if (!candidateId || !jobId || !interviewDate || !interviewTime) {
    throw new ApiError(400, 'candidateId, jobId, interviewDate, and interviewTime are required');
  }

  const { rows: candRows } = await query('SELECT * FROM candidates WHERE candidate_id = $1', [candidateId]);
  if (!candRows.length) throw new ApiError(404, 'Candidate not found');
  const candidate = candRows[0];

  const { rows: jobRows } = await query('SELECT * FROM jobs WHERE job_id = $1', [jobId]);
  if (!jobRows.length) throw new ApiError(404, 'Job not found');
  const job = jobRows[0];

  const startDateTime = new Date(`${interviewDate}T${interviewTime}`);
  const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

  const event = await calendarService.createInterviewEvent({
    candidateEmail: candidate.email,
    candidateName: candidate.full_name,
    interviewerEmail,
    interviewerName,
    jobTitle: job.title,
    startDateTime: startDateTime.toISOString(),
    endDateTime: endDateTime.toISOString(),
    timeZone
  });

  const { rows } = await query(
    `INSERT INTO interview_schedules
       (candidate_id, job_id, interview_date, interview_time, interviewer_name, interviewer_email, calendar_event_id, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled')
     RETURNING *`,
    [candidateId, jobId, interviewDate, interviewTime, interviewerName, interviewerEmail, event.id]
  );

  res.status(201).json(rows[0]);
});

// PATCH /api/interviews/:id
router.patch('/:id', async (req, res) => {
  const { interviewDate, interviewTime, interviewerName, status } = req.body;

  const { rows: existing } = await query('SELECT * FROM interview_schedules WHERE schedule_id = $1', [req.params.id]);
  if (!existing.length) throw new ApiError(404, 'Interview schedule not found');
  const current = existing[0];

  if (current.calendar_event_id && (interviewDate || interviewTime)) {
    const startDateTime = new Date(`${interviewDate || current.interview_date}T${interviewTime || current.interview_time}`);
    await calendarService.updateInterviewEvent(current.calendar_event_id, {
      start: { dateTime: startDateTime.toISOString() }
    });
  }

  const { rows } = await query(
    `UPDATE interview_schedules
     SET interview_date = COALESCE($1, interview_date),
         interview_time = COALESCE($2, interview_time),
         interviewer_name = COALESCE($3, interviewer_name),
         status = COALESCE($4, status)
     WHERE schedule_id = $5
     RETURNING *`,
    [interviewDate, interviewTime, interviewerName, status, req.params.id]
  );

  res.json(rows[0]);
});

// DELETE /api/interviews/:id - cancel
router.delete('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM interview_schedules WHERE schedule_id = $1', [req.params.id]);
  if (!rows.length) throw new ApiError(404, 'Interview schedule not found');

  if (rows[0].calendar_event_id) {
    await calendarService.cancelInterviewEvent(rows[0].calendar_event_id).catch(() => {});
  }

  await query(`UPDATE interview_schedules SET status = 'cancelled' WHERE schedule_id = $1`, [req.params.id]);
  res.status(204).send();
});

module.exports = router;
