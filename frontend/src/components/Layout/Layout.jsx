import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, BookOpen, Sun, TrendingUp, Settings, Mic } from 'lucide-react'
import CommandPalette from '../CommandPalette/CommandPalette'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import CustomCursor from '../ui/CustomCursor'
import AmbientFarmWorld from '../ui/AmbientFarmWorld'
import { getProfile } from '../../services/api'

export default function Layout() {
  const [isMobile, setIsMobile] = useState(false)
  const [operatorName, setOperatorName] = useState('Operator')
  const [motionEnabled, setMotionEnabled] = useState(true)
  const [scrollPos, setScrollPos] = useState(0)
  const [bgOffset, setBgOffset] = useState({ x: 0, y: 0 })
  const location = useLocation()

  const loadProfile = () =>
    getProfile()
      .then(d => { if (d.OPERATOR_NAME) setOperatorName(d.OPERATOR_NAME) })
      .catch(() => {})

  useEffect(() => {
    loadProfile()
    window.addEventListener('profile-updated', loadProfile)
    return () => window.removeEventListener('profile-updated', loadProfile)
  }, [])

  const handleScroll = (e) => {
    setScrollPos(e.currentTarget.scrollTop)
  }

  const handleMouseMoveBg = (e) => {
    if (!motionEnabled) return
    const x = (e.clientX / window.innerWidth - 0.5) * 12
    const y = (e.clientY / window.innerHeight - 0.5) * 12
    setBgOffset({ x, y })
  }

  const [weatherCondition, setWeatherCondition] = useState('sunny')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Check if ambient motion is allowed
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const disableTrails = localStorage.getItem('vyra_disable_trails') === 'true'
    setMotionEnabled(!prefersReducedMotion && !disableTrails)

    // Determine simulated weather condition based on active page
    if (location.pathname === '/insights') {
      setWeatherCondition('cloudy')
    } else if (location.pathname === '/briefing') {
      setWeatherCondition('wind')
    } else if (location.pathname === '/memory') {
      setWeatherCondition('rain')
    } else {
      setWeatherCondition('sunny')
    }

    return () => window.removeEventListener('resize', checkMobile)
  }, [location.pathname])

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/assistant', icon: Mic, label: 'Voice' },
    { path: '/memory', icon: BookOpen, label: 'Log' },
    { path: '/briefing', icon: Sun, label: 'Briefing' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
  ]

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white/20 backdrop-blur-lg border-r border-stone-200/40 relative z-20">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-stone-200/50 bg-stone-50/20">
        <div className="w-9 h-9 bg-farm-tractor rounded-lg flex items-center justify-center text-white shadow-md">
          <Mic size={20} strokeWidth={2} />
        </div>
        <div className="flex flex-col text-left">
          <h1 className="font-semibold text-lg tracking-tight text-farm-soil leading-none">Vyra</h1>
          <span className="text-[10px] font-medium text-farm-tractor tracking-wider uppercase mt-1">Farmer Assistant</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 font-medium text-sm rounded-xl transition-all duration-200 group relative',
              isActive 
                ? 'text-farm-tractor font-semibold' 
                : 'text-farm-soil/75 hover:bg-stone-50/50 hover:text-farm-soil'
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="desktop-active-pill"
                    className="absolute inset-0 bg-farm-tractor/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                <item.icon size={18} className={cn('relative z-10', isActive ? 'text-farm-tractor' : 'text-farm-soil/50 group-hover:text-farm-soil/70')} strokeWidth={2} />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-stone-200/50 bg-white/30">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            'flex items-center gap-3 px-4 py-3 font-medium text-sm rounded-xl transition-all duration-200 group relative',
            isActive 
              ? 'text-farm-tractor font-semibold' 
              : 'text-farm-soil/75 hover:bg-stone-50/50 hover:text-farm-soil'
          )}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="desktop-active-pill"
                  className="absolute inset-0 bg-farm-tractor/10 rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}
              <Settings size={18} className={cn('relative z-10', isActive ? 'text-farm-tractor' : 'text-farm-soil/50 group-hover:text-farm-soil/70')} strokeWidth={2} />
              <span className="relative z-10">Settings</span>
            </>
          )}
        </NavLink>
        
        {/* User profile snippet */}
        <div className="mt-4 p-3 rounded-xl bg-white/50 border border-stone-200/50 flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 bg-farm-tractor/10 rounded-full flex items-center justify-center text-xs font-semibold text-farm-tractor">
            {operatorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'OP'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-farm-soil truncate">{operatorName}</p>
            <p className="text-[10px] font-normal text-farm-soil/50 truncate">Active Profile</p>
          </div>
        </div>
      </div>
    </div>
  )

  const MobileBottomNav = () => (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 h-16 floating-mobile-nav flex justify-around items-center px-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            'flex flex-col items-center justify-center p-2 rounded-xl min-w-[56px] relative transition-all',
            isActive ? 'text-farm-tractor' : 'text-farm-soil/60'
          )}
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <motion.div
                  layoutId="mobile-active-pill"
                  className="absolute inset-0 bg-farm-tractor/10 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <div className="relative z-10 mb-0.5">
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="relative z-10 text-[9px] font-semibold">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )

  return (
    <div 
      onMouseMove={handleMouseMoveBg}
      className="flex h-screen bg-sunrise-ambient overflow-hidden selection:bg-farm-tractor/30 selection:text-farm-soil relative"
    >
      
      {/* Living ambient agricultural background layer */}
      <AmbientFarmWorld weatherState={weatherCondition} />

      <CommandPalette />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] h-full flex-shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-stone-200/30 bg-white/70 backdrop-blur-md flex items-center justify-between px-4 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-farm-tractor rounded-lg flex items-center justify-center text-white shadow-md">
              <Mic size={15} strokeWidth={2} />
            </div>
            <span className="font-semibold text-lg tracking-tight text-farm-soil">Vyra</span>
          </div>
          <NavLink to="/settings" className="p-1.5 text-farm-soil/60 hover:bg-stone-50/50 hover:text-farm-soil rounded-lg transition-colors">
            <Settings size={18} strokeWidth={2} />
          </NavLink>
        </header>

        {/* Main scrollable area */}
        <main 
          onScroll={handleScroll}
          className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 z-10 pb-24 lg:pb-8"
        >
          <div className="max-w-5xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Floating AI Assistant launcher (Desktop only, as mobile has BottomNav) */}
      <NavLink
        to="/assistant"
        className="fixed bottom-6 right-6 hidden lg:flex w-14 h-14 bg-forest-gradient text-white rounded-full items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 z-40 group border border-white/20"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-white/25 blur-md rounded-full scale-125 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Mic size={22} className="relative z-10 animate-pulse text-farm-yellow" />
        </div>
      </NavLink>

      <MobileBottomNav />
      <CustomCursor />
    </div>
  )
}
