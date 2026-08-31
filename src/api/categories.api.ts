import { apiClient } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiCategory {
  _id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  sortOrder: number
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function getCategories(): Promise<ApiCategory[]> {
  const res = await apiClient.get<{ data: { categories: ApiCategory[] } }>('/categories')
  return res.data.data.categories
}
