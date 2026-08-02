require('dotenv').config();
require('express-async-errors');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const { apiLimiter } = require('./middleware/rateLimiter');
const { requireAuth } = require('./middleware/auth');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const candidatesRouter = require('./routes/candidates');
const jobsRouter = require('./routes/jobs');
const callsRouter = require('./routes/calls');
const interviewsRouter = require('./routes/interviews');
const analyticsRouter = require('./routes/analytics');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Twilio webhooks post form-encoded bodies
app.use(apiLimiter);

app.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));

// Mixed router: Twilio-facing endpoints (twiml/gather/webhook/audio) stay
// open since Twilio authenticates via X-Twilio-Signature, not a bearer
// token; internal endpoints (initiate/status/recording/transcript) apply
// requireAuth individually inside routes/calls.js.
app.use('/api/calls', callsRouter);

// Everything else is internal dashboard/API traffic and requires a JWT.
app.use('/api/candidates', requireAuth, candidatesRouter);
app.use('/api/jobs', requireAuth, jobsRouter);
app.use('/api/interviews', requireAuth, interviewsRouter);
app.use('/api/analytics', requireAuth, analyticsRouter);
app.use('/api/reports', requireAuth, analyticsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
