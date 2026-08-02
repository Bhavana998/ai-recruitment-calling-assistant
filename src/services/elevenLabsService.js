const axios = require('axios');
const logger = require('../config/logger');

const BASE_URL = 'https://api.elevenlabs.io/v1';

/**
 * Converts text to speech and returns raw MP3 audio bytes.
 * Callers are responsible for hosting the resulting audio file
 * somewhere Twilio's TwiML <Play> verb can reach (e.g. S3 signed URL,
 * or a route on this server that streams the buffer).
 */
async function synthesizeSpeech(text, { voiceId, modelId = 'eleven_turbo_v2_5' } = {}) {
  if (!process.env.ELEVENLABS_API_KEY) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  const voice = voiceId || process.env.ELEVENLABS_VOICE_ID;
  if (!voice) {
    throw new Error('No ElevenLabs voice ID provided or configured');
  }

  try {
    const response = await axios.post(
      `${BASE_URL}/text-to-speech/${voice}`,
      {
        text,
        model_id: modelId,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 }
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      }
    );

    return Buffer.from(response.data);
  } catch (err) {
    logger.error('ElevenLabs synthesis failed', {
      status: err.response?.status,
      data: err.response?.data?.toString?.()
    });
    throw err;
  }
}

module.exports = { synthesizeSpeech };
