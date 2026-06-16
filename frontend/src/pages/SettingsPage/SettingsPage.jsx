import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageTransition, popIn } from '../../lib/animations'
import { Save, User, Bell, Shield, Database, Smartphone, Globe, Cloud, Check } from 'lucide-react'

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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    notifications: true,
    autoSync: true,
    dataSharing: false,
    theme: 'system',
    language: 'en',
    units: 'metric'
  })

  const handleToggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }))
  const handleChange = (key, val) => setSettings(s => ({ ...s, [key]: val }))

  const tabs = [
    { id: 'general', icon: User, label: 'Profile' },
    { id: 'preferences', icon: Smartphone, label: 'Preferences' },
    { id: 'notifications', icon: Bell, label: 'Alerts' },
    { id: 'data', icon: Database, label: 'Data & Sync' },
  ]

  return (
    <motion.div {...pageTransition} className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 bg-white border-4 border-farm-soil p-6 shadow-brutal">
        <div>
          <span className="section-eyebrow border-none pl-0 text-farm-sunburst">SYSTEM CONFIGURATION</span>
          <h1 className="section-title mb-0">SETTINGS</h1>
        </div>
        <button className="btn-primary shadow-[4px_4px_0px_#1C1917] hidden sm:flex">
          <Save size={20} strokeWidth={3} /> SAVE CHANGES
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Brutalist Tab Bar */}
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
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4 mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>Profile Information</h3>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-24 h-24 bg-farm-tractor border-4 border-farm-soil shadow-[4px_4px_0px_#1C1917] flex items-center justify-center text-farm-soil font-black text-2xl transform rotate-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                      RF
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-xs font-black uppercase text-farm-soil tracking-widest mb-2 block" style={{ fontFamily: "'Space Mono', monospace" }}>Operator Name</label>
                        <input type="text" className="input" defaultValue="Rahul Farmer" />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-farm-soil tracking-widest mb-2 block" style={{ fontFamily: "'Space Mono', monospace" }}>Farm Designation</label>
                        <input type="text" className="input" defaultValue="Vyra Primary Sector" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4 mb-6" style={{ fontFamily: "'Space Mono', monospace" }}>System Preferences</h3>
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
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4 mb-6 flex items-center gap-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                    <Bell size={24} strokeWidth={3} /> Alert Settings
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
                  <h3 className="text-xl font-black text-farm-soil uppercase tracking-tighter border-b-4 border-farm-soil pb-4 mb-6 flex items-center gap-3" style={{ fontFamily: "'Space Mono', monospace" }}>
                    <Database size={24} strokeWidth={3} /> Sync Configuration
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
                  <div className="mt-8 p-6 border-4 border-farm-soil bg-farm-alert/10">
                     <h4 className="text-lg font-black text-farm-alert uppercase tracking-tighter mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>Danger Zone</h4>
                     <button className="btn-danger shadow-[4px_4px_0px_#EF4444]">FACTORY RESET SYSTEM</button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile Save Button */}
      <div className="mt-8 sm:hidden">
        <button className="btn-primary w-full py-4 shadow-[4px_4px_0px_#1C1917]">
          <Save size={20} strokeWidth={3} /> SAVE CHANGES
        </button>
      </div>
    </motion.div>
  )
}
