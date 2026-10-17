import { useState, type FC } from 'react'
import { useCartStore, selectTotal } from '@/store/cartStore'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  onPlaceOrder: () => Promise<void>
  onBack: () => void
  redeemPoints: number
}

// ─── Component ────────────────────────────────────────────────────────────────

const PaymentStep: FC<Props> = ({ onPlaceOrder, onBack, redeemPoints }) => {
  const total = useCartStore(selectTotal)

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const pointsDiscount = redeemPoints / 10
  const displayTotal = Math.max(0, total - pointsDiscount)

  const handlePlace = async () => {
    setError('')
    setLoading(true)
    try {
      await onPlaceOrder()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{
        padding: 20, marginBottom: 24,
        background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
      }}>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: '0 0 6px' }}>
          Pay Online
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057', margin: '0 0 8px' }}>
          Card · UPI · Net Banking · Wallets
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#7B5EA7', margin: 0 }}>
          ✦ Secured by Razorpay
        </p>
      </div>

      {/* Checkout total */}
      {redeemPoints > 0 && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 8,
          padding: '12px 16px', marginBottom: 20,
          background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
        }}>
          {redeemPoints > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A8A6A' }}>
                {redeemPoints} points redeemed
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A8A6A' }}>
                −₹{pointsDiscount.toFixed(2)}
              </span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057' }}>
              Total to pay
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: '#C49A3C' }}>
              ₹{displayTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          padding: '10px 14px', marginBottom: 16, borderRadius: 4,
          background: '#FDF0F0', border: '1px solid #E2C8C8',
          fontFamily: 'var(--font-body)', fontSize: 13, color: '#A85050',
        }}>
          {error}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={() => void handlePlace()}
          disabled={loading}
          className="acct-btn-gold"
          style={{ width: '100%' }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{
                width: 14, height: 14, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.35)',
                borderTopColor: '#fff',
                animation: 'ck-spin 0.7s linear infinite',
                display: 'inline-block', flexShrink: 0,
              }} />
              Placing Order…
            </span>
          ) : (
            `Place Order · ₹${displayTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          )}
        </button>
        <button onClick={onBack} disabled={loading} className="acct-btn-ghost" style={{ width: '100%' }}>
          Back
        </button>
      </div>
    </div>
  )
}

export default PaymentStep
