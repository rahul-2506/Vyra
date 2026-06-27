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
    <motion.div {...pageTransition} className="pb-16 space-y-6">
      
      {/* Immersive Diagnostics Hero (Span 12) */}
      <div className="relative overflow-hidden rounded-[28px] bg-forest-gradient text-white shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-farm-leaf/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 top-10 w-24 h-24 bg-farm-sky/5 rounded-full blur-2xl animate-float" />
        
        {/* Topographic Contour lines overlay */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50,150 C 150,100 200,300 450,250 C 650,200 700,400 950,350" fill="none" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M 100,200 C 200,150 250,350 500,300 C 700,250 750,450 1000,400" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M 0,100 C 100,50 150,250 400,200 C 600,150 650,350 900,300" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="text-left space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest text-farm-yellow bg-farm-yellow/10 border border-farm-yellow/20 px-2.5 py-1 rounded-full uppercase">
              Computer Vision Terminal
            </span>
            <span className="w-2 h-2 bg-farm-yellow rounded-full animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">
            Diagnostics Hub
          </h1>
          <p className="text-white/80 text-xs md:text-sm font-normal max-w-lg">
            Diagnose leaf pathogens, map crop rust vectors, and analyze soil mineral density levels using real-time visual telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          <div className="text-right">
            <p className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Engine status</p>
            <p className="text-xs font-bold text-farm-yellow">Vyra Vision v1.2</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-farm-yellow/10 text-farm-yellow flex items-center justify-center">
            <Layers size={16} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Scanner Terminal (Span 7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-card accent-strip-green p-6 flex flex-col">
            <h2 className="text-sm font-bold text-farm-soil flex items-center gap-2 mb-6 border-b border-stone-100 pb-4 text-left">
              <Camera size={18} className="text-farm-soil/55" /> Uplink Feed
            </h2>
            
            {/* The Dropzone / Scanner */}
            <div 
              className={`relative border-2 border-dashed border-stone-250/60 rounded-2xl transition-all duration-300 flex-1 min-h-[400px] flex flex-col items-center justify-center p-6 cursor-pointer bg-stone-50/30 overflow-hidden ${isAnalyzing ? 'animate-pulse bg-farm-tractor/5 border-farm-leaf' : 'hover:bg-stone-50 hover:border-stone-300'}`}
              onClick={!image ? triggerUpload : undefined}
            >
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              
              <AnimatePresence>
                {!image && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white border border-stone-200 flex items-center justify-center rounded-2xl shadow-md mb-4 transition-transform hover:scale-105">
                      <UploadCloud size={24} className="text-farm-soil/50 animate-float" />
                    </div>
                    <p className="text-base font-bold text-farm-soil mb-1">Initiate Telemetry Scan</p>
                    <p className="text-xs text-farm-soil/55 max-w-xs font-normal leading-relaxed">Upload crop leaf imagery for instant AI diagnostics. Supports JPEG or PNG.</p>
                  </motion.div>
                )}

                {image && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-10 p-2">
                    <img src={image} alt="Target" className="w-full h-full object-cover rounded-xl border border-stone-200/60" />
                    
                    {/* Scanning HUD Overlay */}
                    <div className="absolute inset-0 bg-farm-tractor/5 z-20 overflow-hidden pointer-events-none rounded-xl">
                      {/* Interactive crosshair corners */}
                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-farm-yellow" />
                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-farm-yellow" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-farm-yellow" />
                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-farm-yellow" />
                      
                      {isAnalyzing ? (
                        <>
                          <div className="w-full h-1 bg-farm-leaf/80 shadow-[0_0_15px_#2E7D32] animate-[scanline_3s_linear_infinite]" />
                          <div className="absolute top-6 left-6 bg-white/95 backdrop-blur border border-stone-200/50 px-2.5 py-1 font-bold text-farm-soil text-[10px] uppercase rounded shadow-md flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-farm-alert rounded-full animate-ping" />
                            Analyzing HUD Feed...
                          </div>
                        </>
                      ) : (
                        <div className="absolute top-6 left-6 bg-white/95 backdrop-blur border border-stone-200/50 px-2.5 py-1 font-bold text-farm-soil text-[10px] uppercase rounded shadow-md">
                          Feed Lock • 1080P
                        </div>
                      )}
                      
                      {/* Ambient coordinates */}
                      <div className="absolute bottom-6 left-6 text-white text-[9px] font-mono bg-stone-900/60 backdrop-blur px-2 py-0.5 rounded">
                        COORD: 54.1209, -4.2281
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="flex gap-4 mt-6">
              <button onClick={triggerUpload} className="btn-primary flex-1 py-3 hover-magnetic shadow-md" disabled={isAnalyzing}>
                <UploadCloud size={16} strokeWidth={2} /> {image ? 'Upload New Image' : 'Browse Files'}
              </button>
              {image && (
                <button onClick={resetScanner} className="btn-secondary py-3 px-4 hover-magnetic shadow-sm" disabled={isAnalyzing}>
                  <RefreshCw size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results / Extra Panels (Span 5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div key="analyzing" variants={popIn} initial="initial" animate="animate" exit="exit" className="clay-card-gold p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="relative w-16 h-16 mb-6 flex items-center justify-center">
                  <RefreshCw size={36} className="text-farm-clay animate-spin absolute" strokeWidth={2.5} />
                  <Layers size={18} className="text-farm-clay animate-pulse" />
                </div>
                <h3 className="text-base font-bold text-farm-soil uppercase tracking-wider">Processing Telemetry</h3>
                <p className="text-xs font-semibold text-farm-soil/70 mt-2">Correlating visual markers with disease databases...</p>
              </motion.div>
            )}
            
            {result && !isAnalyzing && (
              <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <AnalysisResultCard analysis={result} onSave={() => toast.success('Saved to memory')} />
              </motion.div>
            )}

            {!result && !isAnalyzing && (
              <motion.div key="placeholder" variants={popIn} initial="initial" animate="animate" exit="exit" className="glass-card accent-strip-gold p-6">
                <h3 className="text-sm font-bold text-farm-soil mb-6 border-b border-stone-100 pb-4 text-left">Diagnostic Capabilities</h3>
                <div className="space-y-6 text-left">
                  {[
                    { icon: Leaf, title: 'Disease Detection', desc: 'Identify leaf blights, rusts, and complex fungal infections instantly.' },
                    { icon: Droplets, title: 'Nutrient Deficiency', desc: 'Analyze leaf discoloration indexes for Nitrogen, Phosphorus, and Potassium shortages.' },
                    { icon: MapIcon, title: 'Pest Identification', desc: 'Locate structural anomalies caused by invasive insects and receive countermeasures.' },
                  ].map((cap, i) => (
                    <div key={i} className="flex gap-4 items-start group hover-magnetic glow-teal p-2 rounded-xl transition-all duration-300">
                      <div className="w-10 h-10 bg-white border border-stone-200/60 shadow-sm flex items-center justify-center text-farm-soil/60 rounded-xl flex-shrink-0 group-hover:bg-farm-tractor group-hover:text-white transition-all">
                        <cap.icon size={16} strokeWidth={2} className="group-hover:rotate-12 transition-transform" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-farm-soil">{cap.title}</h4>
                        <p className="text-xs text-farm-soil/60 font-normal leading-relaxed mt-1">{cap.desc}</p>
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
