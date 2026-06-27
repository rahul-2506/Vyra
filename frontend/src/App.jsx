import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout/Layout'
import DashboardPage  from './pages/DashboardPage/DashboardPage'
import AssistantPage  from './pages/AssistantPage/AssistantPage'
import MemoryPage     from './pages/MemoryPage/MemoryPage'
import BriefingPage   from './pages/BriefingPage/BriefingPage'
import InsightsPage   from './pages/InsightsPage/InsightsPage'
import SettingsPage   from './pages/SettingsPage/SettingsPage'
import ScannerPage    from './pages/ScannerPage/ScannerPage'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index          element={<DashboardPage />} />
            <Route path="assistant" element={<AssistantPage />} />
            <Route path="memory"    element={<MemoryPage />} />
            <Route path="briefing"  element={<BriefingPage />} />
            <Route path="insights"  element={<InsightsPage />} />
            <Route path="settings"  element={<SettingsPage />} />
            <Route path="scanner"   element={<ScannerPage />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
