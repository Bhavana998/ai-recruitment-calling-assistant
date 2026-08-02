const OpenAI = require('openai');
const logger = require('../config/logger');

let client;
function getClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

const QUESTION_CODES = [
  'current_salary',
  'expected_salary',
  'notice_period',
  'skills_confirmed',
  'location',
  'work_preference',
  'interested_in_role'
];

/**
 * Extracts structured, standardized candidate answers from a raw
 * conversation transcript. Returns an array shaped for direct insertion
 * into the candidate_responses table.
 */
async function extractStructuredResponses(transcriptText, jobContext = {}) {
  const openai = getClient();

  const systemPrompt = `You are an information extraction engine for a recruitment call transcript.
Extract only what the candidate actually said. Do not infer or fabricate values.
Return ONLY valid JSON (no markdown fences, no commentary) as an array of objects:
[{ "question_code": string, "response_text": string, "response_value": string }]
Valid question_code values: ${QUESTION_CODES.join(', ')}.
If a value was not discussed, omit that question_code entirely rather than guessing.`;

  const userPrompt = `Job context: ${JSON.stringify(jobContext)}

Transcript:
${transcriptText}`;

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  const raw = completion.choices[0].message.content.trim();

  try {
    return JSON.parse(raw);
  } catch (err) {
    logger.error('Failed to parse NLP extraction output as JSON', { raw });
    throw new Error('NLP extraction returned malformed JSON');
  }
}

/**
 * Answers a candidate's ad-hoc question during the call using the job's
 * description/company background as grounding context.
 */
async function answerCandidateQuestion(question, jobContext) {
  const openai = getClient();

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.3,
    messages: [
      {
        role: 'system',
        content:
          'You are a friendly recruitment voice assistant on a live phone call. ' +
          'Answer the candidate\'s question briefly (2-3 sentences, spoken tone) using only ' +
          'the job details provided. If you do not know, say a recruiter will follow up.'
      },
      { role: 'user', content: `Job details: ${JSON.stringify(jobContext)}\n\nCandidate asked: "${question}"` }
    ]
  });

  return completion.choices[0].message.content.trim();
}

module.exports = { extractStructuredResponses, answerCandidateQuestion, QUESTION_CODES };
