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
    const timeout = window.setTimeout(() => finish(false), 15_000)
    const finish = (loaded: boolean) => {
      window.clearTimeout(timeout)
      resolve(loaded)
    }
    script.onload = () => finish(true)
    script.onerror = () => finish(false)
    document.head.appendChild(script)
  })
}

const delay = (milliseconds: number) =>
  new Promise(resolve => window.setTimeout(resolve, milliseconds))

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
    const reportFailure = async () => {
      try {
        await ordersApi.failRazorpayPayment(razorpayOrderId)
      } catch (error) {
        console.error('Failed to record the Razorpay payment failure', error)
      }
      onFailure()
    }

    const loaded = await loadRazorpayScript()
    if (!loaded) { await reportFailure(); return }

    return new Promise<void>(resolve => {
      let completed = false
      let paymentSubmitted = false

      const handleFailure = async () => {
        if (completed || paymentSubmitted) return
        completed = true
        await reportFailure()
        resolve()
      }

      const handleSuccess = async (response: RazorpayPaymentResponse) => {
        if (completed || paymentSubmitted) return
        paymentSubmitted = true
        try {
          const payment = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }
          let result: ordersApi.OrderSuccessResponse | undefined
          let lastError: unknown
          for (let attempt = 0; attempt < 2; attempt += 1) {
            try {
              result = await ordersApi.verifyRazorpayPayment(payment)
              break
            } catch (error) {
              lastError = error
              if (attempt === 0) await delay(750)
            }
          }
          if (!result) {
            throw lastError instanceof Error
              ? lastError
              : new Error('Payment could not be verified. Please contact support before trying again.')
          }
          await onSuccess(result)
          completed = true
          resolve()
        } catch (error) {
          console.error('Unable to verify the Razorpay payment', error)
          completed = true
          onFailure()
          resolve()
        }
      }

      try {
        const rzp = new window.Razorpay({
          key: (import.meta.env.VITE_RAZORPAY_KEY_ID ?? '') as string,
          amount,
          currency,
          name: 'prayosha crystals',
          description: 'Sacred Crystal Collection',
          order_id: razorpayOrderId,
          prefill: {
            name: user?.name ?? '',
            email: user?.email ?? '',
            contact: user?.phone ?? '',
          },
          theme: { color: '#7B5EA7' },
          handler: response => { void handleSuccess(response) },
          modal: { ondismiss: () => { void handleFailure() } },
        })
        rzp.on('payment.failed', () => { void handleFailure() })
        rzp.open()
      } catch (error) {
        console.error('Unable to open Razorpay checkout', error)
        completed = true
        onFailure()
        resolve()
      }
    })
  }, [user])

  return { openRazorpay }
}
