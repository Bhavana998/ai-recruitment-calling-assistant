# AI Recruitment Calling Assistant

Automated outbound recruitment calling system: fetches candidates/jobs from
Greenhouse, places AI-voice calls via Twilio, speaks with ElevenLabs TTS,
transcribes with AssemblyAI, extracts structured answers with OpenAI, and
schedules interviews on Google Calendar — all synced back to Postgres.

## ⚠️ Before you do anything else

This project was scaffolded from a spec document that had a **live database
password embedded in plaintext**. If you're reusing that Supabase project:

1. Rotate the database password in the Supabase dashboard right now.
2. Never put real secrets in README/spec files — only in `.env`, which is
   git-ignored.
3. Rotate any other credentials (Twilio, OpenAI, etc.) that may have been
   shared alongside it.

## Architecture

```
Dashboard/API client ──JWT──> Express API ──> PostgreSQL
                                  │
                                  ├─> Twilio (calls, recordings)
                                  ├─> ElevenLabs (TTS for call prompts)
                                  ├─> AssemblyAI (transcription, post-call)
                                  ├─> OpenAI (structured extraction, FAQ answers)
                                  ├─> Google Calendar (interview scheduling)
                                  └─> Greenhouse Harvest API (candidates/jobs)
```

Call flow: `POST /api/calls/initiate` creates a `call_sessions` row and asks
Twilio to dial the candidate, pointing it at `/api/calls/twiml/:id` for
instructions. Twilio's status callback (`/api/calls/webhook`) fires when the
call and recording complete, which triggers AssemblyAI transcription →
OpenAI structured extraction → `candidate_responses` rows. Interview
scheduling is a deliberate follow-up action (`POST /api/interviews/schedule`),
not fully automatic, so a recruiter stays in the loop on interviewer
selection.

## Setup

```bash
npm install
cp .env.example .env
# fill in .env with your real credentials — see "Prerequisites" below
npm run migrate
npm run dev        # development
npm start           # production
```

### Prerequisites

You'll need accounts/credentials for:
- **Twilio** — account SID, auth token, a phone number capable of outbound calling
- **ElevenLabs** — API key + a voice ID
- **AssemblyAI** — API key
- **OpenAI** — API key
- **Google Cloud** — OAuth client with Calendar API enabled, plus a refresh
  token for the calendar-owning account (see Google's OAuth Playground for
  the fastest way to mint one for local dev)
- **Greenhouse** (or swap `src/services/atsService.js` for Zoho/Lever) —
  Harvest API key
- **Postgres** — a fresh database; do not reuse credentials that appeared in
  any shared document

Your server also needs a **publicly reachable HTTPS URL** (`BASE_URL` in
`.env`) so Twilio can call back to `/api/calls/twiml/...` and
`/api/calls/webhook`. Use `ngrok` or similar for local development.

### Auth for internal endpoints

Every `/api/*` route except the Twilio-facing ones under `/api/calls`
(`twiml`, `gather`, `webhook`, `audio`) requires a `Authorization: Bearer
<JWT>` header signed with `JWT_SECRET`. This project doesn't ship a login
endpoint — issue tokens however fits your auth setup (SSO, admin CLI, etc.)
and verify `src/middleware/auth.js` fits your needs before going to
production.

## Switching ATS providers

`src/services/atsService.js` is Greenhouse-specific (Harvest API, HTTP Basic
auth, its candidate/job JSON shape). To use Zoho Recruit or Lever instead,
reimplement the four exported functions
(`fetchCandidates`, `fetchCandidateById`, `fetchJobs`, `fetchJobById`,
`updateCandidate`) against that provider's API — nothing else in the
codebase needs to change, since routes only call these exported functions.

## Known simplifications to address before production

- **Audio clip storage**: `routes/calls.js` caches ElevenLabs TTS output in
  an in-memory `Map`. This won't survive a restart or work with more than
  one server process. Swap for S3 (or similar) with signed URLs.
- **In-call FAQ handling**: the current `<Gather>` flow captures one
  speech turn and ends the call. Wiring `nlpService.answerCandidateQuestion`
  into a multi-turn `<Gather>` loop is the natural next step for real FAQ
  handling mid-call.
- **Interview auto-scheduling**: the webhook pipeline flags interest but
  deliberately does *not* auto-book a slot, since interviewer selection
  needs either a rules engine or a recruiter decision. Extend
  `processRecording()` in `routes/calls.js` if you want full automation.
- **Login/token issuance**: no `/auth/login` route is included — plug in
  whatever identity provider your team already uses.

## Database

Schema matches the spec exactly (`candidates`, `call_sessions`,
`candidate_responses`, `jobs`, `interview_schedules`, `recruiters`), with a
couple of additions needed to make it actually work:
- `ats_id` on `candidates`/`jobs` is `UNIQUE`, so ATS sync can `UPSERT`
  instead of creating duplicates on every fetch.
- `call_sessions` and `interview_schedules` gained a couple of practical
  columns (`twilio_call_sid`, `job_id` on call_sessions;
  `interviewer_email` on interview_schedules) needed to actually wire the
  integrations together.

Migrations live in `/migrations` as plain SQL, applied in filename order by
`scripts/migrate.js`, which tracks what's been applied in a
`schema_migrations` table — safe to re-run.

## API surface

See the original spec for the full endpoint list — implemented as written,
under `src/routes/`. All except health checks and Twilio callbacks require
a bearer token.
