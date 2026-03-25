// src/services/aiClient.js
import { OPENROUTER_URL, OPENROUTER_MODEL, SYSTEM_HOMEWORK, SYSTEM_WELLBEING, SYSTEM_SUMMARIZE } from '../config'

// ⚠️  SECURITY NOTE: VITE_OPENROUTER_API_KEY is baked into the JS bundle at build time
// and is visible to anyone who inspects the network tab or built JS.
// For a production or public-facing deployment, restrict this key in the OpenRouter
// dashboard (allowed domains / monthly spend cap). Never commit .env to git.
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

async function chat(messages, systemPrompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Scolia',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter error ${response.status}: ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function callTutorIA(messages) {
  return chat(messages, SYSTEM_HOMEWORK)
}

export async function callWellbeingIA(messages) {
  return chat(messages, SYSTEM_WELLBEING)
}

export async function summarizeDifficulty(messages) {
  // Only send first 6 messages to save tokens
  return chat(messages.slice(0, 6), SYSTEM_SUMMARIZE)
}
