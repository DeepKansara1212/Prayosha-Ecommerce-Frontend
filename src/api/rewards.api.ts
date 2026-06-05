import { apiClient } from './client'
import type { RewardsBalance, RewardTransaction } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RewardsHistoryResponse {
  transactions: RewardTransaction[]
  totalPoints: number
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

export async function getRewardsBalance(): Promise<RewardsBalance> {
  const res = await apiClient.get<{ data: RewardsBalance }>('/rewards/balance')
  return res.data.data
}

export async function getRewardsHistory(page = 1, limit = 10): Promise<RewardsHistoryResponse> {
  const res = await apiClient.get<{ data: RewardsHistoryResponse }>('/rewards/history', {
    params: { page, limit },
  })
  return res.data.data
}
