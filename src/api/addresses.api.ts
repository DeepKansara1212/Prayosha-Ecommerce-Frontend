import { apiClient } from './client'

export interface Address {
  _id: string
  label: 'home' | 'work' | 'other'
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

export const getAddresses = (): Promise<Address[]> =>
  apiClient.get('/auth/me').then(r => r.data.data.addresses ?? [])

export const addAddress = (data: Omit<Address, '_id'>): Promise<Address[]> =>
  apiClient.post('/auth/me/addresses', data).then(r => r.data.data)

export const updateAddress = (id: string, data: Partial<Address>): Promise<Address[]> =>
  apiClient.patch(`/auth/me/addresses/${id}`, data).then(r => r.data.data)

export const deleteAddress = (id: string): Promise<Address[]> =>
  apiClient.delete(`/auth/me/addresses/${id}`).then(r => r.data.data)
