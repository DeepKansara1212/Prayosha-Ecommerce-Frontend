import { useState, useMemo, useEffect, useRef, type FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import { useAuthStore } from '@/store/authStore'
import {
  useCartStore,
  selectSubtotal,
  selectDiscountAmount,
  selectTotal,
  SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from '@/store/cartStore'
import { COLLECTION_PRODUCTS } from '@/data/collection'
import AddressStep from '@/components/checkout/AddressStep'
import ReviewStep  from '@/components/checkout/ReviewStep'
import PaymentStep from '@/components/checkout/PaymentStep'
import { useRazorpay } from '@/hooks/useRazorpay'
import * as ordersApi from '@/api/orders.api'

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CHECKOUT_CSS = `
  @keyframes ck-spin { to { transform: rotate(360deg); } }

  /* Shared input/button tokens (mirrors AccountLayout's acct-* classes) */
  .acct-input {
    display: block; width: 100%; box-sizing: border-box;
    background: #EDE8DC; border: 1px solid #E2DAC8; border-radius: 4px;
    padding: 12px 16px;
    font-family: Jost, system-ui, sans-serif; font-size: 14px; color: #1C1A17;
    outline: none; transition: border-color 150ms, box-shadow 150ms;
  }
  .acct-input:focus { border-color: #7B5EA7; box-shadow: 0 0 0 3px #F0EAF7; }
  .acct-input::placeholder { color: #C4B89A; }

  .acct-btn-gold {
    display: inline-flex; align-items: center; justify-content: center;
    background: #C49A3C; color: #fff; border: none; border-radius: 4px;
    font-family: Jost, system-ui, sans-serif; font-size: 11px; font-weight: 400;
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 14px 28px; cursor: pointer;
    transition: background 150ms, transform 100ms;
  }
  .acct-btn-gold:hover:not(:disabled) { background: #D4B060; transform: translateY(-1px); }
  .acct-btn-gold:disabled { opacity: 0.6; cursor: not-allowed; }

  .acct-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    background: none; color: #6B6057;
    border: 1px solid #E2DAC8; border-radius: 4px;
    font-family: Jost, system-ui, sans-serif; font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 14px 24px; cursor: pointer;
    transition: border-color 150ms, color 150ms;
  }
  .acct-btn-ghost:hover:not(:disabled) { border-color: #C4B89A; color: #1C1A17; }
  .acct-btn-ghost:disabled { opacity: 0.6; cursor: not-allowed; }

  .acct-label {
    display: block;
    font-family: Jost, system-ui, sans-serif; font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.08em; color: #6B6057;
    margin-bottom: 6px;
  }
  .acct-error { font-family: Jost, sans-serif; font-size: 12px; color: #A85050; margin-top: 4px; }

  /* Two-column checkout layout */
  .ck-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 380px;
    gap: 48px;
    max-width: 1100px;
    margin: 0 auto;
  }
  .ck-sidebar-toggle { display: none; }
  .ck-sidebar-body   { display: block; }

  @media (max-width: 880px) {
    .ck-layout {
      grid-template-columns: 1fr;
    }
    .ck-sidebar { order: -1; }
    .ck-sidebar-toggle {
      display: flex; align-items: center; justify-content: space-between;
      width: 100%; padding: 14px 16px; cursor: pointer;
      background: #EDE8DC; border: 1px solid #E2DAC8; border-radius: 6px 6px 0 0;
      font-family: Jost, sans-serif; font-size: 12px; color: #1C1A17;
      border-bottom: none;
    }
    .ck-sidebar-body-collapsed { display: none; }
  }
`

// ─── Step indicator ───────────────────────────────────────────────────────────

type Step = 1 | 2 | 3

const STEP_LABELS = ['Address', 'Review', 'Payment'] as const

const StepIndicator: FC<{ currentStep: Step }> = ({ currentStep }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
    {STEP_LABELS.map((label, i) => {
      const n = (i + 1) as Step
      const done   = n < currentStep
      const active = n === currentStep

      return (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: n < 3 ? 1 : undefined }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Dot */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: done ? '#5A8A6A' : active ? '#7B5EA7' : '#E2DAC8',
              color: done || active ? '#fff' : '#9E9590',
              fontFamily: 'Jost', fontSize: 11, fontWeight: 500,
              transition: 'background 250ms',
            }}>
              {done ? '✓' : '✦'}
            </div>
            {/* Label */}
            <span style={{
              fontFamily: active
                ? '"Cormorant Garamond", Georgia, serif'
                : 'Jost, system-ui, sans-serif',
              fontSize: active ? 18 : 13,
              fontWeight: active ? 400 : done ? 400 : 300,
              color: done ? '#5A8A6A' : active ? '#7B5EA7' : '#9E9590',
              whiteSpace: 'nowrap',
              transition: 'color 200ms',
            }}>
              {label}
            </span>
          </div>
          {/* Connector line */}
          {n < 3 && (
            <div style={{
              flex: 1, height: 1, margin: '0 12px',
              background: n < currentStep ? '#5A8A6A' : '#E2DAC8',
              transition: 'background 300ms',
            }} />
          )}
        </div>
      )
    })}
  </div>
)

// ─── Order summary sidebar ────────────────────────────────────────────────────

const OrderSidebar: FC = () => {
  const items          = useCartStore(s => s.items)
  const coupon         = useCartStore(s => s.coupon)
  const subtotal       = useCartStore(selectSubtotal)
  const discountAmount = useCartStore(selectDiscountAmount)
  const total          = useCartStore(selectTotal)

  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  const shipping = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

  const [open, setOpen] = useState(false)

  return (
    <aside className="ck-sidebar">
      {/* Mobile accordion toggle */}
      <button
        className="ck-sidebar-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span style={{ fontFamily: 'Jost', fontSize: 12, color: '#6B6057' }}>Order Summary</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Jost', fontSize: 14, fontWeight: 500, color: '#C49A3C' }}>
            ₹{total.toLocaleString('en-IN')}
          </span>
          <svg viewBox="0 0 16 16" width={14} height={14} fill="none" stroke="#6B6057" strokeWidth="1.5"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>
            <path d="M3 6l5 5 5-5" />
          </svg>
        </span>
      </button>

      {/* Sidebar body */}
      <div
        className={open ? 'ck-sidebar-body' : 'ck-sidebar-body ck-sidebar-body-collapsed'}
        style={{
          background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
          padding: 32, position: 'sticky', top: 96,
        }}
      >
        <p style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300,
          fontSize: 20, color: '#1C1A17', margin: '0 0 20px',
        }}>
          Order Summary
        </p>

        {/* Items */}
        <div style={{ marginBottom: 20 }}>
          {items.map(item => {
            const product = COLLECTION_PRODUCTS.find(p => p.id === item.productId)
            if (!product) return null
            return (
              <div key={item.productId} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 0', borderBottom: '1px solid #E2DAC8',
              }}>
                <div
                  className={product.bgClass ?? ''}
                  style={{
                    width: 48, height: 48, flexShrink: 0, borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                  }}
                >
                  {product.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: 'Jost', fontSize: 13, color: '#1C1A17', margin: '0 0 2px',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {product.name}
                  </p>
                  <p style={{ fontFamily: 'Jost', fontSize: 11, color: '#9E9590', margin: 0 }}>
                    Qty {item.quantity}
                  </p>
                </div>
                <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#1C1A17', flexShrink: 0, margin: 0 }}>
                  ₹{(item.priceAtAdd * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            )
          })}
        </div>

        {/* Price rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
          <SidebarRow label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
          {discountAmount > 0 && coupon && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: 'Jost', fontSize: 13, color: '#5A8A6A' }}>Discount</span>
                <span style={{
                  background: '#E8F0EA', border: '1px solid #B8D4BE', borderRadius: 10,
                  padding: '1px 8px', fontFamily: 'Jost', fontSize: 10, color: '#5A8A6A',
                }}>
                  {coupon.code} ✕
                </span>
              </div>
              <span style={{ fontFamily: 'Jost', fontSize: 13, color: '#5A8A6A' }}>
                −₹{discountAmount.toLocaleString('en-IN')}
              </span>
            </div>
          )}
          <SidebarRow
            label="Shipping"
            value={shipping === 0 ? 'Free' : `₹${shipping}`}
            valueColor={shipping === 0 ? '#5A8A6A' : '#1C1A17'}
          />
        </div>

        <div style={{ height: 1, background: '#E2DAC8', marginBottom: 16 }} />

        {/* Total */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontFamily: 'Jost', fontSize: 12, textTransform: 'uppercase',
            letterSpacing: '0.12em', color: '#6B6057',
          }}>
            Total
          </span>
          <span style={{ fontFamily: 'Jost', fontSize: 18, fontWeight: 500, color: '#C49A3C' }}>
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>

        {/* Trust signals */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E2DAC8', display: 'flex', gap: 16, justifyContent: 'center' }}>
          {[['🔒', 'Secure'], ['📦', 'Insured'], ['✦', 'Authentic']].map(([icon, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, margin: '0 0 4px' }}>{icon}</p>
              <p style={{ fontFamily: 'Jost', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9E9590', margin: 0 }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}

const SidebarRow: FC<{ label: string; value: string; valueColor?: string }> = ({ label, value, valueColor = '#1C1A17' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
    <span style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057' }}>{label}</span>
    <span style={{ fontFamily: 'Jost', fontSize: 13, color: valueColor }}>{value}</span>
  </div>
)

// ─── CheckoutPage ─────────────────────────────────────────────────────────────

const CheckoutPage: FC = () => {
  const user       = useAuthStore(s => s.user)
  const items      = useCartStore(s => s.items)
  const coupon     = useCartStore(s => s.coupon)
  const clearCart  = useCartStore(s => s.clearCart)
  const { openRazorpay } = useRazorpay()

  const [step, setStep]                       = useState<Step>(1)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  const hasAutoSelected = useRef(false)

  // Auth guard
  useEffect(() => {
    if (!user) window.location.hash = '#/auth/login'
  }, [user])

  // Cart guard
  useEffect(() => {
    if (items.length === 0) window.location.hash = '#/collection'
  }, [items.length])

  // Auto-select default address (once)
  useEffect(() => {
    if (!user || hasAutoSelected.current) return
    const def = user.addresses.find(a => a.isDefault) ?? user.addresses[0]
    if (def) {
      setSelectedAddressId(def._id)
      hasAutoSelected.current = true
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.addresses])

  const orderItems = useMemo(
    () => items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    [items],
  )

  if (!user || items.length === 0) return null

  const handlePlaceOrder = async (method: 'cod' | 'razorpay') => {
    if (!selectedAddressId) throw new Error('No address selected.')

    if (method === 'cod') {
      const order = await ordersApi.createCODOrder({
        items: orderItems,
        shippingAddressId: selectedAddressId,
        couponCode: coupon?.code,
      })
      sessionStorage.setItem('prayosha_last_order', JSON.stringify(order))
      await clearCart()
      window.location.hash = '#/checkout/success'
      return
    }

    // Razorpay
    const { razorpayOrderId, amount, currency, order } = await ordersApi.createRazorpayOrder({
      items: orderItems,
      shippingAddressId: selectedAddressId,
      couponCode: coupon?.code,
    })

    await openRazorpay(
      razorpayOrderId,
      amount,
      currency,
      order._id,
      async (verifiedOrder) => {
        sessionStorage.setItem('prayosha_last_order', JSON.stringify(verifiedOrder))
        await clearCart()
        window.location.hash = '#/checkout/success'
      },
      () => {
        sessionStorage.setItem('prayosha_last_order_failed', JSON.stringify({ orderNumber: order.orderNumber }))
        window.location.hash = '#/checkout/failed'
      },
    )
  }

  const stepTitles: Record<Step, string> = {
    1: 'Delivery Address',
    2: 'Review Your Order',
    3: 'Payment',
  }

  return (
    <>
      <style>{CHECKOUT_CSS}</style>
      <Navbar />

      <main style={{ minHeight: '100vh', background: '#F5F0E8', paddingTop: 72 }}>

        {/* Page header */}
        <div style={{ background: '#EDE8DC', borderBottom: '1px solid #E2DAC8', padding: 'clamp(20px, 3vw, 32px) clamp(24px, 5vw, 80px)' }}>
          <p style={{ fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#C49A3C', margin: '0 0 4px' }}>
            ✦ Checkout
          </p>
          <h1 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontSize: 'clamp(22px, 4vw, 34px)', color: '#1C1A17', margin: 0 }}>
            Complete Your Order
          </h1>
        </div>

        {/* Main content */}
        <div style={{ padding: 'clamp(24px, 4vw, 48px) clamp(24px, 5vw, 80px)' }}>
          <div className="ck-layout">

            {/* Left: steps */}
            <div>
              <StepIndicator currentStep={step} />

              <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400, fontSize: 22, color: '#1C1A17', margin: '0 0 24px' }}>
                {stepTitles[step]}
              </p>

              {step === 1 && (
                <AddressStep
                  selectedId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                  onContinue={() => setStep(2)}
                />
              )}
              {step === 2 && (
                <ReviewStep
                  onContinue={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}
              {step === 3 && (
                <PaymentStep
                  onPlaceOrder={handlePlaceOrder}
                  onBack={() => setStep(2)}
                />
              )}
            </div>

            {/* Right: sidebar */}
            <OrderSidebar />
          </div>
        </div>
      </main>
    </>
  )
}

export default CheckoutPage
