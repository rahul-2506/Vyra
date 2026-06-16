import React from 'react'

export default function Badge({ children, variant = 'surface', className = '' }) {
  const variants = {
    green: "badge-green",
    amber: "badge-amber",
    red: "badge-red",
    blue: "badge-blue",
    surface: "badge-surface"
  }

  return (
    <span className={`${variants[variant] || variants.surface} ${className}`}>
      {children}
    </span>
  )
}
