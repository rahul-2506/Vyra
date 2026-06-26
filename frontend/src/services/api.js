import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor
API.interceptors.request.use(
  (config) => {
    console.log(`[Vyra API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.detail || error?.message || 'Something went wrong'
    console.error(`[Vyra API Error] ${message}`)
    return Promise.reject(new Error(message))
  }
)

// === CHAT ===
export const sendChatMessage = async (message, language = 'English') => {
  const response = await API.post('/chat', { message, language })
  return response.data
}

// === VOICE QUERY ===
export const sendVoiceQuery = async (audioFile) => {
  const formData = new FormData()
  formData.append('file', audioFile)
  const response = await API.post('/voice-query', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
  return response.data
}

// === CROP DIAGNOSIS (IMAGE) ===
export const sendCropDiagnosis = async (imageFile) => {
  const formData = new FormData()
  formData.append('file', imageFile)
  const response = await API.post('/crop-diagnosis', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  })
  return response.data
}

// === WEATHER ===
export const getWeather = async (city) => {
  const response = await API.get(`/weather?city=${encodeURIComponent(city)}`)
  return response.data
}

// === FARM HISTORY ===
export const getFarmHistory = async () => {
  const response = await API.get('/farm-history')
  return response.data
}

// === DAILY BRIEFING ===
export const getDailyBriefing = async () => {
  const response = await API.get('/daily-briefing')
  return response.data
}

// === DASHBOARD SUMMARY ===
export const getDashboardSummary = async () => {
  const response = await API.get('/dashboard-summary')
  return response.data
}

// === HEALTH CHECK ===
export const getHealth = async () => {
  const response = await API.get('/health')
  return response.data
}

// === PROFILE SETTINGS ===
export const getProfile = async () => {
  const response = await API.get('/profile')
  return response.data
}

export const saveProfile = async (settings) => {
  const response = await API.put('/profile', settings)
  return response.data
}

export default API
