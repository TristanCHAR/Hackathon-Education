// src/pages/WellbeingChat.jsx
import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import ChatInterface from '../components/ChatInterface'
import { callWellbeingIA } from '../services/aiClient'
import { detectCritical, addSignal } from '../services/signals'
import { getStudentName } from '../utils/studentName'
import { loadConversation, saveConversation, clearConversation } from '../utils/conversations'
import styles from './WellbeingChat.module.css'

const SUBJECT_KEY = 'bien-etre'

const WELCOME = {
  role: 'assistant',
  content: "Salut 👋 Je suis là pour t'écouter. Tu peux me parler de ce que tu vis, sans jugement. Qu'est-ce qui se passe en ce moment ?",
}
const DISCLAIMER = "Je ne remplace pas un professionnel, mais tu peux me parler librement."

export default function WellbeingChat() {
  const studentName = getStudentName()

  const saved = loadConversation(studentName, SUBJECT_KEY)
  const [messages, setMessages] = useState(saved.length > 0 ? saved : [WELCOME])
  const [loading, setLoading]   = useState(false)
  const [criticalFlagged, setCriticalFlagged] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const sessionSignalId = useRef(null)

  function confirmReset() {
    clearConversation(studentName, SUBJECT_KEY)
    setMessages([WELCOME])
    setCriticalFlagged(false)
    setShowResetConfirm(false)
  }

  async function handleSend(text) {
    const isCritical = detectCritical(text)
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    saveConversation(studentName, SUBJECT_KEY, newMessages)
    setLoading(true)

    if (isCritical && !criticalFlagged) {
      setCriticalFlagged(true)
      const id = addSignal({
        subject: 'Bien-être',
        difficultyType: 'Signal critique détecté',
        summary: '',  // no content stored — privacy by design
        isCritical: true,
        studentName,
      })
      sessionSignalId.current = id
    }

    try {
      const reply = await callWellbeingIA(newMessages.slice(-20))
      const updated = [...newMessages, { role: 'assistant', content: reply }]
      setMessages(updated)
      saveConversation(studentName, SUBJECT_KEY, updated)
    } catch (e) {
      const err = [...newMessages, { role: 'assistant', content: `Désolé, je rencontre un problème technique. (${e.message})` }]
      setMessages(err)
      saveConversation(studentName, SUBJECT_KEY, err)
    } finally {
      setLoading(false)
    }
  }

  const msgCount = messages.filter(m => m.role === 'user').length

  return (
    <Layout title="Ce que je ressens" onBack accentColor="var(--color-coral)">
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.convInfo}>
          {msgCount > 0
            ? `${msgCount} message${msgCount > 1 ? 's' : ''} sauvegardé${msgCount > 1 ? 's' : ''}`
            : 'Nouvelle conversation'}
        </span>
        {!showResetConfirm ? (
          <button
            className={styles.resetBtn}
            onClick={() => setShowResetConfirm(true)}
            disabled={msgCount === 0}
          >
            ↺ Nouvelle conv
          </button>
        ) : (
          <div className={styles.confirmRow}>
            <span>Effacer ?</span>
            <button className={styles.confirmYes} onClick={confirmReset}>Oui</button>
            <button className={styles.confirmNo} onClick={() => setShowResetConfirm(false)}>Non</button>
          </div>
        )}
      </div>

      {criticalFlagged && (
        <div className={styles.criticalBanner}>
          <div className={styles.bannerIcon}>🆘</div>
          <div>
            <p><strong>Tu n'es pas seul(e).</strong></p>
            <p>Appelle le <strong>3114</strong> (prévention suicide), le <strong>3018</strong> (harcèlement) ou le <strong>3020</strong> (harcèlement scolaire). Un adulte peut vraiment t'aider.</p>
          </div>
        </div>
      )}

      <ChatInterface
        messages={messages}
        onSend={handleSend}
        loading={loading}
        placeholder="Dis-moi ce que tu ressens…"
        accentColor="var(--color-coral)"
        disclaimer={DISCLAIMER}
      />
    </Layout>
  )
}
