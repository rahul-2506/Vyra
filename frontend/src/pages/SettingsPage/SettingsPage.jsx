import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageTransition } from '../../lib/animations'
import { Save, User, Bell, Shield, Database, Smartphone, Check, Loader2, Key, Cpu } from 'lucide-react'
import { getProfile, saveProfile } from '../../services/api'
import toast from 'react-hot-toast'

import { cn } from '../../lib/utils'

function SettingToggle({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between p-4 glass-card hover:-translate-y-0.5 transition-all cursor-pointer" onClick={onToggle}>
      <div className="flex-1 pr-4 text-left">
        <h4 className="text-sm font-semibold text-farm-soil">{label}</h4>
        <p className="text-xs text-farm-soil/55 font-normal leading-normal mt-1">{description}</p>
      </div>
      <div className={cn(
        "w-12 h-7 rounded-full flex items-center p-1 transition-all duration-300",
        enabled ? "bg-farm-leaf neumorphic-inset" : "bg-stone-100 neumorphic-inset"
      )}>
        <motion.div
          layout
          className="w-5 h-5 rounded-full bg-white shadow-md border border-stone-200/20"
          initial={false}
          animate={{ x: enabled ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </div>
  )
}

function SettingSelect({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 glass-card gap-3">
      <h4 className="text-sm font-semibold text-farm-soil mb-2 sm:mb-0 text-left">{label}</h4>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="select w-full sm:w-48 neumorphic-control py-2 px-3 text-xs"
      >
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  )
}

function FieldInput({ label, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <div className="text-left">
      <label className="text-xs font-bold text-farm-soil/70 tracking-wide mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input rounded-xl w-full"
      />
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [disableTrails, setDisableTrails] = useState(
    localStorage.getItem('vyra_disable_trails') === 'true'
  )

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
  const handleTogglePrefs = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }))

  const handleToggleTrails = () => {
    const newVal = !disableTrails
    setDisableTrails(newVal)
    localStorage.setItem('vyra_disable_trails', newVal ? 'true' : 'false')
    window.location.reload()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveProfile(profile)
      setSaved(true)
      toast.success('Settings saved!')
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
      className={`relative z-10 bg-white hover:bg-stone-50 text-farm-tractor font-semibold text-xs px-5 py-3.5 rounded-xl flex items-center gap-2 shadow-md active:scale-95 transition-all shrink-0 ${className}`}
    >
      {saving ? (
        <Loader2 size={14} className="animate-spin" />
      ) : saved ? (
        <Check size={14} strokeWidth={2.5} />
      ) : (
        <Save size={14} strokeWidth={2.5} />
      )}
      {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
    </button>
  )

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto pb-16 space-y-6">
      
      {/* Immersive Profile Hero Card (Span 12) */}
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-farm-tractor to-[#2a4d3b] text-white shadow-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-farm-yellow/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 top-5 w-24 h-24 bg-farm-wheat/5 rounded-full blur-2xl animate-float" />
        
        {/* Calming Environmental Gradient Line details */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10%" cy="10%" r="20%" stroke="#FFFFFF" strokeWidth="2" fill="none" />
            <circle cx="10%" cy="10%" r="30%" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
            <circle cx="10%" cy="10%" r="40%" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
          {/* User profile avatar with active rotating border */}
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-farm-yellow via-farm-wheat to-farm-leaf p-1 shadow-md flex-shrink-0 animate-glow-pulse">
            <div className="w-full h-full bg-stone-900 rounded-full flex items-center justify-center text-white font-extrabold text-xl">
              {initials}
            </div>
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none">{profile.OPERATOR_NAME || 'Operator'}</h2>
              <span className="text-[9px] font-bold tracking-wider text-farm-yellow bg-farm-yellow/10 border border-farm-yellow/20 px-2 py-0.5 rounded-full uppercase">PRO OPERATOR</span>
            </div>
            <p className="text-xs text-white/70 font-normal">{profile.FARM_DESIGNATION || 'Vyra Primary Sector'} • ID: Vyra-Sec-4</p>
            
            {/* Storage slider */}
            <div className="pt-2 w-48 mx-auto sm:mx-0">
              <div className="flex justify-between text-[9px] text-white/60 font-semibold mb-1 uppercase tracking-wider">
                <span>Cloud Storage</span>
                <span>2.4 MB of 10 MB used</span>
              </div>
              <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-farm-yellow" style={{ width: '24%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden sm:block">
          <SaveBtn />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={40} className="animate-spin text-farm-soil" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Settings Tabs - Nothing OS / Mobile Style Pill List */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
            {tabs.map(tab => {
              const isTabActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 border-none outline-none flex-shrink-0 lg:flex-shrink relative font-semibold text-sm ${
                    isTabActive 
                      ? 'text-farm-tractor font-bold' 
                      : 'bg-white/40 text-farm-soil/70 hover:bg-white/60 hover:text-farm-soil border border-stone-200/40 shadow-sm'
                  }`}
                >
                  {isTabActive && (
                    <motion.div
                      layoutId="settings-active-pill"
                      className="absolute inset-0 bg-farm-tractor/10 rounded-xl border border-farm-tractor/10"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                  <tab.icon size={16} strokeWidth={2} className="relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Content Area (glass-card) */}
          <div className="lg:col-span-9 bg-white border border-stone-200/50 p-6 md:p-8 rounded-3xl shadow-sm min-h-[460px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >

                {/* ── PROFILE TAB ── */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 text-left">Profile Information</h3>
                    <div className="space-y-4">
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
                )}

                {/* ── API KEYS TAB ── */}
                {activeTab === 'api' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 text-left">API Configuration</h3>
                    <div className="p-4 bg-farm-yellow/20 border border-farm-yellow/50 rounded-xl text-sm font-medium text-farm-soil text-left">
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
                    <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 text-left">AI Model Selection</h3>
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
                    <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 text-left">System Preferences</h3>
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
                    <SettingToggle 
                      label="Enable Cursor Trails & Ambient Motion" 
                      description="Drift leaf particles and show glowing canvas cursor trails (disable for reduced motion or low-power devices)."
                      enabled={!disableTrails} 
                      onToggle={handleToggleTrails} 
                    />
                  </div>
                )}

                {/* ── NOTIFICATIONS TAB ── */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 flex items-center gap-2 text-left">
                      <Bell size={18} strokeWidth={2.5} /> Alert Settings
                    </h3>
                    <SettingToggle
                      label="Push Notifications"
                      description="Receive critical alerts and weather warnings directly on your device."
                      enabled={prefs.notifications}
                      onToggle={() => handleTogglePrefs('notifications')}
                    />
                  </div>
                )}

                {/* ── DATA & SYNC TAB ── */}
                {activeTab === 'data' && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 flex items-center gap-2 text-left">
                      <Database size={18} strokeWidth={2.5} /> Sync Configuration
                    </h3>
                    <SettingToggle
                      label="Background Sync"
                      description="Automatically backup farm memory and telemetry to Vyra Cloud."
                      enabled={prefs.autoSync}
                      onToggle={() => handleTogglePrefs('autoSync')}
                    />
                    <SettingToggle
                      label="Anonymous Telemetry"
                      description="Share anonymous crop data to improve Vyra's AI models."
                      enabled={prefs.dataSharing}
                      onToggle={() => handleTogglePrefs('dataSharing')}
                    />
                    <div className="mt-8 p-5 border border-farm-alert/20 bg-farm-alert/5 rounded-2xl text-left">
                      <h4 className="text-sm font-bold text-farm-alert mb-1">Danger Zone</h4>
                      <p className="text-xs text-farm-soil/60 mb-4 leading-relaxed font-normal">Permanently reset the operator dashboard configurations and clear all memory logs.</p>
                      <button className="btn-danger py-2.5 px-4 text-xs font-bold rounded-xl">Factory Reset System</button>
                    </div>
                  </div>
                )}

                {/* Save button at bottom of content (mobile only) */}
                <div className="pt-6 sm:hidden border-t border-stone-100">
                  <SaveBtn className="w-full justify-center" />
                </div>

              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  )
}
