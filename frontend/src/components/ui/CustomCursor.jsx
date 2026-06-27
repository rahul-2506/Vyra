import React, { useEffect, useState, useRef } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [hoverType, setHoverType] = useState(null) // null, 'tomato', 'onion', 'leaf'
  const [isClicking, setIsClicking] = useState(false)
  const [trailsEnabled, setTrailsEnabled] = useState(true)
  const [ripples, setRipples] = useState([])
  const [burstParticles, setBurstParticles] = useState([])
  const canvasRef = useRef(null)
  
  const lastPos = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const disableTrails = localStorage.getItem('vyra_disable_trails') === 'true'
    setTrailsEnabled(!prefersReducedMotion && !disableTrails)

    // document.body.classList.add('custom-cursor-active') // Restored normal cursor

    const handleMouseMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      setPosition({ x, y })
      
      if (!prefersReducedMotion && !disableTrails) {
        const dx = x - lastPos.current.x
        const dy = y - lastPos.current.y
        const speed = Math.sqrt(dx * dx + dy * dy)
        
        lastPos.current = { x, y }

        // Spawn rotating, velocity-adaptive wheat seeds
        if (speed > 1.5) {
          const count = Math.min(3, Math.floor(speed / 3) + 1)
          for (let i = 0; i < count; i++) {
            particlesRef.current.push({
              x: x + (Math.random() - 0.5) * 6,
              y: y + (Math.random() - 0.5) * 6,
              vx: (Math.random() - 0.5) * 1.0 - (dx * 0.06),
              vy: (Math.random() - 0.5) * 1.0 - (dy * 0.06) + 0.3,
              size: 2.5 + Math.random() * 2.2,
              age: 0,
              maxAge: 35 + Math.random() * 20,
              rotation: Math.random() * Math.PI * 2,
              rotSpeed: (Math.random() - 0.5) * 0.08,
              sparkle: Math.random() > 0.85 // sparkle occasionally
            })
          }
        }
      }

      // Check hover targets (buttons, links, cards, switches, dropdowns, charts, tabs)
      const target = e.target
      if (target) {
        const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .card, .glass-card, .hover-magnetic, .recharts-wrapper, [role="tab"], [role="switch"]')
        if (isInteractive) {
          if (target.closest('.btn-primary, .btn-action, .btn-primary *')) {
            setHoverType('tomato')
          } else if (target.closest('.btn-danger, .btn-danger *')) {
            setHoverType('onion')
          } else {
            setHoverType('tomato') // Tomato is preferred hover pointer
          }
        } else {
          setHoverType(null)
        }
      }
    }

    const handleMouseLeave = () => {
      setPosition({ x: -100, y: -100 })
    }

    const handleMouseDown = () => {
      setIsClicking(true)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
    }

    const handleClick = (e) => {
      if (prefersReducedMotion || disableTrails) return
      
      const clickX = e.clientX
      const clickY = e.clientY

      // Spawn primary ripple
      const newRipple = {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY
      }
      setRipples(prev => [...prev, newRipple])
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 400)

      // Burst tiny wheat seed particles outward
      const count = 5
      const newBurst = []
      const icons = ['🌾', '🌿', '🌱', '🌾', '🌿']
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
        const dist = 35 + Math.random() * 45
        const tx = `${Math.cos(angle) * dist}px`
        const ty = `${Math.sin(angle) * dist}px`
        const rot = `${120 + Math.random() * 180}deg`
        newBurst.push({
          id: Date.now() + Math.random() + i,
          x: clickX,
          y: clickY,
          tx,
          ty,
          rot,
          icon: icons[i % icons.length]
        })
      }
      setBurstParticles(prev => [...prev, ...newBurst])
      setTimeout(() => {
        setBurstParticles(prev => prev.filter(p => !newBurst.find(nb => nb.id === p.id)))
      }, 500)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('click', handleClick)
      // document.body.classList.remove('custom-cursor-active')
    }
  }, [])

  // Canvas drawing loop
  useEffect(() => {
    if (!trailsEnabled) return

    let animationId
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.beginPath()
        
        // Wheat seed-shaped ellipse
        ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.75, 0, 0, 2 * Math.PI)
        
        const opacity = Math.max(0, 1 - p.age / p.maxAge)
        // Alternating wheat gold and organic green seed trails
        ctx.fillStyle = i % 2 === 0 
          ? `rgba(226, 154, 69, ${opacity * 0.45})` 
          : `rgba(46, 125, 50, ${opacity * 0.35})`
        ctx.fill()

        // Subtle sparkle cross
        if (p.sparkle) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.8})`
          ctx.lineWidth = 1
          ctx.moveTo(-p.size * 0.8, 0)
          ctx.lineTo(p.size * 0.8, 0)
          ctx.moveTo(0, -p.size * 0.8)
          ctx.lineTo(0, p.size * 0.8)
          ctx.stroke()
        }

        ctx.restore()

        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotSpeed
        p.age++

        if (p.age >= p.maxAge) {
          particles.splice(i, 1)
        }
      }

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [trailsEnabled])

  // Custom vector vegetable SVGs
  const renderCursorContent = () => {
    switch (hoverType) {
      case 'tomato':
        // Interactive Hover: Morph into Tomato pointer
        return (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="drop-shadow-[0_2px_5px_rgba(0,0,0,0.18)]">
            <circle cx="14" cy="15" r="9" fill="#B8554B" stroke="#682A24" strokeWidth="1.5" />
            <path d="M 14,6 Q 14,2 14,6" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 9,8 Q 14,5 19,8 L 17,10 L 11,10 Z" fill="#2E7D32" stroke="#1B3B2B" strokeWidth="1" />
          </svg>
        )
      case 'onion':
        // Danger Hover: Morph into Red Onion pointer
        return (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="drop-shadow-[0_2px_5px_rgba(0,0,0,0.18)]">
            <path d="M 14,3 Q 21,13 21,18 C 21,22.5 17.5,25 14,25 C 10.5,25 7,22.5 7,18 Q 7,13 14,3 Z" fill="#9C4A6E" stroke="#5C1E3C" strokeWidth="1.5" />
            <path d="M 12,25 L 12,27 M 14,25 L 14,27.5 M 16,25 L 16,27" stroke="#D7A9B9" strokeWidth="1.5" />
          </svg>
        )
      default:
        // Default State: Custom Carrot Pointer (pointing top-left with vertex at (4,4) to feel like a real cursor)
        return (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="drop-shadow-[0_2px_5px_rgba(0,0,0,0.18)]">
            {/* Carrot leafy top-left stem */}
            <path d="M 4,4 Q 1,0 2,2 Q 3,4 4,4" fill="#2E7D32" stroke="#1B3B2B" strokeWidth="1" />
            <path d="M 4,4 Q 0,1 2,2 Q 4,3 4,4" fill="#2E7D32" stroke="#1B3B2B" strokeWidth="1" />
            {/* Carrot main orange pointing wedge */}
            <path d="M 4,4 L 18,10 Q 14,14 10,18 Z" fill="#E29A45" stroke="#7D5139" strokeWidth="1.5" />
          </svg>
        )
    }
  }

  return (
    <>
      {trailsEnabled && (
        <canvas 
          ref={canvasRef} 
          className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
        />
      )}
      
      {/* Click Ripples */}
      {ripples.map(ripple => (
        <div 
          key={ripple.id}
          className="cursor-ripple"
          style={{ left: ripple.x, top: ripple.y, width: '40px', height: '40px' }}
        />
      ))}

      {/* Seed burst particles */}
      {burstParticles.map(p => (
        <div
          key={p.id}
          className="cursor-burst-particle"
          style={{
            left: p.x,
            top: p.y,
            '--tx': p.tx,
            '--ty': p.ty,
            '--rot': p.rot
          }}
        >
          {p.icon}
        </div>
      ))}

      {/* Render cursor SVG removed to restore normal cursor, but trails remain */}
    </>
  )
}
