import { apiClient } from './client'

export interface ApiSubCategory {
  _id: string
  name: string
  slug: string
  parentCategory: string
  image?: string
  isActive: boolean
  sortOrder: number
}

export async function getSubCategories(category: string): Promise<ApiSubCategory[]> {
  const res = await apiClient.get<{ data: { subcategories: ApiSubCategory[] } }>('/subcategories', {
    params: { category },
  })
  return res.data.data.subcategories
}
