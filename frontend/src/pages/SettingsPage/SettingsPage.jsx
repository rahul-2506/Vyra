import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageTransition } from '../../lib/animations'
import { Save, User, Bell, Shield, Database, Smartphone, Check, Loader2, Key, Cpu } from 'lucide-react'
import { getProfile, saveProfile } from '../../services/api'
import toast from 'react-hot-toast'

function SettingToggle({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-2 border-farm-soil shadow-[2px_2px_0px_#1C1917] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1C1917] transition-all cursor-pointer" onClick={onToggle}>
      <div className="flex-1 pr-4">
        <h4 className="text-base font-black text-farm-soil uppercase tracking-tighter" style={{ fontFamily: "'Space Mono', monospace" }}>{label}</h4>
        <p className="text-sm text-farm-soil/70 font-bold leading-tight mt-1">{description}</p>
      </div>
      <div className={`w-14 h-8 border-4 border-farm-soil flex items-center p-0.5 transition-colors ${enabled ? 'bg-farm-tractor' : 'bg-farm-muted'}`}>
        <motion.div
          layout
          className={`w-5 h-5 border-2 border-farm-soil bg-white ${enabled ? 'shadow-[2px_2px_0px_#1C1917]' : ''}`}
          initial={false}
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  )
}

function SettingSelect({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border-2 border-farm-soil shadow-[2px_2px_0px_#1C1917]">
      <h4 className="text-base font-black text-farm-soil uppercase tracking-tighter mb-3 sm:mb-0" style={{ fontFamily: "'Space Mono', monospace" }}>{label}</h4>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-48 bg-farm-canvas border-2 border-farm-soil px-3 py-2 text-sm font-black text-farm-soil outline-none shadow-brutal-sm uppercase"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
}

function FieldInput({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div>
      <label className="text-xs font-black uppercase text-farm-soil tracking-widest mb-2 block" style={{ fontFamily: "'Space Mono', monospace" }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input w-full"
      />
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [profile, setProfile] = useState({
    OPERATOR_NAME: '',
    FARM_DESIGNATION: '',
    GROQ_API_KEY: '',
    OPENWEATHER_API_KEY: '',
    GROQ_MODEL: 'llama-3.3-70b-versatile',
    GROQ_VISION_MODEL: 'llama-3.2-11b-vision-preview',
    GROQ_AUDIO_MODEL: 'whisper-large-v3',
  })

  const [prefs, setPrefs] = useState({
    notifications: true,
    autoSync: true,
    dataSharing: false,
    language: 'en',
    units: 'metric',
  })

  // Load profile from backend on mount
  useEffect(() => {
    getProfile()
      .then(data => {
        setProfile(prev => ({ ...prev, ...data }))
      })
      .catch(() => toast.error('Could not load profile settings.'))
      .finally(() => setLoading(false))
  }, [])

  const handleProfileChange = (key, val) => setProfile(p => ({ ...p, [key]: val }))
  const handlePrefsChange = (key, val) => setPrefs(p => ({ ...p, [key]: val }))
  const handleToggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveProfile(profile)
      setSaved(true)
      toast.success('Settings saved!')
      // Notify other components (e.g., Assistant header) that profile changed
      window.dispatchEvent(new Event('profile-updated'))
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      toast.error('Failed to save settings: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general', icon: User, label: 'Profile' },
    { id: 'api', icon: Key, label: 'API Keys' },
    { id: 'model', icon: Cpu, label: 'AI Models' },
    { id: 'preferences', icon: Smartphone, label: 'Preferences' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'data', icon: Database, label: 'Data & Sync' },
  ]

  const initials = profile.OPERATOR_NAME
    ? profile.OPERATOR_NAME.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'OP'

  const SaveBtn = ({ className = '' }) => (
    <button
      onClick={handleSave}
      disabled={saving || loading}
      className={`btn-primary shadow-[4px_4px_0px_#1C1917] flex items-center gap-2 ${className}`}
    >
      {saving ? (
        <Loader2 size={18} className="animate-spin" />
      ) : saved ? (
        <Check size={18} strokeWidth={3} />
      ) : (
        <Save size={18} strokeWidth={3} />
      )}
      {saving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE CHANGES'}
    </button>
  )

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white border-4 border-farm-soil p-6 shadow-brutal">
        <div>
          <span className="section-eyebrow border-none pl-0 text-farm-sunburst">SYSTEM CONFIGURATION</span>
          <h1 className="section-title mb-0">SETTINGS</h1>
        </div>
        <SaveBtn className="hidden sm:flex" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={40} className="animate-spin text-farm-soil" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Tab Bar */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-4 border-2 transition-all flex-shrink-0 lg:flex-shrink ${
                  activeTab === tab.id
                    ? 'bg-farm-soil text-white border-farm-soil shadow-[4px_4px_0px_#F59E0B] -translate-y-0.5'
                    : 'bg-white text-farm-soil border-farm-soil shadow-[2px_2px_0px_#1C1917] hover:bg-farm-sunburst hover:shadow-[4px_4px_0px_#1C1917]'
                }`}
              >
                <tab.icon size={20} strokeWidth={activeTab === tab.id ? 3 : 2} />
                <span className="font-black text-sm tracking-widest uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9 bg-farm-canvas border-4 border-farm-soil p-6 md:p-8 shadow-brutal min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-8"
              >

                {/* ── PROFILE TAB ── */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4" style={{ fontFamily: "'Space Mono', monospace" }}>Profile Information</h3>
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-24 h-24 bg-farm-tractor border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917] flex items-center justify-center text-farm-soil font-black text-2xl transform rotate-3 flex-shrink-0" style={{ fontFamily: "'Space Mono', monospace" }}>
                        {initials}
                      </div>
                      <div className="flex-1 space-y-4">
                        <FieldInput
                          label="Operator Name"
                          value={profile.OPERATOR_NAME}
                          onChange={v => handleProfileChange('OPERATOR_NAME', v)}
                          placeholder="e.g. Rahul Farmer"
                        />
                        <FieldInput
                          label="Farm Designation"
                          value={profile.FARM_DESIGNATION}
                          onChange={v => handleProfileChange('FARM_DESIGNATION', v)}
                          placeholder="e.g. Vyra Primary Sector"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ── API KEYS TAB ── */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4" style={{ fontFamily: "'Space Mono', monospace" }}>API Configuration</h3>
                    <div className="p-4 bg-farm-sunburst/20 border-2 border-farm-sunburst text-sm font-bold text-farm-soil">
                      ⚠️ These keys are saved to the backend <code>.env</code> file. Keep them secret.
                    </div>
                    <div className="space-y-4">
                      <FieldInput
                        label="Groq API Key"
                        value={profile.GROQ_API_KEY}
                        onChange={v => handleProfileChange('GROQ_API_KEY', v)}
                        type="password"
                        placeholder="gsk_..."
                      />
                      <FieldInput
                        label="OpenWeather API Key"
                        value={profile.OPENWEATHER_API_KEY}
                        onChange={v => handleProfileChange('OPENWEATHER_API_KEY', v)}
                        type="password"
                        placeholder="Your OpenWeather key"
                      />
                    </div>
                  </div>
                )}

                {/* ── AI MODELS TAB ── */}
                {activeTab === 'model' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4" style={{ fontFamily: "'Space Mono', monospace" }}>AI Model Selection</h3>
                    <SettingSelect
                      label="Chat Model"
                      value={profile.GROQ_MODEL}
                      onChange={v => handleProfileChange('GROQ_MODEL', v)}
                      options={[
                        { value: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile' },
                        { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant' },
                        { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
                        { value: 'gemma2-9b-it', label: 'Gemma 2 9B' },
                      ]}
                    />
                    <SettingSelect
                      label="Vision Model"
                      value={profile.GROQ_VISION_MODEL}
                      onChange={v => handleProfileChange('GROQ_VISION_MODEL', v)}
                      options={[
                        { value: 'llama-3.2-11b-vision-preview', label: 'Llama 3.2 11B Vision' },
                        { value: 'llama-3.2-90b-vision-preview', label: 'Llama 3.2 90B Vision' },
                      ]}
                    />
                    <SettingSelect
                      label="Audio / STT Model"
                      value={profile.GROQ_AUDIO_MODEL}
                      onChange={v => handleProfileChange('GROQ_AUDIO_MODEL', v)}
                      options={[
                        { value: 'whisper-large-v3', label: 'Whisper Large v3' },
                        { value: 'whisper-large-v3-turbo', label: 'Whisper Large v3 Turbo' },
                        { value: 'distil-whisper-large-v3-en', label: 'Distil Whisper (EN)' },
                      ]}
                    />
                  </div>
                )}

                {/* ── PREFERENCES TAB ── */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4" style={{ fontFamily: "'Space Mono', monospace" }}>System Preferences</h3>
                    <SettingSelect
                      label="Language"
                      value={prefs.language}
                      onChange={v => handlePrefsChange('language', v)}
                      options={[{ value: 'en', label: 'English (US)' }, { value: 'hi', label: 'Hindi' }, { value: 'te', label: 'Telugu' }]}
                    />
                    <SettingSelect
                      label="Measurement Units"
                      value={prefs.units}
                      onChange={v => handlePrefsChange('units', v)}
                      options={[{ value: 'metric', label: 'Metric (Celsius, kg)' }, { value: 'imperial', label: 'Imperial (Fahrenheit, lbs)' }]}
                    />
                  </div>
                )}

                {/* ── NOTIFICATIONS TAB ── */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4 flex items-center gap-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                      <Bell size={24} strokeWidth={3} /> Alert Settings
                    </h3>
                    <SettingToggle
                      label="Push Notifications"
                      description="Receive critical alerts and weather warnings directly on your device."
                      enabled={prefs.notifications}
                      onToggle={() => handleToggle('notifications')}
                    />
                  </div>
                )}

                {/* ── DATA & SYNC TAB ── */}
                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4 flex items-center gap-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                      <Database size={24} strokeWidth={3} /> Sync Configuration
                    </h3>
                    <SettingToggle
                      label="Background Sync"
                      description="Automatically backup farm memory and telemetry to Vyra Cloud."
                      enabled={prefs.autoSync}
                      onToggle={() => handleToggle('autoSync')}
                    />
                    <SettingToggle
                      label="Anonymous Telemetry"
                      description="Share anonymous crop data to improve Vyra's AI models."
                      enabled={prefs.dataSharing}
                      onToggle={() => handleToggle('dataSharing')}
                    />
                    <div className="mt-8 p-6 border-4 border-farm-soil bg-farm-alert/10">
                      <h4 className="text-lg font-black text-farm-alert uppercase tracking-tighter mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Danger Zone</h4>
                      <button className="btn-danger shadow-[4px_4px_0px_#EF4444]">FACTORY RESET SYSTEM</button>
                    </div>
                  </div>
                )}

                {/* Save button at bottom of content */}
                <div className="pt-4 border-t-2 border-farm-soil/20">
                  <SaveBtn />
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Mobile Save Button */}
      <div className="mt-8 sm:hidden">
        <SaveBtn className="w-full py-4" />
      </div>
    </motion.div>
  )
}
