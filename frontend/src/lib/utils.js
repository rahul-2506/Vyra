import { clsx } from 'clsx'

/**
 * Utility for combining class names conditionally.
 * Works with Tailwind CSS utility classes.
 */
export function cn(...inputs) {
  return clsx(...inputs)
}

/**
 * Format a timestamp to a human-readable relative string.
 */
export function timeAgo(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

/**
 * Format a date to a nice display string.
 */
export function formatDate(dateStr, options = {}) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    ...options,
  })
}

/**
 * Compute a risk class key from a risk string.
 */
export function getRiskLevel(risk = '') {
  const r = risk.toLowerCase()
  if (r.includes('high'))                          return 'high'
  if (r.includes('medium') || r.includes('moderate')) return 'medium'
  return 'low'
}

export const RISK_CONFIG = {
  low:    { label: 'Low Risk',    badge: 'badge-green', color: '#22c55e', dot: 'bg-vyra-500' },
  medium: { label: 'Medium Risk', badge: 'badge-amber', color: '#f59e0b', dot: 'bg-amber-500' },
  high:   { label: 'High Risk',   badge: 'badge-red',   color: '#ef4444', dot: 'bg-red-500' },
}

/**
 * Truncate a string to a maximum length.
 */
export function truncate(str, maxLen = 60) {
  if (!str) return ''
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str
}

/**
 * Generate mock 7-day activity data anchored to a real total.
 */
export function generateActivityData(totalQueries = 0) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const weights = [0.10, 0.14, 0.18, 0.16, 0.20, 0.12, 0.10]
  return days.map((day, i) => ({
    day,
    queries: Math.round(weights[i] * Math.max(totalQueries, 7)),
  }))
}

export function generateChartData(daysCount) {
  const data = []
  for (let i = daysCount; i >= 1; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    data.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      score: 60 + Math.random() * 30
    })
  }
  return data
}
