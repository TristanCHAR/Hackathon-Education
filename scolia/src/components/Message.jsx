// src/components/Message.jsx
import styles from './Message.module.css'

export default function Message({ role, content, isNew = true }) {
  const isUser = role === 'user'
  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.ai} ${isNew ? styles.new : ''}`}>
      {!isUser && (
        <div className={styles.avatar}>
          <span>S</span>
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAi}`}>
        {content}
      </div>
    </div>
  )
}
