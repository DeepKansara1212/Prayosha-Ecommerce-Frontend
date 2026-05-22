import { useState, type FC } from 'react'
import {
  useCartStore,
  selectSubtotal,
  selectDiscountAmount,
  selectTotal,
  SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from '@/store/cartStore'
import { COLLECTION_PRODUCTS } from '@/data/collection'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  onContinue: () => void
  onBack: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

const ReviewStep: FC<Props> = ({ onContinue, onBack }) => {
  const items          = useCartStore(s => s.items)
  const coupon         = useCartStore(s => s.coupon)
  const applyCoupon    = useCartStore(s => s.applyCoupon)
  const removeCoupon   = useCartStore(s => s.removeCoupon)
  const isLoading      = useCartStore(s => s.isLoading)
  const subtotal       = useCartStore(selectSubtotal)
  const discountAmount = useCartStore(selectDiscountAmount)
  const total          = useCartStore(selectTotal)

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')

  const discountedSubtotal = Math.max(0, subtotal - discountAmount)
  const shipping = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST

  const handleApply = async () => {
    const code = couponInput.trim()
    if (!code) return
    setCouponError('')
    try {
      await applyCoupon(code)
      setCouponInput('')
    } catch {
      setCouponError('Invalid or expired coupon code.')
    }
  }

  const handleRemove = async () => {
    setCouponError('')
    await removeCoupon()
  }

  return (
    <div>
      {/* Item list */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: '#6B6057', margin: '0 0 14px',
        }}>
          Order Items
        </p>
        {items.map(item => {
          const product = COLLECTION_PRODUCTS.find(p => p.id === item.productId)
          if (!product) return null
          return (
            <div key={item.productId} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 0', borderBottom: '1px solid #E2DAC8',
            }}>
              <div
                className={product.bgClass ?? ''}
                style={{
                  width: 56, height: 56, flexShrink: 0, borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}
              >
                {product.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17',
                  margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#9E9590', margin: 0 }}>
                  Qty: {item.quantity}
                </p>
              </div>
              <p style={{ fontFamily: 'Jost', fontSize: 14, fontWeight: 500, color: '#1C1A17', flexShrink: 0, margin: 0 }}>
                ₹{(item.priceAtAdd * item.quantity).toLocaleString('en-IN')}
              </p>
            </div>
          )
        })}
      </div>

      {/* Coupon */}
      <div style={{
        padding: 20, marginBottom: 24,
        background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
      }}>
        <p style={{
          fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase',
          letterSpacing: '0.1em', color: '#6B6057', margin: '0 0 14px',
        }}>
          Coupon Code
        </p>

        {coupon ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#E8F0EA', border: '1px solid #B8D4BE', borderRadius: 6, padding: '10px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg viewBox="0 0 20 20" width={16} height={16} fill="none" stroke="#5A8A6A" strokeWidth="1.5">
                <path d="M16.5 7.5 8 16l-4-4 1.5-1.5L8 13l7-7 1.5 1.5Z" />
              </svg>
              <span style={{ fontFamily: 'Jost', fontSize: 13, fontWeight: 500, color: '#5A8A6A' }}>
                {coupon.code}
              </span>
              <span style={{ fontFamily: 'Jost', fontSize: 12, color: '#5A8A6A' }}>
                — You save ₹{coupon.discountAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={handleRemove}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
                fontFamily: 'Jost', fontSize: 12, color: '#6B6057',
                transition: 'color 150ms',
              }}
              aria-label="Remove coupon"
            >
              ✕
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                value={couponInput}
                onChange={e => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                onKeyDown={e => { if (e.key === 'Enter') void handleApply() }}
                placeholder="Enter coupon code"
                className="acct-input"
                style={{ borderRadius: '4px 0 0 4px', flex: 1 }}
              />
              <button
                onClick={() => void handleApply()}
                disabled={isLoading || !couponInput.trim()}
                style={{
                  flexShrink: 0, padding: '0 20px',
                  background: '#C49A3C', color: '#fff', border: 'none',
                  borderRadius: '0 4px 4px 0', cursor: 'pointer',
                  fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                  opacity: isLoading || !couponInput.trim() ? 0.6 : 1,
                  transition: 'background 150ms',
                }}
              >
                {isLoading ? '…' : 'Apply'}
              </button>
            </div>
            {couponError && (
              <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#A85050', margin: '6px 0 0' }}>
                {couponError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div style={{
        padding: 20, marginBottom: 32,
        background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
      }}>
        <Row label="Subtotal" value={`₹${subtotal.toLocaleString('en-IN')}`} />
        {discountAmount > 0 && coupon && (
          <Row label={`Discount (${coupon.code})`} value={`−₹${discountAmount.toLocaleString('en-IN')}`} valueColor="#5A8A6A" labelColor="#5A8A6A" />
        )}
        <Row
          label="Shipping"
          value={shipping === 0 ? 'Free' : `₹${shipping}`}
          valueColor={shipping === 0 ? '#5A8A6A' : undefined}
        />
        <div style={{ height: 1, background: '#E2DAC8', margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Jost', fontSize: 14, fontWeight: 500, color: '#1C1A17' }}>Total</span>
          <span style={{ fontFamily: 'Jost', fontSize: 17, fontWeight: 500, color: '#C49A3C' }}>
            ₹{total.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={onContinue} className="acct-btn-gold" style={{ width: '100%' }}>
          Continue to Payment
        </button>
        <button onClick={onBack} className="acct-btn-ghost" style={{ width: '100%' }}>
          Back
        </button>
      </div>
    </div>
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const Row: FC<{
  label: string
  value: string
  labelColor?: string
  valueColor?: string
}> = ({ label, value, labelColor = '#6B6057', valueColor = '#1C1A17' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
    <span style={{ fontFamily: 'Jost', fontSize: 13, color: labelColor }}>{label}</span>
    <span style={{ fontFamily: 'Jost', fontSize: 13, color: valueColor }}>{value}</span>
  </div>
)

export default ReviewStep
