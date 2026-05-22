import { apiClient } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiProduct {
  _id: string
  slug: string
  name: string
  description: string
  shortDescription?: string
  price: number
  comparePrice?: number
  images: string[]
  category: string | { name: string; slug: string }
  tags: string[]
  chakra?: string
  badge?: 'BESTSELLER' | 'NEW' | 'LIMITED' | 'RARE' | 'GIFT SET'
  stock: number
  lowStockThreshold: number
  weight?: number
  dimensions?: { l: number; w: number; h: number }
  careInstructions?: string
  metaphysicalProperties?: string
  isFeatured: boolean
  isActive: boolean
  ratings: { average: number; count: number }
  // optional frontend-display fields (may be added to backend later)
  emoji?: string
  bgClass?: string
  origin?: string
  relatedSlugs?: string[]
  createdAt: string
}

export interface ProductQueryParams {
  category?: string
  search?: string
  sort?: string
  minPrice?: number
  maxPrice?: number
  badge?: string
  chakra?: string
  inStock?: boolean
  page?: number
  limit?: number
}

export interface PaginatedProducts {
  products: ApiProduct[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function getProducts(params: ProductQueryParams = {}): Promise<PaginatedProducts> {
  const res = await apiClient.get<{ data: { products: ApiProduct[]; pagination: { page: number; limit: number; total: number; totalPages: number } } }>('/products', { params })
  const { products, pagination } = res.data.data
  return { products, ...pagination }
}

export async function getFeaturedProducts(): Promise<ApiProduct[]> {
  const res = await apiClient.get<{ data: { products: ApiProduct[] } }>('/products/featured')
  return res.data.data.products
}

export async function getProductBySlug(slug: string): Promise<ApiProduct> {
  const res = await apiClient.get<{ data: { product: ApiProduct } }>(`/products/${slug}`)
  return res.data.data.product
}

export async function getRelatedProducts(slug: string): Promise<ApiProduct[]> {
  const res = await apiClient.get<{ data: { products: ApiProduct[] } }>(`/products/${slug}/related`)
  return res.data.data.products
}

export async function searchProducts(query: string): Promise<ApiProduct[]> {
  const res = await apiClient.get<{ data: { products: ApiProduct[]; total: number } }>('/search', {
    params: { q: query },
  })
  return res.data.data.products
}
