import { create } from 'zustand'
import * as wishlistApi from '@/api/wishlist.api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WishlistState {
  productIds: string[] // slugs — match COLLECTION_PRODUCTS[n].id
  isLoading: boolean

  fetchWishlist(): Promise<void>
  toggle(productId: string): Promise<void>
  isInWishlist(productId: string): boolean
  syncOnLogin(): Promise<void>
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useWishlistStore = create<WishlistState>((set, get) => ({
  productIds: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true })
    try {
      const wishlist = await wishlistApi.getWishlist()
      set({
        productIds: wishlist.products.map(p => p.slug),
        isLoading: false,
      })
    } catch {
      set({ isLoading: false })
    }
  },

  toggle: async (productId) => {
    const prev = get().productIds
    const inList = prev.includes(productId)
    // Optimistic update
    set({ productIds: inList ? prev.filter(id => id !== productId) : [...prev, productId] })
    try {
      if (inList) {
        await wishlistApi.removeFromWishlist(productId)
      } else {
        await wishlistApi.addToWishlist(productId)
      }
      // Re-sync to pick up any server-side changes
      const wishlist = await wishlistApi.getWishlist()
      set({ productIds: wishlist.products.map(p => p.slug) })
    } catch {
      set({ productIds: prev }) // revert optimistic update
    }
  },

  // Use this from callbacks; for reactive component state prefer:
  //   useWishlistStore(s => s.productIds.includes(id))
  isInWishlist: (productId) => get().productIds.includes(productId),

  // After login: push guest-accumulated wishlist items to the server, then sync
  syncOnLogin: async () => {
    const local = get().productIds
    if (local.length === 0) {
      await get().fetchWishlist()
      return
    }
    try {
      await Promise.all(local.map(id => wishlistApi.addToWishlist(id)))
    } finally {
      await get().fetchWishlist()
    }
  },
}))
