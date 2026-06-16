import React from 'react'
import styles from '../ComingSoon.module.css'

export default function CropVisionCard() {
  return (
    <div className={styles.card}>
      <div className={styles.iconRow}>
        <div className={styles.mainIcon}>🔬</div>
      </div>
      <div className={styles.badge}>Coming Soon</div>
      <h3 className={styles.title}>AI Crop Vision</h3>
      <p className={styles.desc}>
        Upload a photo of your crop and get instant AI-powered disease detection, severity analysis, and visual treatment guides.
      </p>
      <div className={styles.features}>
        <div className={styles.featureChip}>📸 Image Upload</div>
        <div className={styles.featureChip}>🦠 Disease Detection</div>
        <div className={styles.featureChip}>📊 Severity Score</div>
        <div className={styles.featureChip}>💊 Treatment Plan</div>
      </div>
    </div>
  )
}
