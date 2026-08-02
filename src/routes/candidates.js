const express = require('express');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const { query } = require('../config/db');
const atsService = require('../services/atsService');
const { ApiError } = require('../middleware/errorHandler');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/candidates - fetch (and upsert-sync) candidates from ATS
router.get('/', async (req, res) => {
  const atsCandidates = await atsService.fetchCandidates({
    page: Number(req.query.page) || 1,
    perPage: Number(req.query.perPage) || 100
  });

  const upserted = [];
  for (const c of atsCandidates) {
    if (!c.phone_number) continue; // can't call without a number
    const { rows } = await query(
      `INSERT INTO candidates (full_name, phone_number, email, source, ats_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (ats_id) DO UPDATE
         SET full_name = EXCLUDED.full_name,
             phone_number = EXCLUDED.phone_number,
             email = EXCLUDED.email
       RETURNING *`,
      [c.full_name, c.phone_number, c.email, c.source, c.ats_id]
    );
    upserted.push(rows[0]);
  }

  res.json({ count: upserted.length, candidates: upserted });
});

// GET /api/candidates/:id
router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT * FROM candidates WHERE candidate_id = $1', [req.params.id]);
  if (!rows.length) throw new ApiError(404, 'Candidate not found');
  res.json(rows[0]);
});

// POST /api/candidates/upload - CSV upload
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No CSV file provided (field name: file)');

  const records = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true });

  const inserted = [];
  for (const row of records) {
    const fullName = row.full_name || row.name;
    const phone = row.phone_number || row.phone;
    if (!fullName || !phone) continue;

    const { rows } = await query(
      `INSERT INTO candidates (full_name, phone_number, email, source, ats_id)
       VALUES ($1, $2, $3, 'manual', $4)
       RETURNING *`,
      [fullName, phone, row.email || null, row.ats_id || null]
    );
    inserted.push(rows[0]);
  }

  res.status(201).json({ inserted: inserted.length, candidates: inserted });
});

// PATCH /api/candidates/:id
router.patch('/:id', async (req, res) => {
  const { full_name, phone_number, email } = req.body;
  const { rows } = await query(
    `UPDATE candidates
     SET full_name = COALESCE($1, full_name),
         phone_number = COALESCE($2, phone_number),
         email = COALESCE($3, email)
     WHERE candidate_id = $4
     RETURNING *`,
    [full_name, phone_number, email, req.params.id]
  );
  if (!rows.length) throw new ApiError(404, 'Candidate not found');

  const candidate = rows[0];
  if (candidate.ats_id) {
    await atsService.updateCandidate(candidate.ats_id, { first_name: full_name }).catch(() => {
      // ATS sync failure shouldn't fail the local update; it's logged inside atsService/axios interceptors.
    });
  }

  res.json(candidate);
});

// DELETE /api/candidates/:id - GDPR erasure
router.delete('/:id', async (req, res) => {
  const { rowCount } = await query('DELETE FROM candidates WHERE candidate_id = $1', [req.params.id]);
  if (!rowCount) throw new ApiError(404, 'Candidate not found');
  res.status(204).send();
});

module.exports = router;
