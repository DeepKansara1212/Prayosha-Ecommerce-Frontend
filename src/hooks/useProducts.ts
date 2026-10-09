import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getProducts,
  getFeaturedProducts,
  getCategorySummary,
  getProductBySlug,
  getRelatedProducts,
  searchProducts,
  type ApiProduct,
  type ProductQueryParams,
} from '@/api/products.api'
import { useCategories } from './useCategories'
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

export function adapt(p: ApiProduct): ProductDetail {
  const properties: string[] = p.metaphysicalProperties
    ? p.metaphysicalProperties.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    : []
  const howToUse = (p.howToUse ?? '')
    .split(/\r?\n/)
    .map(step => step.trim())
    .filter(Boolean)
  const careInstructions = (p.careInstructions ?? '')
    .split(/\r?\n/)
    .map(instruction => instruction.trim())
    .filter(Boolean)

  return {
    id: p.slug,
    sku: p.sku,
    name: p.name,
    subtitle: p.shortDescription ?? '',
    category: str(p.category) as ProductCategory,
    ...(p.price !== undefined && { price: p.price }),
    priceDisplay: p.price !== undefined ? '₹' + p.price.toLocaleString('en-IN') : 'Price on request',
    images: p.images ?? [],
    video: p.video,
    emoji: p.emoji ?? '💎',
    bgClass: p.bgClass ?? 'bg-warm',
    badge: p.badge ? BADGE_MAP[p.badge] : undefined,
    chakra: (p.chakra ?? 'Crown') as ChakraType,
    origin: p.origin ?? '',
    intention: p.tags?.join(' · ') ?? '',
    description: p.description,
    properties,
    howToUse,
    careInstructions,
    productDetails: {
      ...(p.productDetails ?? {}),
      dimensions: p.dimensions ?? p.productDetails?.dimensions,
      size: p.size ?? p.productDetails?.size,
    },
    dimensions: p.dimensions ?? p.productDetails?.dimensions,
    size: p.size ?? p.productDetails?.size,
    inStock: (p.stock ?? 0) > 0,
    stockCount: p.stock ?? 0,
    rating: p.ratings?.average ?? 0,
    reviewCount: p.ratings?.count ?? 0,
    isNew: p.badge === 'NEW',
    isBestseller: p.badge === 'BESTSELLER',
    hasFreeGift: p.hasFreeGift ?? false,
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

// ─── Category showcase (real admin-managed categories, one representative product + count each) ──

// Cyclic fallback styling for categories without their own uploaded image.
const FALLBACK_STYLES = [
  { emoji: '🔮', bgClass: 'bg-gem-amethyst' },
  { emoji: '🌸', bgClass: 'bg-gem-rose' },
  { emoji: '💎', bgClass: 'bg-gem-aqua' },
  { emoji: '✨', bgClass: 'bg-gem-citrine' },
  { emoji: '🌿', bgClass: 'bg-gem-sage' },
  { emoji: '🌙', bgClass: 'bg-[linear-gradient(135deg,#C8C5BE_0%,#E8E4DC_50%,#F5F2ED_100%)]' },
]

export interface CategoryShowcase {
  name: string
  slug: string
  count: number
  image?: string
  emoji: string
  bgClass: string
}

export function useCategoryShowcase() {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories()

  const { data: summary = [], isLoading: summaryLoading } = useQuery({
    queryKey: ['products', 'category-summary'],
    queryFn: getCategorySummary,
  })

  const showcase: CategoryShowcase[] = categories.map((cat, i) => {
    const entry = summary.find(s => s._id === cat._id)
    return {
      name: cat.name,
      slug: cat.slug,
      count: entry?.count ?? 0,
      image: cat.image ?? entry?.image,
      ...FALLBACK_STYLES[i % FALLBACK_STYLES.length],
    }
  })

  return { showcase, isLoading: categoriesLoading || summaryLoading }
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
