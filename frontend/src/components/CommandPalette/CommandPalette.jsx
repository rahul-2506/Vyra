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
            className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -5 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-xl bg-white border border-stone-200 shadow-xl rounded-xl pointer-events-auto flex flex-col overflow-hidden"
            >
              {/* Sleek Search Header */}
              <div className="p-3 flex items-center border-b border-stone-100 bg-white relative">
                <Search size={18} className="text-farm-soil/40 absolute left-4" strokeWidth={2} />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-sm text-farm-soil placeholder-farm-soil/40 outline-none pl-10 pr-12 py-1.5 font-normal"
                />
                <div className="flex items-center border border-stone-200 bg-white px-1.5 py-0.5 rounded text-[10px] text-farm-soil/40 absolute right-4">
                  <span>ESC</span>
                </div>
              </div>

              {/* Command List */}
              <div className="max-h-[40vh] overflow-y-auto p-2 scroll-smooth bg-white">
                {filteredCommands.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-farm-soil/40 font-normal">
                    No matching operations found
                  </div>
                ) : (
                  <div className="space-y-0.5">
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
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors border-none outline-none ${
                            isSelected 
                              ? 'bg-stone-50 text-farm-soil font-medium' 
                              : 'bg-white text-farm-soil/80 hover:bg-stone-50/50'
                          }`}
                        >
                          <cmd.icon size={16} className={isSelected ? 'text-farm-tractor' : 'text-farm-soil/40'} strokeWidth={2} />
                          <span className="text-sm">{cmd.title}</span>
                          {isSelected && (
                            <span className="ml-auto text-[10px] text-farm-soil/40 border border-stone-200 bg-white px-1.5 py-0.5 rounded">Enter ↵</span>
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
