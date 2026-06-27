import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Activity, Droplets, Thermometer, AlertTriangle, ShieldCheck, Zap, CloudLightning, Sprout, ChevronRight, Clock, MessageSquare, Mic, Camera, TrendingUp } from 'lucide-react'
import { getDashboardSummary, getWeather, sendCropDiagnosis, getMarketPrices } from '../../services/api'
import { pageTransition, staggerContainer, staggerItem } from '../../lib/animations'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [weather, setWeather] = useState(null)
  const [market, setMarket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

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
  const statusIcon = hasIssues ? <AlertTriangle size={28} className="text-farm-alert" /> : <ShieldCheck size={28} className="text-farm-tractor" />

  return (
    <motion.div {...pageTransition} className="pb-8 space-y-8">
      {/* Voice CTA - Top Priority */}
      <div className="bg-farm-tractor rounded-3xl p-8 shadow-xl text-center relative overflow-hidden flex flex-col items-center justify-center min-h-[200px]">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Mic size={200} />
         </div>
         <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">Need Farm Assistance?</h2>
         <p className="text-white/90 text-lg mb-8 relative z-10 max-w-lg mx-auto">
            Tap the microphone to speak to Vyra, or use the camera to diagnose crop diseases instantly.
         </p>
         <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4">
           <button 
             onClick={() => navigate('/assistant')}
             className="bg-white text-farm-tractor hover:bg-farm-muted font-bold text-xl px-8 py-4 rounded-full flex items-center gap-3 shadow-lg transition-transform hover:scale-105"
           >
             <Mic size={28} />
             TAP TO SPEAK
           </button>
           <button 
             onClick={() => navigate('/scanner')}
             className="bg-farm-sunburst text-farm-soil hover:bg-farm-sunburst/90 font-bold text-xl px-8 py-4 rounded-full flex items-center gap-3 shadow-lg transition-transform hover:scale-105"
           >
             <Camera size={28} />
             DIAGNOSE CROP
           </button>
         </div>
      </div>

      {/* Grid */}
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-12 gap-6">
        
        {/* System Status - Span 12 or 4 */}
        <motion.div variants={staggerItem} className={`col-span-12 md:col-span-6 lg:col-span-4 card ${statusBgColor} border-2 border-transparent`}>
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-bold text-farm-soil uppercase tracking-wide">System Status</h3>
            {statusIcon}
          </div>
          <div className="flex items-baseline gap-2 mb-2">
             <span className={`text-4xl font-bold tracking-tight ${hasIssues ? 'text-farm-alert' : 'text-farm-tractor'}`}>
               {hasIssues ? 'ATTENTION' : 'NOMINAL'}
             </span>
          </div>
          <p className="text-sm text-farm-soil/70 font-medium">{summary?.total_queries || 0} Total Interactions Processed</p>
        </motion.div>

        {/* Quick Env Stats - Span 12 or 8 */}
        <motion.div variants={staggerItem} className="col-span-12 md:col-span-6 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card flex flex-col justify-center items-center text-center p-4">
            <Thermometer size={28} className="text-farm-sunburst mb-3" strokeWidth={2.5} />
            <p className="text-2xl font-bold text-farm-soil mb-1">{weather?.temperature || '--'}°C</p>
            <p className="text-xs font-semibold text-farm-soil/60">AVG TEMP</p>
          </div>
          <div className="card flex flex-col justify-center items-center text-center p-4">
            <Droplets size={28} className="text-farm-sky mb-3" strokeWidth={2.5} />
            <p className="text-2xl font-bold text-farm-soil mb-1">{weather?.humidity || '--'}%</p>
            <p className="text-xs font-semibold text-farm-soil/60">HUMIDITY</p>
          </div>
          <div className="card flex flex-col justify-center items-center text-center p-4">
            <CloudLightning size={28} className="text-farm-soil/70 mb-3" strokeWidth={2.5} />
            <p className="text-lg font-bold text-farm-soil mb-1 truncate w-full">{weather?.condition || 'Unknown'}</p>
            <p className="text-xs font-semibold text-farm-soil/60">FORECAST</p>
          </div>
          <div className="card flex flex-col justify-center items-center text-center p-4 bg-farm-tractor/10">
            <Sprout size={28} className="text-farm-tractor mb-3" strokeWidth={2.5} />
            <p className="text-2xl font-bold text-farm-tractor mb-1">OK</p>
            <p className="text-xs font-semibold text-farm-tractor/80">SENSORS</p>
          </div>
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
