import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, BookOpen, Sun, TrendingUp, Settings, Menu, ShieldAlert } from 'lucide-react'
import CommandPalette from '../CommandPalette/CommandPalette'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isMobile) setSidebarOpen(false)
  }, [location.pathname, isMobile])

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'DASHBOARD' },
    { path: '/assistant', icon: MessageSquare, label: 'COPILOT' },
    { path: '/memory', icon: BookOpen, label: 'FARM LOG' },
    { path: '/briefing', icon: Sun, label: 'BRIEFING' },
    { path: '/insights', icon: TrendingUp, label: 'INSIGHTS' },
  ]

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-farm-canvas border-r-4 border-farm-soil shadow-brutal relative z-20">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b-4 border-farm-soil bg-farm-tractor">
        <div className="w-12 h-12 bg-white border-4 border-farm-soil flex items-center justify-center text-farm-soil shadow-brutal-sm transform -rotate-3">
          <ShieldAlert size={28} strokeWidth={3} />
        </div>
        <div className="flex flex-col">
          <h1 className="font-black text-3xl tracking-tighter text-farm-soil leading-none uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>VYRA</h1>
          <span className="text-[10px] font-black text-white uppercase tracking-widest mt-1 bg-farm-soil px-1" style={{ fontFamily: "'Space Mono', monospace" }}>OS V2.0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-4 px-4 py-4 font-bold text-sm uppercase tracking-wide transition-all duration-200 group border-2',
              isActive 
                ? 'bg-farm-soil text-white border-farm-soil shadow-[4px_4px_0px_#10B981]' 
                : 'bg-white text-farm-soil border-farm-soil shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal hover:bg-farm-sunburst'
            )}
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={isActive ? 'text-farm-tractor' : 'text-farm-soil'} strokeWidth={3} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t-4 border-farm-soil bg-white">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            'flex items-center gap-4 px-4 py-4 font-bold text-sm uppercase tracking-wide transition-all duration-200 group border-2',
            isActive 
              ? 'bg-farm-soil text-white border-farm-soil shadow-[4px_4px_0px_#10B981]' 
              : 'bg-farm-canvas text-farm-soil border-farm-soil shadow-brutal-sm hover:-translate-y-1 hover:shadow-brutal hover:bg-farm-muted'
          )}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {({ isActive }) => (
            <>
              <Settings size={22} className={isActive ? 'text-farm-tractor' : 'text-farm-soil'} strokeWidth={3} />
              <span>SETTINGS</span>
            </>
          )}
        </NavLink>
        
        {/* User profile snippet */}
        <div className="mt-4 p-3 border-4 border-farm-soil bg-farm-tractor shadow-brutal-sm flex items-center gap-3">
          <div className="w-10 h-10 bg-white border-2 border-farm-soil flex items-center justify-center text-sm font-black text-farm-soil transform rotate-3" style={{ fontFamily: "'Space Mono', monospace" }}>
            RF
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-farm-soil truncate uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>Rahul Farmer</p>
            <p className="text-[10px] font-bold text-farm-soil/80 uppercase truncate tracking-widest">Active License</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-farm-canvas overflow-hidden selection:bg-farm-tractor selection:text-farm-soil">
      <CommandPalette />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[300px] h-full flex-shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-farm-soil/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[300px] z-50 shadow-brutal"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b-4 border-farm-soil bg-farm-tractor flex items-center justify-between px-4 z-10 sticky top-0 shadow-brutal-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white border-2 border-farm-soil flex items-center justify-center text-farm-soil transform -rotate-3">
              <ShieldAlert size={18} strokeWidth={3} />
            </div>
            <span className="font-black text-xl tracking-tighter text-farm-soil uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>VYRA</span>
          </div>
          <button onClick={() => setSidebarOpen(true)} className="p-2 border-2 border-farm-soil bg-white text-farm-soil shadow-[2px_2px_0px_#1C1917] active:translate-y-0.5 active:shadow-none transition-all">
            <Menu size={20} strokeWidth={3} />
          </button>
        </header>

        {/* Tactical Ticker Tape */}
        <div className="w-full bg-farm-sunburst border-b-4 border-farm-soil overflow-hidden flex items-center h-10 flex-shrink-0 relative z-10 shadow-brutal-sm hidden md:flex">
          <div className="whitespace-nowrap flex w-max font-black text-sm uppercase tracking-widest text-farm-soil animate-ticker" style={{ fontFamily: "'Space Mono', monospace" }}>
            <span className="pr-12">/// SYSTEM NOMINAL</span>
            <span className="pr-12">/// SOIL MOISTURE: 42% [OPTIMAL]</span>
            <span className="pr-12">/// SECTOR 7 CLEAR</span>
            <span className="pr-12">/// NO BLIGHT DETECTED</span>
            <span className="pr-12">/// AI VISION ARMED</span>
            <span className="pr-12">/// SATELLITE UPLINK STABLE</span>
            <span className="pr-12">/// SYSTEM NOMINAL</span>
            <span className="pr-12">/// SOIL MOISTURE: 42% [OPTIMAL]</span>
            <span className="pr-12">/// SECTOR 7 CLEAR</span>
            <span className="pr-12">/// NO BLIGHT DETECTED</span>
            <span className="pr-12">/// AI VISION ARMED</span>
            <span className="pr-12">/// SATELLITE UPLINK STABLE</span>
          </div>
        </div>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 z-10">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
