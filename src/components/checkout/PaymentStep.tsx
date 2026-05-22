import { useState, type FC } from 'react'
import { useCartStore, selectTotal } from '@/store/cartStore'

// ─── Constants ────────────────────────────────────────────────────────────────

const COD_SURCHARGE = 50

// ─── Props ────────────────────────────────────────────────────────────────────

type PaymentMethod = 'razorpay' | 'cod'

interface Props {
  onPlaceOrder: (method: PaymentMethod) => Promise<void>
  onBack: () => void
}

// ─── Payment method card ──────────────────────────────────────────────────────

const MethodCard: FC<{
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}> = ({ selected, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      display: 'block', width: '100%', textAlign: 'left',
      background: selected ? '#F0EAF7' : '#fff',
      border: selected ? '2px solid #7B5EA7' : '1px solid #E2DAC8',
      borderRadius: 6, padding: 20, cursor: 'pointer',
      transition: 'border-color 150ms, background 150ms',
    }}
  >
    {children}
  </button>
)

const RadioDot: FC<{ selected: boolean }> = ({ selected }) => (
  <div style={{
    width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
    border: selected ? '5px solid #7B5EA7' : '2px solid #C4B89A',
    background: '#fff', transition: 'border 150ms',
  }} />
)

// ─── Component ────────────────────────────────────────────────────────────────

const PaymentStep: FC<Props> = ({ onPlaceOrder, onBack }) => {
  const total = useCartStore(selectTotal)

  const [method, setMethod]   = useState<PaymentMethod>('razorpay')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const displayTotal = method === 'cod' ? total + COD_SURCHARGE : total

  const handlePlace = async () => {
    setError('')
    setLoading(true)
    try {
      await onPlaceOrder(method)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Payment method cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>

        {/* Razorpay */}
        <MethodCard selected={method === 'razorpay'} onClick={() => setMethod('razorpay')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: method === 'razorpay' ? 8 : 0 }}>
            <RadioDot selected={method === 'razorpay'} />
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: 0 }}>
                Pay Online
              </p>
              <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#6B6057', margin: '3px 0 0' }}>
                Card · UPI · Net Banking · Wallets
              </p>
            </div>
            {/* Badge icons */}
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {['VISA', 'UPI', 'RuPay'].map(label => (
                <span key={label} style={{
                  padding: '3px 7px', border: '1px solid #E2DAC8', borderRadius: 4,
                  fontFamily: 'Jost', fontSize: 9, color: '#6B6057',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
          {method === 'razorpay' && (
            <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#7B5EA7', marginLeft: 30, marginBottom: 0 }}>
              ✦ Secured by Razorpay
            </p>
          )}
        </MethodCard>

        {/* Cash on Delivery */}
        <MethodCard selected={method === 'cod'} onClick={() => setMethod('cod')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: method === 'cod' ? 8 : 0 }}>
            <RadioDot selected={method === 'cod'} />
            <div>
              <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: 0 }}>
                Cash on Delivery
              </p>
              <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#6B6057', margin: '3px 0 0' }}>
                +₹{COD_SURCHARGE} handling charge
              </p>
            </div>
          </div>
          {method === 'cod' && (
            <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#6B6057', marginLeft: 30, marginBottom: 0 }}>
              Pay when your crystals arrive
            </p>
          )}
        </MethodCard>
      </div>

      {/* COD total update */}
      {method === 'cod' && (
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px', marginBottom: 20,
          background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
        }}>
          <span style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057' }}>
            Total (incl. COD charge)
          </span>
          <span style={{ fontFamily: 'Jost', fontSize: 16, fontWeight: 500, color: '#C49A3C' }}>
            ₹{displayTotal.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          padding: '10px 14px', marginBottom: 16, borderRadius: 4,
          background: '#FDF0F0', border: '1px solid #E2C8C8',
          fontFamily: 'Jost', fontSize: 13, color: '#A85050',
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
            `Place Order · ₹${displayTotal.toLocaleString('en-IN')}`
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
