import { apiClient } from './client'
import type { Address } from './auth.api'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  product: string  // MongoDB ObjectId
  name: string
  image: string
  sku: string
  price: number
  quantity: number
}

export type PaymentMethod = 'cod' | 'razorpay'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderStatusEntry {
  status: string
  note?: string
  timestamp: string
}

export interface Order {
  _id: string
  orderNumber: string
  user: string
  items: OrderItem[]
  shippingAddress: Address
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  status: OrderStatus
  statusHistory: OrderStatusEntry[]
  subtotal: number
  discount: number
  total: number
  razorpayOrderId?: string
  pointsEarned: number
  hasFreeGift: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderSuccessResponse {
  order: Order
  pointsEarned: number
  newPointsBalance: number
}

export interface OrderLineInput {
  productId: string
  quantity: number
}

export interface CODOrderData {
  addressId: string
  couponCode?: string
}

export interface RazorpayOrderData {
  addressId: string
  couponCode?: string
}

export interface RazorpayOrderResponse {
  razorpayOrderId: string
  amount: number
  currency: string
  order: Order
}

export interface RazorpayPaymentData {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface PaginatedOrders {
  orders: Order[]
  total: number
  page: number
  totalPages: number
}

// ─── Functions ────────────────────────────────────────────────────────────────

export async function createCODOrder(data: CODOrderData): Promise<OrderSuccessResponse> {
  const res = await apiClient.post<{ data: OrderSuccessResponse }>('/orders/cod', data)
  return res.data.data
}

export async function createRazorpayOrder(
  data: RazorpayOrderData,
): Promise<RazorpayOrderResponse> {
  const res = await apiClient.post<{ data: RazorpayOrderResponse }>('/orders/razorpay/create', data)
  return res.data.data
}

export async function verifyRazorpayPayment(data: RazorpayPaymentData): Promise<OrderSuccessResponse> {
  const res = await apiClient.post<{ data: OrderSuccessResponse }>('/orders/razorpay/verify', data)
  return res.data.data
}

export async function getUserOrders(page = 1): Promise<PaginatedOrders> {
  const res = await apiClient.get<{ data: PaginatedOrders }>('/orders', { params: { page } })
  return res.data.data
}

export async function getOrderByNumber(orderNumber: string): Promise<Order> {
  const res = await apiClient.get<{ data: Order }>(`/orders/${orderNumber}`)
  return res.data.data
}
