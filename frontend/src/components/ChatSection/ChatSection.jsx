import React, { useState } from 'react'
import styles from './ChatSection.module.css'
import { sendChatMessage } from '../../services/api'
import AnalysisCard from '../AnalysisCard/AnalysisCard'
import { useApp } from '../../context/AppContext'

export default function ChatSection() {
  const { language } = useApp()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await sendChatMessage(message.trim(), language)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const exampleQueries = [
    'My paddy leaves are turning yellow',
    'Wheat has brown spots on leaves',
    'Cotton plants are wilting',
    'My tomato yield is very low this season',
  ]

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.iconBadge}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <div>
          <p className="section-eyebrow">Text Query</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Ask Vyra</h2>
        </div>
      </div>
      <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
        Describe your crop problem in plain language. Vyra will analyze and give you actionable advice.
      </p>

      {/* Example chips */}
      <div className={styles.examples}>
        {exampleQueries.map((q) => (
          <button
            key={q}
            className={styles.chip}
            onClick={() => setMessage(q)}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputWrapper}>
          <textarea
            className={`input textarea ${styles.textarea}`}
            placeholder="e.g. My rice crop has yellowing leaves and stunted growth..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            id="chat-input"
          />
          <div className={styles.inputFooter}>
            <span className={styles.charCount}>{message.length} chars</span>
            <span className={styles.langTag}>Language: {language}</span>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!message.trim() || isLoading}
          id="chat-submit-btn"
        >
          {isLoading ? (
            <>
              <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Ask Vyra
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="alert alert-error animate-slide-up">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="animate-slide-up">
          <div className={styles.queryEcho}>
            <span>Query:</span> "{result.query}"
          </div>
          <AnalysisCard analysis={result.analysis} />
        </div>
      )}
    </div>
  )
}
