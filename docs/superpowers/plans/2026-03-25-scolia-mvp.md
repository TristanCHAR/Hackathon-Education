# Scolia MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, mobile-first React SPA called Scolia — a school companion with an AI homework tutor, a mental-wellbeing chatbot, and a teacher dashboard that surfaces scholastic signals and critical alert flags, all with light/dark theming.

**Architecture:** Single-page React app (Vite) with React Router v6 for four views (Home, HomeworkChat, WellbeingChat, TeacherView). A thin `aiClient.js` service wraps OpenRouter REST calls; a `signals.js` service persists scholastic signals and critical-risk flags to localStorage. Theme state lives in React Context and persists to localStorage.

**Tech Stack:** React 18, Vite 5, React Router v6, CSS custom properties (no external UI framework), OpenRouter REST API.

---

## File Map

| Path | Responsibility |
|------|---------------|
| `scolia/index.html` | Root HTML shell |
| `scolia/vite.config.js` | Vite config (base path `/`) |
| `scolia/package.json` | Dependencies |
| `scolia/.env.example` | Template showing `VITE_OPENROUTER_API_KEY` |
| `scolia/.env` | Real API key (git-ignored) |
| `scolia/.gitignore` | Ignore `.env`, `node_modules`, `dist` |
| `scolia/src/main.jsx` | React entrypoint, wraps App in Router + ThemeProvider |
| `scolia/src/App.jsx` | Route declarations |
| `scolia/src/config.js` | OpenRouter URL, model name, system prompts |
| `scolia/src/styles/global.css` | CSS reset, base typography, layout utilities |
| `scolia/src/styles/theme.css` | CSS custom properties for light/dark palettes |
| `scolia/src/context/ThemeContext.jsx` | Theme state (light/dark), toggle, localStorage persistence |
| `scolia/src/services/aiClient.js` | `streamChat(messages, systemPrompt)` → OpenRouter fetch |
| `scolia/src/services/signals.js` | CRUD for scholastic signals + critical flag in localStorage |
| `scolia/src/components/Layout.jsx` | Shell: max-width container, applies theme class to `<body>` |
| `scolia/src/components/ThemeToggle.jsx` | Sun/moon icon button, calls `toggleTheme()` |
| `scolia/src/components/ThemeToggle.module.css` | Toggle button styles |
| `scolia/src/components/ChatInterface.jsx` | Reusable chat UI: message list + input bar |
| `scolia/src/components/Message.jsx` | Single message bubble (user / assistant) |
| `scolia/src/pages/Home.jsx` | Accueil: logo, two CTA buttons, teacher link |
| `scolia/src/pages/HomeworkChat.jsx` | Homework tutor chat; generates scholastic signal on first AI reply |
| `scolia/src/pages/WellbeingChat.jsx` | Wellbeing chat; detects critical keywords; flags signal |
| `scolia/src/pages/TeacherView.jsx` | List of scholastic signals with optional alert badge |

---

## Task 1 — Project Scaffold

**Files:**
- Create: `scolia/package.json`
- Create: `scolia/vite.config.js`
- Create: `scolia/index.html`
- Create: `scolia/.gitignore`
- Create: `scolia/.env.example`

- [ ] **Step 1: Initialise project**

```bash
cd /Users/ziad/Documents/Hackathon-Education
npm create vite@latest scolia -- --template react
cd scolia
npm install react-router-dom
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
dist/
.env
```

- [ ] **Step 3: Create `.env.example`**

```
VITE_OPENROUTER_API_KEY=sk-or-...
```

- [ ] **Step 4: Create your `.env` file** (dev only, never commit)

```bash
cp .env.example .env
# Edit .env and paste your real key
```

- [ ] **Step 5: Verify dev server starts**

```bash
npm run dev
```
Expected: Vite server at `http://localhost:5173`, default React page loads.

- [ ] **Step 6: Commit scaffold**

```bash
cd /Users/ziad/Documents/Hackathon-Education/scolia
git add package.json vite.config.js index.html .gitignore .env.example
git commit -m "feat: scaffold Scolia Vite + React project"
```

---

## Task 2 — CSS Theme System

**Files:**
- Create: `scolia/src/styles/global.css`
- Create: `scolia/src/styles/theme.css`
- Modify: `scolia/src/main.jsx` (import stylesheets)

- [ ] **Step 1: Write `theme.css`**

```css
/* src/styles/theme.css */

:root {
  /* ── Light (Jour) ─────────────────────── */
  --bg-primary:       #f8f7f4;
  --bg-card:          #ffffff;
  --bg-input:         #ffffff;
  --text-primary:     #1a1a2e;
  --text-secondary:   #555577;
  --text-muted:       #888899;
  --border:           #e2e2ec;
  --shadow:           rgba(0,0,0,0.06);

  --color-green:      #4caf82;
  --color-green-soft: #e8f7f0;
  --color-coral:      #e07b6a;
  --color-coral-soft: #fdf0ee;

  --bubble-user-bg:   #4caf82;
  --bubble-user-text: #ffffff;
  --bubble-ai-bg:     #f0f0f6;
  --bubble-ai-text:   #1a1a2e;

  --accent-hw:        #4caf82;
  --accent-wb:        #e07b6a;
}

.dark {
  --bg-primary:       #1a1a24;
  --bg-card:          #252533;
  --bg-input:         #2e2e3e;
  --text-primary:     #e8e8f0;
  --text-secondary:   #a0a0bb;
  --text-muted:       #666688;
  --border:           #3a3a4e;
  --shadow:           rgba(0,0,0,0.3);

  --color-green:      #5dc992;
  --color-green-soft: #1e3a2e;
  --color-coral:      #e8917f;
  --color-coral-soft: #3a2020;

  --bubble-user-bg:   #3a7a58;
  --bubble-user-text: #f0f0f0;
  --bubble-ai-bg:     #2e2e3e;
  --bubble-ai-text:   #e8e8f0;

  --accent-hw:        #5dc992;
  --accent-wb:        #e8917f;
}
```

- [ ] **Step 2: Write `global.css`**

```css
/* src/styles/global.css */
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
@import './theme.css';

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #root {
  height: 100%;
  font-family: 'Nunito', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background 0.25s, color 0.25s;
}

/* Mobile-first container */
.app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; border: none; background: none; }
```

- [ ] **Step 3: Import in `src/main.jsx`**

```jsx
import './styles/global.css'
```

- [ ] **Step 4: Verify** — run `npm run dev`, page background changes are visible once ThemeContext is wired (next task).

- [ ] **Step 5: Commit**

```bash
git add src/styles/
git commit -m "feat: add CSS custom-property theme system (light/dark)"
```

---

## Task 3 — ThemeContext + ThemeToggle

**Files:**
- Create: `scolia/src/context/ThemeContext.jsx`
- Create: `scolia/src/components/ThemeToggle.jsx`

- [ ] **Step 1: Write `ThemeContext.jsx`**

```jsx
// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('scolia-theme') || 'light'
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('scolia-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light')

  return (
    <ThemeCtx.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeCtx.Provider>
  )
}

export const useTheme = () => useContext(ThemeCtx)
```

- [ ] **Step 2: Write `ThemeToggle.jsx`**

```jsx
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
```

- [ ] **Step 3: Create `ThemeToggle.module.css`**

```css
/* src/components/ThemeToggle.module.css */
.toggle {
  font-size: 1.4rem;
  padding: 6px 8px;
  border-radius: 50%;
  line-height: 1;
  transition: background 0.2s;
}
.toggle:hover { background: var(--border); }
```

- [ ] **Step 4: Wire ThemeProvider in `src/main.jsx`**

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 5: Manual verify** — toggle button changes background between `#f8f7f4` and `#1a1a24`.

- [ ] **Step 6: Commit**

```bash
git add src/context/ src/components/ThemeToggle* src/main.jsx
git commit -m "feat: ThemeContext with localStorage persistence + toggle button"
```

---

## Task 4 — Config & AI Client Service

**Files:**
- Create: `scolia/src/config.js`
- Create: `scolia/src/services/aiClient.js`

- [ ] **Step 1: Write `config.js`**

```js
// src/config.js

export const OPENROUTER_URL  = 'https://openrouter.ai/api/v1/chat/completions'
export const OPENROUTER_MODEL = 'openai/gpt-4o-mini'  // change to preferred model

export const SYSTEM_HOMEWORK = `Tu es "Scolia", un tuteur scolaire bienveillant pour collégiens et lycéens.
Tu aides sur les matières principales (mathématiques, français, sciences, histoire-géographie, langues…).
Tu NE donnes PAS directement les réponses aux exercices.
Tu poses des questions guidées, proposes des indices progressifs, décomposes les problèmes en étapes.
Tu vérifies régulièrement la compréhension et tu peux proposer un ou deux exercices similaires.
Tu restes encourageant, sans être condescendant.
Si l'élève réclame la réponse complète plusieurs fois de suite (3 fois), tu peux la donner en expliquant.`

export const SYSTEM_WELLBEING = `Tu es "Scolia", un compagnon d'écoute empathique pour adolescents.
Tu n'es pas médecin ni psychologue, tu ne fais aucun diagnostic.
Tu écoutes les sujets légers (stress, démotivation, tensions relationnelles) et les sujets sérieux.
Tu poses des questions ouvertes, tu valides les émotions sans minimiser ni juger.
Tu encourages à parler à un adulte de confiance (parent, prof, CPE, infirmier scolaire…).
En cas de propos graves (violence, harcèlement continu, auto-mutilation, idées suicidaires) :
1. Tu affirmes clairement que tu ne peux pas gérer ça seul(e).
2. Tu demandes à la personne d'en parler IMMÉDIATEMENT à un adulte de confiance.
3. Tu mentionnes :
   - 3114 (numéro national prévention suicide)
   - 3018 (cyberharcèlement)
   - 3020 (harcèlement scolaire)
Tu NE demandes pas de données identifiantes (noms complets, adresse…).`

export const SYSTEM_SUMMARIZE = `Tu es un assistant concis. Résume en UNE phrase courte la difficulté scolaire exprimée par l'élève dans la conversation suivante. Commence par "L'élève exprime..."`
```

- [ ] **Step 2: Write `aiClient.js`**

```js
// src/services/aiClient.js
import { OPENROUTER_URL, OPENROUTER_MODEL } from '../config'

// ⚠️  SECURITY NOTE: VITE_OPENROUTER_API_KEY is baked into the JS bundle at build time
// and is visible to anyone who inspects the network tab or built JS.
// For a production or public-facing deployment, restrict this key in the OpenRouter
// dashboard (allowed domains / monthly spend cap). Never commit .env to git.
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

async function chat(messages, systemPrompt) {
  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Scolia',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`OpenRouter error ${response.status}: ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export async function callTutorIA(messages) {
  const { SYSTEM_HOMEWORK } = await import('../config')
  return chat(messages, SYSTEM_HOMEWORK)
}

export async function callWellbeingIA(messages) {
  const { SYSTEM_WELLBEING } = await import('../config')
  return chat(messages, SYSTEM_WELLBEING)
}

export async function summarizeDifficulty(messages) {
  const { SYSTEM_SUMMARIZE } = await import('../config')
  // Only send first 6 messages to save tokens
  return chat(messages.slice(0, 6), SYSTEM_SUMMARIZE)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/config.js src/services/aiClient.js
git commit -m "feat: OpenRouter aiClient with tutor, wellbeing, and summarize functions"
```

---

## Task 5 — Signals Service

**Files:**
- Create: `scolia/src/services/signals.js`

- [ ] **Step 1: Write `signals.js`**

```js
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

export function addSignal({ subject, difficultyType, summary, isCritical = false }) {
  const signals = load()
  const id = Date.now().toString()
  signals.unshift({
    id,
    subject,
    difficultyType,
    summary,
    isCritical,
    createdAt: new Date().toISOString(),
  })
  save(signals)
  return id  // caller may use this to later call flagCritical(id)
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
```

- [ ] **Step 2: Commit**

```bash
git add src/services/signals.js
git commit -m "feat: signals service with critical keyword detection and localStorage CRUD"
```

---

## Task 6 — Shared Chat Components

**Files:**
- Create: `scolia/src/components/Layout.jsx`
- Create: `scolia/src/components/Layout.module.css`
- Create: `scolia/src/components/Message.jsx`
- Create: `scolia/src/components/Message.module.css`
- Create: `scolia/src/components/ChatInterface.jsx`
- Create: `scolia/src/components/ChatInterface.module.css`

- [ ] **Step 1: Write `Layout.jsx`**

```jsx
// src/components/Layout.jsx
import ThemeToggle from './ThemeToggle'
import styles from './Layout.module.css'
import { useNavigate } from 'react-router-dom'

export default function Layout({ title, onBack, accentColor, children }) {
  const navigate = useNavigate()
  return (
    <div className="app-container">
      <header className={styles.header} style={{ borderBottomColor: accentColor }}>
        {onBack
          ? <button className={styles.back} onClick={() => navigate(-1)}>← Retour</button>
          : <span />
        }
        <h1 className={styles.title}>{title}</h1>
        <ThemeToggle />
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Write `Layout.module.css`**

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-card);
  border-bottom: 3px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
}
.title { font-size: 1.1rem; font-weight: 800; }
.back  { font-size: 0.9rem; font-weight: 700; color: var(--text-secondary); padding: 4px 8px; border-radius: 8px; }
.back:hover { background: var(--border); }
.main  { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
```

- [ ] **Step 3: Write `Message.jsx`**

```jsx
// src/components/Message.jsx
import styles from './Message.module.css'

export default function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.ai}`}>
      {!isUser && <span className={styles.avatar}>🤖</span>}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAi}`}>
        {content}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write `Message.module.css`**

```css
.wrapper {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0 12px;
}
.user  { flex-direction: row-reverse; }
.ai    { flex-direction: row; }

.avatar { font-size: 1.4rem; flex-shrink: 0; }

.bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}
.bubbleUser {
  background: var(--bubble-user-bg);
  color: var(--bubble-user-text);
  border-bottom-right-radius: 4px;
}
.bubbleAi {
  background: var(--bubble-ai-bg);
  color: var(--bubble-ai-text);
  border-bottom-left-radius: 4px;
}
```

- [ ] **Step 5: Write `ChatInterface.jsx`**

```jsx
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
  inputRef,
}) {
  const bottomRef = useRef(null)
  const localRef   = useRef(null)
  const ref = inputRef || localRef

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  function submit() {
    const text = ref.current?.value.trim()
    if (!text || loading) return
    ref.current.value = ''
    onSend(text)
  }

  return (
    <>
      <div className={styles.messages}>
        {messages.map((m, i) => <Message key={i} role={m.role} content={m.content} />)}
        {loading && (
          <div className={`${styles.typing}`}>
            <span /><span /><span />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}

      <div className={styles.inputBar}>
        <textarea
          ref={ref}
          className={styles.input}
          placeholder={placeholder}
          rows={1}
          onKeyDown={handleKeyDown}
        />
        <button
          className={styles.send}
          style={{ background: accentColor }}
          onClick={submit}
          disabled={loading}
          aria-label="Envoyer"
        >
          ➤
        </button>
      </div>
    </>
  )
}
```

- [ ] **Step 6: Write `ChatInterface.module.css`**

```css
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0 8px;
}

/* Typing indicator */
.typing {
  display: flex;
  gap: 5px;
  padding: 0 20px 12px;
}
.typing span {
  width: 8px; height: 8px;
  background: var(--text-muted);
  border-radius: 50%;
  animation: bounce 1.2s infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-8px); }
}

.disclaimer {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  padding: 4px 16px;
  border-top: 1px solid var(--border);
}

.inputBar {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}

.input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid var(--border);
  border-radius: 20px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.95rem;
  resize: none;
  max-height: 120px;
  overflow-y: auto;
  line-height: 1.4;
}
.input:focus { outline: none; border-color: var(--text-secondary); }

.send {
  width: 44px; height: 44px;
  border-radius: 50%;
  color: #fff;
  font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.2s;
}
.send:disabled { opacity: 0.5; }
```

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: Layout, Message, and ChatInterface shared components"
```

---

## Task 7 — Home Page

**Files:**
- Create: `scolia/src/pages/Home.jsx`
- Create: `scolia/src/pages/Home.module.css`

- [ ] **Step 1: Write `Home.jsx`**

```jsx
// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import styles from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  return (
    <div className="app-container">
      <header className={styles.header}>
        <span />
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.logoMark}>📚</div>
          <h1 className={styles.logo}>Scolia</h1>
          <p className={styles.tagline}>Ton compagnon scolaire</p>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.cta} ${styles.ctaGreen}`}
            onClick={() => navigate('/homework')}
          >
            <span className={styles.ctaIcon}>✏️</span>
            <span>
              <strong>Aide aux devoirs</strong>
              <small>Je guide, tu comprends</small>
            </span>
          </button>

          <button
            className={`${styles.cta} ${styles.ctaCoral}`}
            onClick={() => navigate('/feelings')}
          >
            <span className={styles.ctaIcon}>💬</span>
            <span>
              <strong>Parler de ce que je ressens</strong>
              <small>Un espace pour toi</small>
            </span>
          </button>
        </div>
      </main>

      <footer className={styles.footer}>
        <button className={styles.teacherLink} onClick={() => navigate('/teacher')}>
          Vue Professeur / Référent →
        </button>
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Write `Home.module.css`**

```css
.header {
  display: flex;
  justify-content: flex-end;
  padding: 12px 16px;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  gap: 40px;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.logoMark { font-size: 3.5rem; }
.logo {
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--text-primary);
}
.tagline {
  font-size: 1rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.cta {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 20px;
  border-radius: 20px;
  width: 100%;
  text-align: left;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 16px var(--shadow);
}
.cta:hover  { transform: translateY(-2px); box-shadow: 0 6px 20px var(--shadow); }
.cta:active { transform: translateY(0); }
.cta span:not(.ctaIcon) { display: flex; flex-direction: column; gap: 2px; }
.cta strong { font-size: 1.05rem; font-weight: 800; }
.cta small  { font-size: 0.8rem; font-weight: 400; }

.ctaGreen {
  background: var(--color-green-soft);
  color: var(--text-primary);
  border: 2px solid var(--color-green);
}
.ctaGreen .ctaIcon { font-size: 2rem; }

.ctaCoral {
  background: var(--color-coral-soft);
  color: var(--text-primary);
  border: 2px solid var(--color-coral);
}
.ctaCoral .ctaIcon { font-size: 2rem; }

.footer {
  padding: 16px;
  text-align: center;
  border-top: 1px solid var(--border);
}
.teacherLink {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 8px;
}
.teacherLink:hover { color: var(--text-secondary); background: var(--border); }
```

- [ ] **Step 3: Wire route in `App.jsx`**

```jsx
// src/App.jsx (initial)
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
```

- [ ] **Step 4: Manual verify** — home page renders, toggle switches theme, buttons visible.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Home* src/App.jsx
git commit -m "feat: Home page with CTA buttons and teacher link"
```

---

## Task 8 — Homework Chat Page

**Files:**
- Create: `scolia/src/pages/HomeworkChat.jsx`
- Create: `scolia/src/pages/HomeworkChat.module.css`

- [ ] **Step 1: Write `HomeworkChat.jsx`**

```jsx
// src/pages/HomeworkChat.jsx
import { useState, useRef, useCallback } from 'react'
import Layout from '../components/Layout'
import ChatInterface from '../components/ChatInterface'
import { callTutorIA, summarizeDifficulty } from '../services/aiClient'
import { addSignal } from '../services/signals'
import styles from './HomeworkChat.module.css'

const SUBJECTS = ['Mathématiques','Français','Sciences','Histoire-Géo','Anglais','Autre']

const DIFFICULTY_KEYWORDS = {
  'Compréhension de notion': ['comprends pas','comprendrai','c\'est quoi','expliquer','notion','définition'],
  'Application d\'une méthode': ['comment faire','méthode','étapes','procédure','résoudre'],
  'Problème de rédaction': ['rédiger','rédaction','écrire','dissertation','paragraphe','argumentation'],
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
  content: 'Bonjour ! Je suis Scolia 👋 Dis-moi ce que tu dois faire (colle l\'énoncé, décris le problème…) et on avance ensemble, étape par étape !',
}

export default function HomeworkChat() {
  const [messages, setMessages] = useState([WELCOME])
  const [loading, setLoading]   = useState(false)
  const [subject, setSubject]   = useState('Mathématiques')
  const [signalSaved, setSignalSaved] = useState(false)

  const saveSignal = useCallback(async (msgs) => {
    if (signalSaved) return
    setSignalSaved(true)
    const difficultyType = guessDifficulty(msgs.map(m => m.content).join(' '))
    let summary = 'L\'élève exprime une difficulté scolaire.'
    try {
      summary = await summarizeDifficulty(msgs)
    } catch { /* silent */ }
    addSignal({ subject, difficultyType, summary, isCritical: false })
  }, [signalSaved, subject])

  async function handleSend(text) {
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    try {
      // Filter out the local welcome message (reference equality) before sending to API
      const reply = await callTutorIA(newMessages.filter(m => m !== WELCOME))
      const updated = [...newMessages, { role: 'assistant', content: reply }]
      setMessages(updated)
      // Save signal after first real exchange
      if (updated.filter(m => m.role === 'user').length === 1) {
        saveSignal(updated)
      }
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: `Oups, une erreur s'est produite. Réessaie ! (${e.message})` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Aide aux devoirs" onBack accentColor="var(--color-green)">
      <div className={styles.subjectBar}>
        <label className={styles.subjectLabel}>Matière :</label>
        <select
          className={styles.subjectSelect}
          value={subject}
          onChange={e => setSubject(e.target.value)}
        >
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <ChatInterface
        messages={messages}
        onSend={handleSend}
        loading={loading}
        placeholder="Colle ton énoncé ou décris la notion…"
        accentColor="var(--color-green)"
      />
    </Layout>
  )
}
```

- [ ] **Step 2: Write `HomeworkChat.module.css`**

```css
.subjectBar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-card);
}
.subjectLabel { font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); }
.subjectSelect {
  border: 1.5px solid var(--border);
  border-radius: 10px;
  background: var(--bg-input);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 0.85rem;
  padding: 4px 8px;
}
```

- [ ] **Step 3: Add route to `App.jsx`**

```jsx
import HomeworkChat from './pages/HomeworkChat'
// inside <Routes>:
<Route path="/homework" element={<HomeworkChat />} />
```

- [ ] **Step 4: Manual verify** — send a homework message, AI replies, signal saved in localStorage.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomeworkChat*
git commit -m "feat: HomeworkChat with tutor AI, subject picker, and signal generation"
```

---

## Task 9 — Wellbeing Chat Page

**Files:**
- Create: `scolia/src/pages/WellbeingChat.jsx`
- Create: `scolia/src/pages/WellbeingChat.module.css`

- [ ] **Step 1: Write `WellbeingChat.jsx`**

```jsx
// src/pages/WellbeingChat.jsx
import { useState, useRef } from 'react'
import Layout from '../components/Layout'
import ChatInterface from '../components/ChatInterface'
import { callWellbeingIA } from '../services/aiClient'
import { detectCritical, addSignal } from '../services/signals'
import styles from './WellbeingChat.module.css'

const WELCOME = {
  role: 'assistant',
  content: 'Salut 👋 Je suis là pour t\'écouter. Tu peux me parler de ce que tu vis, sans jugement. Qu\'est-ce qui se passe en ce moment ?',
}

const DISCLAIMER = "Je ne remplace pas un professionnel, mais tu peux me parler librement."

export default function WellbeingChat() {
  const [messages, setMessages] = useState([WELCOME])
  const [loading, setLoading]   = useState(false)
  const [criticalFlagged, setCriticalFlagged] = useState(false)
  const sessionSignalId = useRef(null)

  async function handleSend(text) {
    // Check critical keywords in user input
    const isCritical = detectCritical(text)
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)

    if (isCritical && !criticalFlagged) {
      setCriticalFlagged(true)
      // Log a minimal signal — no message content is stored, only the boolean flag
      const id = addSignal({
        subject: 'Bien-être',
        difficultyType: 'Signal critique détecté',
        summary: "⚠️ Signal critique détecté — parler à l'élève en direct.",
        isCritical: true,
      })
      sessionSignalId.current = id
    }

    try {
      // NOTE: message history is transmitted to OpenRouter on each turn.
      // No content is stored client-side, but users should be aware via the disclaimer.
      // Cap at last 20 messages to limit token growth on long sessions.
      const reply = await callWellbeingIA(newMessages.slice(-20))
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: `Désolé, je rencontre un problème technique. (${e.message})` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Ce que je ressens" onBack accentColor="var(--color-coral)">
      {criticalFlagged && (
        <div className={styles.criticalBanner}>
          <strong>🆘 Tu n'es pas seul(e).</strong> N'hésite pas à appeler le <strong>3114</strong> (prévention suicide) ou le <strong>3018</strong> (harcèlement). Un adulte peut vraiment t'aider.
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
```

- [ ] **Step 2: Write `WellbeingChat.module.css`**

```css
.criticalBanner {
  background: #fff3cd;
  color: #7a5000;
  border-left: 4px solid #e89b00;
  padding: 12px 16px;
  font-size: 0.88rem;
  line-height: 1.5;
}
:global(.dark) .criticalBanner {
  background: #3a2e00;
  color: #ffd060;
  border-color: #cc8800;
}
```

- [ ] **Step 3: Add route to `App.jsx`**

```jsx
import WellbeingChat from './pages/WellbeingChat'
// inside <Routes>:
<Route path="/feelings" element={<WellbeingChat />} />
```

- [ ] **Step 4: Manual verify** — type a message with "harcèlement", confirm banner appears and signal in localStorage has `isCritical: true`.

- [ ] **Step 5: Commit**

```bash
git add src/pages/WellbeingChat*
git commit -m "feat: WellbeingChat with empathy AI, critical keyword detection, and alert banner"
```

---

## Task 10 — Teacher View

**Files:**
- Create: `scolia/src/pages/TeacherView.jsx`
- Create: `scolia/src/pages/TeacherView.module.css`

- [ ] **Step 1: Write `TeacherView.jsx`**

```jsx
// src/pages/TeacherView.jsx
import { useState } from 'react'
import Layout from '../components/Layout'
import { getSignals } from '../services/signals'
import styles from './TeacherView.module.css'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
  })
}

export default function TeacherView() {
  // Signals are read once on mount. Use the Refresh button to pick up new entries
  // added during the same browser session without a full page reload.
  const [signals, setSignals] = useState(() => getSignals())

  function refresh() { setSignals(getSignals()) }

  return (
    <Layout title="Vue Professeur" onBack accentColor="var(--border)">
      <div className={styles.container}>
        <div className={styles.topBar}>
          <p className={styles.intro}>
            Résumé des difficultés scolaires signalées. Les alertes indiquent un signal de mal-être — parlez directement à l'élève.
          </p>
          <button className={styles.refreshBtn} onClick={refresh}>↻ Actualiser</button>
        </div>
        {signals.length === 0 && (
          <p className={styles.empty}>Aucun signal enregistré pour l'instant.</p>
        )}
        {signals.map(sig => (
          <div key={sig.id} className={`${styles.card} ${sig.isCritical ? styles.critical : ''}`}>
            <div className={styles.cardHeader}>
              <div className={styles.meta}>
                <span className={styles.subject}>{sig.subject}</span>
                <span className={styles.diffType}>{sig.difficultyType}</span>
              </div>
              <div className={styles.right}>
                <span className={styles.date}>{formatDate(sig.createdAt)}</span>
                {sig.isCritical && (
                  <span className={styles.badge}>🔴 Alerte</span>
                )}
              </div>
            </div>
            <p className={styles.summary}>{sig.summary}</p>
            {sig.isCritical && (
              <p className={styles.alertNote}>
                ⚠️ Ce profil a exprimé des signaux critiques de mal-être. Parler à l'élève en direct dès que possible.
              </p>
            )}
          </div>
        ))}
      </div>
    </Layout>
  )
}
```

- [ ] **Step 2: Write `TeacherView.module.css`**

```css
.container {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;
}
.topBar {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.intro {
  font-size: 0.82rem;
  color: var(--text-muted);
  line-height: 1.5;
  flex: 1;
}
.refreshBtn {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 4px 10px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  white-space: nowrap;
  flex-shrink: 0;
}
.refreshBtn:hover { background: var(--border); }
.empty {
  text-align: center;
  color: var(--text-muted);
  margin-top: 40px;
  font-size: 0.9rem;
}

.card {
  background: var(--bg-card);
  border: 1.5px solid var(--border);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 8px var(--shadow);
}
.card.critical {
  border-color: #e07b6a;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}
.meta    { display: flex; flex-direction: column; gap: 2px; }
.subject { font-weight: 800; font-size: 0.95rem; }
.diffType { font-size: 0.78rem; color: var(--text-secondary); }
.right   { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.date    { font-size: 0.75rem; color: var(--text-muted); }
.badge   {
  font-size: 0.72rem;
  font-weight: 700;
  background: #ffe5e0;
  color: #c0392b;
  padding: 2px 8px;
  border-radius: 20px;
}
:global(.dark) .badge {
  background: #4a1a14;
  color: #ff9f93;
}

.summary    { font-size: 0.88rem; color: var(--text-primary); line-height: 1.5; }
.alertNote  {
  font-size: 0.8rem;
  color: #c0392b;
  background: #fdf0ee;
  border-radius: 8px;
  padding: 8px 12px;
  line-height: 1.4;
}
:global(.dark) .alertNote {
  color: #ff9f93;
  background: #3a1a14;
}
```

- [ ] **Step 3: Complete `App.jsx`**

```jsx
// src/App.jsx — final
import { Routes, Route, Navigate } from 'react-router-dom'
import Home          from './pages/Home'
import HomeworkChat  from './pages/HomeworkChat'
import WellbeingChat from './pages/WellbeingChat'
import TeacherView   from './pages/TeacherView'

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<Home />} />
      <Route path="/homework" element={<HomeworkChat />} />
      <Route path="/feelings" element={<WellbeingChat />} />
      <Route path="/teacher"  element={<TeacherView />} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  )
}
```

- [ ] **Step 4: Manual verify** — after generating signals in homework/wellbeing chats, teacher view shows cards; critical signals show red badge.

- [ ] **Step 5: Commit**

```bash
git add src/pages/TeacherView* src/App.jsx
git commit -m "feat: TeacherView with signal cards and critical alert badges"
```

---

## Task 11 — Final Polish & Production Build

- [ ] **Step 1: Fix textarea auto-resize** — in `ChatInterface.jsx`, add:

```jsx
// Add onInput handler to textarea in ChatInterface.jsx
function handleInput(e) {
  e.target.style.height = 'auto'
  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
}
// add onInput={handleInput} to the <textarea>
```

Also add `aria-live="polite"` to the messages container div so screen-reader users are announced when new AI messages arrive:

```jsx
<div className={styles.messages} aria-live="polite" aria-relevant="additions">
```

- [ ] **Step 2: Verify `<meta>` viewport in `index.html`** — do NOT include `maximum-scale` (it blocks pinch-to-zoom, an accessibility violation):

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#f8f7f4">
<title>Scolia</title>
```

- [ ] **Step 3: Build for production**

```bash
npm run build
npm run preview
```

Expected: preview server starts, app works at `localhost:4173`.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: Scolia MVP complete — homework tutor, wellbeing chat, teacher view, light/dark theme"
```

---

## How to Run Locally

```bash
# 1. Move into the project
cd /Users/ziad/Documents/Hackathon-Education/scolia

# 2. Install dependencies
npm install

# 3. Configure your OpenRouter key
cp .env.example .env
# Edit .env: VITE_OPENROUTER_API_KEY=sk-or-YOUR_KEY_HERE

# 4. Start dev server
npm run dev
# → Open http://localhost:5173 in a mobile-preview mode (DevTools → Toggle device toolbar)

# 5. Production build
npm run build && npm run preview
```

---

## Data Privacy Notes

- **No conversation content is stored client-side** — only: subject, difficulty type, one-sentence summary, boolean critical flag, timestamp.
- Critical flag is set by keyword match **client-side**; no message text is saved to localStorage.
- Teacher view shows **zero verbatim wellbeing content**.
- `localStorage` key: `scolia-signals`.
- **⚠️ OpenRouter transmission:** message history is sent to OpenRouter's servers on every API call. Users should be informed via the in-app disclaimer. The API key is embedded in the frontend bundle — set a domain restriction and monthly spend cap in your OpenRouter dashboard before any public deployment.
