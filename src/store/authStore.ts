import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProfile } from '@/api/auth.api'
import * as authApi from '@/api/auth.api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginData {
  phone: string
  otp: string
  password: string
}

interface RegisterData {
  name: string
  phone: string
  password: string
  email?: string
}

interface AuthState {
  user: UserProfile | null
  accessToken: string | null
  isLoading: boolean

  login(data: LoginData): Promise<void>
  register(data: RegisterData): Promise<void>
  logout(): Promise<void>
  fetchMe(): Promise<void>
  setToken(token: string): void
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      // verifyOtpAndLogin is the OTP-based login step; phone/otp/password come from the auth form
      login: async (data) => {
        set({ isLoading: true })
        try {
          const { accessToken, refreshToken, user } = await authApi.verifyOtpAndLogin(data)
          // Write to plain keys so the axios interceptor can read them
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', refreshToken)
          set({ user, accessToken, isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      // Creates the account; caller should follow up with sendOtp → login
      register: async (data) => {
        set({ isLoading: true })
        try {
          await authApi.register(data)
          set({ isLoading: false })
        } catch (err) {
          set({ isLoading: false })
          throw err
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authApi.logout()
        } finally {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({ user: null, accessToken: null, isLoading: false })
        }
      },

      // Called on mount when a stored token is found; 401 is handled by the refresh interceptor
      fetchMe: async () => {
        try {
          const user = await authApi.getMe()
          set({ user })
        } catch {
          // Silently ignore — the axios interceptor already handles 401 + redirect
        }
      },

      // Called by the axios interceptor after a successful token refresh
      setToken: (token) => {
        localStorage.setItem('accessToken', token)
        set({ accessToken: token })
      },
    }),
    {
      name: 'prayosha-auth',
      // Only persist user profile + token; isLoading is always false at startup
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    },
  ),
)
