import { apiClient } from './client'
import type { ApiProduct } from './products.api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Wishlist {
  products: ApiProduct[]
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function getWishlist(): Promise<Wishlist> {
  const res = await apiClient.get<{ data: { wishlist: ApiProduct[] } }>('/wishlist')
  return { products: res.data.data.wishlist }
}

export async function addToWishlist(productId: string): Promise<Wishlist> {
  const res = await apiClient.post<{ data: { wishlist: ApiProduct[] } }>(`/wishlist/${productId}`)
  return { products: res.data.data.wishlist }
}

export async function removeFromWishlist(productId: string): Promise<Wishlist> {
  const res = await apiClient.delete<{ data: { wishlist: ApiProduct[] } }>(`/wishlist/${productId}`)
  return { products: res.data.data.wishlist }
}
