import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply persisted theme before React mounts to avoid flash
const stored = localStorage.getItem('gitsearch-ui')
if (stored) {
  try {
    const { state } = JSON.parse(stored)
    if (state?.theme === 'dark') document.documentElement.classList.add('dark')
  } catch {}
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
