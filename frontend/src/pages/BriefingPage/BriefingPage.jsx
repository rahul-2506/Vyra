import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getDailyBriefing } from '../../services/api'
import { pageTransition, staggerContainer, staggerItem } from '../../lib/animations'
import { Sun, CloudRain, AlertTriangle, Lightbulb, CalendarDays, RefreshCw, Layers, ChevronRight, Mic } from 'lucide-react'
import toast from 'react-hot-toast'

function SectionCard({ icon: Icon, title, children, badge, badgeColor = 'green', className = '' }) {
  return (
    <motion.div variants={staggerItem} className={`glass-card hover-magnetic flex flex-col p-0 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-stone-100 bg-stone-50/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white border border-stone-200 flex items-center justify-center text-farm-soil/70 rounded-lg shadow-sm">
            <Icon size={16} strokeWidth={2} className="text-farm-leaf" />
          </div>
          <h3 className="text-sm font-bold text-farm-soil">{title}</h3>
        </div>
        {badge && (
          <span className={`px-2.5 py-0.5 text-[9px] font-bold tracking-wider rounded-full border
            ${badgeColor === 'green' ? 'bg-farm-leaf/10 text-farm-leaf border-farm-leaf/20' : 
              badgeColor === 'red' ? 'bg-farm-alert/10 text-farm-alert border-farm-alert/20' : 
              'bg-stone-50 text-farm-soil/60 border-stone-200'}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-6 flex-1 text-left">
        {children}
      </div>
    </motion.div>
  )
}

function SkeletonBriefing() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="md:col-span-12 skeleton h-32" />
      {[1,2,3,4].map(i => (
        <div key={i} className="md:col-span-6 skeleton h-48" />
      ))}
    </div>
  )
}

export default function BriefingPage() {
  const navigate = useNavigate()
  const [briefing, setBriefing] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const fetchBriefing = async () => {
    setIsLoading(true)
    try {
      const data = await getDailyBriefing()
      setBriefing(data)
      setGenerated(true)
    } catch (err) {
      toast.error('Briefing sync failed.')
    } finally {
      setIsLoading(false)
    }
  }

  const recs = briefing?.recommendations || []
  const weatherRec = recs[0] || null
  const diseaseRec = recs[1] || null
  const farmRecs   = recs.slice(2) || []

  return (
    <motion.div {...pageTransition} className="pb-16 space-y-6">
      
      {/* Immersive Executive Header (Span 12) */}
      <div className="relative overflow-hidden rounded-[28px] bg-forest-gradient text-white shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-farm-leaf/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 top-5 w-24 h-24 bg-farm-wheat/5 rounded-full blur-2xl animate-float" />
        
        {/* Layered paper-report vector accents */}
        <div className="absolute right-1/4 top-[-20px] opacity-[0.06] pointer-events-none z-0">
          <svg width="220" height="180" viewBox="0 0 220 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
            <rect x="30" y="30" width="130" height="150" rx="12" fill="#FFFFFF" transform="rotate(-6 95 105)" />
            <rect x="45" y="20" width="130" height="150" rx="12" fill="#FFFFFF" transform="rotate(3 110 95)" />
            <rect x="60" y="10" width="130" height="150" rx="12" fill="#FFFFFF" transform="rotate(12 125 85)" />
          </svg>
        </div>

        <div className="text-left space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-farm-yellow bg-farm-yellow/10 border border-farm-yellow/20 px-2.5 py-1 rounded-full uppercase">
              AI Compilation Report
            </span>
            <span className="w-1.5 h-1.5 bg-farm-leaf rounded-full animate-ping" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">
            Daily Briefing
          </h1>
          <div className="flex items-center gap-3">
            <p className="text-xs text-white/70 font-semibold bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg inline-block">{today}</p>
            <p className="text-[10px] tracking-wider text-farm-yellow font-bold uppercase">Status: {generated ? 'Optimized' : 'Pending'}</p>
          </div>
        </div>

        <button
          onClick={fetchBriefing}
          disabled={isLoading}
          className="relative z-10 bg-white hover:bg-stone-50 text-farm-tractor font-semibold text-xs px-5 py-3.5 rounded-xl flex items-center gap-2 shadow-md active:scale-95 transition-all shrink-0 hover:scale-105"
        >
          {isLoading ? (
            <><RefreshCw size={14} className="animate-spin" strokeWidth={2.5} /> Compiling...</>
          ) : (
            <><Layers size={14} strokeWidth={2.5} /> {generated ? 'Re-compile Report' : 'Generate Briefing'}</>
          )}
        </button>
      </div>

      {!isLoading && !briefing && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-fade-in">
          {/* Main Empty State Alert Banner */}
          <div className="md:col-span-8 card hover-magnetic flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden bg-gradient-to-br from-white/95 to-farm-canvas/95 border border-stone-200/50">
            <div className="w-14 h-14 bg-farm-yellow/10 rounded-2xl flex items-center justify-center text-farm-yellow relative z-10 shadow-sm shrink-0">
              <Sun size={28} className="animate-spin text-farm-wheat" style={{ animationDuration: '10s' }} />
            </div>
            <div className="flex-1 text-left relative z-10 space-y-2">
              <h3 className="font-extrabold text-lg text-farm-soil leading-tight">No Daily Briefing Compiled</h3>
              <p className="text-sm text-farm-soil/75 max-w-xl">
                Get an AI-curated daily action plan containing real-time telemetry analytics, weather alerts, and crop recommendations tailored specifically to your farm coordinate profiles.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-bold text-farm-tractor">
                <span className="bg-farm-tractor/10 px-2.5 py-1 rounded-full uppercase tracking-wider">🌾 Seasonal Tip</span>
                <span className="text-farm-soil/70 font-medium italic">Early morning soil moisture scans detect evaporation spikes before sun peak.</span>
              </div>
            </div>
          </div>

          {/* Quick Suggestions Card */}
          <div className="md:col-span-4 card hover-magnetic flex flex-col justify-between bg-white border border-stone-200/50 text-left">
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-farm-tractor">AI Quick Start</h4>
              <p className="text-xs text-farm-soil/65 leading-relaxed">
                Trigger compilation or test telemetry integrations using quick shortcuts.
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <button 
                onClick={fetchBriefing} 
                className="w-full text-left px-4 py-3 rounded-xl border border-stone-250/60 hover:border-farm-tractor hover:bg-stone-50/50 transition-all flex items-center justify-between text-xs font-bold text-farm-soil"
              >
                <span>Compile Briefing Now</span>
                <ChevronRight size={14} />
              </button>
              <button 
                onClick={() => navigate('/assistant')} 
                className="w-full text-left px-4 py-3 rounded-xl border border-stone-250/60 hover:border-farm-tractor hover:bg-stone-50/50 transition-all flex items-center justify-between text-xs font-bold text-farm-soil"
              >
                <span>Voice Ask Vyra</span>
                <Mic size={14} className="text-farm-tractor" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && <SkeletonBriefing />}

      <AnimatePresence>
        {briefing && !isLoading && (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Summary Showcase Banner - Span 12 */}
            <motion.div variants={staggerItem} className="md:col-span-12 clay-card-gold hover-magnetic glow-gold p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
              <div className="w-14 h-14 bg-farm-clay/10 text-farm-clay flex items-center justify-center rounded-2xl flex-shrink-0 relative z-10 shadow-sm">
                <Sun size={28} strokeWidth={2} className="animate-pulse text-farm-wheat" />
              </div>
              <div className="flex-1 w-full relative z-10 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-farm-clay mb-1">Executive Summary</p>
                <p className="text-lg font-medium text-farm-soil leading-relaxed">{briefing.summary}</p>
              </div>
            </motion.div>

            {/* Weather Outlook - Span 6 */}
            <SectionCard icon={CloudRain} title="Atmospheric Data" badge="LIVE TELEMETRY" badgeColor="surface" className="md:col-span-6 accent-strip-green">
              {weatherRec ? (
                <p className="text-sm font-semibold text-farm-soil/85 leading-relaxed">{weatherRec}</p>
              ) : (
                <p className="text-sm text-farm-soil/40 italic">Telemetry unavailable.</p>
              )}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-dashed border-stone-200">
                <span className="bg-stone-50 border border-stone-200 px-2.5 py-1 text-xs text-farm-soil/60 rounded-lg">🌡️ Nominal Temp</span>
                <span className="bg-stone-50 border border-stone-200 px-2.5 py-1 text-xs text-farm-soil/60 rounded-lg">💧 Optimal Humidity</span>
              </div>
            </SectionCard>

            {/* Disease Alerts - Span 6 */}
            <SectionCard icon={AlertTriangle} title="Threat Assessment" badge={diseaseRec ? 'ACTION REQUIRED' : 'ALL CLEAR'} badgeColor={diseaseRec ? 'red' : 'green'} className="md:col-span-6 accent-strip-gold">
              {diseaseRec ? (
                <div className="bg-farm-alert/5 border border-farm-alert/15 rounded-xl p-4 text-farm-soil">
                  <p className="text-sm font-semibold leading-relaxed text-farm-alert">{diseaseRec}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-2 text-farm-tractor h-full py-2">
                  <div className="w-10 h-10 bg-farm-tractor/10 rounded-full flex items-center justify-center text-farm-tractor">
                     <span className="text-lg font-bold">✓</span>
                  </div>
                  <span className="text-sm font-semibold text-farm-soil/80 mt-1">All Threat Vectors Clear</span>
                </div>
              )}
            </SectionCard>

            {/* Farm Recommendations - Span 8 */}
            <SectionCard icon={Lightbulb} title="Operational Directives" className="md:col-span-8 lg:col-span-8 accent-strip-green">
              {farmRecs.length > 0 ? (
                <div className="space-y-3">
                  {farmRecs.map((rec, i) => (
                    <div key={i} className="flex items-start gap-3 bg-stone-50/50 border border-stone-200/60 rounded-2xl p-4 hover:translate-x-1 transition-transform duration-200 shadow-sm">
                      <span className="w-6 h-6 bg-farm-tractor text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                        {i + 1}
                      </span>
                      <p className="text-sm font-semibold text-farm-soil leading-snug">{rec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-farm-soil/45 italic">No directives issued today.</p>
              )}
            </SectionCard>

            {/* Upcoming Tasks - Span 4 */}
            <SectionCard icon={CalendarDays} title="Schedule" badge="UPCOMING" badgeColor="surface" className="md:col-span-4 lg:col-span-4 accent-strip-gold">
              <div className="space-y-3">
                {[
                  { day: 'TODAY',    task: 'Inspect high-risk crops', bg: 'bg-white' },
                  { day: 'TOMORROW', task: 'Schedule irrigation', bg: 'bg-white' },
                  { day: 'LATER',    task: 'Apply treatment', bg: 'bg-stone-50/50' },
                ].map((t, i) => (
                  <div key={i} className={`flex flex-col items-start gap-1.5 ${t.bg} p-4 rounded-2xl border border-stone-200/60 shadow-sm hover:scale-[1.03] transition-transform duration-200`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-farm-wheat bg-farm-wheat/10 px-2 py-0.5 rounded">
                      {t.day}
                    </span>
                    <p className="text-xs font-semibold text-farm-soil leading-snug">{t.task}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
            
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
