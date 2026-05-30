import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getRelatedProducts,
  searchProducts,
  type ApiProduct,
  type ProductQueryParams,
} from '@/api/products.api'
import type { ProductDetail, ProductCategory, ChakraType } from '@/types'

// ─── Adapter ──────────────────────────────────────────────────────────────────

// The API may return string fields as populated Mongoose objects — extract the name.
function str(val: unknown, fallback = ''): string {
  if (typeof val === 'string') return val
  if (val && typeof val === 'object') {
    const o = val as Record<string, unknown>
    return (typeof o.name === 'string' ? o.name : typeof o.slug === 'string' ? o.slug : fallback)
  }
  return fallback
}

const BADGE_MAP: Record<string, string> = {
  BESTSELLER: 'Bestseller',
  NEW: 'New',
  LIMITED: 'Limited',
  RARE: 'Rare',
  'GIFT SET': 'Gifting',
}

function adapt(p: ApiProduct): ProductDetail {
  const dims = p.dimensions
    ? `${p.dimensions.l} × ${p.dimensions.w} × ${p.dimensions.h} cm`
    : 'N/A'

  const properties: string[] = p.metaphysicalProperties
    ? p.metaphysicalProperties.split(/\n|\.(?=\s[A-Z])/).map(s => s.trim()).filter(Boolean)
    : []

  return {
    id: p.slug,
    name: p.name,
    subtitle: p.shortDescription ?? '',
    category: str(p.category) as ProductCategory,
    price: p.price,
    priceDisplay: '₹' + p.price.toLocaleString('en-IN'),
    images: p.images ?? [],
    emoji: p.emoji ?? '💎',
    bgClass: p.bgClass ?? 'bg-warm',
    badge: p.badge ? BADGE_MAP[p.badge] : undefined,
    chakra: (p.chakra ?? 'Crown') as ChakraType,
    origin: p.origin ?? '',
    intention: p.tags?.join(' · ') ?? '',
    description: p.description,
    properties,
    howToUse: p.careInstructions ?? '',
    dimensions: dims,
    weight: p.weight != null ? `${p.weight} g` : 'N/A',
    inStock: (p.stock ?? 0) > 0,
    stockCount: p.stock ?? 0,
    rating: p.ratings?.average ?? 0,
    reviewCount: p.ratings?.count ?? 0,
    isNew: p.badge === 'NEW',
    isBestseller: p.badge === 'BESTSELLER',
    relatedIds: p.relatedSlugs ?? [],
  }
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useProducts(params: ProductQueryParams) {
  const query = useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  })
  return {
    products: query.data?.products.map(adapt) ?? [],
    pagination: query.data
      ? {
          total: query.data.total,
          page: query.data.page,
          limit: query.data.limit,
          totalPages: query.data.totalPages,
        }
      : null,
    isLoading: query.isLoading,
    isError: query.isError,
  }
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: getFeaturedProducts,
    select: (data) => data.map(adapt),
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    select: adapt,
  })
}

export function useRelatedProducts(slug: string) {
  return useQuery({
    queryKey: ['products', 'related', slug],
    queryFn: () => getRelatedProducts(slug),
    enabled: !!slug,
    select: (data) => data.map(adapt),
  })
}

export function useProductSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  return useQuery({
    queryKey: ['products', 'search', debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    select: (data) => data.map(adapt),
  })
}
