import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDailyBriefing } from '../../services/api'
import { pageTransition, staggerContainer, staggerItem } from '../../lib/animations'
import { Sun, CloudRain, AlertTriangle, Lightbulb, CalendarDays, RefreshCw, Layers } from 'lucide-react'
import toast from 'react-hot-toast'

function SectionCard({ icon: Icon, title, children, badge, badgeColor = 'green', className = '' }) {
  return (
    <motion.div variants={staggerItem} className={`card-static flex flex-col bg-white border-4 border-farm-soil shadow-[6px_6px_0px_#1C1917] p-0 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b-4 border-farm-soil bg-farm-canvas">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white border-2 border-farm-soil flex items-center justify-center text-farm-soil shadow-[2px_2px_0px_#1C1917] transform -rotate-2">
            <Icon size={20} strokeWidth={3} />
          </div>
          <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>{title}</h3>
        </div>
        {badge && (
          <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest border-2 shadow-[2px_2px_0px_#1C1917] transform rotate-2
            ${badgeColor === 'green' ? 'bg-farm-tractor text-farm-soil border-farm-soil' : 
              badgeColor === 'red' ? 'bg-farm-alert text-white border-farm-soil' : 
              'bg-white text-farm-soil border-farm-soil'}`} style={{ fontFamily: "'Space Mono', monospace" }}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-6 flex-1">
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
    <motion.div {...pageTransition}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 bg-white border-4 border-farm-soil p-6 shadow-[8px_8px_0px_#1C1917]">
        <div>
          <span className="section-eyebrow border-none pl-0 text-farm-sky">AI GENERATED REPORT</span>
          <h1 className="section-title mb-2">DAILY BRIEFING</h1>
          <div className="flex items-center gap-3">
            <p className="text-sm font-black text-farm-soil uppercase tracking-widest bg-farm-canvas border-2 border-farm-soil px-3 py-1 shadow-brutal-sm inline-block" style={{ fontFamily: "'Space Mono', monospace" }}>{today}</p>
            <p className="text-xs font-bold text-farm-soil/80 uppercase">STATUS: {generated ? 'OPTIMIZED' : 'PENDING'}</p>
          </div>
        </div>
        <button
          onClick={fetchBriefing}
          disabled={isLoading}
          className="btn-action w-full md:w-auto px-8 py-4 text-base shadow-[4px_4px_0px_#1C1917] hover:shadow-[6px_6px_0px_#1C1917]"
        >
          {isLoading ? (
            <><RefreshCw size={20} className="animate-spin" strokeWidth={3} /> COMPILING...</>
          ) : (
            <><Layers size={20} strokeWidth={3} /> {generated ? 'RE-COMPILE DATA' : 'GENERATE BRIEFING'}</>
          )}
        </button>
      </div>

      {!isLoading && !briefing && (
        <div className="empty-state h-[50vh]">
          <div className="w-24 h-24 bg-white border-4 border-farm-soil flex items-center justify-center shadow-brutal transform rotate-3 mb-6">
             <Layers size={48} className="text-farm-soil" strokeWidth={3} />
          </div>
          <div className="empty-state-title">No Intelligence Compiled</div>
          <div className="empty-state-desc font-bold text-farm-soil/80">Generate a briefing to get your AI-curated daily action plan.</div>
        </div>
      )}

      {isLoading && <SkeletonBriefing />}

      <AnimatePresence>
        {briefing && !isLoading && (
          <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Summary Banner - Span 12 */}
            <motion.div variants={staggerItem} className="md:col-span-12 card bg-farm-tractor border-4 border-farm-soil shadow-[8px_8px_0px_#1C1917] flex flex-col md:flex-row items-start md:items-center gap-6 relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08] transform -rotate-6 select-none z-0 flex items-center justify-center w-full h-full">
                <span className="text-[100px] md:text-[140px] font-black text-black leading-none tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>
                  CLASSIFIED
                </span>
              </div>
              <div className="w-20 h-20 bg-white border-4 border-farm-soil flex items-center justify-center flex-shrink-0 text-farm-soil shadow-[4px_4px_0px_#1C1917] transform -rotate-3 relative z-10">
                <Sun size={40} strokeWidth={3} />
              </div>
              <div className="bg-white border-4 border-farm-soil p-4 shadow-[4px_4px_0px_#1C1917] flex-1 w-full relative z-10">
                <p className="text-sm font-black uppercase tracking-widest text-farm-tractor mb-2 border-b-4 border-farm-soil pb-1" style={{ fontFamily: "'Space Mono', monospace" }}>Executive Summary</p>
                <p className="text-xl font-bold text-farm-soil leading-tight">{briefing.summary}</p>
              </div>
            </motion.div>

            {/* Weather Outlook - Span 6 */}
            <SectionCard icon={CloudRain} title="Atmospheric Data" badge="LIVE DATA" badgeColor="surface" className="md:col-span-6">
              {weatherRec ? (
                <p className="text-lg text-farm-soil leading-relaxed font-bold">{weatherRec}</p>
              ) : (
                <p className="text-lg font-bold text-farm-soil/50 italic">Telemetry unavailable.</p>
              )}
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t-4 border-farm-soil border-dashed">
                <span className="bg-white px-3 py-2 border-2 border-farm-soil text-sm font-black text-farm-soil shadow-[2px_2px_0px_#1C1917] uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>🌡️ NOMINAL TEMP</span>
                <span className="bg-white px-3 py-2 border-2 border-farm-soil text-sm font-black text-farm-soil shadow-[2px_2px_0px_#1C1917] uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>💧 OPTIMAL HUMIDITY</span>
              </div>
            </SectionCard>

            {/* Disease Alerts - Span 6 */}
            <SectionCard icon={AlertTriangle} title="Threat Assessment" badge={diseaseRec ? 'ACTION REQ' : 'ALL CLEAR'} badgeColor={diseaseRec ? 'red' : 'green'} className="md:col-span-6">
              {diseaseRec ? (
                <div className="bg-farm-alert border-4 border-farm-soil p-5 shadow-[4px_4px_0px_#1C1917] text-white">
                  <p className="text-lg font-bold leading-relaxed">{diseaseRec}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-3 text-farm-tractor h-full">
                  <div className="w-16 h-16 bg-farm-tractor border-4 border-farm-soil flex items-center justify-center shadow-[4px_4px_0px_#1C1917] transform rotate-3">
                     <span className="text-3xl font-black text-white">✓</span>
                  </div>
                  <span className="font-black text-xl text-farm-soil uppercase tracking-widest mt-2" style={{ fontFamily: "'Space Mono', monospace" }}>All Threat Vectors Clear</span>
                </div>
              )}
            </SectionCard>

            {/* Farm Recommendations - Span 8 */}
            <SectionCard icon={Lightbulb} title="Operational Directives" className="md:col-span-8 lg:col-span-8">
              {farmRecs.length > 0 ? (
                <div className="space-y-4">
                  {farmRecs.map((rec, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white border-2 border-farm-soil shadow-[2px_2px_0px_#1C1917] p-4 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1C1917] transition-all">
                      <span className="w-8 h-8 bg-farm-tractor border-2 border-farm-soil text-farm-soil text-base font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow-brutal-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
                        {i + 1}
                      </span>
                      <p className="text-base font-bold text-farm-soil leading-tight">{rec}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-lg font-bold text-farm-soil/50 italic">No directives issued today.</p>
              )}
            </SectionCard>

            {/* Upcoming Tasks - Span 4 */}
            <SectionCard icon={CalendarDays} title="Schedule" badge="UPCOMING" badgeColor="surface" className="md:col-span-4 lg:col-span-4 bg-farm-sunburst">
              <div className="space-y-4">
                {[
                  { day: 'TODAY',    task: 'Inspect high-risk crops', bg: 'bg-white' },
                  { day: 'TOMORROW', task: 'Schedule irrigation', bg: 'bg-white' },
                  { day: 'LATER',    task: 'Apply treatment', bg: 'bg-farm-canvas' },
                ].map((t, i) => (
                  <div key={i} className={`flex flex-col items-start gap-2 ${t.bg} border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917] p-4`}>
                    <span className="text-xs font-black uppercase tracking-widest text-farm-soil bg-farm-sunburst px-2 border-2 border-farm-soil" style={{ fontFamily: "'Space Mono', monospace" }}>
                      {t.day}
                    </span>
                    <p className="text-base font-bold text-farm-soil leading-tight">{t.task}</p>
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
