import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Droplets, Thermometer, AlertTriangle, ShieldCheck, Zap, CloudLightning, Sprout, ChevronRight, Clock, MessageSquare, Mic, Camera, TrendingUp } from 'lucide-react'
import { getDashboardSummary, getWeather, sendCropDiagnosis, getMarketPrices } from '../../services/api'
import { pageTransition, staggerContainer, staggerItem } from '../../lib/animations'
import toast from 'react-hot-toast'
import TiltCard from '../../components/ui/TiltCard'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [weather, setWeather] = useState(null)
  const [market, setMarket] = useState(null)
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
        const [summaryData, weatherData, marketData] = await Promise.all([
          getDashboardSummary(),
          getWeather('London'),
          getMarketPrices()
        ])
        setSummary(summaryData)
        setWeather(weatherData)
        setMarket(marketData)
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
        className="shine-container bg-gradient-to-br from-[#082213] via-[#103720] to-[#0A3F23] rounded-[28px] p-8 shadow-[0_24px_55px_-12px_rgba(11,37,22,0.38)] border border-white/15 text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[230px] transition-all duration-300 hover:border-farm-yellow/30"
      >
         {/* Shimmer Sheen Animated Highlight */}
         <div className="shine-overlay" />

         <div className="absolute -right-10 -bottom-10 p-8 opacity-[0.08] text-white pointer-events-none">
            <Mic size={240} className="animate-float" />
         </div>
         {/* Mouse tracking dynamic spotlight */}
         <div 
           className="absolute w-88 h-88 bg-farm-yellow/20 rounded-full blur-3xl pointer-events-none transition-all duration-300 ease-out"
           style={{
             left: `${mousePos.x}%`,
             top: `${mousePos.y}%`,
             transform: 'translate(-50%, -50%)'
           }}
         />
         
         {/* Sunrise over Farmland silhouettes */}
         <div className="absolute inset-x-0 bottom-0 opacity-[0.24] pointer-events-none z-0">
           <svg width="100%" height="85" viewBox="0 0 1000 85" preserveAspectRatio="none" fill="none" className="w-full">
             <path d="M0,85 L1000,85 L1000,45 C750,15 600,65 350,35 C200,15 0,55 0,55 Z" fill="#DE9A35" />
             <path d="M0,85 L1000,85 L1000,60 C800,45 700,75 500,50 C300,25 150,65 0,65 Z" fill="#1B5E20" />
           </svg>
         </div>
         
         <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-extrabold tracking-widest text-farm-yellow bg-farm-yellow/15 border border-farm-yellow/30 px-3 py-1 rounded-full uppercase inline-block shadow-sm animate-breath">
               Interactive Voice Core
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight text-shadow">
               Need Farm Assistance?
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-lg mx-auto font-medium">
               Tap the microphone to speak to Vyra, or use the camera to diagnose crop diseases instantly.
            </p>
         </div>

         <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
           <button 
             onClick={() => navigate('/assistant')}
             className="bg-gradient-to-r from-farm-yellow to-farm-wheat hover:brightness-110 text-farm-soil font-extrabold text-sm md:text-base tracking-wider px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg border border-white/20 active:scale-95 transition-all hover:scale-105"
           >
             <Mic size={18} className="text-farm-soil animate-pulse" />
             TAP TO SPEAK
           </button>
           <button 
             onClick={() => navigate('/scanner')}
             className="bg-white hover:bg-gray-100 text-farm-tractor font-extrabold text-sm md:text-base tracking-wider px-8 py-4 rounded-xl flex items-center justify-center gap-2.5 shadow-lg border border-white/20 active:scale-95 transition-all hover:scale-105"
           >
             <Camera size={18} className="text-farm-tractor" />
             DIAGNOSE CROP
           </button>
         </div>
      </div>
 
      {/* Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-12 gap-6">
        
         {/* System Status - Accent Strip Gold */}
         <motion.div variants={staggerItem} className={`col-span-12 md:col-span-6 lg:col-span-4 card accent-strip-gold ${statusBgColor} border-2 border-transparent relative overflow-hidden`}>
           {/* Subtle background telemetry grid line illustration */}
           <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-0">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
               <line x1="0" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="0.75" />
               <line x1="0" y1="70%" x2="100%" y2="70%" stroke="currentColor" strokeWidth="0.75" />
               <line x1="25%" y1="0" x2="25%" y2="100%" stroke="currentColor" strokeWidth="0.75" />
               <line x1="75%" y1="0" x2="75%" y2="100%" stroke="currentColor" strokeWidth="0.75" />
             </svg>
           </div>
           
           <div className="relative z-10 flex justify-between items-start mb-6">
             <h3 className="text-xs font-bold text-farm-soil/60 uppercase tracking-wider">System Status</h3>
             {statusIcon}
           </div>
           <div className="relative z-10 flex items-baseline gap-2 mb-2">
              <span className={`text-3xl font-extrabold tracking-tight ${hasIssues ? 'text-farm-alert' : 'text-farm-tractor'}`}>
                {hasIssues ? 'ATTENTION' : 'NOMINAL'}
              </span>
           </div>
           <p className="relative z-10 text-xs text-farm-soil/55 font-semibold">{summary?.total_queries || 0} Total Interactions Processed</p>
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
                 <div className="p-8 text-center bg-farm-muted/20 border border-stone-200/50 rounded-xl relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
                    <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                      <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-farm-soil animate-telemetry">
                        <path d="M50,15 C65,35 65,65 50,85 C35,65 35,35 50,15 Z" strokeWidth="2" />
                        <path d="M50,15 L50,85" strokeWidth="1" strokeDasharray="2,2" />
                      </svg>
                    </div>
                    <p className="text-farm-soil/45 font-bold text-sm uppercase tracking-wider relative z-10">No recent activity recorded</p>
                    <p className="text-farm-soil/35 font-semibold text-xs mt-1 relative z-10">Activities and voice logs will populate here</p>
                 </div>
              )}
           </div>
         </motion.div>

        {/* Market Trends - Span 12 or 6 */}
        <motion.div variants={staggerItem} className="col-span-12 lg:col-span-6 card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-farm-soil flex items-center gap-2">
               <TrendingUp size={20} className="text-farm-tractor" strokeWidth={2.5} /> Market Prices
            </h3>
            <span className="text-xs font-semibold text-farm-soil/60 bg-farm-muted px-2 py-1 rounded-full uppercase tracking-wide">
              {market?.location || 'Local'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {market?.prices?.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-farm-muted/30 border border-farm-muted/50 flex flex-col justify-between">
                   <p className="font-semibold text-farm-soil/80 text-sm mb-1">{item.crop}</p>
                   <div className="flex items-end justify-between">
                     <p className="text-lg font-bold text-farm-soil">₹{item.price}</p>
                     <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                       item.trend === 'up' ? 'text-farm-tractor bg-farm-tractor/10' : 
                       item.trend === 'down' ? 'text-farm-alert bg-farm-alert/10' : 
                       'text-farm-soil/60 bg-farm-muted'
                     }`}>
                       {item.change}
                     </span>
                   </div>
                </div>
             ))}
          </div>
        </motion.div>

        {/* Alerts Box - Span 12 or 6 (changed from 4) */}
        <motion.div variants={staggerItem} className="col-span-12 lg:col-span-6 card bg-farm-soil text-white">
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
