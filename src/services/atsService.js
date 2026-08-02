const axios = require('axios');

/**
 * Greenhouse Harvest API client.
 * Auth: HTTP Basic, API key as username, empty password.
 * https://developers.greenhouse.io/harvest.html
 */
function getClient() {
  if (!process.env.GREENHOUSE_API_KEY) {
    throw new Error('GREENHOUSE_API_KEY is not configured');
  }

  return axios.create({
    baseURL: process.env.GREENHOUSE_BASE_URL || 'https://harvest.greenhouse.io/v1',
    auth: { username: process.env.GREENHOUSE_API_KEY, password: '' },
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000
  });
}

async function fetchCandidates({ page = 1, perPage = 100 } = {}) {
  const client = getClient();
  const { data } = await client.get('/candidates', { params: { page, per_page: perPage } });
  return data.map(mapGreenhouseCandidate);
}

async function fetchCandidateById(atsId) {
  const client = getClient();
  const { data } = await client.get(`/candidates/${atsId}`);
  return mapGreenhouseCandidate(data);
}

async function fetchJobs({ page = 1, perPage = 100, status = 'open' } = {}) {
  const client = getClient();
  const { data } = await client.get('/jobs', { params: { page, per_page: perPage, status } });
  return data.map(mapGreenhouseJob);
}

async function fetchJobById(atsId) {
  const client = getClient();
  const { data } = await client.get(`/jobs/${atsId}`);
  return mapGreenhouseJob(data);
}

async function updateCandidate(atsId, patch) {
  const client = getClient();
  const { data } = await client.patch(`/candidates/${atsId}`, patch, {
    headers: { 'On-Behalf-Of': process.env.GREENHOUSE_ON_BEHALF_OF_USER_ID || undefined }
  });
  return data;
}

function mapGreenhouseCandidate(c) {
  const primaryPhone = c.phone_numbers?.[0]?.value || null;
  const primaryEmail = c.email_addresses?.[0]?.value || null;
  return {
    full_name: [c.first_name, c.last_name].filter(Boolean).join(' '),
    phone_number: primaryPhone,
    email: primaryEmail,
    source: 'ATS',
    ats_id: String(c.id)
  };
}

function mapGreenhouseJob(j) {
  return {
    title: j.name,
    company_name: j.departments?.[0]?.name || null,
    location: j.offices?.[0]?.name || null,
    employment_type: j.employment_type || null,
    salary_range: null, // Greenhouse doesn't expose this by default; pull from custom fields if configured
    jd_text: j.notes || '',
    ats_id: String(j.id)
  };
}

module.exports = {
  fetchCandidates,
  fetchCandidateById,
  fetchJobs,
  fetchJobById,
  updateCandidate
};
