import React, { useState, useEffect, useCallback } from 'react'
import styles from './Dashboard.module.css'
import { getDashboardSummary } from '../../services/api'

function StatCard({ icon, value, label, color, delay = '0s' }) {
  return (
    <div className={styles.statCard} style={{ animationDelay: delay }}>
      <div className={styles.statIcon} style={{ background: color }}>
        {icon}
      </div>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

function SkeletonStat() {
  return (
    <div className={styles.statCard}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 12 }} />
      <div className="skeleton" style={{ width: '60%', height: '1.75rem', marginBottom: 8 }} />
      <div className="skeleton" style={{ width: '80%', height: '0.8rem' }} />
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSummary = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const summary = await getDashboardSummary()
      setData(summary)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <p className="section-eyebrow">Overview</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Dashboard</h2>
        </div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={fetchSummary}
          disabled={isLoading}
          id="dashboard-refresh-btn"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
          </svg>
          {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {isLoading ? (
          [1, 2, 3].map((i) => <SkeletonStat key={i} />)
        ) : data ? (
          <>
            <StatCard
              icon="📊"
              value={data.total_queries}
              label="Total Queries"
              color="linear-gradient(135deg, #f0f7f1, #daeedd)"
              delay="0s"
            />
            <StatCard
              icon="🐛"
              value={data.last_issue || '—'}
              label="Last Issue"
              color="linear-gradient(135deg, #fff4ec, #f5e8d0)"
              delay="0.05s"
            />
            <StatCard
              icon="💬"
              value={data.last_query ? `"${data.last_query.slice(0, 22)}..."` : 'No queries yet'}
              label="Last Query"
              color="linear-gradient(135deg, #eff6ff, #dbeafe)"
              delay="0.1s"
            />
          </>
        ) : null}
      </div>

      {/* Recent Activity */}
      {!isLoading && data?.recent_activity?.length > 0 && (
        <div className={styles.activitySection}>
          <div className={styles.activityHeader}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Recent Activity
          </div>
          <div className={styles.activityList}>
            {data.recent_activity.map((item, i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityDot}></div>
                <div className={styles.activityContent}>
                  <p className={styles.activityQuery}>{item.query}</p>
                  <p className={styles.activityTime}>
                    {new Date(item.timestamp).toLocaleString('en-IN', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && data?.recent_activity?.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <div className="empty-state-title">No activity yet</div>
          <div className="empty-state-desc">Start using Vyra to build your farm history.</div>
        </div>
      )}
    </div>
  )
}
