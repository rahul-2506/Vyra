import React, { useEffect, useState, useRef } from 'react'

export default function AmbientFarmWorld({ weatherState = 'sunny' }) {
  const [motionEnabled, setMotionEnabled] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [scrollPos, setScrollPos] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const disableTrails = localStorage.getItem('vyra_disable_trails') === 'true'
    setMotionEnabled(!prefersReducedMotion && !disableTrails)

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      setMousePos({ x, y })
    }

    const handleScroll = () => {
      const main = document.querySelector('main')
      if (main) {
        setScrollPos(main.scrollTop)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    
    const timer = setTimeout(() => {
      const main = document.querySelector('main')
      if (main) {
        main.addEventListener('scroll', handleScroll, { passive: true })
      }
    }, 500)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(timer)
      const main = document.querySelector('main')
      if (main) {
        main.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  if (!motionEnabled) {
    return (
      <div className="absolute inset-0 bg-sunrise-ambient z-0 pointer-events-none" />
    )
  }

  const calculateParallax = (factor, scrollFactor = 0.05) => {
    const tx = mousePos.x * factor * 12
    const ty = (mousePos.y * factor * 12) - (scrollPos * scrollFactor)
    return `translate3d(${tx}px, ${ty}px, 0)`
  }

  // Weather state configurations
  const isRain = weatherState === 'rain'
  const isCloudy = weatherState === 'cloudy' || weatherState === 'rain'
  const isWindy = weatherState === 'wind' || weatherState === 'rain'

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none select-none">
      
      {/* LAYER 1: Ambient Sunrise Gradient Mesh (Dynamic Colors) */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-out"
        style={{ transform: calculateParallax(0.08, 0.01) }}
      >
        <div className={`absolute inset-0 transition-colors duration-1000 ${
          isCloudy 
            ? 'bg-gradient-to-tr from-stone-200 via-stone-100 to-stone-200' 
            : 'bg-sunrise-ambient'
        }`} />
        
        {/* Sun lighting rays */}
        {!isCloudy && (
          <div className="absolute top-0 right-[15%] w-[320px] h-[550px] opacity-[0.06] origin-top rotate-[-20deg]">
            <div className="w-full h-full bg-gradient-to-b from-farm-yellow via-transparent to-transparent clip-path-rays animate-pulse-slow" />
          </div>
        )}
      </div>

      {/* LAYER 2: Distant Valley & Mountains silhouettes */}
      <div 
        className="absolute inset-x-0 bottom-[140px] h-[180px] opacity-[0.04] transition-transform duration-500 ease-out"
        style={{ transform: calculateParallax(0.2, 0.05) }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1440 180" preserveAspectRatio="none" fill="none">
          <path d="M0,120 L300,50 L600,100 L900,40 L1200,90 L1440,30 L1440,180 L0,180 Z" fill="#1B3B2B" />
        </svg>
      </div>

      {/* LAYER 3: Rolling Farmland Hills & Winding River (Back layer) */}
      <div 
        className="absolute inset-x-0 bottom-[70px] h-[250px] opacity-[0.06] transition-transform duration-500 ease-out"
        style={{ transform: calculateParallax(0.35, 0.08) }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1440 250" preserveAspectRatio="none" fill="none">
          {/* Hills */}
          <path d="M0,180 C360,110 720,240 1080,140 C1260,90 1440,150 1440,150 L1440,250 L0,250 Z" fill="#2E7D32" />
          {/* Winding River */}
          <path d="M150,250 C300,180 500,190 700,150" stroke="#3A7D80" strokeWidth="3" fill="none" opacity="0.4" />
        </svg>
      </div>

      {/* LAYER 4: Rare Distant Wildlife Event (Deer Silhouette walking on Hills) */}
      <div 
        className="absolute bottom-[160px] left-[15%] opacity-[0.12] pointer-events-none transition-transform duration-500 ease-out"
        style={{ transform: calculateParallax(0.35, 0.08) }}
      >
        <div className="w-10 h-10 animate-deer text-2xl select-none">
          🦌
        </div>
      </div>

      {/* LAYER 5: Animated Contour agricultural lines */}
      <div 
        className="absolute inset-0 opacity-[0.05] transition-transform duration-300 ease-out mix-blend-overlay"
        style={{ transform: calculateParallax(0.2, 0.04) }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0,220 Q 360,260 720,200 T 1440,240" fill="none" stroke="#1B3B2B" strokeWidth="2.5" />
          <path d="M 0,380 Q 400,330 800,400 T 1440,360" fill="none" stroke="#1B3B2B" strokeWidth="2" />
        </svg>
      </div>

      {/* LAYER 6: Rolling Farmland Hills (Front layer) */}
      <div 
        className="absolute inset-x-0 bottom-[-20px] h-[200px] opacity-[0.07] transition-transform duration-300 ease-out"
        style={{ transform: calculateParallax(0.55, 0.12) }}
      >
        <svg width="100%" height="100%" viewBox="0 0 1440 200" preserveAspectRatio="none" fill="none">
          <path d="M0,130 C240,70 480,180 720,110 C960,40 1200,160 1440,100 L1440,200 L0,200 Z" fill="#E29A45" />
        </svg>
      </div>

      {/* LAYER 7: Rare Wildlife Event 2 (Rabbit hopping through tall crop lines) */}
      <div 
        className="absolute bottom-[80px] left-[50%] opacity-[0.12] pointer-events-none transition-transform duration-300 ease-out"
        style={{ transform: calculateParallax(0.55, 0.12) }}
      >
        <div className="w-8 h-8 animate-rabbit text-lg select-none">
          🐇
        </div>
      </div>

      {/* LAYER 8: Moving Wind Waves across fields */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,280 Q 200,260 400,300 T 800,270 T 1200,310 T 1600,260" fill="none" stroke="#3A7D80" strokeWidth="4" strokeDasharray="30, 150" className="animate-[dash_22s_linear_infinite]" />
          <path d="M0,480 Q 300,510 600,460 T 1200,500 T 1800,450" fill="none" stroke="#2E7D32" strokeWidth="3" strokeDasharray="40, 180" className="animate-[dash_28s_linear_infinite]" style={{ animationDelay: '1.5s' }} />
        </svg>
      </div>

      {/* LAYER 9: Sky Clouds */}
      <div 
        className="absolute top-[8%] w-[200%] flex justify-between opacity-[0.08] transition-transform duration-700 ease-out"
        style={{ transform: `translate3d(${-40 + mousePos.x * 15}px, 0, 0)` }}
      >
        <div className="w-44 h-10 bg-white rounded-full blur-md animate-[float_40s_linear_infinite]" />
        <div className="w-64 h-14 bg-white rounded-full blur-lg animate-[float_55s_linear_infinite]" style={{ animationDelay: '-12s' }} />
      </div>

      {/* LAYER 10: Dynamic Weather Overlays (Gentle Rainfall lines) */}
      {isRain && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute top-[-50px] w-[1.5px] h-20 bg-farm-sky/18 animate-rain"
              style={{
                left: `${(i * 9) + 4}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${1.1 + Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Foreground Drifting Leaves / Pollen Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(6)].map((_, i) => {
          const size = 12 + (i * 3)
          const delay = i * 3.5
          const left = 5 + (i * 18)
          return (
            <div
              key={i}
              className="absolute text-farm-leaf/8 pointer-events-none animate-drift select-none"
              style={{
                left: `${left}%`,
                fontSize: `${size}px`,
                animationDuration: `${isWindy ? '12s' : `${18 + (i * 4)}s`}`,
                animationDelay: `${delay}s`,
                opacity: 0.12
              }}
            >
              {i % 2 === 0 ? '🌿' : '✨'}
            </div>
          )
        })}
      </div>

      {/* Custom Styles */}
      <style>{`
        .clip-path-rays {
          clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%);
        }
        @keyframes dash {
          to {
            stroke-dashoffset: -1000;
          }
        }
      `}</style>
    </div>
  )
}
