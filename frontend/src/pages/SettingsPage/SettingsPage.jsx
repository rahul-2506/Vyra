import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageTransition, popIn } from '../../lib/animations'
import { Save, User, Bell, Shield, Database, Smartphone, Globe, Cloud, Check } from 'lucide-react'

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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [disableTrails, setDisableTrails] = useState(
    localStorage.getItem('vyra_disable_trails') === 'true'
  )
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    dataSharing: false,
    theme: 'system',
    language: 'en',
    units: 'metric'
  })

  const handleToggleTrails = () => {
    const newVal = !disableTrails
    setDisableTrails(newVal)
    localStorage.setItem('vyra_disable_trails', newVal ? 'true' : 'false')
    window.location.reload()
  }

  const handleToggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }))
  const handleChange = (key, val) => setSettings(s => ({ ...s, [key]: val }))

  const tabs = [
    { id: 'general', icon: User, label: 'Profile' },
    { id: 'preferences', icon: Smartphone, label: 'Preferences' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'data', icon: Database, label: 'Data & Sync' },
  ]

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
              RF
            </div>
          </div>
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-none">Rahul Farmer</h2>
              <span className="text-[9px] font-bold tracking-wider text-farm-yellow bg-farm-yellow/10 border border-farm-yellow/20 px-2 py-0.5 rounded-full uppercase">PRO OPERATOR</span>
            </div>
            <p className="text-xs text-white/70 font-normal">Vyra Primary Sector • ID: Vyra-Sec-4</p>
            
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

        <button className="relative z-10 bg-white hover:bg-stone-50 text-farm-tractor font-semibold text-xs px-5 py-3.5 rounded-xl flex items-center gap-2 shadow-md active:scale-95 transition-all shrink-0">
          <Save size={14} strokeWidth={2.5} /> Save Changes
        </button>
      </div>

      {/* Main settings tabs & panel grid */}
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
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 text-left">Profile Information</h3>
                  <div className="space-y-4">
                    <div className="text-left">
                      <label className="text-xs font-bold text-farm-soil/70 tracking-wide mb-1.5 block">Operator Name</label>
                      <input type="text" className="input rounded-xl" defaultValue="Rahul Farmer" />
                    </div>
                    <div className="text-left">
                      <label className="text-xs font-bold text-farm-soil/70 tracking-wide mb-1.5 block">Farm Designation</label>
                      <input type="text" className="input rounded-xl" defaultValue="Vyra Primary Sector" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 text-left">System Preferences</h3>
                  <SettingSelect 
                    label="Language" 
                    value={settings.language} 
                    onChange={(v) => handleChange('language', v)}
                    options={[ { value: 'en', label: 'English (US)' }, { value: 'hi', label: 'Hindi' }, { value: 'te', label: 'Telugu' } ]}
                  />
                  <SettingSelect 
                    label="Measurement Units" 
                    value={settings.units} 
                    onChange={(v) => handleChange('units', v)}
                    options={[ { value: 'metric', label: 'Metric (Celsius, kg)' }, { value: 'imperial', label: 'Imperial (Fahrenheit, lbs)' } ]}
                  />
                  <SettingToggle 
                    label="Enable Cursor Trails & Ambient Motion" 
                    description="Drift leaf particles and show glowing canvas cursor trails (disable for reduced motion or low-power devices)."
                    enabled={!disableTrails} 
                    onToggle={handleToggleTrails} 
                  />
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 flex items-center gap-2 text-left">
                    <Bell size={18} strokeWidth={2.5} /> Alert Settings
                  </h3>
                  <SettingToggle 
                    label="Push Notifications" 
                    description="Receive critical alerts and weather warnings directly on your device."
                    enabled={settings.notifications} 
                    onToggle={() => handleToggle('notifications')} 
                  />
                </div>
              )}

              {activeTab === 'data' && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-farm-soil border-b border-stone-100 pb-3 mb-6 flex items-center gap-2 text-left">
                    <Database size={18} strokeWidth={2.5} /> Sync Configuration
                  </h3>
                  <SettingToggle 
                    label="Background Sync" 
                    description="Automatically backup farm memory and telemetry to Vyra Cloud."
                    enabled={settings.autoSync} 
                    onToggle={() => handleToggle('autoSync')} 
                  />
                  <SettingToggle 
                    label="Anonymous Telemetry" 
                    description="Share anonymous crop data to improve Vyra's AI models."
                    enabled={settings.dataSharing} 
                    onToggle={() => handleToggle('dataSharing')} 
                  />
                  <div className="mt-8 p-5 border border-farm-alert/20 bg-farm-alert/5 rounded-2xl text-left">
                     <h4 className="text-sm font-bold text-farm-alert mb-1">Danger Zone</h4>
                     <p className="text-xs text-farm-soil/60 mb-4 leading-relaxed font-normal">Permanently reset the operator dashboard configurations and clear all memory logs.</p>
                     <button className="btn-danger py-2.5 px-4 text-xs font-bold rounded-xl">Factory Reset System</button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile Save Button */}
      <div className="mt-8 sm:hidden">
        <button className="btn-primary w-full py-3.5 rounded-xl shadow-lg">
          <Save size={16} strokeWidth={2.5} /> Save Changes
        </button>
      </div>
    </motion.div>
  )
}
