import React, { useState, useRef } from 'react'
import { Mic, Square, Loader2, FileAudio } from 'lucide-react'
import { sendVoiceQuery } from '../../services/api'
import AnalysisCard from '../AnalysisCard/AnalysisCard'

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const file = new File([audioBlob], 'voice_query.webm', { type: 'audio/webm' })
        await handleVoiceSubmit(file)
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setError(null)
      setResult(null)
    } catch (err) {
      setError("Microphone access denied or unavailable. Please check your browser permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  const handleVoiceSubmit = async (file) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await sendVoiceQuery(file)
      setResult(data)
    } catch (err) {
      setError(err.message || "Failed to process voice query.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto items-center py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-farm-soil mb-3">Ask Vyra</h2>
        <p className="text-farm-soil/70 font-medium max-w-md mx-auto">
          Tap the microphone and describe your farm issue, ask about weather, or log recent activity.
        </p>
      </div>

      {/* Giant Microphone Button */}
      <div className="relative mb-12">
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-farm-alert/20 animate-ping" style={{ transform: 'scale(1.5)' }} />
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
          className={`relative z-10 w-56 h-56 rounded-full flex flex-col items-center justify-center text-white shadow-xl transition-all duration-300 border-none outline-none ${
            isLoading ? 'bg-farm-muted cursor-not-allowed' :
            isRecording ? 'bg-farm-alert hover:bg-farm-alert/90 scale-105' : 
            'bg-farm-tractor hover:bg-farm-tractor/90 hover:scale-105'
          }`}
        >
          {isLoading ? (
            <Loader2 size={72} className="animate-spin text-farm-soil" />
          ) : isRecording ? (
            <Square size={72} fill="currentColor" />
          ) : (
            <Mic size={96} />
          )}
          
          <span className="mt-4 font-bold tracking-wide text-lg uppercase">
            {isLoading ? 'Analyzing...' : isRecording ? 'Tap to Stop' : 'Tap to Speak'}
          </span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="w-full bg-farm-alert/10 border-2 border-farm-alert text-farm-alert rounded-2xl p-4 text-center font-semibold animate-fade-in mb-8">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="w-full animate-slide-up space-y-6">
          <div className="bg-white rounded-2xl p-6 border-2 border-farm-muted shadow-sm">
             <div className="flex items-center gap-2 text-farm-soil/70 font-semibold mb-2 uppercase text-sm tracking-wide">
                <FileAudio size={16} /> Transcript
             </div>
             <p className="text-xl font-medium text-farm-soil italic">"{result.transcript}"</p>
          </div>

          <AnalysisCard analysis={result.analysis} />
        </div>
      )}
    </div>
  )
}
