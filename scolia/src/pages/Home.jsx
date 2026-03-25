// src/pages/Home.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { getStudentName, setStudentName, clearStudentName } from '../utils/studentName'
import styles from './Home.module.css'

function NameGate({ onConfirm }) {
  const [val, setVal] = useState('')
  return (
    <div className={styles.nameGate}>
      <div className={styles.nameCard}>
        <div className={styles.nameEmoji}>👋</div>
        <h2 className={styles.nameTitle}>Bienvenue sur Scolia</h2>
        <p className={styles.nameSubtitle}>Comment tu t'appelles ?</p>
        <input
          className={styles.nameInput}
          type="text"
          placeholder="Ton prénom…"
          value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && val.trim() && onConfirm(val)}
          autoFocus
          maxLength={24}
        />
        <button
          className={styles.nameBtn}
          onClick={() => val.trim() && onConfirm(val)}
          disabled={!val.trim()}
        >
          C'est parti →
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [name, setName] = useState(() => getStudentName())
  const navigate = useNavigate()

  function handleConfirmName(n) {
    setStudentName(n)
    setName(n.trim())
  }

  function handleLogout() {
    clearStudentName()
    setName('')
  }

  return (
    <div className="app-container">
      {/* Aurora background */}
      <div className={styles.aurora} aria-hidden="true">
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />
        <div className={styles.blob4} />
      </div>

      <header className={styles.header}>
        <span />
        <ThemeToggle />
      </header>

      {!name ? (
        <NameGate onConfirm={handleConfirmName} />
      ) : (
        <main className={styles.main}>
          <div className={styles.hero}>
            <div className={styles.logoMark}>📚</div>
            <h1 className={styles.logo}>Scolia</h1>
            <div className={styles.greetingRow}>
              <p className={styles.greeting}>
                Salut, <strong>{name}</strong> ✦
              </p>
              <button className={styles.logoutBtn} onClick={handleLogout} title="Changer de profil">
                Déconnecter
              </button>
            </div>
            <p className={styles.tagline}>Que veux-tu faire aujourd'hui ?</p>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.cta} ${styles.ctaGreen}`}
              onClick={() => navigate('/homework')}
            >
              <span className={styles.ctaIcon}>✏️</span>
              <div className={styles.ctaText}>
                <strong>Aide aux devoirs</strong>
                <span>Je guide, tu comprends</span>
              </div>
              <svg className={styles.ctaChevron} width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6.5 4.5l5 4.5-5 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button
              className={`${styles.cta} ${styles.ctaCoral}`}
              onClick={() => navigate('/feelings')}
            >
              <span className={styles.ctaIcon}>💬</span>
              <div className={styles.ctaText}>
                <strong>Ce que je ressens</strong>
                <span>Un espace rien que pour toi</span>
              </div>
              <svg className={styles.ctaChevron} width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M6.5 4.5l5 4.5-5 4.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </main>
      )}

      <footer className={styles.footer}>
        <button className={styles.teacherLink} onClick={() => navigate('/teacher')}>
          Vue Professeur / Référent
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </footer>
    </div>
  )
}
