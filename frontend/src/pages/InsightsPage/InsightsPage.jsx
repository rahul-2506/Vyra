import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { sendCropDiagnosis } from '../../services/api'
import { pageTransition, popIn } from '../../lib/animations'
import AnalysisResultCard from '../../components/ui/AnalysisResultCard'
import { UploadCloud, Camera, Leaf, Droplets, Map as MapIcon, RefreshCw, Layers } from 'lucide-react'
import toast from 'react-hot-toast'

export default function InsightsPage() {
  const [image, setImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const fileInputRef = useRef(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      toast.error('Only image uploads supported')
      return
    }

    const url = URL.createObjectURL(file)
    setImage(url)
    setResult(null)
    setIsAnalyzing(true)

    try {
      const data = await sendCropDiagnosis(file)
      setResult(data)
    } catch (err) {
      toast.error('Scan failed. Ensure image is clear.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const triggerUpload = () => fileInputRef.current?.click()

  const resetScanner = () => {
    if (image) URL.revokeObjectURL(image)
    setImage(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <motion.div {...pageTransition}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 bg-white border-4 border-farm-soil p-6 shadow-brutal">
        <div>
          <span className="section-eyebrow border-none pl-0 text-farm-tractor">COMPUTER VISION MODULE</span>
          <h1 className="section-title mb-0">CROP SCANNER</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-black uppercase text-farm-soil bg-farm-tractor border-2 border-farm-soil px-3 py-1 shadow-[2px_2px_0px_#1C1917]" style={{ fontFamily: "'Space Mono', monospace" }}>VYRA AI</span>
          <span className="text-xs font-black uppercase text-white bg-farm-soil px-3 py-1 border-2 border-farm-soil shadow-[2px_2px_0px_#10B981]" style={{ fontFamily: "'Space Mono', monospace" }}>VISION V1</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Scanner Terminal */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white border-4 border-farm-soil p-6 shadow-brutal flex flex-col">
            <h2 className="text-sm font-black text-farm-soil uppercase tracking-widest flex items-center gap-3 mb-6 border-b-4 border-farm-soil pb-4" style={{ fontFamily: "'Space Mono', monospace" }}>
              <Camera size={24} strokeWidth={3} /> Uplink Feed
            </h2>
            
            {/* The Dropzone / Scanner */}
            <div 
              className={`relative border-4 border-dashed border-farm-soil transition-all duration-300 flex-1 min-h-[400px] flex flex-col items-center justify-center p-6 cursor-pointer bg-farm-canvas overflow-hidden ${isAnalyzing ? 'animate-pulse bg-farm-tractor/20' : 'hover:bg-farm-tractor/10'}`}
              onClick={!image ? triggerUpload : undefined}
            >
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              
              <AnimatePresence>
                {!image && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-white border-4 border-farm-soil flex items-center justify-center shadow-brutal mb-6 transform hover:rotate-6 transition-transform">
                      <UploadCloud size={48} className="text-farm-soil" strokeWidth={2.5} />
                    </div>
                    <p className="text-2xl font-black text-farm-soil mb-2 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>Initiate Scan</p>
                    <p className="text-sm text-farm-soil/70 font-bold max-w-sm">Upload crop imagery for AI diagnostics. Supports JPEG/PNG.</p>
                  </motion.div>
                )}

                {image && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10 p-2">
                    <img src={image} alt="Target" className="w-full h-full object-cover border-4 border-farm-soil shadow-[inset_0_0_0_4px_#FDFBF7]" />
                    
                    {/* Brutal Scanning HUD */}
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-farm-tractor/20 z-20 overflow-hidden pointer-events-none">
                        <div className="w-full h-4 bg-farm-tractor/80 border-b-4 border-farm-soil shadow-[0_0_30px_#10B981] animate-[slideDown_2s_ease-in-out_infinite]" />
                        <div className="absolute top-4 left-4 bg-white border-2 border-farm-soil px-3 py-1 font-black text-farm-soil text-sm uppercase shadow-[2px_2px_0px_#1C1917]" style={{ fontFamily: "'Space Mono', monospace" }}>ANALYZING...</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                          <Layers size={64} className="text-farm-tractor animate-spin opacity-80" strokeWidth={2} />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button onClick={triggerUpload} className="btn-primary flex-1 py-4 text-base shadow-[4px_4px_0px_#1C1917]" disabled={isAnalyzing}>
                <UploadCloud size={20} strokeWidth={3} /> {image ? 'UPLOAD NEW' : 'BROWSE'}
              </button>
              {image && (
                <button onClick={resetScanner} className="btn-secondary py-4 px-6 shadow-[4px_4px_0px_#1C1917]" disabled={isAnalyzing}>
                  <RefreshCw size={20} strokeWidth={3} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results / Extra Panels */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div key="analyzing" variants={popIn} initial="initial" animate="animate" exit="exit" className="bg-farm-sunburst border-4 border-farm-soil p-8 shadow-brutal flex flex-col items-center justify-center min-h-[300px] text-center">
                <RefreshCw size={48} className="text-farm-soil animate-spin mb-6" strokeWidth={2} />
                <h3 className="text-2xl font-black text-farm-soil uppercase tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>Processing Telemetry</h3>
                <p className="text-base font-bold text-farm-soil/80 mt-2">Correlating visual markers with disease databases...</p>
              </motion.div>
            )}
            
            {result && !isAnalyzing && (
              <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <AnalysisResultCard analysis={result} onSave={() => toast.success('Saved to memory')} />
              </motion.div>
            )}

            {!result && !isAnalyzing && (
              <motion.div key="placeholder" variants={popIn} initial="initial" animate="animate" exit="exit" className="bg-white border-4 border-farm-soil shadow-brutal p-8">
                <h3 className="text-lg font-black text-farm-soil uppercase mb-6 tracking-widest border-b-4 border-farm-soil pb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Capabilities</h3>
                <div className="space-y-6">
                  {[
                    { icon: Leaf, title: 'Disease Detection', desc: 'Identify blights, rusts, and fungal infections instantly.' },
                    { icon: Droplets, title: 'Nutrient Deficiency', desc: 'Analyze leaf discoloration for N-P-K shortages.' },
                    { icon: MapIcon, title: 'Pest Identification', desc: 'Spot invasive insects and recommend countermeasures.' },
                  ].map((cap, i) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <div className="w-12 h-12 bg-farm-canvas border-2 border-farm-soil flex items-center justify-center text-farm-soil shadow-[2px_2px_0px_#1C1917] flex-shrink-0 group-hover:bg-farm-tractor transition-colors">
                        <cap.icon size={20} strokeWidth={3} />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-farm-soil uppercase tracking-tight" style={{ fontFamily: "'Space Mono', monospace" }}>{cap.title}</h4>
                        <p className="text-sm text-farm-soil/80 font-bold leading-tight mt-1">{cap.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  )
}
