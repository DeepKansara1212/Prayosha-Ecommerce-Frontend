import { apiClient } from './client'

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface Address {
  _id: string
  label: string
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export interface AddressInput {
  label?: string
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

export interface UserProfile {
  _id: string
  name: string
  phone: string
  email?: string
  avatar?: string
  role?: 'user' | 'admin'
  addresses: Address[]
  createdAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: UserProfile
}

// ─── Registration & OTP ──────────────────────────────────────────────────────

export async function register(data: {
  name: string
  phone: string
  password: string
  email?: string
}): Promise<UserProfile> {
  const res = await apiClient.post<{ data: UserProfile }>('/auth/register', data)
  return res.data.data
}

export async function sendOtp(data: {
  phone: string
  purpose: 'login' | 'register'
}): Promise<void> {
  await apiClient.post('/auth/send-otp', data)
}

export async function verifyOtpAndLogin(data: {
  phone: string
  otp: string
  password: string
}): Promise<AuthTokens> {
  const res = await apiClient.post<{ data: AuthTokens }>('/auth/verify-otp', data)
  return res.data.data
}

// ─── Session ─────────────────────────────────────────────────────────────────

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

export async function refreshToken(): Promise<{ accessToken: string }> {
  const storedRefresh = localStorage.getItem('refreshToken')
  const res = await apiClient.post<{ data: { accessToken: string } }>('/auth/refresh-token', {
    refreshToken: storedRefresh,
  })
  return res.data.data
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getMe(): Promise<UserProfile> {
  const res = await apiClient.get<{ data: UserProfile }>('/auth/me')
  return res.data.data
}

export async function updateMe(data: {
  name?: string
  phone?: string
  email?: string
  avatar?: string
}): Promise<UserProfile> {
  const res = await apiClient.patch<{ data: UserProfile }>('/auth/me', data)
  return res.data.data
}


// ─── Password reset ───────────────────────────────────────────────────────────

export async function forgotPassword(phone: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { phone })
}

export async function resetPassword(data: {
  phone: string
  otp: string
  newPassword: string
}): Promise<void> {
  await apiClient.post('/auth/reset-password', data)
}

// ─── Addresses ────────────────────────────────────────────────────────────────

export async function addAddress(data: AddressInput): Promise<Address[]> {
  const res = await apiClient.post<{ data: Address[] }>('/auth/me/addresses', data)
  return res.data.data
}

export async function updateAddress(id: string, data: Partial<AddressInput>): Promise<Address[]> {
  const res = await apiClient.patch<{ data: Address[] }>(`/auth/me/addresses/${id}`, data)
  return res.data.data
}

export async function deleteAddress(id: string): Promise<Address[]> {
  const res = await apiClient.delete<{ data: Address[] }>(`/auth/me/addresses/${id}`)
  return res.data.data
}
