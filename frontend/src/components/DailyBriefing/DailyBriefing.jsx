import React, { useState, useEffect, useCallback } from 'react'
import styles from './DailyBriefing.module.css'
import { getDailyBriefing } from '../../services/api'

function SkeletonBriefing() {
  return (
    <div className={styles.skeleton}>
      <div className="skeleton skeleton-title" style={{ width: '60%' }} />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text" style={{ width: '80%' }} />
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={styles.recSkeleton}>
            <div className="skeleton" style={{ width: 24, height: 24, borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" style={{ width: '60%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DailyBriefing({ autoFetch }) {
  const [briefing, setBriefing] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(null)

  const fetchBriefing = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getDailyBriefing()
      setBriefing(data)
      setLastFetched(new Date())
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (autoFetch) fetchBriefing()
  }, [autoFetch, fetchBriefing])

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <p className="section-eyebrow">Daily Briefing</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Today's Farm Intelligence</h2>
          <p className={styles.date}>{today}</p>
        </div>
        <button
          className={`btn btn-secondary btn-sm ${isLoading ? styles.spinning : ''}`}
          onClick={fetchBriefing}
          disabled={isLoading}
          id="briefing-refresh-btn"
        >
          {isLoading ? (
            <div className="spinner spinner-sm" />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          )}
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {isLoading && <SkeletonBriefing />}

      {error && !isLoading && (
        <div className="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {!isLoading && !briefing && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <div className="empty-state-title">No briefing yet</div>
          <div className="empty-state-desc">Click "Generate" to get your personalized daily farm briefing.</div>
        </div>
      )}

      {briefing && !isLoading && (
        <div className={`${styles.content} animate-slide-up`}>
          {/* Summary Banner */}
          <div className={styles.summaryBanner}>
            <div className={styles.summaryIcon}>☀️</div>
            <p className={styles.summaryText}>{briefing.summary}</p>
          </div>

          {/* Recommendations */}
          <div className={styles.recommendationsSection}>
            <div className={styles.recHeader}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
              Actionable Recommendations
            </div>
            <div className={styles.recommendations}>
              {briefing.recommendations?.map((rec, i) => (
                <div key={i} className={styles.recItem} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={styles.recNumber}>{i + 1}</div>
                  <p className={styles.recText}>{rec}</p>
                </div>
              ))}
            </div>
          </div>

          {lastFetched && (
            <p className={styles.timestamp}>
              Generated at {lastFetched.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
