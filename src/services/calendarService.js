const { google } = require('googleapis');

function getOAuthClient() {
  const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN', 'GOOGLE_REDIRECT_URI'];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing Google Calendar env vars: ${missing.join(', ')}`);
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return oAuth2Client;
}

function getCalendarClient() {
  return google.calendar({ version: 'v3', auth: getOAuthClient() });
}

async function checkAvailability({ interviewerEmail, timeMin, timeMax }) {
  const calendar = getCalendarClient();
  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      items: [{ id: interviewerEmail }]
    }
  });
  return data.calendars[interviewerEmail]?.busy || [];
}

async function createInterviewEvent({
  candidateEmail,
  candidateName,
  interviewerEmail,
  interviewerName,
  jobTitle,
  startDateTime,
  endDateTime,
  timeZone = 'UTC'
}) {
  const calendar = getCalendarClient();

  const { data } = await calendar.events.insert({
    calendarId: 'primary',
    sendUpdates: 'all',
    requestBody: {
      summary: `Interview: ${candidateName} — ${jobTitle}`,
      description: `Recruitment interview for ${jobTitle} scheduled via AI Recruitment Calling Assistant.`,
      start: { dateTime: startDateTime, timeZone },
      end: { dateTime: endDateTime, timeZone },
      attendees: [
        ...(candidateEmail ? [{ email: candidateEmail, displayName: candidateName }] : []),
        ...(interviewerEmail ? [{ email: interviewerEmail, displayName: interviewerName }] : [])
      ],
      reminders: { useDefault: true }
    }
  });

  return data; // includes data.id -> calendar_event_id
}

async function updateInterviewEvent(eventId, patch) {
  const calendar = getCalendarClient();
  const { data } = await calendar.events.patch({
    calendarId: 'primary',
    eventId,
    sendUpdates: 'all',
    requestBody: patch
  });
  return data;
}

async function cancelInterviewEvent(eventId) {
  const calendar = getCalendarClient();
  await calendar.events.delete({ calendarId: 'primary', eventId, sendUpdates: 'all' });
}

module.exports = {
  checkAvailability,
  createInterviewEvent,
  updateInterviewEvent,
  cancelInterviewEvent
};
