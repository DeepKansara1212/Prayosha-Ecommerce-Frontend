export interface NavLink {
  label: string
  href: string
}

export interface CrystalCard {
  id: string
  name: string
  tag: string
  price: string
  emoji: string
  gemClass: string
  large?: boolean
}

export interface Benefit {
  id: string
  icon: string
  title: string
  description: string
}

export interface Product {
  id: string
  name: string
  type: string
  price: string
  emoji: string
  bgClass: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  location: string
}

export interface FooterColumn {
  heading: string
  links: Array<{ label: string; href: string }>
}

// ─── Collection page ─────────────────────────────────────────────────────────

export type ProductCategory =
  | 'All'
  | 'Raw Clusters'
  | 'Tumbled Stones'
  | 'Towers & Points'
  | 'Spheres'
  | 'Jewellery'
  | 'Gift Sets'

export type ChakraType =
  | 'Root'
  | 'Sacral'
  | 'Solar Plexus'
  | 'Heart'
  | 'Throat'
  | 'Third Eye'
  | 'Crown'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'name-asc'

export interface ProductDetail {
  id: string
  name: string
  subtitle: string
  category: ProductCategory
  price: number
  priceDisplay: string
  emoji: string
  bgClass: string
  badge?: string
  chakra: ChakraType
  origin: string
  intention: string
  description: string
  properties: string[]
  howToUse: string
  dimensions: string
  weight: string
  inStock: boolean
  stockCount: number
  rating: number
  reviewCount: number
  isNew: boolean
  isBestseller: boolean
  relatedIds: string[]
}
