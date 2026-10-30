import { apiClient } from './client'
import type { WalletBalance, WalletTransaction } from '@/types'

export interface WalletHistoryResponse {
  transactions: WalletTransaction[]
  cashbackBalance: number
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function getWalletBalance(): Promise<WalletBalance> {
  const res = await apiClient.get<{ data: WalletBalance }>('/wallet/balance')
  return res.data.data
}

export async function getWalletHistory(page = 1, limit = 10): Promise<WalletHistoryResponse> {
  const res = await apiClient.get<{ data: WalletHistoryResponse }>('/wallet/history', {
    params: { page, limit },
  })
  return res.data.data
}
