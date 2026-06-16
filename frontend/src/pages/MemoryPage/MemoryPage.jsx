import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFarmHistory } from '../../services/api'
import { getRiskLevel, truncate, timeAgo } from '../../lib/utils'
import { pageTransition, staggerContainer, staggerItem } from '../../lib/animations'
import { Search, RefreshCw, ChevronDown, ChevronUp, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../../components/ui/Badge'
import { cn } from '../../lib/utils'

const RISK_FILTERS  = ['ALL', 'LOW', 'MEDIUM', 'HIGH']
const DATE_FILTERS  = ['ALL TIME', 'TODAY', 'THIS WEEK']

function HistoryEntry({ item }) {
  const [expanded, setExpanded] = useState(false)
  const a = item.analysis || {}
  const risk = getRiskLevel(a.risk)

  return (
    <motion.div
      variants={staggerItem}
      layout
      className={cn(
        'bg-white border-4 border-farm-soil p-0 overflow-hidden cursor-pointer group transition-all duration-300',
        expanded ? 'shadow-brutal-hover -translate-y-1' : 'shadow-brutal hover:-translate-y-1 hover:shadow-brutal-hover'
      )}
      onClick={() => setExpanded(p => !p)}
    >
      <div className="flex items-stretch min-h-[100px]">
        {/* Massive Risk Block */}
        <div className={cn(
          'w-6 md:w-8 flex-shrink-0 border-r-4 border-farm-soil',
          risk === 'high' ? 'bg-farm-alert' : 
          risk === 'medium' ? 'bg-farm-sunburst' : 'bg-farm-tractor'
        )} />
        
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xl md:text-2xl font-black text-farm-soil leading-tight uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                "{item.query}"
              </p>
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                {a.crop && <Badge variant="surface" className="text-xs">🌾 {a.crop}</Badge>}
                {a.issue && <Badge variant="surface" className="text-xs">🔍 {truncate(a.issue, 20)}</Badge>}
                <Badge variant={risk === 'high' ? 'red' : risk === 'medium' ? 'amber' : 'green'} className="text-xs">
                  {risk.toUpperCase()}
                </Badge>
                <span className="text-sm font-bold text-farm-soil/60 ml-2 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>{timeAgo(item.timestamp)}</span>
              </div>
            </div>
            <div className="w-12 h-12 border-4 border-farm-soil bg-farm-canvas flex items-center justify-center flex-shrink-0 text-farm-soil group-hover:bg-farm-tractor transition-colors shadow-brutal-sm">
              {expanded ? <ChevronUp size={24} strokeWidth={3} /> : <ChevronDown size={24} strokeWidth={3} />}
            </div>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t-4 border-farm-soil border-dashed">
                  {a.recommendation && (
                    <div className="bg-farm-sunburst/20 border-4 border-farm-soil p-5 shadow-brutal-sm">
                      <h4 className="text-sm font-black uppercase tracking-widest text-farm-soil mb-3 flex items-center gap-2 border-b-4 border-farm-soil pb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                        <FileText size={18} strokeWidth={3} /> Action Plan
                      </h4>
                      <p className="text-base text-farm-soil leading-relaxed font-bold">
                        {a.recommendation}
                      </p>
                    </div>
                  )}
                  <div className="mt-5 flex gap-2">
                    <span className="text-xs font-black text-farm-soil uppercase tracking-widest bg-farm-canvas border-2 border-farm-soil px-3 py-1 shadow-[2px_2px_0px_#1C1917]" style={{ fontFamily: "'Space Mono', monospace" }}>
                      Logged: {new Date(item.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function MemoryPage() {
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [dateFilter, setDateFilter] = useState('ALL TIME')

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getFarmHistory()
      setHistory(data)
    } catch (err) {
      toast.error('Could not load memory.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const filtered = history.filter(item => {
    const a = item.analysis || {}
    const riskLevel = getRiskLevel(a.risk).toUpperCase()
    const matchSearch = !searchQuery || item.query?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRisk   = riskFilter === 'ALL' || riskLevel === riskFilter
    const matchDate   = (() => {
      if (dateFilter === 'ALL TIME') return true
      const d = new Date(item.timestamp)
      const now = new Date()
      if (dateFilter === 'TODAY') return d.toDateString() === now.toDateString()
      if (dateFilter === 'THIS WEEK') return (now - d) < 7 * 24 * 60 * 60 * 1000
      return true
    })()
    return matchSearch && matchRisk && matchDate
  })

  return (
    <motion.div {...pageTransition}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 bg-white border-4 border-farm-soil p-6 shadow-brutal">
        <div>
          <span className="section-eyebrow border-none pl-0 text-farm-sunburst">INTELLIGENCE LOG</span>
          <h1 className="section-title mb-0">FARM MEMORY</h1>
        </div>
        <button onClick={fetchHistory} disabled={isLoading} className="btn-primary">
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} strokeWidth={3} /> REFRESH SYNC
        </button>
      </div>

      {/* Search + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        {/* Search */}
        <div className="lg:col-span-6 bg-white border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917] flex items-center relative p-2">
          <div className="bg-farm-tractor border-2 border-farm-soil w-12 h-12 flex items-center justify-center ml-2 shadow-[2px_2px_0px_#1C1917]">
            <Search size={24} className="text-farm-soil" strokeWidth={3} />
          </div>
          <input
            type="text"
            placeholder="SEARCH LOGS..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none py-4 px-4 text-xl font-black text-farm-soil placeholder-farm-soil/40 outline-none uppercase tracking-tighter"
            style={{ fontFamily: "'Space Mono', monospace" }}
          />
        </div>

        {/* Filters */}
        <div className="lg:col-span-6 bg-white border-4 border-farm-soil p-6 shadow-[4px_4px_0px_#1C1917] flex flex-col justify-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-black text-farm-soil uppercase tracking-widest w-16" style={{ fontFamily: "'Space Mono', monospace" }}>RISK</span>
            <div className="flex gap-2 flex-wrap">
              {RISK_FILTERS.map(f => (
                <button key={f} onClick={() => setRiskFilter(f)} className={`chip ${riskFilter === f ? 'chip-active' : ''}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-xs font-black text-farm-soil uppercase tracking-widest w-16" style={{ fontFamily: "'Space Mono', monospace" }}>TIME</span>
            <div className="flex gap-2 flex-wrap">
              {DATE_FILTERS.map(f => (
                <button key={f} onClick={() => setDateFilter(f)} className={`chip ${dateFilter === f ? 'chip-active' : ''}`}>{f}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="space-y-6">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="w-24 h-24 border-4 border-farm-soil bg-farm-canvas flex items-center justify-center shadow-brutal mb-6 transform -rotate-6">
            <Search size={48} className="text-farm-soil/50" strokeWidth={3} />
          </div>
          <div className="empty-state-title">No records found</div>
          <div className="empty-state-desc font-bold">Try adjusting your filters or search term.</div>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
          <div className="text-sm font-black text-farm-soil uppercase tracking-widest mb-4 inline-block bg-white border-2 border-farm-soil px-3 py-1 shadow-brutal-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
            Showing {filtered.length} entries
          </div>
          {filtered.map((item, i) => (
            <HistoryEntry key={i} item={item} />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
