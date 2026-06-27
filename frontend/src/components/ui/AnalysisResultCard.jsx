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
      className="card space-y-5 relative overflow-hidden"
    >
      {/* Header section */}
      <motion.div variants={staggerItem} className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b border-stone-100 pb-4 relative z-10">
        <div>
          <h3 className="text-lg font-semibold text-farm-soil flex items-center gap-2">
            <AlertCircle size={20} className={isHighRisk ? 'text-farm-alert' : 'text-farm-sunburst'} strokeWidth={2} />
            {analysis.issue}
          </h3>
          {analysis.crop && (
            <Badge variant="surface" className="mt-1 text-xs">
              🌾 {analysis.crop}
            </Badge>
          )}
        </div>
        
        {/* Risk Badge */}
        <div className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1.5
          ${riskLevel === 'high' ? 'bg-farm-alert/10 text-farm-alert' : 
            riskLevel === 'medium' ? 'bg-farm-sunburst/10 text-farm-sunburst' : 
            'bg-farm-tractor/10 text-farm-tractor'}`}
        >
          {riskLevel === 'high' && <span className="w-1.5 h-1.5 bg-farm-alert rounded-full animate-pulse" />}
          {riskLevel.toUpperCase()} RISK
        </div>
      </motion.div>

      {/* Grid layout for details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 relative z-10">
        {/* Details Card */}
        <motion.div variants={staggerItem} className="bg-stone-50/50 border border-stone-200/50 p-4 rounded-xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-farm-soil/75 mb-2 flex items-center gap-1.5 border-b border-stone-200/30 pb-2">
            <FileText size={14} /> Analysis Report
          </h4>
          <p className="text-sm text-farm-soil/95 leading-relaxed font-normal">
            {analysis.details || truncate(analysis.disease_info || 'No detailed analysis provided for this condition.', 150)}
          </p>
        </motion.div>

        {/* Recommendation Card */}
        {analysis.recommendation && (
          <motion.div variants={staggerItem} className="bg-farm-tractor/5 border border-farm-tractor/15 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-farm-tractor mb-2 flex items-center gap-1.5 border-b border-farm-tractor/10 pb-2">
                <CheckCircle2 size={14} /> Action Directive
              </h4>
              <p className="text-sm text-farm-soil leading-relaxed font-medium">
                {analysis.recommendation}
              </p>
            </div>
            {analysis.confidence && (
               <div className="mt-4 pt-2.5 border-t border-farm-tractor/10 text-xs text-farm-soil/60 font-medium">
                 Confidence score: <span className="text-sm font-semibold text-farm-tractor ml-1">{analysis.confidence}%</span>
               </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      {showActions && (
        <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-2.5 pt-4 border-t border-stone-100 mt-4 relative z-10">
          <button className="btn-primary flex-1" onClick={onSave}>
            <Save size={16} strokeWidth={2} /> Log to Memory
          </button>
          <button className="btn-icon">
            <Share2 size={16} strokeWidth={2} />
          </button>
          <button className="btn-icon">
            <PlusCircle size={16} strokeWidth={2} />
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
