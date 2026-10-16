import { type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'

// ─── CheckoutFailedPage ───────────────────────────────────────────────────────

const CheckoutFailedPage: FC = () => {
  const navigate = useNavigate()

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
            fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: '#A85050', margin: '0 0 12px',
          }}>
            Payment Failed
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-heading)', fontWeight: 400,
            fontSize: 'clamp(26px, 5vw, 38px)', color: '#1C1A17', lineHeight: 1.2, margin: '0 0 16px',
          }}>
            Something went wrong
          </h1>

          {/* Message */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057', lineHeight: 1.75,
            maxWidth: 360, margin: '0 auto 12px',
          }}>
            Your payment could not be processed. No amount has been deducted.
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057', lineHeight: 1.75,
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
                fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em',
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
                fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em',
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
              fontFamily: 'var(--font-body)', fontSize: 13, color: '#5A4638',
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
