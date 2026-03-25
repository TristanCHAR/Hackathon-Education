// src/services/signals.js

const STORAGE_KEY = 'scolia-signals'

// Critical keywords for client-side detection
const CRITICAL_KEYWORDS = [
  'suicide', 'suicidaire', 'me tuer', 'me suicider', 'en finir',
  'plus envie de vivre', 'mourir', 'je veux mourir',
  'me faire du mal', 'me blesser', 'automutilation', 'auto-mutilation',
  'je me coupe', 'je me blesse',
  'on me frappe', 'on me bat', 'harcèlement', 'harcelé', 'harcèle',
  'ils me forcent', 'agression', 'agressé',
]

export function detectCritical(text) {
  const lower = text.toLowerCase()
  return CRITICAL_KEYWORDS.some(kw => lower.includes(kw))
}

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function save(signals) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(signals))
}

export function addSignal({ subject, difficultyType, summary, isCritical = false, studentName = '' }) {
  const signals = load()
  const id = Date.now().toString()
  signals.unshift({
    id,
    subject,
    difficultyType,
    summary,
    isCritical,
    studentName,
    createdAt: new Date().toISOString(),
  })
  save(signals)
  return id
}

export function flagCritical(signalId) {
  const signals = load()
  const idx = signals.findIndex(s => s.id === signalId)
  if (idx !== -1) {
    signals[idx].isCritical = true
    save(signals)
  }
}

export function getSignals() {
  return load()
}
