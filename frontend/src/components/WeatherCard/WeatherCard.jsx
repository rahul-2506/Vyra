import React from 'react'
import styles from '../ComingSoon.module.css'

export default function WeatherCard() {
  return (
    <div className={styles.card}>
      <div className={styles.iconRow}>
        <div className={styles.mainIcon}>🌦️</div>
      </div>
      <div className={styles.badge}>Coming Soon</div>
      <h3 className={styles.title}>Weather Intelligence</h3>
      <p className={styles.desc}>
        Hyperlocal weather data fused with AI crop advisories — soil moisture, rain probability, evapotranspiration, and irrigation scheduling.
      </p>
      <div className={styles.features}>
        <div className={styles.featureChip}>🌡️ Temperature</div>
        <div className={styles.featureChip}>💧 Humidity</div>
        <div className={styles.featureChip}>🌧️ Rain Forecast</div>
        <div className={styles.featureChip}>🌬️ Wind Advisory</div>
      </div>
    </div>
  )
}
