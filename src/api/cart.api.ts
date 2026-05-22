import { apiClient } from './client'
import type { ApiProduct } from './products.api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: ApiProduct
  quantity: number
}

export interface CartItemAnnotated {
  _id: string
  product: ApiProduct
  quantity: number
  priceAtAdd: number
  lineTotal: number
  unavailable: boolean
}

export interface Cart {
  _id: string
  items: CartItemAnnotated[]
  couponApplied?: string
  subtotal: number
  itemCount: number
}

export interface CouponValidation {
  valid: boolean
  discount: number
  discountType: 'flat' | 'percent'
  message: string
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function getCart(): Promise<Cart> {
  const res = await apiClient.get<{ data: Cart }>('/cart')
  return res.data.data
}

export async function addItem(productId: string, quantity: number): Promise<Cart> {
  const res = await apiClient.post<{ data: Cart }>('/cart/items', { productId, quantity })
  return res.data.data
}

export async function updateItem(productId: string, quantity: number): Promise<Cart> {
  const res = await apiClient.patch<{ data: Cart }>(`/cart/items/${productId}`, { quantity })
  return res.data.data
}

export async function removeItem(productId: string): Promise<Cart> {
  const res = await apiClient.delete<{ data: Cart }>(`/cart/items/${productId}`)
  return res.data.data
}

export async function clearCart(): Promise<void> {
  await apiClient.delete('/cart')
}

export async function applyCoupon(code: string): Promise<Cart> {
  const res = await apiClient.post<{ data: Cart }>('/cart/coupon', { code })
  return res.data.data
}

export async function removeCoupon(): Promise<Cart> {
  const res = await apiClient.delete<{ data: Cart }>('/cart/coupon')
  return res.data.data
}

export async function validateCoupon(code: string): Promise<CouponValidation> {
  const res = await apiClient.get<{ data: CouponValidation }>('/cart/coupon/validate', {
    params: { code },
  })
  return res.data.data
}
