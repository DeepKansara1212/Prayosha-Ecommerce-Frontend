import { apiClient } from './client'

export interface PublicSettings {
  freeGiftEnabled: boolean
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const res = await apiClient.get<{ data: PublicSettings }>('/settings')
  return res.data.data
}
