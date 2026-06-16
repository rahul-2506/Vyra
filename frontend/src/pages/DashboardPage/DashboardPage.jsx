import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Activity, Droplets, Thermometer, AlertTriangle, ShieldCheck, Zap, CloudLightning, Sprout, ChevronRight } from 'lucide-react'
import { getDashboardSummary } from '../../services/api'
import { pageTransition, staggerContainer, staggerItem } from '../../lib/animations'
import { generateChartData, timeAgo } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import toast from 'react-hot-toast'

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: '#ffffff', border: '4px solid #1C1917', borderRadius: '0', color: '#1C1917', fontSize: '14px', fontWeight: 'bold', fontFamily: "'Space Mono', monospace", boxShadow: '4px 4px 0px #1C1917' },
  cursor: { stroke: '#1C1917', strokeWidth: 2, fill: 'rgba(28,25,23,0.05)' },
  itemStyle: { color: '#10B981', fontWeight: '900' }
}

export default function DashboardPage() {
  const [health, setHealth] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [actions, setActions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const yieldData = generateChartData(7)
  const healthData = generateChartData(14).map(d => ({ ...d, score: 70 + Math.random() * 25 }))

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDashboardSummary()
        setHealth({ score: data.health_score || 85, status: data.health_status || 'OPTIMAL CONDITIONS' })
        setAlerts(data.alerts || [])
        setActions(data.recommended_actions || [])
      } catch (err) {
        toast.error('Failed to sync farm data')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-6">
        <div className="w-16 h-16 bg-farm-tractor border-4 border-farm-soil shadow-[8px_8px_0px_#1C1917] flex items-center justify-center animate-spin">
          <Zap size={32} className="text-farm-soil" strokeWidth={3} />
        </div>
        <p className="text-xl font-black tracking-widest uppercase text-farm-soil" style={{ fontFamily: "'Space Mono', monospace" }}>Syncing Telemetry...</p>
      </div>
    )
  }

  const healthScoreColor = health?.score > 80 ? 'text-farm-tractor' : health?.score > 60 ? 'text-farm-sunburst' : 'text-farm-alert'
  const healthBgColor = health?.score > 80 ? 'bg-farm-tractor' : health?.score > 60 ? 'bg-farm-sunburst' : 'bg-farm-alert'

  return (
    <motion.div {...pageTransition} className="pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b-4 border-farm-soil pb-6 bg-white p-6 shadow-brutal">
        <div>
          <span className="section-eyebrow border-none pl-0 text-farm-tractor">COMMAND CENTER</span>
          <h1 className="section-title mb-2">SYSTEM OVERVIEW</h1>
          <p className="font-bold text-farm-soil/80 uppercase tracking-widest text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>All sensors operational. AI copilot is standing by.</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="green" className="py-2 px-4 bg-farm-tractor shadow-brutal-sm text-farm-soil text-sm">
            <span className="w-3 h-3 border-2 border-farm-soil bg-white animate-pulse" /> LIVE SYNC
          </Badge>
        </div>
      </div>

      {/* Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-12 gap-6">
        
        {/* Farm Health Score - Span 4 */}
        <motion.div variants={staggerItem} className={`col-span-12 md:col-span-6 lg:col-span-4 card flex flex-col justify-between relative overflow-hidden ${healthBgColor}`}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08] transform -rotate-12 select-none z-0 flex items-center justify-center w-full h-full">
            <span className="text-[120px] font-black text-black leading-none tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>
              {health?.score > 80 ? 'OPT' : 'WRN'}
            </span>
          </div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h3 className="text-sm font-black text-farm-soil uppercase tracking-widest bg-white border-2 border-farm-soil px-3 py-1 shadow-[2px_2px_0px_#1C1917]" style={{ fontFamily: "'Space Mono', monospace" }}>Farm Health</h3>
            <Activity size={24} className="text-farm-soil" strokeWidth={3} />
          </div>
          <div className="bg-white border-4 border-farm-soil p-4 shadow-[4px_4px_0px_#1C1917] relative z-10">
            <div className="flex items-baseline gap-2 mb-2">
              <span className={`text-7xl font-black tracking-tighter text-farm-soil`} style={{ fontFamily: "'Space Mono', monospace" }}>{health?.score || 85}</span>
              <span className="text-2xl text-farm-soil/50 font-black" style={{ fontFamily: "'Space Mono', monospace" }}>/100</span>
            </div>
            <p className="text-sm text-farm-soil font-black uppercase tracking-widest">{health?.status || 'OPTIMAL CONDITIONS'}</p>
          </div>
        </motion.div>

        {/* Quick Env Stats - Span 8 */}
        <motion.div variants={staggerItem} className="col-span-12 md:col-span-6 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card flex flex-col justify-center items-center text-center py-6 hover:bg-farm-sunburst group transition-colors">
            <Thermometer size={32} className="text-farm-soil mb-4" strokeWidth={2.5} />
            <p className="text-3xl font-black text-farm-soil mb-2 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Space Mono', monospace" }}>28°C</p>
            <p className="text-xs uppercase font-bold tracking-widest text-farm-soil/70">Avg Temp</p>
          </div>
          <div className="card flex flex-col justify-center items-center text-center py-6 hover:bg-farm-sky group transition-colors">
            <Droplets size={32} className="text-farm-soil mb-4" strokeWidth={2.5} />
            <p className="text-3xl font-black text-farm-soil mb-2 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Space Mono', monospace" }}>65%</p>
            <p className="text-xs uppercase font-bold tracking-widest text-farm-soil/70">Humidity</p>
          </div>
          <div className="card flex flex-col justify-center items-center text-center py-6 hover:bg-farm-canvas group transition-colors">
            <CloudLightning size={32} className="text-farm-soil mb-4" strokeWidth={2.5} />
            <p className="text-3xl font-black text-farm-soil mb-2 group-hover:scale-110 transition-transform" style={{ fontFamily: "'Space Mono', monospace" }}>Clear</p>
            <p className="text-xs uppercase font-bold tracking-widest text-farm-soil/70">Forecast</p>
          </div>
          <div className="card flex flex-col justify-center items-center text-center py-6 bg-farm-tractor">
            <Sprout size={32} className="text-farm-soil mb-4" strokeWidth={2.5} />
            <p className="text-3xl font-black text-farm-soil mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>92%</p>
            <p className="text-xs uppercase font-black tracking-widest text-farm-soil/80 bg-white border-2 border-farm-soil px-2 py-0.5 shadow-brutal-sm">Vitality</p>
          </div>
        </motion.div>

        {/* Chart: Health Trend - Span 8 */}
        <motion.div variants={staggerItem} className="col-span-12 lg:col-span-8 card bg-white">
          <div className="flex justify-between items-center mb-8 border-b-4 border-farm-soil pb-4">
            <h3 className="text-lg font-black text-farm-soil uppercase tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>Health Trend (14D)</h3>
            <select className="bg-white border-4 border-farm-soil text-sm font-bold text-farm-soil shadow-[4px_4px_0px_#1C1917] px-3 py-2 outline-none uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
              <option>Last 14 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScoreBrutal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={{ stroke: '#1C1917', strokeWidth: 4 }} tickLine={{ stroke: '#1C1917', strokeWidth: 3 }} tick={{ fontSize: 12, fill: '#1C1917', fontWeight: 900, fontFamily: "'Space Mono', monospace" }} dy={15} />
                <YAxis axisLine={{ stroke: '#1C1917', strokeWidth: 4 }} tickLine={{ stroke: '#1C1917', strokeWidth: 3 }} tick={{ fontSize: 12, fill: '#1C1917', fontWeight: 900, fontFamily: "'Space Mono', monospace" }} />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Area type="step" dataKey="score" stroke="#1C1917" strokeWidth={4} fillOpacity={1} fill="url(#colorScoreBrutal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alerts Box - Span 4 */}
        <motion.div variants={staggerItem} className="col-span-12 lg:col-span-4 card flex flex-col bg-farm-alert text-white">
          <div className="flex justify-between items-center mb-6 border-b-4 border-white pb-4">
            <h3 className="text-lg font-black uppercase tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>Active Alerts</h3>
            <div className="bg-white text-farm-alert border-4 border-farm-soil font-black px-3 py-1 shadow-[4px_4px_0px_#1C1917]" style={{ fontFamily: "'Space Mono', monospace" }}>{alerts.length}</div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-90">
                <ShieldCheck size={48} className="mb-4 text-white" strokeWidth={2} />
                <span className="text-sm font-black uppercase tracking-widest border-2 border-white px-4 py-2" style={{ fontFamily: "'Space Mono', monospace" }}>All Systems Nominal</span>
              </div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="p-4 bg-white border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917] flex gap-4 items-start group hover:-translate-y-1 transition-transform cursor-pointer">
                  <div className="w-10 h-10 bg-farm-alert border-2 border-farm-soil flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                    <AlertTriangle size={20} strokeWidth={3} />
                  </div>
                  <div>
                    <p className="text-base font-black text-farm-soil mb-1 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>{alert.title}</p>
                    <p className="text-sm text-farm-soil/80 font-bold leading-tight">{alert.desc}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          {alerts.length > 0 && (
             <button className="w-full mt-6 py-3 bg-white border-4 border-farm-soil text-sm font-black uppercase tracking-widest text-farm-soil hover:bg-farm-canvas shadow-[4px_4px_0px_#1C1917] transition-colors" style={{ fontFamily: "'Space Mono', monospace" }}>
               View All Alerts
             </button>
          )}
        </motion.div>

        {/* Recommended Actions - Span 12 */}
        <motion.div variants={staggerItem} className="col-span-12 card bg-farm-canvas border-4 border-farm-sky">
          <div className="flex justify-between items-center mb-6 border-b-4 border-farm-sky pb-4">
            <h3 className="text-lg font-black text-farm-sky uppercase tracking-widest flex items-center gap-3" style={{ fontFamily: "'Space Mono', monospace" }}>
              <Zap size={24} strokeWidth={3} /> AI Directives
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {actions.map((act, i) => (
              <div key={i} className="bg-white border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917] p-5 flex justify-between items-center group cursor-pointer hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1C1917] transition-all">
                <div>
                  <p className="text-xs font-black text-farm-sky uppercase tracking-widest mb-2 border-b-2 border-farm-sky inline-block" style={{ fontFamily: "'Space Mono', monospace" }}>{act.type}</p>
                  <p className="text-base font-bold text-farm-soil leading-tight">{act.desc}</p>
                </div>
                <div className="w-10 h-10 border-2 border-farm-soil flex items-center justify-center text-farm-soil bg-farm-canvas group-hover:bg-farm-sky group-hover:text-white transition-colors flex-shrink-0">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </motion.div>
    </motion.div>
  )
}
