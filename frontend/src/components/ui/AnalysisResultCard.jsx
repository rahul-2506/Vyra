import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../../lib/animations'
import { AlertCircle, FileText, CheckCircle2, Save, Share2, PlusCircle } from 'lucide-react'
import { getRiskLevel, truncate } from '../../lib/utils'

export default function AnalysisResultCard({ analysis, onSave, onShare, showActions = true }) {
  if (!analysis) return null

  const riskLevel = getRiskLevel(analysis.risk)
  const isHighRisk = riskLevel === 'high'

  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="bg-white border-4 border-farm-soil p-6 shadow-brutal space-y-5 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.05] transform -rotate-12 select-none z-0 flex items-center justify-center w-full h-full">
        <span className="text-[120px] font-black text-black leading-none tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>
          SCANNED
        </span>
      </div>

      {/* Header section */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b-4 border-farm-soil pb-4 relative z-10">
        <div>
          <h3 className="text-2xl font-black text-farm-soil uppercase tracking-tighter flex items-center gap-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            <AlertCircle size={24} className={isHighRisk ? 'text-farm-alert' : 'text-farm-sunburst'} strokeWidth={3} />
            {analysis.issue}
          </h3>
          {analysis.crop && (
            <p className="text-sm font-bold text-farm-soil/70 mt-1 uppercase tracking-widest bg-farm-canvas inline-block px-2 py-0.5 border-2 border-farm-soil">
              {analysis.crop}
            </p>
          )}
        </div>
        
        {/* Risk Badge */}
        <div className={`px-4 py-2 border-2 border-farm-soil font-black uppercase tracking-widest flex items-center gap-2 transform rotate-2 shadow-brutal-sm
          ${riskLevel === 'high' ? 'bg-farm-alert text-white' : 
            riskLevel === 'medium' ? 'bg-farm-sunburst text-farm-soil' : 
            'bg-farm-tractor text-farm-soil'}`}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {riskLevel === 'high' && <span className="w-2 h-2 bg-white rounded-full animate-ping" />}
          {riskLevel} RISK
        </div>
      </motion.div>

      {/* Grid layout for details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 relative z-10">
        {/* Details Card */}
        <motion.div variants={staggerItem} className="bg-farm-canvas border-2 border-farm-soil p-4 shadow-brutal-sm">
          <h4 className="text-sm font-bold uppercase tracking-widest text-farm-soil/80 mb-2 flex items-center gap-1.5 border-b-2 border-farm-soil/20 pb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
            <FileText size={16} /> Analysis Report
          </h4>
          <p className="text-sm text-farm-soil leading-relaxed font-medium">
            {analysis.details || truncate(analysis.disease_info || 'No detailed analysis provided for this condition.', 150)}
          </p>
        </motion.div>

        {/* Recommendation Card */}
        {analysis.recommendation && (
          <motion.div variants={staggerItem} className="bg-farm-tractor/20 border-2 border-farm-soil p-4 shadow-brutal-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-farm-soil mb-2 flex items-center gap-1.5 border-b-2 border-farm-soil/20 pb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                <CheckCircle2 size={16} /> Action Directive
              </h4>
              <p className="text-sm text-farm-soil leading-relaxed font-bold">
                {analysis.recommendation}
              </p>
            </div>
            {analysis.confidence && (
               <div className="mt-4 pt-2 border-t-2 border-farm-soil/20 text-xs text-farm-soil font-bold uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                 Confidence Level: <span className="text-xl font-black bg-farm-tractor px-2 py-0.5 ml-2 border border-farm-soil">{analysis.confidence}%</span>
               </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-3 pt-4 border-t-4 border-farm-soil mt-4 relative z-10">
          <button className="btn-action flex-1" onClick={onSave}>
            <Save size={18} strokeWidth={2.5} /> Log to Memory
          </button>
          <button className="btn-icon">
            <Share2 size={18} strokeWidth={2.5} />
          </button>
          <button className="btn-icon">
            <PlusCircle size={18} strokeWidth={2.5} />
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
