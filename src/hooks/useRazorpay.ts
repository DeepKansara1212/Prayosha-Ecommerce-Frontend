import { useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import * as ordersApi from '@/api/orders.api'

// ─── Razorpay global types ────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  handler?: (response: RazorpayPaymentResponse) => void | Promise<void>
  modal?: { ondismiss?: () => void }
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayInstance {
  open(): void
  on(event: string, cb: (response: { error: { code: string; description: string } }) => void): void
}

// ─── Script loader ────────────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRazorpay() {
  const user = useAuthStore(s => s.user)

  const openRazorpay = useCallback(async (
    razorpayOrderId: string,
    amount: number,
    currency: string,
    onSuccess: (result: ordersApi.OrderSuccessResponse) => void | Promise<void>,
    onFailure: () => void,
  ) => {
    const loaded = await loadRazorpayScript()
    if (!loaded) { onFailure(); return }

    const rzp = new window.Razorpay({
      key: (import.meta.env.VITE_RAZORPAY_KEY_ID ?? '') as string,
      amount,
      currency,
      name: 'Prayosha Crystals',
      description: 'Sacred Crystal Collection',
      order_id: razorpayOrderId,
      prefill: {
        name: user?.name ?? '',
        email: user?.email ?? '',
        contact: user?.phone ?? '',
      },
      theme: { color: '#7B5EA7' },
      handler: async (response) => {
        try {
          const result = await ordersApi.verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          await onSuccess(result)
        } catch {
          onFailure()
        }
      },
    })
    rzp.on('payment.failed', () => onFailure())
    rzp.open()
  }, [user])

  return { openRazorpay }
}
