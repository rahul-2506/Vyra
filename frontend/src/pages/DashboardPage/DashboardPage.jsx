import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Droplets, Thermometer, AlertTriangle, ShieldCheck, Zap, CloudLightning, Sprout, ChevronRight, Clock, MessageSquare, Mic } from 'lucide-react'
import { getDashboardSummary, getWeather } from '../../services/api'
import { pageTransition, staggerContainer, staggerItem } from '../../lib/animations'
import toast from 'react-hot-toast'
import TiltCard from '../../components/ui/TiltCard'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [weather, setWeather] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })
  const navigate = useNavigate()

  const handleMouseMoveHero = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setMousePos({ x, y })
  }

  const handleMouseLeaveHero = () => {
    setMousePos({ x: 50, y: 50 })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, weatherData] = await Promise.all([
          getDashboardSummary(),
          getWeather('London')
        ])
        setSummary(summaryData)
        setWeather(weatherData)
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
        <div className="w-16 h-16 bg-farm-tractor rounded-2xl shadow-lg flex items-center justify-center animate-spin">
          <Zap size={32} className="text-white" strokeWidth={3} />
        </div>
        <p className="text-xl font-bold tracking-wide uppercase text-farm-soil">Syncing Data...</p>
      </div>
    )
  }

  const hasIssues = summary?.last_issue && summary.last_issue !== 'Unknown' && summary.last_issue !== 'No issues recorded'
  const statusBgColor = hasIssues ? 'bg-farm-alert/10' : 'bg-farm-tractor/10'
  const statusIcon = hasIssues ? <AlertTriangle size={28} className="text-farm-alert animate-breath" /> : <ShieldCheck size={28} className="text-farm-tractor animate-breath" />

  return (
    <motion.div {...pageTransition} className="pb-8 space-y-8">
      {/* Voice CTA - Flagship Environmental Hero */}
      <div 
        onMouseMove={handleMouseMoveHero}
        onMouseLeave={handleMouseLeaveHero}
        className="bg-gradient-to-br from-farm-tractor via-[#142c1f] to-farm-teal rounded-[28px] p-8 shadow-xl text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]"
      >
         <div className="absolute -right-10 -bottom-10 p-8 opacity-[0.07] text-white pointer-events-none">
            <Mic size={240} className="animate-float" />
         </div>
         <div 
           className="absolute w-80 h-80 bg-farm-yellow/15 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
           style={{
             left: `${mousePos.x}%`,
             top: `${mousePos.y}%`,
             transform: 'translate(-50%, -50%)'
           }}
         />
         
         {/* Sunrise over Farmland silhouettes */}
         <div className="absolute inset-x-0 bottom-0 opacity-[0.16] pointer-events-none z-0">
           <svg width="100%" height="80" viewBox="0 0 1000 80" preserveAspectRatio="none" fill="none" className="w-full">
             <path d="M0,80 L1000,80 L1000,40 C750,10 600,60 350,30 C200,10 0,50 0,50 Z" fill="#E29A45" />
             <path d="M0,80 L1000,80 L1000,55 C800,40 700,70 500,45 C300,20 150,60 0,60 Z" fill="#2E7D32" />
           </svg>
         </div>
         
         <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-bold tracking-widest text-farm-yellow bg-farm-yellow/10 border border-farm-yellow/20 px-2.5 py-1 rounded-full uppercase inline-block">
               Interactive Voice Core
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">Need Farm Assistance?</h2>
            <p className="text-white/80 text-sm md:text-base max-w-lg mx-auto font-normal">
               Tap the microphone to speak to Vyra. Ask about your crops, weather, or log recent activities.
            </p>
         </div>

         <button 
           onClick={() => navigate('/assistant')}
           className="relative z-10 mt-6 bg-white hover:bg-stone-50 text-farm-tractor font-bold text-sm tracking-wider px-8 py-4 rounded-xl flex items-center gap-2.5 shadow-md active:scale-95 transition-all hover:scale-105"
         >
           <Mic size={20} className="text-farm-teal animate-pulse" />
           TAP TO SPEAK
         </button>
      </div>
 
      {/* Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-12 gap-6">
        
        {/* System Status - Accent Strip Gold */}
        <motion.div variants={staggerItem} className={`col-span-12 md:col-span-6 lg:col-span-4 card accent-strip-gold ${statusBgColor} border-2 border-transparent`}>
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-bold text-farm-soil/60 uppercase tracking-wider">System Status</h3>
            {statusIcon}
          </div>
          <div className="flex items-baseline gap-2 mb-2">
             <span className={`text-3xl font-extrabold tracking-tight ${hasIssues ? 'text-farm-alert' : 'text-farm-tractor'}`}>
               {hasIssues ? 'ATTENTION' : 'NOMINAL'}
             </span>
          </div>
          <p className="text-xs text-farm-soil/55 font-semibold">{summary?.total_queries || 0} Total Interactions Processed</p>
        </motion.div>
 
        {/* Quick Env Stats */}
        <motion.div variants={staggerItem} className="col-span-12 md:col-span-6 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <TiltCard className="card hover-magnetic glow-gold flex flex-col justify-center items-center text-center p-4">
            <Thermometer size={24} className="text-farm-wheat mb-3 animate-float" strokeWidth={2.5} />
            <p className="text-xl font-extrabold text-farm-soil mb-1">{weather?.temperature || '--'}°C</p>
            <p className="text-[10px] font-bold text-farm-soil/50 uppercase tracking-wider">AVG TEMP</p>
          </TiltCard>
          <TiltCard className="card hover-magnetic glow-teal flex flex-col justify-center items-center text-center p-4">
            <Droplets size={24} className="text-farm-sky mb-3 animate-float" style={{ animationDelay: '1s' }} strokeWidth={2.5} />
            <p className="text-xl font-extrabold text-farm-soil mb-1">{weather?.humidity || '--'}%</p>
            <p className="text-[10px] font-bold text-farm-soil/50 uppercase tracking-wider">HUMIDITY</p>
          </TiltCard>
          <TiltCard className="card hover-magnetic flex flex-col justify-center items-center text-center p-4">
            <CloudLightning size={24} className="text-farm-soil/60 mb-3 animate-breath" strokeWidth={2.5} />
            <p className="text-base font-extrabold text-farm-soil mb-1 truncate w-full">{weather?.condition || 'Unknown'}</p>
            <p className="text-[10px] font-bold text-farm-soil/50 uppercase tracking-wider">FORECAST</p>
          </TiltCard>
          <TiltCard className="card hover-magnetic accent-strip-green flex flex-col justify-center items-center text-center p-4">
            <Sprout size={24} className="text-farm-leaf mb-3 animate-pulse" strokeWidth={2.5} />
            <p className="text-xl font-extrabold text-farm-leaf mb-1">OK</p>
            <p className="text-[10px] font-bold text-farm-soil/50 uppercase tracking-wider">SENSORS</p>
          </TiltCard>
        </motion.div>

        {/* Recent Activity - Span 12 or 8 */}
        <motion.div variants={staggerItem} className="col-span-12 lg:col-span-8 card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-farm-soil flex items-center gap-2">
               <Clock size={20} className="text-farm-soil/70" strokeWidth={2.5} /> Recent Interactions
            </h3>
            <Link to="/memory" className="text-sm font-semibold text-farm-tractor hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
             {summary?.recent_activity?.length > 0 ? summary.recent_activity.map((act, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-farm-muted/30 items-start">
                   <div className="w-10 h-10 bg-white rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm">
                      <MessageSquare size={20} className="text-farm-soil/70" />
                   </div>
                   <div>
                      <p className="font-semibold text-farm-soil text-base leading-snug">{act.query}</p>
                      <p className="text-xs font-medium text-farm-soil/50 mt-1">
                         {new Date(act.timestamp).toLocaleString()}
                      </p>
                   </div>
                </div>
             )) : (
                <div className="p-8 text-center bg-farm-muted/30 rounded-xl">
                   <p className="text-farm-soil/60 font-medium">No recent activity found.</p>
                </div>
             )}
          </div>
        </motion.div>

        {/* Alerts Box - Span 12 or 4 */}
        <motion.div variants={staggerItem} className="col-span-12 lg:col-span-4 card bg-farm-soil text-white">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Latest Issue</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${hasIssues ? 'bg-farm-alert text-white' : 'bg-farm-tractor text-white'}`}>
               {hasIssues ? '1 ALERT' : '0 ALERTS'}
            </span>
          </div>
          <div className="flex-1">
            {!hasIssues ? (
              <div className="flex flex-col items-center justify-center opacity-80 py-8">
                <ShieldCheck size={48} className="mb-4 text-white" strokeWidth={2} />
                <span className="text-sm font-semibold tracking-wide">All Systems Nominal</span>
              </div>
            ) : (
                <div className="p-4 rounded-xl bg-white/10 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-farm-alert flex items-center justify-center flex-shrink-0 text-white mt-0.5">
                    <AlertTriangle size={20} strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white mb-1">Recorded Anomaly</p>
                    <p className="text-sm text-white/80 font-medium leading-relaxed">{summary.last_issue}</p>
                  </div>
                </div>
            )}
          </div>
        </motion.div>

        {/* Weather Directive - Span 12 */}
        {weather?.agricultural_advice && (
          <motion.div variants={staggerItem} className="col-span-12 card bg-farm-sky/10 border-2 border-farm-sky/20">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={24} className="text-farm-sky" strokeWidth={2.5} /> 
              <h3 className="text-lg font-bold text-farm-soil">Weather Directive</h3>
            </div>
            <div className="bg-white rounded-xl p-5 flex justify-between items-center shadow-sm">
               <div>
                  <p className="text-xs font-bold text-farm-sky uppercase tracking-wide mb-1">ADVICE</p>
                  <p className="text-base font-medium text-farm-soil leading-tight">{weather.agricultural_advice}</p>
               </div>
               <div className="w-10 h-10 rounded-full flex items-center justify-center text-farm-sky bg-farm-sky/10 flex-shrink-0">
                  <ChevronRight size={20} strokeWidth={2.5} />
               </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}
