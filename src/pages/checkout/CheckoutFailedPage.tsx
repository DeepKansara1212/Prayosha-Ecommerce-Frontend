import { useMemo, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'

// ─── CheckoutFailedPage ───────────────────────────────────────────────────────

const CheckoutFailedPage: FC = () => {
  const navigate = useNavigate()
  const failedOrder = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('prayosha_last_order_failed')
      return raw ? (JSON.parse(raw) as { orderNumber?: string }) : null
    } catch {
      return null
    }
  }, [])

  const retry = () => {
    navigate('/checkout')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goContact = () => {
    navigate('/contact')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goCollection = () => {
    navigate('/collection')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh', paddingTop: 72,
        background: 'radial-gradient(ellipse at 50% 30%, #F5E8E8 0%, #F5F0E8 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px, 8vw, 80px) clamp(24px, 5vw, 60px)',
      }}>
        <div style={{ maxWidth: 500, width: '100%', textAlign: 'center' }}>

          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #FDF0F0, #FAE8E8)',
            border: '1px solid #E8C8C8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#A85050" strokeWidth="1.5" width={28} height={28}>
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>

          {/* Eyebrow */}
          <p style={{
            fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase',
            letterSpacing: '0.28em', color: '#A85050', margin: '0 0 12px',
          }}>
            Payment Failed
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300,
            fontSize: 'clamp(26px, 5vw, 38px)', color: '#1C1A17', lineHeight: 1.2, margin: '0 0 16px',
          }}>
            Something went wrong
          </h1>

          {/* Order reference */}
          {failedOrder?.orderNumber && (
            <div style={{
              display: 'inline-block', padding: '12px 24px', marginBottom: 24,
              background: '#FDF0F0', border: '1px solid #E8C8C8', borderRadius: 6,
            }}>
              <p style={{ fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A85050', margin: '0 0 4px' }}>
                Reference
              </p>
              <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: 0 }}>
                {failedOrder.orderNumber}
              </p>
            </div>
          )}

          {/* Message */}
          <p style={{
            fontFamily: 'Jost', fontSize: 13, color: '#6B6057', lineHeight: 1.75,
            maxWidth: 360, margin: '0 auto 12px',
          }}>
            Your payment could not be processed. No amount has been deducted.
          </p>
          <p style={{
            fontFamily: 'Jost', fontSize: 13, color: '#6B6057', lineHeight: 1.75,
            maxWidth: 360, margin: '0 auto 36px',
          }}>
            Please try again or contact our support team if the issue persists.
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={retry}
              style={{
                background: '#C49A3C', color: '#fff', border: 'none', borderRadius: 4,
                fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                padding: '14px 28px', cursor: 'pointer',
                transition: 'background 150ms',
              }}
            >
              Try Again
            </button>
            <button
              onClick={goContact}
              style={{
                background: 'none', color: '#A85050',
                border: '1px solid #E8C8C8', borderRadius: 4,
                fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                padding: '14px 28px', cursor: 'pointer',
                transition: 'border-color 150ms, color 150ms',
              }}
            >
              Contact Support
            </button>
          </div>

          {/* Back to shopping */}
          <button
            onClick={goCollection}
            style={{
              marginTop: 20, background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'Jost', fontSize: 12, color: '#9E9590',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            Back to collection
          </button>
        </div>
      </main>
    </>
  )
}

export default CheckoutFailedPage
