import { useEffect, useRef, useState, type FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useCartStore, selectSubtotal, selectDiscountAmount } from '@/store/cartStore'
import { validateCoupon } from '@/api/cart.api'
import { getWalletBalance } from '@/api/wallet.api'
import { adapt } from '@/hooks/useProducts'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  onCashbackChange: (used: number, earned: number) => void
  onContinue: () => void
  onBack: () => void
  shippingCharge: number
  shippingLoading: boolean
  shippingError?: string
  onRetryShipping: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

const ReviewStep: FC<Props> = ({
  onCashbackChange,
  onContinue,
  onBack,
  shippingCharge,
  shippingLoading,
  shippingError,
  onRetryShipping,
}) => {
  const items          = useCartStore(s => s.items)
  const coupon         = useCartStore(s => s.coupon)
  const applyCoupon    = useCartStore(s => s.applyCoupon)
  const removeCoupon   = useCartStore(s => s.removeCoupon)
  const isLoading      = useCartStore(s => s.isLoading)
  const subtotal       = useCartStore(selectSubtotal)
  const storedDiscountAmount = useCartStore(selectDiscountAmount)

  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const syncedCouponCode = useRef<string | null>(null)
  const walletQuery = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: getWalletBalance,
  })
  const existingCouponQuery = useQuery({
    queryKey: ['checkout-coupon', coupon?.code],
    queryFn: () => validateCoupon(coupon!.code),
    enabled: !!coupon && storedDiscountAmount === 0,
    retry: false,
  })

  const discountAmount = coupon
    ? storedDiscountAmount || existingCouponQuery.data?.discountAmount || 0
    : 0
  const productTotal = Math.max(0, subtotal - discountAmount)
  const cashbackBalance = walletQuery.data?.cashbackBalance ?? 0
  const cashbackUsed = Math.round(Math.min(cashbackBalance, productTotal) * 50) / 100
  const cashbackEarned = Math.round(Math.max(0, productTotal - cashbackUsed) * 2) / 100
  const payableTotal = Math.max(0, productTotal + shippingCharge - cashbackUsed)
  const couponSyncFailed = !!coupon && (existingCouponQuery.isError || !!couponError)
  const walletUnavailable = walletQuery.isLoading || walletQuery.isError

  useEffect(() => {
    onCashbackChange(cashbackUsed, cashbackEarned)
  }, [cashbackUsed, cashbackEarned, onCashbackChange])

  useEffect(() => {
    if (
      coupon &&
      storedDiscountAmount === 0 &&
      existingCouponQuery.data &&
      syncedCouponCode.current !== coupon.code
    ) {
      const code = coupon.code
      syncedCouponCode.current = code
      void applyCoupon(code, existingCouponQuery.data.discountAmount).catch(() => {
        syncedCouponCode.current = null
        setCouponError('Could not refresh the applied coupon. Please retry.')
      })
    }
  }, [applyCoupon, coupon, existingCouponQuery.data, storedDiscountAmount])

  const handleApply = async () => {
    const code = couponInput.trim()
    if (!code) return
    setCouponError('')
    try {
      const result = await validateCoupon(code)
      await applyCoupon(code, result.discountAmount)
      setCouponInput('')
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setCouponError(msg || 'Invalid or expired coupon code.')
    }
  }

  const handleRemove = async () => {
    setCouponError('')
    await removeCoupon()
  }

  const retryCouponSync = () => {
    setCouponError('')
    if (existingCouponQuery.isError) {
      void existingCouponQuery.refetch()
    } else if (coupon && existingCouponQuery.data) {
      syncedCouponCode.current = null
      void applyCoupon(coupon.code, existingCouponQuery.data.discountAmount).catch(() => {
        setCouponError('Could not refresh the applied coupon. Please retry.')
      })
    }
  }

  return (
    <div>
      {/* Item list */}
      <div style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase',
          letterSpacing: '0.05em', color: '#6B6057', margin: '0 0 14px',
        }}>
          Order Items
        </p>
        {items.map(item => {
          if (!item.product) return null
          const product = adapt(item.product)
          return (
            <div key={item.productId} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '12px 0', borderBottom: '1px solid #E2DAC8',
            }}>
              <div
                className={product.images.length === 0 ? (product.bgClass ?? '') : ''}
                style={{
                  width: 56, height: 56, flexShrink: 0, borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                  overflow: 'hidden',
                }}
              >
                {product.images.length > 0
                  ? <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : product.emoji}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: '#1C1A17',
                  margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {product.name}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A4638', margin: 0 }}>
                  Qty: {item.quantity}
                </p>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#1C1A17', flexShrink: 0, margin: 0 }}>
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
          fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase',
          letterSpacing: '0.05em', color: '#6B6057', margin: '0 0 14px',
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
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, color: '#5A8A6A' }}>
                {coupon.code}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A8A6A' }}>
                — You save ₹{coupon.discountAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <button
              onClick={handleRemove}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px',
                fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057',
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
                  fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em',
                  opacity: isLoading || !couponInput.trim() ? 0.6 : 1,
                  transition: 'background 150ms',
                }}
              >
                {isLoading ? '…' : 'Apply'}
              </button>
            </div>
            {couponError && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A85050', margin: '6px 0 0' }}>
                {couponError}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Cashback wallet */}
      <div style={{
        padding: 20, marginBottom: 24,
        background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase',
          letterSpacing: '0.05em', color: '#6B6057', margin: '0 0 8px',
        }}>
          Cashback Wallet
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057', margin: '0 0 14px' }}>
          Available balance: {walletQuery.isLoading
            ? 'Loading…'
            : walletQuery.isError
              ? 'Unavailable'
              : `₹${cashbackBalance.toFixed(2)}`}
        </p>
        {walletQuery.isError && (
          <p role="alert" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A85050', margin: '0 0 12px' }}>
            Could not load your wallet balance. Retry before continuing.
            <button
              type="button"
              onClick={() => void walletQuery.refetch()}
              style={{ marginLeft: 8, color: '#7B5EA7', background: 'none', border: 0, cursor: 'pointer' }}
            >
              Retry
            </button>
          </p>
        )}
        {couponSyncFailed && (
          <p role="alert" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A85050', margin: '0 0 12px' }}>
            {couponError || 'Could not verify the applied coupon, so cashback cannot be calculated yet.'}
            <button
              type="button"
              onClick={retryCouponSync}
              style={{ marginLeft: 8, color: '#7B5EA7', background: 'none', border: 0, cursor: 'pointer' }}
            >
              Retry
            </button>
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A8A6A', margin: '0 0 6px' }}>
          Cashback applied automatically: −₹{cashbackUsed.toFixed(2)}
        </p>
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
          value={shippingLoading ? 'Calculating…' : shippingError ? 'Unavailable' : shippingCharge === 0 ? 'Free' : `₹${shippingCharge.toLocaleString('en-IN')}`}
          valueColor={shippingCharge === 0 && !shippingLoading && !shippingError ? '#5A8A6A' : undefined}
        />
        {shippingError && (
          <div role="alert" style={{ marginBottom: 10 }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#A85050', margin: '0 0 8px' }}>
              Could not calculate shipping: {shippingError}
            </p>
            <button type="button" onClick={onRetryShipping} className="acct-btn-ghost" style={{ padding: '8px 12px' }}>
              Retry rate
            </button>
          </div>
        )}
        {cashbackUsed > 0 && (
          <Row label="Wallet cashback" value={`−₹${cashbackUsed.toFixed(2)}`} valueColor="#5A8A6A" />
        )}
        <div style={{ height: 1, background: '#E2DAC8', margin: '14px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#1C1A17' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 500, color: '#C49A3C' }}>
            ₹{payableTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div style={{
          marginTop: 16, padding: '14px 16px',
          background: '#E8F0EA', border: '1px solid #B8D4BE', borderRadius: 6,
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: '#315F40', margin: '0 0 4px' }}>
            Pay ₹{payableTotal.toFixed(2)} + earn ₹{cashbackEarned.toFixed(2)} cashback
          </p>
          
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={onContinue}
          disabled={walletUnavailable || couponSyncFailed || existingCouponQuery.isLoading || shippingLoading || !!shippingError}
          className="acct-btn-gold"
          style={{ width: '100%' }}
        >
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
    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: labelColor }}>{label}</span>
    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: valueColor }}>{value}</span>
  </div>
)

export default ReviewStep
