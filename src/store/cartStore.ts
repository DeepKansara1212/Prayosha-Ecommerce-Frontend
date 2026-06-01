import { create } from 'zustand'
import type { Cart } from '@/api/cart.api'
import * as cartApi from '@/api/cart.api'

// ─── Constants ────────────────────────────────────────────────────────────────

export const SHIPPING_THRESHOLD = 999
export const SHIPPING_COST = 149

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StoreCartItem {
  productId: string   // slug from backend
  quantity: number
  priceAtAdd: number
  // Snapshot kept so CartPage can render even when slug doesn't match static data
  name?: string
  images?: string[]
  stock?: number
}

export interface Coupon {
  code: string
  discountAmount: number // flat amount already computed by the backend
}

interface CartState {
  items: StoreCartItem[]
  coupon: Coupon | null
  isLoading: boolean
  isOpen: boolean

  fetchCart(): Promise<void>
  addItem(productId: string, quantity: number): Promise<void>
  updateItem(productId: string, quantity: number): Promise<void>
  removeItem(productId: string): Promise<void>
  clearCart(): Promise<void>
  applyCoupon(code: string, discountAmount?: number): Promise<void>
  removeCoupon(): Promise<void>
  openCart(): void
  closeCart(): void
  toggleCart(): void
  syncOnLogin(): Promise<void>
}

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectItemCount = (s: CartState): number =>
  s.items.reduce((sum, i) => sum + i.quantity, 0)

export const selectSubtotal = (s: CartState): number =>
  s.items.reduce((sum, i) => sum + i.priceAtAdd * i.quantity, 0)

export const selectDiscountAmount = (s: CartState): number =>
  s.coupon?.discountAmount ?? 0

export const selectTotal = (s: CartState): number => {
  const subtotal = selectSubtotal(s)
  const discounted = Math.max(0, subtotal - selectDiscountAmount(s))
  const shipping = discounted >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  return discounted + shipping
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function fromApiCart(cart: Cart): Pick<CartState, 'items' | 'coupon'> {
  return {
    items: cart.items.map(i => ({
      productId: i.product.slug,
      quantity: i.quantity,
      priceAtAdd: i.priceAtAdd,
      name: i.product.name,
      images: i.product.images,
      stock: i.product.stock,
    })),
    coupon: cart.couponApplied
      ? { code: cart.couponApplied, discountAmount: 0 }
      : null,
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  coupon: null,
  isLoading: false,
  isOpen: false,

  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const cart = await cartApi.getCart()
      set({ ...fromApiCart(cart), isLoading: false })
    } catch {
      set({ isLoading: false })
    }
  },

  addItem: async (productId, quantity) => {
    const prev = get().items
    const existing = prev.find(i => i.productId === productId)
    // Optimistic update — priceAtAdd is 0 until the server responds
    set({
      items: existing
        ? prev.map(i =>
            i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...prev, { productId, quantity, priceAtAdd: 0 }],
    })
    try {
      const cart = await cartApi.addItem(productId, quantity)
      set(fromApiCart(cart))
    } catch {
      set({ items: prev }) // revert optimistic update
    }
  },

  updateItem: async (productId, quantity) => {
    const prev = get().items
    set({ items: prev.map(i => (i.productId === productId ? { ...i, quantity } : i)) })
    try {
      const cart = await cartApi.updateItem(productId, quantity)
      set(fromApiCart(cart))
    } catch {
      set({ items: prev })
    }
  },

  removeItem: async (productId) => {
    const prev = get().items
    set({ items: prev.filter(i => i.productId !== productId) })
    try {
      const cart = await cartApi.removeItem(productId)
      set(fromApiCart(cart))
    } catch {
      set({ items: prev })
    }
  },

  clearCart: async () => {
    const prev = get().items
    set({ items: [], coupon: null })
    try {
      await cartApi.clearCart()
    } catch {
      set({ items: prev })
    }
  },

  applyCoupon: async (code, discountAmount) => {
    set({ isLoading: true })
    try {
      const cart = await cartApi.applyCoupon(code)
      const synced = fromApiCart(cart)
      // Patch in the pre-validated discount if the cart response doesn't carry it
      if (discountAmount != null && synced.coupon && synced.coupon.discountAmount === 0) {
        synced.coupon = { ...synced.coupon, discountAmount }
      }
      set({ ...synced, isLoading: false })
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  removeCoupon: async () => {
    const prev = get().coupon
    set({ coupon: null })
    try {
      const cart = await cartApi.removeCoupon()
      set(fromApiCart(cart))
    } catch {
      set({ coupon: prev })
    }
  },

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set(s => ({ isOpen: !s.isOpen })),

  // After login: push any locally-accumulated guest items to the server, then sync
  syncOnLogin: async () => {
    const local = get().items
    if (local.length === 0) {
      await get().fetchCart()
      return
    }
    try {
      await Promise.all(local.map(i => cartApi.addItem(i.productId, i.quantity)))
    } finally {
      await get().fetchCart()
    }
  },
}))
