// src/utils/conversations.js

function keyFor(studentName, subject) {
  const name = (studentName || 'anon').toLowerCase().replace(/[^a-z0-9]/g, '-')
  const sub  = subject.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return `scolia-conv-${name}-${sub}`
}

export function loadConversation(studentName, subject) {
  try {
    const raw = localStorage.getItem(keyFor(studentName, subject))
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

export function saveConversation(studentName, subject, messages) {
  try {
    localStorage.setItem(keyFor(studentName, subject), JSON.stringify(messages))
  } catch { /* storage full — silent */ }
}

export function clearConversation(studentName, subject) {
  localStorage.removeItem(keyFor(studentName, subject))
}
