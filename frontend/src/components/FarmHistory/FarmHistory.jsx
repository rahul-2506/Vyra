import React, { useState, useEffect, useCallback } from 'react'
import styles from './FarmHistory.module.css'
import { getFarmHistory } from '../../services/api'

function SkeletonItem() {
  return (
    <div className={styles.historyItem}>
      <div className={styles.itemTimeline}>
        <div className={styles.timelineDot} style={{ background: 'var(--color-border)' }}></div>
        <div className={styles.timelineLine}></div>
      </div>
      <div className={styles.itemBody} style={{ flex: 1 }}>
        <div className="skeleton skeleton-title" style={{ width: '55%' }} />
        <div className="skeleton skeleton-text" />
        <div className="skeleton skeleton-text" style={{ width: '70%' }} />
      </div>
    </div>
  )
}

export default function FarmHistory() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getFarmHistory()
      setHistory(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const getRiskClass = (risk = '') => {
    const r = risk.toLowerCase()
    if (r.includes('high')) return 'badge-error'
    if (r.includes('medium') || r.includes('moderate')) return 'badge-warning'
    return 'badge-green'
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <p className="section-eyebrow">Memory</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Farm History</h2>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={fetchHistory}
          disabled={isLoading}
          id="history-refresh-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>
      <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
        Vyra remembers every query and analysis — your complete farm intelligence log.
      </p>

      {error && (
        <div className="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
          </svg>
          {error}
        </div>
      )}

      {!isLoading && !error && history.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🌱</div>
          <div className="empty-state-title">No farm history yet</div>
          <div className="empty-state-desc">Start asking Vyra questions to build your farm memory log.</div>
        </div>
      )}

      <div className={styles.timeline}>
        {isLoading
          ? [1, 2, 3].map((i) => <SkeletonItem key={i} />)
          : history.map((item, i) => {
              const a = item.analysis || {}
              const riskClass = getRiskClass(a.risk)
              const ts = new Date(item.timestamp)
              return (
                <div
                  key={i}
                  className={`${styles.historyItem} animate-slide-left`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className={styles.itemTimeline}>
                    <div className={styles.timelineDot}></div>
                    {i < history.length - 1 && <div className={styles.timelineLine}></div>}
                  </div>
                  <div className={styles.itemBody}>
                    <div className={styles.itemHeader}>
                      <p className={styles.itemQuery}>"{item.query}"</p>
                      <time className={styles.itemTime}>
                        {ts.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        {' · '}
                        {ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>

                    {(a.crop || a.issue || a.risk) && (
                      <div className={styles.tags}>
                        {a.crop && <span className="badge badge-green">🌾 {a.crop}</span>}
                        {a.issue && <span className="badge badge-earth">🔍 {a.issue}</span>}
                        {a.risk && <span className={`badge ${riskClass}`}>⚠️ {a.risk}</span>}
                      </div>
                    )}

                    {a.recommendation && (
                      <p className={styles.itemRec}>
                        <span>💡</span> {a.recommendation}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
      </div>
    </div>
  )
}
