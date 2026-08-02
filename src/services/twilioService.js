const twilio = require('twilio');
const logger = require('../config/logger');

function getClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error('Twilio credentials are not configured');
  }
  return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

/**
 * Places an outbound call. The `url` should point at a TwiML endpoint
 * (see routes/calls.js -> /api/calls/twiml/:callSessionId) that streams
 * the AI-generated speech and gathers candidate responses.
 */
async function initiateCall({ toNumber, twimlUrl, statusCallbackUrl }) {
  const client = getClient();

  const call = await client.calls.create({
    to: toNumber,
    from: process.env.TWILIO_PHONE_NUMBER,
    url: twimlUrl,
    method: 'POST',
    statusCallback: statusCallbackUrl,
    statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    statusCallbackMethod: 'POST',
    record: true,
    recordingStatusCallback: statusCallbackUrl,
    recordingStatusCallbackEvent: ['completed']
  });

  logger.info('Twilio call initiated', { sid: call.sid, to: toNumber });
  return call;
}

async function getCallStatus(callSid) {
  const client = getClient();
  return client.calls(callSid).fetch();
}

async function getRecordings(callSid) {
  const client = getClient();
  const recordings = await client.calls(callSid).recordings.list();
  return recordings.map(r => ({
    sid: r.sid,
    duration: r.duration,
    url: `https://api.twilio.com${r.uri.replace('.json', '.mp3')}`
  }));
}

/**
 * Validates that an inbound webhook actually originated from Twilio.
 * MUST be used on /api/calls/webhook to prevent forged status updates.
 */
function validateWebhookSignature(signature, url, params) {
  if (!process.env.TWILIO_AUTH_TOKEN) return false;
  return twilio.validateRequest(process.env.TWILIO_AUTH_TOKEN, signature, url, params);
}

module.exports = { initiateCall, getCallStatus, getRecordings, validateWebhookSignature };
