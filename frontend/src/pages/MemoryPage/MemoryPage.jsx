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
        'card p-0 overflow-hidden cursor-pointer group transition-all duration-300',
        expanded ? 'shadow-md border-stone-200' : 'shadow-sm border-stone-200/50 hover:shadow-md hover:border-stone-200'
      )}
      onClick={() => setExpanded(p => !p)}
    >
      <div className="flex items-stretch min-h-[90px]">
        {/* Risk Color Left Strip Indicator */}
        <div className={cn(
          'w-1.5 flex-shrink-0',
          risk === 'high' ? 'bg-farm-alert' : 
          risk === 'medium' ? 'bg-farm-sunburst' : 'bg-farm-tractor'
        )} />
        
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-farm-soil leading-snug">
                "{item.query}"
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {a.crop && <Badge variant="surface" className="text-[10px]">🌾 {a.crop}</Badge>}
                {a.issue && <Badge variant="surface" className="text-[10px]">🔍 {truncate(a.issue, 20)}</Badge>}
                <Badge variant={risk === 'high' ? 'red' : risk === 'medium' ? 'amber' : 'green'} className="text-[10px]">
                  {risk.toUpperCase()}
                </Badge>
                <span className="text-xs text-farm-soil/40 ml-2">{timeAgo(item.timestamp)}</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg border border-stone-200 bg-stone-50/50 flex items-center justify-center flex-shrink-0 text-farm-soil/50 group-hover:bg-farm-tractor group-hover:text-white transition-colors">
              {expanded ? <ChevronUp size={16} strokeWidth={2} /> : <ChevronDown size={16} strokeWidth={2} />}
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
                <div className="mt-4 pt-4 border-t border-dashed border-stone-200">
                  {a.recommendation && (
                    <div className="bg-farm-sunburst/5 border border-farm-sunburst/20 p-4 rounded-lg">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-farm-soil/75 mb-2 pb-1.5 border-b border-farm-sunburst/10 flex items-center gap-1.5">
                        <FileText size={14} strokeWidth={2} /> Action Plan
                      </h4>
                      <p className="text-sm text-farm-soil leading-relaxed font-medium">
                        {a.recommendation}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 flex gap-2">
                    <span className="text-[10px] text-farm-soil/55 bg-stone-50 border border-stone-200 px-2 py-0.5 rounded">
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
    <motion.div {...pageTransition} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white border border-stone-200/50 p-6 rounded-2xl shadow-sm">
        <div>
          <span className="section-eyebrow border-none pl-0">INTELLIGENCE LOG</span>
          <h1 className="section-title mb-0">Farm Memory</h1>
        </div>
        <button onClick={fetchHistory} disabled={isLoading} className="btn-primary">
          <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} strokeWidth={2} /> Sync logs
        </button>
      </div>

      {/* Search + Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Search */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl flex items-center relative p-1.5 shadow-sm">
          <div className="pl-3 pr-1 text-stone-400">
            <Search size={18} strokeWidth={2} />
          </div>
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none py-2 px-3 text-sm text-farm-soil placeholder-farm-soil/40 outline-none"
          />
        </div>

        {/* Filters */}
        <div className="lg:col-span-6 bg-white border border-stone-200 p-4 rounded-xl shadow-sm flex flex-col justify-center gap-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[10px] font-semibold text-farm-soil/60 tracking-wider w-12 uppercase">Risk</span>
            <div className="flex gap-2 flex-wrap">
              {RISK_FILTERS.map(f => (
                <button key={f} onClick={() => setRiskFilter(f)} className={`chip ${riskFilter === f ? 'chip-active' : ''}`}>{f}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-[10px] font-semibold text-farm-soil/60 tracking-wider w-12 uppercase">Time</span>
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
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card hover-magnetic border border-stone-200/50 flex flex-col items-center justify-center p-8 text-center bg-white">
          <div className="w-14 h-14 bg-farm-leaf/10 rounded-2xl flex items-center justify-center text-farm-leaf mb-4 shadow-sm animate-float">
            <Search size={24} strokeWidth={2.5} />
          </div>
          <h3 className="font-extrabold text-base text-farm-soil">No Logs Found</h3>
          <p className="text-xs text-farm-soil/70 mt-1 max-w-sm">
            We couldn't locate any activity records matching your current filters. Try resetting the text query or checking other activity types.
          </p>
          <div className="mt-4 pt-4 border-t border-dashed border-stone-200 w-full max-w-xs text-[11px] font-bold text-farm-tractor">
            💡 Did you know? <span className="text-farm-soil/70 font-medium">Vyra voice logs are saved here automatically.</span>
          </div>
        </div>
      ) : (
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-4">
          <div className="text-[11px] font-medium text-farm-soil/60 tracking-wide bg-stone-50 border border-stone-200 px-3 py-1 rounded-full inline-block">
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
