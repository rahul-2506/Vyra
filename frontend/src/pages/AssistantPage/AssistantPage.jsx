import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { 
  Send, Mic, Image as ImageIcon, StopCircle, RefreshCw, 
  X, Cpu, Brain, CheckCircle2, ArrowUpRight, Gauge 
} from 'lucide-react'
import { staggerContainer, staggerItem, popIn } from '../../lib/animations'
import { sendChatMessage } from '../../services/api'
import AnalysisResultCard from '../../components/ui/AnalysisResultCard'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 px-4 py-3">
      <div className="w-1.5 h-1.5 bg-farm-leaf rounded-full animate-bounce" style={{ animationDelay: '-0.32s' }} />
      <div className="w-1.5 h-1.5 bg-farm-leaf rounded-full animate-bounce" style={{ animationDelay: '-0.16s' }} />
      <div className="w-1.5 h-1.5 bg-farm-leaf rounded-full animate-bounce" />
    </div>
  )
}

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'System online. I am your Vyra agricultural intelligence copilot. How can I assist you with your operations today?',
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  
  const fileInputRef = useRef(null)
  const chatEndRef = useRef(null)
  const location = useLocation()

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => scrollToBottom(), [messages, isTyping])

  // Handle queries passed from the dashboard quick actions
  useEffect(() => {
    if (location.state?.initialQuery) {
      setInput(location.state.initialQuery)
      toast.success(`Loaded query: "${location.state.initialQuery}"`, { icon: '🌱' })
    }
  }, [location.state])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() && !selectedImage) return

    const userMsg = { role: 'user', content: input, image: selectedImage, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setSelectedImage(null)
    setIsTyping(true)

    try {
      const response = await sendChatMessage([...messages, userMsg])
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.content || response.answer,
        analysis: response.analysis,
        timestamp: new Date().toISOString()
      }])
    } catch (err) {
      toast.error('Connection to Vyra Core failed.')
    } finally {
      setIsTyping(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) return toast.error('Images only.')
      const url = URL.createObjectURL(file)
      setSelectedImage(url)
    }
  }

  const removeImage = () => {
    if (selectedImage) URL.revokeObjectURL(selectedImage)
    setSelectedImage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
    if (!isRecording) toast.success('Mic active', { icon: '🎙️' })
    else toast('Recording saved.', { icon: '⏹️' })
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
      
      {/* Left Workspace Panel: Chat (Span 8) */}
      <div className="col-span-12 lg:col-span-8 flex flex-col h-full bg-white border border-stone-200/50 shadow-md rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-50/80 to-white border-b border-stone-200/40 p-4 flex items-center justify-between relative overflow-hidden">
          {/* AI wave overlay vector */}
          <div className="absolute right-0 inset-y-0 opacity-[0.06] pointer-events-none w-1/2 z-0">
            <svg width="100%" height="100%" viewBox="0 0 300 80" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,40 C 75,10 150,70 300,40" stroke="#3A7D80" strokeWidth="2" fill="none" />
              <path d="M 0,30 Q 75,50 150,30 T 300,30" stroke="#E29A45" strokeWidth="1.5" fill="none" />
              <path d="M 0,50 Q 75,20 150,50 T 300,50" stroke="#2E7D32" strokeWidth="1" fill="none" />
            </svg>
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            {/* Pulsing AI Brain Orbit Avatar */}
            <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-farm-leaf via-farm-teal to-farm-yellow p-0.5 shadow-md flex-shrink-0 animate-glow-pulse">
              <div className="w-full h-full bg-stone-900 rounded-full flex items-center justify-center text-white">
                <Brain size={14} className="text-farm-yellow animate-float" />
              </div>
            </div>
            <div className="text-left">
              <h2 className="font-bold text-sm text-farm-soil leading-tight">Vyra Intelligence</h2>
              <span className="text-[9px] font-bold tracking-wider text-farm-leaf uppercase mt-0.5 inline-block">
                Core Responding
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200/60 px-2.5 py-1 rounded-lg">
            <span className="w-1.5 h-1.5 bg-farm-leaf rounded-full animate-ping" />
            <span className="text-[10px] font-bold text-farm-soil/70">Secure Uplink</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-stone-50/15 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user'
              return (
                <motion.div
                  key={idx}
                  variants={popIn}
                  initial="initial"
                  animate="animate"
                  className={cn('flex flex-col max-w-[85%] md:max-w-[75%]', isUser ? 'ml-auto items-end' : 'mr-auto items-start')}
                >
                  <div className={cn('flex items-center gap-2 mb-1.5', isUser ? 'flex-row-reverse' : '')}>
                    {isUser ? (
                      <span className="text-[9px] font-bold tracking-widest text-farm-wheat bg-farm-wheat/10 border border-farm-wheat/20 px-2 py-0.5 rounded-full uppercase">Operator</span>
                    ) : (
                      <span className="text-[9px] font-bold tracking-widest text-farm-teal bg-farm-teal/10 border border-farm-teal/20 px-2 py-0.5 rounded-full uppercase font-sans">Vyra Advisor</span>
                    )}
                    <span className="text-[9px] text-farm-soil/45 font-semibold">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'p-4 shadow-sm text-sm leading-relaxed text-left border',
                      isUser 
                        ? 'bg-farm-teal text-white border-transparent rounded-2xl rounded-tr-none' 
                        : 'bg-white text-farm-soil border-stone-200/50 rounded-2xl rounded-tl-none'
                    )}
                  >
                    {msg.image && (
                      <img src={msg.image} alt="Upload" className="max-w-xs border border-white/20 rounded-xl mb-3 shadow-md" />
                    )}
                    <div className={cn(
                      "prose prose-sm max-w-none prose-headings:font-bold prose-strong:font-bold",
                      isUser ? "prose-p:text-white text-white" : "prose-p:text-farm-soil"
                    )}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>

                  {msg.analysis && (
                    <div className="mt-3 w-full sm:w-[500px]">
                      <AnalysisResultCard analysis={msg.analysis} onSave={() => toast.success('Saved to memory')} />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 max-w-[85%]">
              <div className="w-7 h-7 bg-stone-900 rounded-full flex items-center justify-center text-white border border-white/10 shadow-sm animate-pulse">
                <Brain size={12} className="text-farm-yellow" />
              </div>
              <div className="bg-white border border-stone-200/50 shadow-sm rounded-2xl rounded-tl-none">
                <TypingIndicator />
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-stone-200/60 bg-white relative">
          <AnimatePresence>
            {selectedImage && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                className="absolute -top-28 left-4 p-1.5 bg-white border border-stone-200 rounded-xl shadow-lg"
              >
                <button onClick={removeImage} className="absolute -top-2 -right-2 bg-farm-alert text-white hover:bg-red-600 rounded-full p-1 shadow-sm transition-colors z-10">
                  <X size={14} strokeWidth={2} />
                </button>
                <img src={selectedImage} alt="Preview" className="h-20 object-cover border border-stone-200 rounded-lg" />
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="flex items-center gap-2.5">
            <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-icon flex-shrink-0 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl hover:scale-105 active:scale-95 transition-transform">
              <ImageIcon size={18} strokeWidth={2} className="text-farm-soil/60" />
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Vyra a question..."
              className="input flex-1 font-normal placeholder-farm-soil/30 rounded-xl"
              disabled={isTyping}
            />
            
            <button 
              type="button" 
              onClick={toggleRecording} 
              className={cn(
                'btn-icon flex-shrink-0 border transition-all rounded-xl hover:scale-105 active:scale-95',
                isRecording 
                  ? 'bg-farm-alert border-farm-alert text-white shadow-md animate-pulse hover:bg-farm-alert' 
                  : 'bg-stone-50 text-farm-soil/60 border-stone-200 hover:bg-stone-100 hover:text-farm-soil'
              )}
            >
              {isRecording ? <StopCircle size={18} strokeWidth={2} /> : <Mic size={18} strokeWidth={2} />}
            </button>
            
            <button 
              type="submit" 
              disabled={(!input.trim() && !selectedImage) || isTyping} 
              className="btn-icon flex-shrink-0 bg-farm-tractor border border-farm-tractor text-white hover:bg-farm-tractor/90 hover:text-white disabled:opacity-40 disabled:bg-stone-100 disabled:border-stone-200 disabled:text-stone-400 rounded-xl hover:scale-105 active:scale-95 transition-all"
            >
              {isTyping ? <RefreshCw size={18} strokeWidth={2} className="animate-spin" /> : <Send size={18} strokeWidth={2} className="ml-0.5" />}
            </button>
          </form>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>
      </div>

      {/* Right Sidebar Panel: Context Feed (Span 4) */}
      <div className="col-span-12 lg:col-span-4 hidden lg:flex flex-col gap-6 h-full">
        
        {/* Module 1: AI Confidence & Status (glass-card) */}
        <div className="glass-card accent-strip-green hover-magnetic glow-green p-6 flex flex-col justify-between h-[200px]">
          <div className="flex justify-between items-start">
            <div className="text-left">
              <p className="text-[10px] font-semibold text-farm-soil/50 uppercase tracking-wider">Advisory Telemetry</p>
              <h3 className="text-sm font-bold text-farm-soil mt-0.5">Model Confidence</h3>
            </div>
            <div className="w-8 h-8 rounded-lg bg-farm-leaf/10 text-farm-leaf flex items-center justify-center">
              <Gauge size={16} />
            </div>
          </div>

          <div className="my-2 flex items-center gap-4 text-left">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-stone-100" strokeWidth="5" fill="transparent" />
                <circle cx="32" cy="32" r="28" className="stroke-farm-leaf" strokeWidth="5" fill="transparent"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - 0.95)}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute text-xs font-bold text-farm-soil">95%</span>
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-farm-soil">Optimized Precision</p>
              <p className="text-[10px] text-farm-soil/50 font-normal">Groq LLama 3 correlate models online.</p>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-200/40 text-[10px] text-left text-farm-soil/50">
            System latency: <span className="font-semibold text-farm-soil ml-1">0.32s avg</span>
          </div>
        </div>

        {/* Module 2: Active Directives (clay-card-gold) */}
        <div className="clay-card-gold hover-magnetic glow-gold p-6 flex-1 flex flex-col justify-between text-left">
          <div className="space-y-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-farm-clay/90 bg-farm-clay/10 px-2 py-0.5 rounded border border-farm-clay/20 inline-block">
              Agricultural Directives
            </span>
            <div className="space-y-4 pt-2">
              <div className="flex gap-3 items-start hover:translate-x-1 transition-transform duration-200">
                <div className="w-5 h-5 rounded-full bg-farm-leaf/10 text-farm-leaf flex items-center justify-center mt-0.5">
                  <CheckCircle2 size={12} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-farm-soil">Pathogen Control</p>
                  <p className="text-[10px] text-farm-soil/60 mt-0.5 font-normal">Diagnose rust or blight triggers via Crop Vision scanner upload.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start hover:translate-x-1 transition-transform duration-200">
                <div className="w-5 h-5 rounded-full bg-farm-wheat/10 text-farm-wheat flex items-center justify-center mt-0.5">
                  <ArrowUpRight size={12} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-farm-soil">Irrigation Optimizations</p>
                  <p className="text-[10px] text-farm-soil/60 mt-0.5 font-normal">Maintain 54% Moisture Index relative to weather directives.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-farm-clay/10 text-[10px] text-farm-soil/45 font-medium uppercase tracking-wider">
            Operator log ID: Vyra-Sec-4
          </div>
        </div>

      </div>

    </div>
  )
}
