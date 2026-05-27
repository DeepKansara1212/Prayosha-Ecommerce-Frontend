import { apiClient } from './client'

export interface SearchResult {
  _id: string
  slug: string
  name: string
  price: number
  images: string[]
  category: string
  badge?: string
}

type RawCategory = string | { _id: string; name: string } | null | undefined

function categoryName(cat: RawCategory): string {
  if (!cat) return ''
  if (typeof cat === 'string') return cat
  return cat.name ?? ''
}

export const searchProducts = (q: string, limit = 6): Promise<SearchResult[]> =>
  apiClient.get('/search', { params: { q, limit } }).then(r => {
    // Backend may return products directly in data or nested under data.products
    const raw: unknown[] = r.data.data?.products ?? r.data.data ?? []
    return raw.map((p: any) => ({
      ...p,
      category: categoryName(p.category),
    }))
  })
