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
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  // Initialize recent scans from localStorage
  const [recentScans, setRecentScans] = useState(() => {
    try {
      const saved = localStorage.getItem('vyra_recent_scans')
      return saved ? JSON.parse(saved) : []
    } catch (e) {
      return []
    }
  })

  // Save scan to localStorage history (up to 3 items)
  const saveScanToHistory = (scanName, scanResult, imgUrl) => {
    const newScan = {
      id: Date.now(),
      name: scanName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      result: scanResult,
      image: imgUrl
    }
    setRecentScans(prev => {
      const updated = [newScan, ...prev.filter(s => s.name !== scanName)].slice(0, 3)
      try {
        localStorage.setItem('vyra_recent_scans', JSON.stringify(updated))
      } catch (e) {
        console.error(e)
      }
      return updated
    })
  }

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
      saveScanToHistory(file.name === 'blob' ? 'Custom Scan' : file.name.substring(0, 22), data, url)
    } catch (err) {
      toast.error('Scan failed. Ensure image is clear.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
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
      saveScanToHistory(file.name.substring(0, 22), data, url)
    } catch (err) {
      toast.error('Scan failed. Ensure image is clear.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const triggerUpload = () => fileInputRef.current?.click()

  // Mobile camera mode
  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment')
      fileInputRef.current.click()
      setTimeout(() => {
        fileInputRef.current?.removeAttribute('capture')
      }, 1000)
    }
  }

  // Draw crop symptoms on a canvas and submit to API
  const runExampleScan = async (diseaseName, colorBase, spotColor, spotCount) => {
    setResult(null)
    setIsAnalyzing(true)
    
    // Create leaf canvas
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 400
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 400, 400)
      grad.addColorStop(0, '#EBF2F8')
      grad.addColorStop(1, '#D5F5E3')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 400, 400)
      
      // Leaf shape
      ctx.beginPath()
      ctx.moveTo(200, 40)
      ctx.quadraticCurveTo(370, 140, 200, 360)
      ctx.quadraticCurveTo(30, 140, 200, 40)
      ctx.closePath()
      ctx.fillStyle = colorBase
      ctx.fill()
      
      // Leaf veins
      ctx.beginPath()
      ctx.moveTo(200, 40)
      ctx.lineTo(200, 360)
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'
      ctx.lineWidth = 5
      ctx.stroke()
      
      for (let y = 100; y < 320; y += 45) {
        ctx.beginPath()
        ctx.moveTo(200, y)
        ctx.lineTo(200 + (y % 90 === 0 ? 85 : -85), y + 35)
        ctx.stroke()
      }
      
      // Spots representing disease
      ctx.fillStyle = spotColor
      for (let k = 0; k < spotCount; k++) {
        const xOffset = 200 + (Math.sin(k * 2.3) * 65)
        const yOffset = 110 + (k * 45)
        ctx.beginPath()
        ctx.arc(xOffset, yOffset, 14 + (k % 3) * 5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.strokeStyle = 'rgba(0,0,0,0.18)'
        ctx.lineWidth = 2.5
        ctx.stroke()
      }
    }
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsAnalyzing(false)
        return
      }
      const file = new File([blob], `${diseaseName.toLowerCase().replace(' ', '_')}.png`, { type: 'image/png' })
      const url = URL.createObjectURL(file)
      setImage(url)
      
      try {
        const data = await sendCropDiagnosis(file)
        setResult(data)
        saveScanToHistory(diseaseName, data, url)
      } catch (err) {
        toast.error('Mock scan failed')
      } finally {
        setIsAnalyzing(false)
      }
    }, 'image/png')
  }

  const resetScanner = () => {
    if (image && !recentScans.some(s => s.image === image)) {
      URL.revokeObjectURL(image)
    }
    setImage(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <motion.div {...pageTransition} className="pb-16 space-y-6">
      
      {/* Immersive Diagnostics Hero */}
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
        
        {/* Scanner Terminal (Span 7) - Premium Redesigned Upload Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-card accent-strip-green p-6 flex flex-col relative overflow-hidden bg-white/40 border border-white/40 backdrop-blur-xl shadow-2xl rounded-3xl transition-all duration-300">
            
            {/* Subtle Agricultural illustration in background */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0 flex items-center justify-center">
              <svg width="250" height="250" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-farm-tractor">
                <path d="M50,10 C68,30 68,70 50,90 C32,70 32,30 50,10 Z" strokeWidth="1.5" />
                <path d="M50,10 L50,90" strokeWidth="1" strokeDasharray="2,2" />
                <path d="M50,30 C62,35 67,45 67,55" strokeWidth="1" />
                <path d="M50,45 C38,50 33,60 33,70" strokeWidth="1" />
                <path d="M50,60 C62,65 67,75 67,85" strokeWidth="1" />
              </svg>
            </div>

            <h2 className="text-sm font-bold text-farm-soil flex items-center gap-2 mb-6 border-b border-stone-200/50 pb-4 text-left relative z-10">
              <Camera size={18} className="text-farm-soil/55" /> Uplink Feed
            </h2>
            
            {/* The Dropzone / Scanner */}
            <div 
              className={`relative border-2 rounded-2xl transition-all duration-300 flex-1 min-h-[360px] flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden relative z-10 ${
                isDragging 
                  ? 'border-farm-leaf bg-white/70 scale-[1.01] shadow-[0_0_35px_rgba(36,155,85,0.18)] border-tracing' 
                  : image 
                  ? 'border-stone-200 bg-white/10' 
                  : 'border-stone-200/80 hover:bg-white/50 hover:border-stone-300 hover:shadow-md border-tracing bg-white/20'
              }`}
              onClick={!image ? triggerUpload : undefined}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
              
              {/* Soft Gradient Lighting bloom */}
              <div className="absolute w-60 h-60 bg-[radial-gradient(circle_at_center,rgba(36,155,85,0.15),transparent_70%)] opacity-80 pointer-events-none" />

              <AnimatePresence>
                {!image && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center text-center relative z-10 py-6">
                    <div className="w-18 h-18 bg-white/95 border border-white/80 flex items-center justify-center rounded-2xl shadow-md mb-6 hover:scale-105 transition-transform group">
                      <UploadCloud size={28} className="text-farm-tractor animate-bounce" style={{ animationDuration: '3.5s' }} />
                    </div>
                    <p className="text-lg font-extrabold text-farm-soil mb-2">Initiate Telemetry Scan</p>
                    <p className="text-xs text-farm-soil/75 max-w-xs font-semibold leading-relaxed mb-4">
                      Vyra AI is ready to diagnose leaf pathogens, mineral shortages, and pest hazards. Drag and drop leaf imagery here or click to browse.
                    </p>
                    <span className="text-[9px] font-extrabold text-farm-tractor/70 bg-farm-tractor/5 px-2.5 py-1 rounded-full uppercase border border-farm-tractor/10">
                      Supports JPEG, PNG, HEIC (Max 10MB)
                    </span>
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
            
            <div className="flex gap-4 mt-6 relative z-10">
              <button onClick={triggerUpload} className="btn-primary flex-1 py-3.5 hover-magnetic shadow-md" disabled={isAnalyzing}>
                <UploadCloud size={16} strokeWidth={2} /> {image ? 'Scan New' : 'Browse Files'}
              </button>
              
              {/* Take Photo Action Button for mobile camera */}
              <button onClick={triggerCamera} className="btn-secondary py-3.5 px-4 hover-magnetic shadow-sm flex items-center gap-1.5 text-farm-soil font-extrabold" disabled={isAnalyzing}>
                <Camera size={16} strokeWidth={2} />
                <span className="hidden sm:inline">Take Photo</span>
              </button>

              {image && (
                <button onClick={resetScanner} className="btn-secondary py-3.5 px-4 hover-magnetic shadow-sm" disabled={isAnalyzing}>
                  <RefreshCw size={16} strokeWidth={2} />
                </button>
              )}
            </div>

            {/* Quick Example Images Section */}
            {!image && (
              <div className="mt-6 pt-5 border-t border-stone-200/50 relative z-10 text-left">
                <p className="text-[10px] font-extrabold text-farm-soil/50 uppercase tracking-widest mb-3">Quick Example Scans</p>
                <div className="flex flex-wrap gap-2.5">
                  <button 
                    onClick={() => runExampleScan('Tomato Blight', '#4ADE80', '#451A03', 4)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-stone-200 hover:border-farm-leaf hover:bg-white text-xs font-bold text-farm-soil transition-all hover:scale-105"
                    disabled={isAnalyzing}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] shadow-sm" />
                    Tomato Blight
                  </button>
                  <button 
                    onClick={() => runExampleScan('Wheat Rust', '#F5B041', '#A04000', 5)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-stone-200 hover:border-farm-leaf hover:bg-white text-xs font-bold text-farm-soil transition-all hover:scale-105"
                    disabled={isAnalyzing}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F5B041] shadow-sm" />
                    Wheat Rust
                  </button>
                  <button 
                    onClick={() => runExampleScan('Corn Spot', '#A3E4D7', '#5B2C6F', 3)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-stone-200 hover:border-farm-leaf hover:bg-white text-xs font-bold text-farm-soil transition-all hover:scale-105"
                    disabled={isAnalyzing}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A3E4D7] shadow-sm" />
                    Corn Spot
                  </button>
                </div>
              </div>
            )}

            {/* Recent Scans shortcut list */}
            {recentScans.length > 0 && !image && (
              <div className="mt-5 pt-4 border-t border-stone-200/50 relative z-10 text-left">
                <p className="text-[10px] font-extrabold text-farm-soil/50 uppercase tracking-widest mb-3">Recent Scans</p>
                <div className="space-y-2">
                  {recentScans.map((scan) => (
                    <div 
                      key={scan.id}
                      onClick={() => {
                        setImage(scan.image)
                        setResult(scan.result)
                      }}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/60 hover:bg-white border border-stone-200/60 hover:border-stone-300 cursor-pointer transition-all duration-200 hover:translate-x-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-farm-tractor/10 text-farm-tractor flex items-center justify-center font-bold text-[10px]">
                          🔬
                        </div>
                        <div>
                          <p className="text-xs font-bold text-farm-soil">{scan.name}</p>
                          <p className="text-[9px] font-semibold text-farm-soil/45">{scan.timestamp}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold text-farm-leaf bg-farm-leaf/10 px-2 py-0.5 rounded-full uppercase">
                        Load Scan
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
              <motion.div key="placeholder" variants={popIn} initial="initial" animate="animate" exit="exit" className="glass-card accent-strip-gold p-6 bg-white/40 border border-white/40 backdrop-blur-xl shadow-2xl rounded-3xl relative overflow-hidden flex flex-col min-h-[480px]">
                
                {/* Technical circular radar telemetry scan illustration to reduce empty space */}
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none z-0 flex items-center justify-center">
                  <svg width="280" height="280" viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-farm-wheat animate-telemetry">
                    <circle cx="50" cy="50" r="45" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="30" strokeWidth="0.5" strokeDasharray="1,3" />
                    <circle cx="50" cy="50" r="15" strokeWidth="0.5" />
                    <line x1="50" y1="0" x2="50" y2="100" strokeWidth="0.5" />
                    <line x1="0" y1="50" x2="100" y2="50" strokeWidth="0.5" />
                    <path d="M50,50 L80,30" strokeWidth="0.75" strokeLinecap="round" className="origin-center animate-[radar-slow_8s_linear_infinite]" />
                  </svg>
                </div>

                <h3 className="text-sm font-bold text-farm-soil mb-6 border-b border-stone-200/50 pb-4 text-left relative z-10">
                  Diagnostic Capabilities
                </h3>

                {/* Crop Health Visualization Mock telemetry graph */}
                <div className="bg-stone-900/5 border border-stone-200/40 rounded-2xl p-4 mb-6 relative z-10 backdrop-blur-sm">
                  <p className="text-[9px] font-extrabold text-farm-soil/45 uppercase tracking-widest mb-3">AI Diagnostic Telemetry Feed</p>
                  <div className="h-16 flex items-end gap-1.5 px-2">
                    {[35, 60, 45, 80, 55, 95, 75, 40, 65, 85, 50, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-farm-tractor/50 to-farm-leaf/80 rounded-t-sm" style={{ height: `${h}%` }}>
                        <div className="w-full h-0.5 bg-farm-yellow/80 shadow-[0_0_4px_rgba(245,176,65,0.8)]" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] font-extrabold text-farm-soil/40 mt-2 px-1">
                    <span>N - MINERALS</span>
                    <span>P - MOISTURE</span>
                    <span>K - VECTOR</span>
                  </div>
                </div>

                <div className="space-y-6 text-left relative z-10 flex-1">
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
                        <h4 className="text-sm font-bold text-farm-soil">{cap.title}</h4>
                        <p className="text-xs text-farm-soil/65 font-medium leading-relaxed mt-1">{cap.desc}</p>
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
