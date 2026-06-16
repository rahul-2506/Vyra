import React from 'react'
import styles from './AnalysisCard.module.css'

const RISK_LEVEL = {
  low: { label: 'Low Risk', className: 'badge-green' },
  medium: { label: 'Medium Risk', className: 'badge-warning' },
  high: { label: 'High Risk', className: 'badge-error' },
}

function getRiskBadge(risk = '') {
  const key = risk.toLowerCase()
  if (key.includes('high')) return RISK_LEVEL.high
  if (key.includes('medium') || key.includes('moderate')) return RISK_LEVEL.medium
  return RISK_LEVEL.low
}

export default function AnalysisCard({ analysis }) {
  if (!analysis) return null
  const riskBadge = getRiskBadge(analysis.risk)

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          AI Analysis
        </div>
        <span className={`badge ${riskBadge.className}`}>{riskBadge.label}</span>
      </div>

      <div className={styles.grid}>
        <div className={styles.item}>
          <div className={styles.itemLabel}>
            <span className={styles.itemIcon}>🌾</span> Crop
          </div>
          <div className={styles.itemValue}>{analysis.crop || '—'}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemLabel}>
            <span className={styles.itemIcon}>🔍</span> Issue Detected
          </div>
          <div className={styles.itemValue}>{analysis.issue || '—'}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.itemLabel}>
            <span className={styles.itemIcon}>⚠️</span> Risk Level
          </div>
          <div className={styles.itemValue}>{analysis.risk || '—'}</div>
        </div>
      </div>

      <div className={styles.recommendation}>
        <div className={styles.recommendationLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Recommendation
        </div>
        <p className={styles.recommendationText}>{analysis.recommendation || '—'}</p>
      </div>
    </div>
  )
}
