// src/components/ChatInterface.jsx
import { useEffect, useRef } from 'react'
import Message from './Message'
import styles from './ChatInterface.module.css'

export default function ChatInterface({
  messages,
  onSend,
  loading,
  placeholder = 'Écris ton message…',
  accentColor,
  disclaimer,
}) {
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  function handleInput(e) {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  function submit() {
    const text = inputRef.current?.value.trim()
    if (!text || loading) return
    inputRef.current.value = ''
    inputRef.current.style.height = 'auto'
    onSend(text)
  }

  return (
    <>
      <div className={styles.messages} aria-live="polite" aria-relevant="additions">
        {messages.map((m, i) => (
          <Message key={i} role={m.role} content={m.content} isNew={i === messages.length - 1} />
        ))}
        {loading && (
          <div className={styles.typingWrapper}>
            <div className={styles.avatar}><span>S</span></div>
            <div className={styles.typing}>
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}

      <div className={styles.inputBar}>
        <textarea
          ref={inputRef}
          className={styles.input}
          placeholder={placeholder}
          rows={1}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
        />
        <button
          className={styles.send}
          style={{ '--accent': accentColor, background: accentColor }}
          onClick={submit}
          disabled={loading}
          aria-label="Envoyer"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M16 9L2 2l3 7-3 7 14-7z" fill="currentColor"/>
          </svg>
        </button>
      </div>
    </>
  )
}
