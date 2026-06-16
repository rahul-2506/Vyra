import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, LayoutDashboard, MessageSquare, BookOpen, Sun, TrendingUp, Settings, Zap } from 'lucide-react'

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const commands = [
    { id: 'dash', title: 'Dashboard', icon: LayoutDashboard, action: () => navigate('/') },
    { id: 'copilot', title: 'Ask Vyra Copilot', icon: MessageSquare, action: () => navigate('/assistant') },
    { id: 'memory', title: 'Search Farm Memory', icon: BookOpen, action: () => navigate('/memory') },
    { id: 'briefing', title: 'Daily Briefing', icon: Sun, action: () => navigate('/briefing') },
    { id: 'insights', title: 'Crop Vision Scanner', icon: TrendingUp, action: () => navigate('/insights') },
    { id: 'settings', title: 'Settings', icon: Settings, action: () => navigate('/settings') },
  ]

  const filteredCommands = commands.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault()
      filteredCommands[selectedIndex].action()
      setIsOpen(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-farm-soil/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="w-full max-w-2xl bg-white border-4 border-farm-soil shadow-[8px_8px_0px_#1C1917] pointer-events-auto flex flex-col"
            >
              {/* Sleek Search Header */}
              <div className="p-4 flex items-center border-b-4 border-farm-soil bg-farm-sunburst relative">
                <Search size={28} className="text-farm-soil absolute left-6" strokeWidth={3} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="EXECUTE COMMAND..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-xl font-black text-farm-soil placeholder-farm-soil/50 outline-none pl-14 pr-4 py-2 uppercase tracking-tight"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                />
                <div className="flex gap-1 border-2 border-farm-soil bg-white px-2 py-1 absolute right-4 shadow-[2px_2px_0px_#1C1917]">
                  <span className="text-xs text-farm-soil font-black uppercase tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>ESC</span>
                </div>
              </div>

              {/* Command List */}
              <div className="max-h-[40vh] overflow-y-auto p-4 scroll-smooth bg-farm-canvas">
                {filteredCommands.length === 0 ? (
                  <div className="px-6 py-12 text-center text-sm font-bold uppercase text-farm-soil/60 tracking-widest">
                    No matching operations found
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredCommands.map((cmd, index) => {
                      const isSelected = index === selectedIndex
                      return (
                        <button
                          key={cmd.id}
                          onClick={() => {
                            cmd.action()
                            setIsOpen(false)
                          }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`w-full flex items-center gap-4 px-4 py-4 text-left transition-all duration-150 border-2 ${
                            isSelected 
                              ? 'bg-farm-tractor text-farm-soil border-farm-soil shadow-[4px_4px_0px_#1C1917] -translate-y-0.5' 
                              : 'bg-white text-farm-soil border-transparent hover:border-farm-soil hover:shadow-[2px_2px_0px_#1C1917]'
                          }`}
                        >
                          <cmd.icon size={24} className="text-farm-soil" strokeWidth={isSelected ? 3 : 2} />
                          <span className="font-bold text-sm tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>{cmd.title}</span>
                          {isSelected && (
                            <span className="ml-auto text-[10px] font-black tracking-widest uppercase bg-white border-2 border-farm-soil px-2 py-1 shadow-[2px_2px_0px_#1C1917]" style={{ fontFamily: "'Space Mono', monospace" }}>Run ↵</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
