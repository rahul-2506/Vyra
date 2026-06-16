import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // === THEME ===
  const [theme, setTheme] = useState(() => localStorage.getItem('vyra-theme') || 'dark')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    localStorage.setItem('vyra-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [])

  // === LANGUAGE ===
  const [language, setLanguage] = useState(() => localStorage.getItem('vyra-language') || 'English')
  useEffect(() => { localStorage.setItem('vyra-language', language) }, [language])

  // === SIDEBAR ===
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('vyra-sidebar-collapsed') === 'true'
  })
  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const next = !prev
      localStorage.setItem('vyra-sidebar-collapsed', String(next))
      return next
    })
  }, [])

  // === MOBILE SIDEBAR ===
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const openMobileSidebar  = useCallback(() => setIsMobileSidebarOpen(true),  [])
  const closeMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), [])

  // === COMMAND PALETTE ===
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const openCommandPalette  = useCallback(() => setIsCommandPaletteOpen(true),  [])
  const closeCommandPalette = useCallback(() => setIsCommandPaletteOpen(false), [])
  const toggleCommandPalette = useCallback(() => setIsCommandPaletteOpen(p => !p), [])

  // Ctrl+K handler
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        toggleCommandPalette()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleCommandPalette])

  // === NOTIFICATIONS ===
  const [notifications, setNotifications] = useState([])
  const addNotification = useCallback((notif) => {
    setNotifications(prev => [{ id: Date.now(), ...notif }, ...prev].slice(0, 20))
  }, [])
  const clearNotifications = useCallback(() => setNotifications([]), [])

  // === FARM PROFILE (localStorage) ===
  const [farmProfile, setFarmProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vyra-farm-profile')) || {
        name: '', location: '', primaryCrops: '', soilType: '', farmSize: '',
      }
    } catch { return { name: '', location: '', primaryCrops: '', soilType: '', farmSize: '' } }
  })
  const updateFarmProfile = useCallback((data) => {
    setFarmProfile(prev => {
      const next = { ...prev, ...data }
      localStorage.setItem('vyra-farm-profile', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AppContext.Provider value={{
      // Theme
      theme, toggleTheme,
      // Language
      language, setLanguage,
      // Sidebar
      isSidebarCollapsed, toggleSidebar,
      isMobileSidebarOpen, openMobileSidebar, closeMobileSidebar,
      // Command palette
      isCommandPaletteOpen, openCommandPalette, closeCommandPalette, toggleCommandPalette,
      // Notifications
      notifications, addNotification, clearNotifications,
      // Farm profile
      farmProfile, updateFarmProfile,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
