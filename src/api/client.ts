import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export const apiClient = axios.create({ baseURL: BASE_URL })

// ─── Request: attach access token ────────────────────────────────────────────

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Response: 401 → refresh → retry ─────────────────────────────────────────

let refreshing = false
const pendingQueue: Array<(token: string | null) => void> = []

function flushQueue(token: string | null) {
  pendingQueue.splice(0).forEach(fn => fn(token))
}

function clearAuth() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  window.location.hash = '#/auth'
}

apiClient.interceptors.response.use(
  res => res,
  async error => {
    const config = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    const is401 = error.response?.status === 401
    const isRefreshEndpoint = (config.url ?? '').includes('refresh-token')

    if (!is401 || config._retry || isRefreshEndpoint) {
      return Promise.reject(error)
    }

    config._retry = true

    // Queue concurrent requests while a refresh is already in-flight
    if (refreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push(token => {
          if (!token) return reject(error)
          config.headers.Authorization = `Bearer ${token}`
          resolve(apiClient(config))
        })
      })
    }

    refreshing = true

    try {
      const refreshToken = localStorage.getItem('refreshToken')
      const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, { refreshToken })
      const newToken: string = data.data.accessToken
      localStorage.setItem('accessToken', newToken)
      config.headers.Authorization = `Bearer ${newToken}`
      flushQueue(newToken)
      return apiClient(config)
    } catch {
      flushQueue(null)
      clearAuth()
      return Promise.reject(error)
    } finally {
      refreshing = false
    }
  },
)
