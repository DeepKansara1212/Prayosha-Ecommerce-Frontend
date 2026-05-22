import { apiClient } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReviewAuthor {
  _id: string
  name: string
  avatar?: string
}

export interface Review {
  _id: string
  user: ReviewAuthor
  product: string
  rating: number
  title: string
  body: string
  verified: boolean
  createdAt: string
}

export interface ReviewInput {
  rating: number
  title: string
  body: string
}

export interface RatingBreakdown {
  1: number
  2: number
  3: number
  4: number
  5: number
}

export interface PaginatedReviews {
  reviews: Review[]
  total: number
  page: number
  totalPages: number
  averageRating: number
  ratingBreakdown: RatingBreakdown
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function getProductReviews(slug: string, page = 1): Promise<PaginatedReviews> {
  const res = await apiClient.get<{ data: PaginatedReviews }>(`/products/${slug}/reviews`, {
    params: { page },
  })
  return res.data.data
}

export async function submitReview(slug: string, data: ReviewInput): Promise<Review> {
  const res = await apiClient.post<{ data: Review }>(`/products/${slug}/reviews`, data)
  return res.data.data
}
