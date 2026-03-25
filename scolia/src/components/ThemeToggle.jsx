// src/components/ThemeToggle.jsx
import { useTheme } from '../context/ThemeContext'
import styles from './ThemeToggle.module.css'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label="Basculer le thème"
      title={theme === 'light' ? 'Passer en mode nuit' : 'Passer en mode jour'}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
