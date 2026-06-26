import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, BookOpen, Sun, TrendingUp, Settings, Mic } from 'lucide-react'
import CommandPalette from '../CommandPalette/CommandPalette'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'
import { getProfile } from '../../services/api'

export default function Layout() {
  const [isMobile, setIsMobile] = useState(false)
  const [operatorName, setOperatorName] = useState('Operator')

  const loadProfile = () =>
    getProfile()
      .then(d => { if (d.OPERATOR_NAME) setOperatorName(d.OPERATOR_NAME) })
      .catch(() => {})

  useEffect(() => {
    loadProfile()
    window.addEventListener('profile-updated', loadProfile)
    return () => window.removeEventListener('profile-updated', loadProfile)
  }, [])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/assistant', icon: Mic, label: 'Voice' },
    { path: '/memory', icon: BookOpen, label: 'Log' },
    { path: '/briefing', icon: Sun, label: 'Briefing' },
    { path: '/insights', icon: TrendingUp, label: 'Insights' },
  ]

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-white border-r-2 border-farm-muted relative z-20">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b-2 border-farm-muted bg-farm-tractor/10">
        <div className="w-10 h-10 bg-farm-tractor rounded-xl flex items-center justify-center text-white shadow-sm">
          <Mic size={24} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl tracking-tight text-farm-soil leading-none">Vyra</h1>
          <span className="text-xs font-semibold text-farm-tractor tracking-wide mt-1">Farmer Assistant</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-4 px-4 py-3 font-semibold text-sm rounded-xl transition-all duration-200 group',
              isActive 
                ? 'bg-farm-tractor text-white shadow-md' 
                : 'bg-transparent text-farm-soil hover:bg-farm-muted/50'
            )}
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} className={isActive ? 'text-white' : 'text-farm-soil/70'} strokeWidth={2.5} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t-2 border-farm-muted bg-white">
        <NavLink
          to="/settings"
          className={({ isActive }) => cn(
            'flex items-center gap-4 px-4 py-3 font-semibold text-sm rounded-xl transition-all duration-200 group',
            isActive 
              ? 'bg-farm-tractor text-white shadow-md' 
              : 'bg-transparent text-farm-soil hover:bg-farm-muted/50'
          )}
        >
          {({ isActive }) => (
            <>
              <Settings size={22} className={isActive ? 'text-white' : 'text-farm-soil/70'} strokeWidth={2.5} />
              <span>Settings</span>
            </>
          )}
        </NavLink>
        
        {/* User profile snippet */}
        <div className="mt-4 p-3 rounded-xl bg-farm-canvas border-2 border-farm-muted flex items-center gap-3">
          <div className="w-10 h-10 bg-farm-tractor/20 rounded-full flex items-center justify-center text-sm font-bold text-farm-tractor">
            {operatorName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'OP'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-farm-soil truncate">{operatorName}</p>
            <p className="text-xs font-medium text-farm-soil/60 truncate">Active Profile</p>
          </div>
        </div>
      </div>
    </div>
  )

  const MobileBottomNav = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-farm-muted flex justify-around items-center p-2 z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => cn(
            'flex flex-col items-center justify-center p-2 rounded-xl min-w-[64px]',
            isActive ? 'text-farm-tractor' : 'text-farm-soil/50'
          )}
        >
          {({ isActive }) => (
            <>
              <div className={cn("p-1.5 rounded-full mb-1 transition-colors", isActive ? "bg-farm-tractor/10" : "")}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )

  return (
    <div className="flex h-screen bg-farm-canvas overflow-hidden selection:bg-farm-tractor/30 selection:text-farm-soil">
      <CommandPalette />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[280px] h-full flex-shrink-0 z-20">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b-2 border-farm-muted bg-white flex items-center justify-between px-4 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-farm-tractor rounded-lg flex items-center justify-center text-white">
              <Mic size={18} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-farm-soil">Vyra</span>
          </div>
          <NavLink to="/settings" className="p-2 text-farm-soil/70 hover:bg-farm-muted rounded-full">
            <Settings size={22} strokeWidth={2} />
          </NavLink>
        </header>

        {/* Main scrollable area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 z-10 pb-24 lg:pb-8">
          <div className="max-w-4xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>

      <MobileBottomNav />
    </div>
  )
}
