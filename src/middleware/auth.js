const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');

/**
 * Verifies a Bearer JWT on protected routes.
 * Does NOT protect /api/calls/webhook — that route uses Twilio
 * signature verification instead (see routes/calls.js).
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Missing or malformed Authorization header'));
  }

  if (!process.env.JWT_SECRET) {
    return next(new ApiError(500, 'JWT_SECRET is not configured on the server'));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
}

module.exports = { requireAuth };
