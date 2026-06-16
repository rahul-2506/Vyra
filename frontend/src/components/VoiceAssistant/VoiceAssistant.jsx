import React, { useState, useRef } from 'react'
import styles from './VoiceAssistant.module.css'
import { sendVoiceQuery } from '../../services/api'
import AnalysisCard from '../AnalysisCard/AnalysisCard'

export default function VoiceAssistant() {
  const [file, setFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setResult(null)
      setError(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) {
      setFile(dropped)
      setResult(null)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!file) return
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await sendVoiceQuery(file)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.iconBadge}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <div>
          <p className="section-eyebrow">Voice First</p>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Voice Assistant</h2>
        </div>
      </div>
      <p className="section-desc" style={{ marginBottom: '1.5rem' }}>
        Upload an audio recording of your farm query. Vyra will transcribe and analyze it instantly.
      </p>

      {/* Drop Zone */}
      <div
        className={`${styles.dropZone} ${file ? styles.dropZoneActive : ''}`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        id="voice-drop-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/mp4"
          className={styles.hiddenInput}
          onChange={handleFileChange}
          id="voice-file-input"
        />
        {file ? (
          <div className={styles.filePreview}>
            <div className={styles.fileIcon}>🎵</div>
            <div>
              <div className={styles.fileName}>{file.name}</div>
              <div className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</div>
            </div>
          </div>
        ) : (
          <div className={styles.dropPlaceholder}>
            <div className={styles.micIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <p className={styles.dropText}>Click to upload or drag audio file here</p>
            <p className={styles.dropHint}>Supports MP3, WAV, M4A, MP4</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        {file && (
          <button className="btn btn-ghost btn-sm" onClick={reset} id="voice-reset-btn">
            Remove
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!file || isLoading}
          id="voice-submit-btn"
          style={{ marginLeft: 'auto' }}
        >
          {isLoading ? (
            <>
              <div className="spinner spinner-sm" style={{ borderTopColor: 'white', borderColor: 'rgba(255,255,255,0.3)' }} />
              Analyzing...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              Analyze Voice Query
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error animate-slide-up" style={{ marginTop: '1rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`${styles.result} animate-slide-up`}>
          {/* Transcript */}
          <div className={styles.transcriptBlock}>
            <div className={styles.transcriptLabel}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Transcript
            </div>
            <p className={styles.transcriptText}>"{result.transcript}"</p>
          </div>

          {/* Analysis */}
          <AnalysisCard analysis={result.analysis} />
        </div>
      )}
    </div>
  )
}
