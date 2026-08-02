const axios = require('axios');
const logger = require('../config/logger');

const BASE_URL = 'https://api.assemblyai.com/v2';

function getHeaders() {
  if (!process.env.ASSEMBLYAI_API_KEY) {
    throw new Error('ASSEMBLYAI_API_KEY is not configured');
  }
  return { authorization: process.env.ASSEMBLYAI_API_KEY };
}

/**
 * Submits a publicly-reachable audio URL (e.g. the Twilio recording URL)
 * for transcription and polls until it completes.
 */
async function transcribeFromUrl(audioUrl, { pollIntervalMs = 3000, timeoutMs = 120000 } = {}) {
  const { data: submitted } = await axios.post(
    `${BASE_URL}/transcript`,
    { audio_url: audioUrl, speaker_labels: true },
    { headers: getHeaders() }
  );

  const transcriptId = submitted.id;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const { data: poll } = await axios.get(`${BASE_URL}/transcript/${transcriptId}`, {
      headers: getHeaders()
    });

    if (poll.status === 'completed') {
      return { text: poll.text, confidence: poll.confidence, utterances: poll.utterances };
    }
    if (poll.status === 'error') {
      throw new Error(`AssemblyAI transcription failed: ${poll.error}`);
    }

    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(`AssemblyAI transcription timed out for transcript ${transcriptId}`);
}

module.exports = { transcribeFromUrl };
