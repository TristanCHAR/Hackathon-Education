// src/components/Layout.jsx
import ThemeToggle from './ThemeToggle'
import styles from './Layout.module.css'
import { useNavigate } from 'react-router-dom'
import { getStudentName } from '../utils/studentName'

export default function Layout({ title, onBack, accentColor, children }) {
  const navigate = useNavigate()
  const name = getStudentName()

  return (
    <div className="app-container">
      <header className={styles.header}>
        <div className={styles.left}>
          {onBack && (
            <button className={styles.back} onClick={() => navigate(-1)} aria-label="Retour">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Retour
            </button>
          )}
        </div>

        <h1 className={styles.title} style={{ '--accent': accentColor }}>{title}</h1>

        <div className={styles.right}>
          {name && <span className={styles.namePill}>{name}</span>}
          <ThemeToggle />
        </div>
      </header>

      {accentColor && (
        <div className={styles.accentBar} style={{ background: accentColor }} />
      )}

      <main className={styles.main}>{children}</main>
    </div>
  )
}
