import React, { useState, useRef, useEffect } from 'react'

export default function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [motionEnabled, setMotionEnabled] = useState(true)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const disableTrails = localStorage.getItem('vyra_disable_trails') === 'true'
    setMotionEnabled(!prefersReducedMotion && !disableTrails)
  }, [])

  const handleMouseMove = (e) => {
    if (!motionEnabled || !cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()
    
    // Mouse coordinates relative to card center
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    
    // Normalize coordinates (rotation range: -3.5 to 3.5 degrees)
    const rotateX = -(y / (rect.height / 2)) * 3.5
    const rotateY = (x / (rect.width / 2)) * 3.5
    
    setRotate({ x: rotateX, y: rotateY })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ease-out ${className}`}
      style={{
        transform: isHovered && motionEnabled
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transformStyle: 'preserve-3d'
      }}
    >
      {children}
    </div>
  )
}
