// src/pages/TeacherView.jsx
import { useState } from 'react'
import Layout from '../components/Layout'
import { getSignals } from '../services/signals'
import styles from './TeacherView.module.css'

const SUBJECT_META = {
  'Mathématiques': { emoji: '📐', color: '#6366f1', bg: 'rgba(99,102,241,0.13)' },
  'Français':      { emoji: '✍️',  color: '#ec4899', bg: 'rgba(236,72,153,0.13)' },
  'Sciences':      { emoji: '🔬', color: '#10b981', bg: 'rgba(16,185,129,0.13)' },
  'Histoire-Géo':  { emoji: '🌍', color: '#f59e0b', bg: 'rgba(245,158,11,0.13)' },
  'Anglais':       { emoji: '🇬🇧', color: '#3b82f6', bg: 'rgba(59,130,246,0.13)' },
  'Autre':         { emoji: '📖', color: '#8b5cf6', bg: 'rgba(139,92,246,0.13)' },
}

const DIFFICULTY_META = {
  "Compréhension de notion":   { color: '#6366f1', bg: 'rgba(99,102,241,0.10)' },
  "Application d'une méthode": { color: '#0ea5e9', bg: 'rgba(14,165,233,0.10)' },
  "Problème de rédaction":     { color: '#ec4899', bg: 'rgba(236,72,153,0.10)' },
  "Difficulté générale":       { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

function SubjectBadge({ subject }) {
  const meta = SUBJECT_META[subject] || { emoji: '📖', color: '#8b5cf6', bg: 'rgba(139,92,246,0.13)' }
  return (
    <span className={styles.badge} style={{ color: meta.color, background: meta.bg }}>
      {meta.emoji} {subject}
    </span>
  )
}

function DifficultyBadge({ type }) {
  const m = DIFFICULTY_META[type] || { color: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' }
  return (
    <span className={styles.badge} style={{ color: m.color, background: m.bg }}>{type}</span>
  )
}

function StudentChip({ name, variant = 'default' }) {
  if (!name) return null
  return (
    <div className={styles.studentChip}>
      <div className={`${styles.studentAvatar} ${variant === 'alert' ? styles.avatarAlert : ''}`}>
        {name[0].toUpperCase()}
      </div>
      <span className={styles.studentName}>{name}</span>
    </div>
  )
}

function SchoolCard({ sig }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <div className={styles.badges}>
          <SubjectBadge subject={sig.subject} />
          <DifficultyBadge type={sig.difficultyType} />
        </div>
        <span className={styles.date}>{formatDate(sig.createdAt)}</span>
      </div>
      <StudentChip name={sig.studentName} />
      <p className={styles.summary}>{sig.summary}</p>
    </div>
  )
}

function WellbeingCard({ sig }) {
  return (
    <div className={`${styles.card} ${styles.cardAlert}`}>
      <div className={styles.cardHead}>
        <div className={styles.alertPill}>
          <span className={styles.alertDot} />
          ALERTE BIEN-ÊTRE
        </div>
        <span className={styles.date}>{formatDate(sig.createdAt)}</span>
      </div>
      <StudentChip name={sig.studentName || 'Élève (anonyme)'} variant="alert" />
      <div className={styles.privacyNote}>
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1.5a5 5 0 100 10 5 5 0 000-10zM6.5 4v3.5M6.5 9h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        Aucun détail de conversation n'est partagé ici.
      </div>
      <p className={styles.alertInstruction}>
        Parler directement à cet élève en privé dès que possible.
      </p>
    </div>
  )
}

export default function TeacherView() {
  const [signals, setSignals] = useState(() => getSignals())

  const schoolSignals    = signals.filter(s => s.subject !== 'Bien-être')
  const wellbeingSignals = signals.filter(s => s.subject === 'Bien-être')
  const criticalCount    = wellbeingSignals.length

  return (
    <Layout title="Vue Professeur" onBack>
      <div className={styles.container}>

        {/* Stats */}
        <div className={styles.statsBar}>
          <div className={styles.stat}>
            <span className={styles.statNum}>{schoolSignals.length}</span>
            <span className={styles.statLabel}>📚 scolaires</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={`${styles.statNum} ${criticalCount > 0 ? styles.statRed : ''}`}>
              {criticalCount}
            </span>
            <span className={styles.statLabel}>🔴 alertes</span>
          </div>
          <button className={styles.refreshBtn} onClick={() => setSignals(getSignals())} title="Actualiser">
            ↻
          </button>
        </div>

        {/* ── Alertes bien-être (priorité visuelle) ── */}
        {wellbeingSignals.length > 0 && (
          <section>
            <h2 className={`${styles.sectionTitle} ${styles.sectionRed}`}>
              <span>💙 Bien-être & Alertes</span>
              <span className={styles.sectionCount}>{wellbeingSignals.length}</span>
            </h2>
            {wellbeingSignals.map(sig => <WellbeingCard key={sig.id} sig={sig} />)}
          </section>
        )}

        {/* ── Difficultés scolaires ── */}
        {schoolSignals.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>
              <span>📚 Difficultés scolaires</span>
              <span className={styles.sectionCount}>{schoolSignals.length}</span>
            </h2>
            {schoolSignals.map(sig => <SchoolCard key={sig.id} sig={sig} />)}
          </section>
        )}

        {signals.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📭</div>
            <p>Aucun signal pour l'instant</p>
            <span>Les signaux apparaîtront ici après les premières conversations des élèves.</span>
          </div>
        )}
      </div>
    </Layout>
  )
}
