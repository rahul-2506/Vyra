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
      
      {/* LAYER 1: Animated Sky (z-[1]) */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-out z-[1]"
        style={{ transform: calculateParallax(0.05, 0.01) }}
      >
        {/* Dynamic Sky Gradient based on weather */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          isRain 
            ? 'bg-gradient-to-b from-[#4A5568] via-[#718096] to-[#A0AEC0]' 
            : isCloudy
            ? 'bg-gradient-to-b from-[#718096] via-[#A0AEC0] to-[#E2E8F0]'
            : 'bg-gradient-to-b from-[#8CB7E3] via-[#AFD1EC] to-[#FAD6BD]'
        }`} />
        
        {/* Sunrise Horizon Glow */}
        {!isCloudy && (
          <div className="absolute bottom-[100px] inset-x-0 h-[220px] bg-gradient-to-t from-[#FFE5B4]/50 via-[#FFD1A9]/20 to-transparent blur-md pointer-events-none" />
        )}

        {/* Sunlight Bloom */}
        {!isCloudy && (
          <div className="absolute top-[10%] right-[25%] w-[450px] h-[450px] bg-[radial-gradient(circle_at_center,#FFF2C5,transparent_70%)] opacity-[0.25] blur-3xl animate-pulse-slow pointer-events-none" />
        )}
        
        {/* Sun Lighting Rays */}
        {!isCloudy && (
          <div className="absolute top-0 right-[15%] w-[450px] h-[750px] opacity-[0.14] origin-top rotate-[-22deg] pointer-events-none">
            <div className="w-full h-full bg-gradient-to-b from-farm-yellow via-transparent to-transparent clip-path-rays animate-pulse-slow" />
          </div>
        )}

        {/* Clouds (Slow drifting, layered depth) */}
        <div className="absolute top-[8%] w-[200%] flex justify-between opacity-[0.15]">
          <div className="w-64 h-16 bg-white/40 rounded-full blur-md animate-[float_45s_linear_infinite]" />
          <div className="w-96 h-24 bg-white/30 rounded-full blur-lg animate-[float_65s_linear_infinite]" style={{ animationDelay: '-15s' }} />
          <div className="w-48 h-12 bg-white/30 rounded-full blur-md animate-[float_35s_linear_infinite]" style={{ animationDelay: '-8s' }} />
        </div>

        {/* Soaring Birds (Visual surprise) */}
        {!isRain && (
          <div className="absolute top-[15%] left-0 w-full h-[60px] pointer-events-none overflow-hidden opacity-[0.25]">
            <div className="animate-soar flex gap-2">
              <svg className="w-4 h-4 text-farm-soil" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.5 5.5 5 6.5 2 7c4 1 7 0 10-3c3 3 6 4 10 3c-3-.5-7.5-1.5-10-5z" />
              </svg>
              <svg className="w-3.5 h-3.5 text-farm-soil mt-1.5" viewBox="0 0 24 24" fill="currentColor" style={{ animationDelay: '0.8s' }}>
                <path d="M12 2C9.5 5.5 5 6.5 2 7c4 1 7 0 10-3c3 3 6 4 10 3c-3-.5-7.5-1.5-10-5z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* LAYER 2: Landscape and Farmland (z-[2]) */}
      <div 
        className="absolute inset-0 z-[2]"
      >
        {/* Distant Valley & Mountains silhouettes */}
        <div 
          className="absolute inset-x-0 bottom-[130px] h-[220px] opacity-[0.18] transition-transform duration-500 ease-out"
          style={{ transform: calculateParallax(0.18, 0.04) }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1440 220" preserveAspectRatio="none" fill="none">
            <path d="M0,150 L250,70 L550,130 L850,60 L1150,120 L1440,50 L1440,220 L0,220 Z" fill="#143422" />
          </svg>
        </div>

        {/* Rolling Farmland Hills & Winding River (Back layer) */}
        <div 
          className="absolute inset-x-0 bottom-[60px] h-[280px] opacity-[0.24] transition-transform duration-500 ease-out"
          style={{ transform: calculateParallax(0.32, 0.07) }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1440 280" preserveAspectRatio="none" fill="none">
            {/* Hills */}
            <path d="M0,200 C360,125 720,260 1080,150 C1260,95 1440,165 1440,165 L1440,280 L0,280 Z" fill="#1B5E20" />
            {/* Winding River */}
            <path d="M180,280 C320,200 520,210 720,165 C850,135 1000,160 1150,140" stroke="#4DA1A9" strokeWidth="4" fill="none" opacity="0.65" />
          </svg>
        </div>

        {/* Wildlife Event 1 (Deer walking on Hills) */}
        <div 
          className="absolute bottom-[175px] left-[15%] opacity-[0.25] pointer-events-none transition-transform duration-500 ease-out"
          style={{ transform: calculateParallax(0.32, 0.07) }}
        >
          <div className="w-10 h-10 animate-deer text-2xl select-none">
            🦌
          </div>
        </div>

        {/* Animated Contour agricultural lines */}
        <div 
          className="absolute inset-0 opacity-[0.12] transition-transform duration-300 ease-out mix-blend-overlay"
          style={{ transform: calculateParallax(0.25, 0.04) }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0,240 Q 360,285 720,220 T 1440,265" fill="none" stroke="#0F2D1F" strokeWidth="2.5" />
            <path d="M 0,400 Q 400,350 800,420 T 1440,380" fill="none" stroke="#0F2D1F" strokeWidth="2" />
          </svg>
        </div>

        {/* Rolling Farmland Hills (Front layer) */}
        <div 
          className="absolute inset-x-0 bottom-[-20px] h-[220px] opacity-[0.32] transition-transform duration-300 ease-out"
          style={{ transform: calculateParallax(0.52, 0.11) }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1440 220" preserveAspectRatio="none" fill="none">
            <path d="M0,140 C240,75 480,190 720,120 C960,45 1200,170 1440,110 L1440,220 L0,220 Z" fill="#DE9A35" />
          </svg>
        </div>

        {/* Wildlife Event 2 (Rabbit hopping through fields) */}
        <div 
          className="absolute bottom-[90px] left-[50%] opacity-[0.25] pointer-events-none transition-transform duration-300 ease-out"
          style={{ transform: calculateParallax(0.52, 0.11) }}
        >
          <div className="w-8 h-8 animate-rabbit text-lg select-none">
            🐇
          </div>
        </div>

        {/* Swaying Foreground Crop stalks (Foreground Vegetation) */}
        <div 
          className="absolute inset-x-0 bottom-0 h-20 opacity-[0.35] flex justify-around pointer-events-none transition-transform duration-300 ease-out"
          style={{ transform: calculateParallax(0.65, 0.14) }}
        >
          {[...Array(9)].map((_, i) => (
            <svg 
              key={i} 
              className="w-10 h-20 animate-sway text-[#C68323] drop-shadow-sm" 
              style={{ 
                animationDelay: `${i * 0.8}s`, 
                animationDuration: `${5.5 + i}s`,
                opacity: 0.75 + (i % 3) * 0.1
              }} 
              viewBox="0 0 50 100" 
              fill="currentColor"
            >
              <path d="M25,100 C20,70 16,35 25,5 C27,35 22,70 25,100 Z" />
              <path d="M25,60 C32,53 38,53 35,62 C30,66 27,64 25,60 Z" fill="#B2711C" />
              <path d="M25,43 C16,37 10,37 13,46 C18,50 22,47 25,43 Z" fill="#B2711C" />
              <path d="M25,26 C32,19 38,19 35,28 C30,32 27,30 25,26 Z" fill="#B2711C" />
              <path d="M25,10 C16,4 10,4 13,13 C18,17 22,14 25,10 Z" fill="#B2711C" />
            </svg>
          ))}
        </div>
      </div>

      {/* LAYER 3: Ambient Particles & Environmental Motion (z-[3]) */}
      <div className="absolute inset-0 z-[3]">
        
        {/* Moving Wind Waves across fields */}
        <div className="absolute inset-0 opacity-[0.12]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,290 Q 200,270 400,310 T 800,280 T 1200,320 T 1600,270" fill="none" stroke="#68A4C4" strokeWidth="4.5" strokeDasharray="40, 160" className="animate-[dash_20s_linear_infinite]" />
            <path d="M0,490 Q 300,520 600,470 T 1200,510 T 1800,460" fill="none" stroke="#2E7D32" strokeWidth="3.5" strokeDasharray="50, 190" className="animate-[dash_26s_linear_infinite]" style={{ animationDelay: '1.2s' }} />
          </svg>
        </div>

        {/* Dynamic Weather Overlays (Gentle Rainfall lines) */}
        {isRain && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(16)].map((_, i) => (
              <div 
                key={i}
                className="absolute top-[-50px] w-[1.5px] h-24 bg-[#63B3ED]/30 animate-rain"
                style={{
                  left: `${(i * 7) + 3}%`,
                  animationDelay: `${i * 0.12}s`,
                  animationDuration: `${0.9 + Math.random() * 0.4}s`
                }}
              />
            ))}
          </div>
        )}

        {/* Foreground Drifting Leaves, Pollen & Wheat Chaff Sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Pollen Particles */}
          {[...Array(10)].map((_, i) => {
            const size = 3 + (i % 3) * 2
            const delay = i * 2.1
            const left = 8 + (i * 9)
            const top = 15 + (i * 7)
            return (
              <div
                key={`pollen-${i}`}
                className="absolute w-2 h-2 rounded-full bg-[#FFE893] opacity-0 blur-[1px] animate-pollen select-none pointer-events-none"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDuration: `${10 + (i * 2.5)}s`,
                  animationDelay: `${delay}s`
                }}
              />
            )
          })}

          {/* Drifting Leaves */}
          {[...Array(5)].map((_, i) => {
            const size = 10 + (i * 4)
            const delay = i * 4.2
            const left = 5 + (i * 22)
            return (
              <div
                key={`leaf-${i}`}
                className="absolute text-farm-leaf/10 pointer-events-none animate-drift select-none"
                style={{
                  left: `${left}%`,
                  fontSize: `${size}px`,
                  animationDuration: `${isWindy ? '10s' : `${16 + (i * 3.5)}s`}`,
                  animationDelay: `${delay}s`,
                  opacity: 0.22
                }}
              >
                {i % 2 === 0 ? '🌿' : '🍃'}
              </div>
            )
          })}

          {/* Floating Wheat Seeds */}
          {[...Array(4)].map((_, i) => {
            const delay = 1 + (i * 5)
            const left = 12 + (i * 26)
            return (
              <div
                key={`seed-${i}`}
                className="absolute text-[#E29A45]/15 pointer-events-none animate-drift select-none"
                style={{
                  left: `${left}%`,
                  fontSize: '9px',
                  animationDuration: `${isWindy ? '12s' : '20s'}`,
                  animationDelay: `${delay}s`,
                  opacity: 0.25
                }}
              >
                🌾
              </div>
            )
          })}
        </div>
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
