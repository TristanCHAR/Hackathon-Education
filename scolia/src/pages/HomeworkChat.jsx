// src/pages/HomeworkChat.jsx
import { useState, useCallback } from 'react'
import Layout from '../components/Layout'
import ChatInterface from '../components/ChatInterface'
import { callTutorIA, summarizeDifficulty } from '../services/aiClient'
import { addSignal } from '../services/signals'
import { getStudentName } from '../utils/studentName'
import { loadConversation, saveConversation, clearConversation } from '../utils/conversations'
import styles from './HomeworkChat.module.css'

const SUBJECTS = [
  { label: 'Mathématiques', emoji: '📐', color: '#6366f1' },
  { label: 'Français',      emoji: '✍️',  color: '#ec4899' },
  { label: 'Sciences',      emoji: '🔬', color: '#10b981' },
  { label: 'Histoire-Géo',  emoji: '🌍', color: '#f59e0b' },
  { label: 'Anglais',       emoji: '🇬🇧', color: '#3b82f6' },
  { label: 'Autre',         emoji: '📖', color: '#8b5cf6' },
]

const DIFFICULTY_KEYWORDS = {
  "Compréhension de notion":   ['comprends pas', "c'est quoi", 'expliquer', 'notion', 'définition'],
  "Application d'une méthode": ['comment faire', 'méthode', 'étapes', 'résoudre'],
  "Problème de rédaction":     ['rédiger', 'rédaction', 'dissertation', 'paragraphe'],
}

function guessDifficulty(text) {
  const lower = text.toLowerCase()
  for (const [type, kws] of Object.entries(DIFFICULTY_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) return type
  }
  return 'Difficulté générale'
}

const WELCOME = {
  role: 'assistant',
  content: "Bonjour ! Je suis Scolia 👋 Dis-moi ce que tu dois faire (colle l'énoncé, décris le problème…) et on avance ensemble !",
}

function buildInitialMessages(studentName, subject) {
  const saved = loadConversation(studentName, subject)
  return saved.length > 0 ? saved : [WELCOME]
}

export default function HomeworkChat() {
  const studentName = getStudentName()

  const [subject, setSubject]   = useState('Mathématiques')
  const [messages, setMessages] = useState(() => buildInitialMessages(studentName, 'Mathématiques'))
  const [loading, setLoading]   = useState(false)
  const [signalSaved, setSignalSaved] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  // Switch subject: save current, load new
  function handleSubjectChange(newSubject) {
    if (newSubject === subject) return
    saveConversation(studentName, subject, messages)
    setSubject(newSubject)
    setMessages(buildInitialMessages(studentName, newSubject))
    setSignalSaved(false)
    setShowResetConfirm(false)
  }

  // Reset current subject's conversation
  function confirmReset() {
    clearConversation(studentName, subject)
    setMessages([WELCOME])
    setSignalSaved(false)
    setShowResetConfirm(false)
  }

  const saveSignal = useCallback(async (msgs) => {
    if (signalSaved) return
    setSignalSaved(true)
    const difficultyType = guessDifficulty(msgs.map(m => m.content).join(' '))
    let summary = "L'élève exprime une difficulté scolaire."
    try { summary = await summarizeDifficulty(msgs) } catch { /* silent */ }
    addSignal({ subject, difficultyType, summary, isCritical: false, studentName })
  }, [signalSaved, subject, studentName])

  async function handleSend(text) {
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    saveConversation(studentName, subject, newMessages)
    setLoading(true)
    try {
      const reply = await callTutorIA(newMessages.filter(m => m !== WELCOME))
      const updated = [...newMessages, { role: 'assistant', content: reply }]
      setMessages(updated)
      saveConversation(studentName, subject, updated)
      if (updated.filter(m => m.role === 'user').length === 1) saveSignal(updated)
    } catch (e) {
      const err = [...newMessages, { role: 'assistant', content: `Oups, une erreur s'est produite. Réessaie ! (${e.message})` }]
      setMessages(err)
      saveConversation(studentName, subject, err)
    } finally {
      setLoading(false)
    }
  }

  const current = SUBJECTS.find(s => s.label === subject)
  const color = current?.color || '#6366f1'
  const msgCount = messages.filter(m => m.role === 'user').length

  return (
    <Layout title="Aide aux devoirs" onBack accentColor={color}>
      {/* Subject pills */}
      <div className={styles.subjectBar}>
        <div className={styles.pills}>
          {SUBJECTS.map(s => (
            <button
              key={s.label}
              className={`${styles.pill} ${subject === s.label ? styles.pillActive : ''}`}
              style={subject === s.label ? { background: s.color, borderColor: s.color, color: '#fff' } : {}}
              onClick={() => handleSubjectChange(s.label)}
              title={s.label}
            >
              <span>{s.emoji}</span>
              {subject === s.label && <span className={styles.pillLabel}>{s.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation toolbar */}
      <div className={styles.convBar}>
        <span className={styles.convInfo}>
          {msgCount > 0
            ? `${msgCount} échange${msgCount > 1 ? 's' : ''} sauvegardé${msgCount > 1 ? 's' : ''}`
            : 'Nouvelle conversation'}
        </span>
        {!showResetConfirm ? (
          <button
            className={styles.resetBtn}
            onClick={() => setShowResetConfirm(true)}
            disabled={msgCount === 0}
          >
            ↺ Réinitialiser
          </button>
        ) : (
          <div className={styles.confirmRow}>
            <span className={styles.confirmText}>Effacer cette conv ?</span>
            <button className={styles.confirmYes} onClick={confirmReset}>Oui</button>
            <button className={styles.confirmNo} onClick={() => setShowResetConfirm(false)}>Non</button>
          </div>
        )}
      </div>

      <ChatInterface
        messages={messages}
        onSend={handleSend}
        loading={loading}
        placeholder={`Question de ${subject.toLowerCase()}…`}
        accentColor={color}
      />
    </Layout>
  )
}
