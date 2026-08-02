const express = require('express');
const { query } = require('../config/db');
const atsService = require('../services/atsService');
const { ApiError } = require('../middleware/errorHandler');

const router = express.Router();

// GET /api/jobs - fetch from ATS
router.get('/', async (req, res) => {
  const atsJobs = await atsService.fetchJobs({
    page: Number(req.query.page) || 1,
    perPage: Number(req.query.perPage) || 100
  });

  const upserted = [];
  for (const j of atsJobs) {
    const { rows } = await query(
      `INSERT INTO jobs (title, company_name, location, employment_type, salary_range, jd_text, ats_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (ats_id) DO UPDATE
         SET title = EXCLUDED.title,
             company_name = EXCLUDED.company_name,
             location = EXCLUDED.location,
             employment_type = EXCLUDED.employment_type,
             jd_text = EXCLUDED.jd_text
       RETURNING *`,
      [j.title, j.company_name, j.location, j.employment_type, j.salary_range, j.jd_text, j.ats_id]
    );
    upserted.push(rows[0]);
  }

  res.json({ count: upserted.length, jobs: upserted });
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM jobs WHERE job_id = $1', [req.params.id]);
  if (!rows.length) throw new ApiError(404, 'Job not found');
  res.json(rows[0]);
});

// POST /api/jobs/sync - explicit full re-sync from ATS (same upsert logic as GET /)
router.post('/sync', async (req, res) => {
  const atsJobs = await atsService.fetchJobs({ perPage: 100 });
  let synced = 0;

  for (const j of atsJobs) {
    await query(
      `INSERT INTO jobs (title, company_name, location, employment_type, salary_range, jd_text, ats_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (ats_id) DO UPDATE
         SET title = EXCLUDED.title, company_name = EXCLUDED.company_name,
             location = EXCLUDED.location, employment_type = EXCLUDED.employment_type,
             jd_text = EXCLUDED.jd_text`,
      [j.title, j.company_name, j.location, j.employment_type, j.salary_range, j.jd_text, j.ats_id]
    );
    synced++;
  }

  res.json({ synced });
});

module.exports = router;
