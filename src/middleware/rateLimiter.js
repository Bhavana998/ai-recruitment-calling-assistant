const rateLimit = require('express-rate-limit');

// General API traffic
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Too many requests, please try again later.' } }
});

// Outbound call initiation is the most expensive/abuse-prone action —
// keep it tighter than general API traffic.
const callInitiationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Call initiation rate limit exceeded.' } }
});

module.exports = { apiLimiter, callInitiationLimiter };
