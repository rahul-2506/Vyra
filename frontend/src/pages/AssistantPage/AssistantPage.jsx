import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { Send, Mic, Image as ImageIcon, StopCircle, RefreshCw, X, ShieldAlert, Cpu } from 'lucide-react'
import { staggerContainer, staggerItem, popIn } from '../../lib/animations'
import { sendChatMessage } from '../../services/api'
import AnalysisResultCard from '../../components/ui/AnalysisResultCard'
import toast from 'react-hot-toast'
import { cn } from '../../lib/utils'

function TypingIndicator() {
  return (
    <div className="flex gap-2 px-3 py-4">
      <div className="thinking-dot" />
      <div className="thinking-dot" />
      <div className="thinking-dot" />
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

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => scrollToBottom(), [messages, isTyping])

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
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto bg-white border-4 border-farm-soil shadow-[8px_8px_0px_#1C1917] overflow-hidden">
      
      {/* Header Tape */}
      <div className="bg-farm-tractor border-b-4 border-farm-soil p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white border-4 border-farm-soil p-1 shadow-[2px_2px_0px_#1C1917]">
            <Cpu size={24} className="text-farm-soil" strokeWidth={3} />
          </div>
          <div>
            <h2 className="font-black text-xl text-farm-soil uppercase tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>VYRA COPILOT</h2>
            <p className="text-[10px] font-bold text-farm-soil uppercase tracking-widest bg-white inline-block px-1 border border-farm-soil">Secure Comms</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border-4 border-farm-soil px-3 py-1 shadow-[2px_2px_0px_#1C1917]">
          <span className="w-3 h-3 bg-farm-tractor border-2 border-farm-soil animate-pulse" />
          <span className="text-xs font-black uppercase text-farm-soil" style={{ fontFamily: "'Space Mono', monospace" }}>Connected</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-farm-canvas space-y-8" 
           style={{ backgroundImage: 'linear-gradient(rgba(28, 25, 23, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(28, 25, 23, 0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user'
            return (
              <motion.div
                key={idx}
                variants={popIn}
                initial="initial"
                animate="animate"
                className={cn('flex flex-col max-w-[85%]', isUser ? 'ml-auto items-end' : 'mr-auto items-start')}
              >
                <div className={cn('flex items-center gap-3 mb-2', isUser ? 'flex-row-reverse' : '')}>
                  {isUser ? (
                     <div className="w-8 h-8 bg-farm-sunburst border-2 border-farm-soil flex items-center justify-center text-xs font-black text-farm-soil shadow-brutal-sm transform rotate-3" style={{ fontFamily: "'Space Mono', monospace" }}>USR</div>
                  ) : (
                     <div className="w-8 h-8 bg-farm-tractor border-2 border-farm-soil text-farm-soil flex items-center justify-center shadow-brutal-sm transform -rotate-3">
                       <Cpu size={16} strokeWidth={3} />
                     </div>
                  )}
                  <span className="text-xs font-bold text-farm-soil/60 uppercase tracking-widest bg-white px-2 border border-farm-soil/20">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div
                  className={cn(
                    'p-5 border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917]',
                    isUser 
                      ? 'bg-farm-sunburst text-farm-soil rounded-tl-xl rounded-bl-xl rounded-br-xl' 
                      : 'bg-white text-farm-soil rounded-tr-xl rounded-bl-xl rounded-br-xl'
                  )}
                >
                  {msg.image && (
                    <img src={msg.image} alt="Upload" className="max-w-xs border-4 border-farm-soil mb-4 shadow-brutal-sm" />
                  )}
                  <div className="prose prose-sm max-w-none prose-p:font-medium prose-p:text-farm-soil prose-headings:font-black prose-headings:font-['Space_Mono'] prose-strong:font-black">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>

                {msg.analysis && (
                  <div className="mt-4 w-full sm:w-[500px]">
                    <AnalysisResultCard analysis={msg.analysis} onSave={() => toast.success('Saved to memory')} />
                  </div>
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 max-w-[85%]">
            <div className="w-8 h-8 bg-farm-tractor border-2 border-farm-soil text-farm-soil flex items-center justify-center shadow-brutal-sm transform -rotate-3">
               <Cpu size={16} strokeWidth={3} />
            </div>
            <div className="bg-white border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917] rounded-tr-xl rounded-bl-xl rounded-br-xl">
              <TypingIndicator />
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <motion.div variants={staggerItem} initial="initial" animate="animate" className="p-4 border-t-4 border-farm-soil bg-white relative">
        <AnimatePresence>
          {selectedImage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute -top-32 left-4 p-2 bg-white border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917]"
            >
              <button onClick={removeImage} className="absolute -top-3 -right-3 bg-farm-alert border-2 border-farm-soil text-white hover:bg-red-600 rounded-none p-1 shadow-brutal-sm transition-colors z-10">
                <X size={16} strokeWidth={3} />
              </button>
              <img src={selectedImage} alt="Preview" className="h-24 object-cover border-2 border-farm-soil" />
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSend} className="flex items-center gap-3">
          <button type="button" onClick={() => fileInputRef.current?.click()} className="btn-icon flex-shrink-0 w-14 h-14 border-4 bg-farm-canvas hover:bg-farm-tractor">
            <ImageIcon size={24} strokeWidth={2.5} className="text-farm-soil" />
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="INPUT QUERY..."
            className="flex-1 bg-white border-4 border-farm-soil px-4 py-3 text-base md:text-lg text-farm-soil placeholder-farm-soil/40 outline-none shadow-[inset_0_4px_8px_rgba(0,0,0,0.05)] focus:shadow-[inset_0_4px_8px_rgba(0,0,0,0.1),_0_0_0_4px_rgba(16,185,129,0.3)] font-bold uppercase tracking-wider"
            style={{ fontFamily: "'Space Mono', monospace" }}
            disabled={isTyping}
          />
          
          <button 
            type="button" 
            onClick={toggleRecording} 
            className={cn('btn-icon flex-shrink-0 w-14 h-14 border-4 transition-colors', isRecording ? 'bg-farm-alert border-farm-soil text-white shadow-brutal animate-pulse' : 'bg-farm-canvas text-farm-soil hover:bg-farm-sunburst')}
          >
            {isRecording ? <StopCircle size={24} strokeWidth={3} /> : <Mic size={24} strokeWidth={2.5} />}
          </button>
          
          <button 
            type="submit" 
            disabled={(!input.trim() && !selectedImage) || isTyping} 
            className="btn-icon flex-shrink-0 w-14 h-14 border-4 bg-farm-soil text-white hover:bg-farm-tractor hover:text-farm-soil disabled:opacity-50 disabled:bg-farm-muted disabled:text-farm-soil/50"
          >
            {isTyping ? <RefreshCw size={24} strokeWidth={3} className="animate-spin" /> : <Send size={24} strokeWidth={3} className="ml-1" />}
          </button>
        </form>
        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
      </motion.div>
    </div>
  )
}
