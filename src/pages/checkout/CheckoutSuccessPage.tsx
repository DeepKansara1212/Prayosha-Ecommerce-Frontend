import { useMemo, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { COLLECTION_PRODUCTS } from '@/data/collection'
import type { Order } from '@/api/orders.api'

// ─── CheckoutSuccessPage ──────────────────────────────────────────────────────

const CheckoutSuccessPage: FC = () => {
  const navigate = useNavigate()

  const order: Order | null = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('prayosha_last_order')
      return raw ? (JSON.parse(raw) as Order) : null
    } catch {
      return null
    }
  }, [])

  const goOrders = () => {
    navigate(order ? `/account/orders/${order.orderNumber}` : '/account/orders')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goCollection = () => {
    navigate('/collection')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Match static product by name to get emoji/bgClass for display
  const orderItems = useMemo(() => {
    if (!order) return []
    return order.items.map(item => ({
      ...item,
      staticProduct: COLLECTION_PRODUCTS.find(p => p.name === item.name),
    }))
  }, [order])

  return (
    <>
      <style>{`
        @media (max-width: 720px) {
          .success-grid { grid-template-columns: 1fr !important; }
          .success-hero-title { font-size: clamp(28px, 8vw, 42px) !important; }
        }
      `}</style>

      <Navbar />

      <main style={{ minHeight: '100vh', background: '#F5F0E8' }}>

        {/* ── Hero ── */}
        <div style={{
          position: 'relative', overflow: 'hidden', textAlign: 'center',
          background: 'radial-gradient(ellipse at 50% 0%, #2A3D2F 0%, #1A251E 50%, #1C1410 100%)',
          paddingTop: 'clamp(88px, 16vw, 128px)',
          paddingBottom: 'clamp(56px, 10vw, 96px)',
          paddingLeft: 'clamp(24px, 5vw, 80px)',
          paddingRight: 'clamp(24px, 5vw, 80px)',
        }}>
          {/* Decorative SVG */}
          <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }} viewBox="0 0 900 420" fill="none">
            <polygon points="450,24 830,170 830,350 450,390 70,350 70,170" stroke="#B8956A" strokeWidth="0.8" fill="none" />
            <circle cx="450" cy="210" r="148" stroke="#B8956A" strokeWidth="0.4" fill="none" />
            <circle cx="450" cy="210" r="220" stroke="#B8956A" strokeWidth="0.3" fill="none" opacity="0.5" />
          </svg>
          <div aria-hidden="true" style={{ position: 'absolute', top: 0, right: '28%', width: 320, height: 320, borderRadius: '50%', background: '#6A8570', opacity: 0.13, filter: 'blur(90px)', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', bottom: 0, left: '20%', width: 240, height: 240, borderRadius: '50%', background: '#7B5EA7', opacity: 0.08, filter: 'blur(80px)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Checkmark icon */}
            <div style={{
              width: 80, height: 80, borderRadius: '50%', margin: '0 auto 32px',
              background: 'rgba(90, 138, 106, 0.18)',
              border: '1px solid rgba(90, 138, 106, 0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" width={34} height={34} fill="none" stroke="#6A8570" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>

            {/* Eyebrow */}
            <p style={{
              fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '0.35em', color: '#C49A3C', margin: '0 0 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
            }}>
              <span style={{ width: 32, height: 1, background: '#C49A3C', display: 'inline-block' }} />
              Order Confirmed
              <span style={{ width: 32, height: 1, background: '#C49A3C', display: 'inline-block' }} />
            </p>

            {/* Headline */}
            <h1 className="success-hero-title" style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300,
              fontSize: 'clamp(34px, 5.5vw, 58px)', color: '#F5F0E8',
              lineHeight: 1.1, margin: '0 0 6px',
            }}>
              Thank you for your
            </h1>
            <h1 className="success-hero-title" style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic',
              fontSize: 'clamp(34px, 5.5vw, 58px)', color: '#9B7EC8',
              lineHeight: 1.1, margin: '0 0 36px',
            }}>
              sacred order
            </h1>

            {/* Order number pill */}
            {order && (
              <div style={{
                display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
                padding: '18px 48px',
                background: 'rgba(255,255,255,0.055)',
                border: '1px solid rgba(196,154,60,0.28)',
                borderRadius: 6,
              }}>
                <p style={{ fontFamily: 'Jost', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#C49A3C', margin: '0 0 7px' }}>
                  Order Number
                </p>
                <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 19, color: '#F5F0E8', margin: 0, letterSpacing: '0.04em' }}>
                  {order.orderNumber}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Content grid ── */}
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 'clamp(40px, 7vw, 72px) clamp(24px, 5vw, 48px)' }}>
          <div
            className="success-grid"
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 308px', gap: 32, alignItems: 'start' }}
          >

            {/* ── Left column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

              {/* Items */}
              {orderItems.length > 0 && (
                <div style={{ background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2DAC8' }}>
                    <p style={{ fontFamily: 'Jost', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#9E9590', margin: 0 }}>
                      Items Ordered
                    </p>
                  </div>
                  <div style={{ padding: '0 24px' }}>
                    {orderItems.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '18px 0',
                        borderBottom: i < orderItems.length - 1 ? '1px solid #E2DAC8' : 'none',
                      }}>
                        {/* Thumbnail */}
                        <div
                          className={item.staticProduct?.bgClass ?? ''}
                          style={{
                            width: 60, height: 60, flexShrink: 0, borderRadius: 4,
                            background: item.staticProduct?.bgClass ? undefined : '#D8D0C4',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 26, overflow: 'hidden',
                          }}
                        >
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            item.staticProduct?.emoji ?? '💎'
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400,
                            fontSize: 17, color: '#1C1A17', margin: '0 0 3px',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {item.name}
                          </p>
                          <p style={{ fontFamily: 'Jost', fontSize: 11, color: '#9E9590', margin: 0 }}>
                            Qty {item.quantity}
                          </p>
                        </div>

                        {/* Line total */}
                        <p style={{ fontFamily: 'Jost', fontSize: 14, color: '#1C1A17', flexShrink: 0, margin: 0, fontWeight: 400 }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping address */}
              {order?.shippingAddress && (
                <div style={{ background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2DAC8' }}>
                    <p style={{ fontFamily: 'Jost', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#9E9590', margin: 0 }}>
                      Shipping To
                    </p>
                  </div>
                  <div style={{ padding: '20px 24px', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <svg viewBox="0 0 20 24" width={16} height={16} fill="none" stroke="#9E9590" strokeWidth="1.3" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M10 1C6.13 1 3 4.13 3 8c0 5.25 7 15 7 15s7-9.75 7-15c0-3.87-3.13-7-7-7Z" />
                      <circle cx="10" cy="8" r="2.5" />
                    </svg>
                    <div>
                      <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 17, fontWeight: 400, color: '#1C1A17', margin: '0 0 5px' }}>
                        {order.shippingAddress.fullName}
                      </p>
                      <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#6B6057', margin: 0, lineHeight: 1.7 }}>
                        {order.shippingAddress.line1}
                        {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                        <br />
                        {order.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right column ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Order total */}
              {order && (
                <div style={{ background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2DAC8' }}>
                    <p style={{ fontFamily: 'Jost', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#9E9590', margin: 0 }}>
                      Payment Summary
                    </p>
                  </div>
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {order.discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'Jost', fontSize: 12, color: '#9E9590' }}>Discount</span>
                        <span style={{ fontFamily: 'Jost', fontSize: 12, color: '#5A8A6A' }}>−₹{order.discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'Jost', fontSize: 12, color: '#9E9590' }}>Payment</span>
                      <span style={{ fontFamily: 'Jost', fontSize: 12, color: '#5A8A6A', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <svg viewBox="0 0 14 14" width={11} height={11} fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M11.5 3.5 5.5 10 2.5 7" /></svg>
                        Confirmed
                      </span>
                    </div>
                    <div style={{ height: 1, background: '#E2DAC8' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6057' }}>Total Paid</span>
                      <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 28, fontWeight: 300, color: '#C49A3C' }}>
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* What happens next */}
              <div style={{ background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2DAC8' }}>
                  <p style={{ fontFamily: 'Jost', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.22em', color: '#9E9590', margin: 0 }}>
                    What Happens Next
                  </p>
                </div>
                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {([
                    { icon: '✦', label: 'Packed with intention', sub: 'Moon-cleansed & sacred packaging' },
                    { icon: '📦', label: 'Dispatched in 1–2 days', sub: 'Tracking link sent to your email' },
                    { icon: '🌙', label: 'Delivered to your door', sub: '3–7 business days' },
                  ] as const).map((step, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      paddingBottom: i < 2 ? 14 : 0,
                      marginBottom: i < 2 ? 14 : 0,
                      borderBottom: i < 2 ? '1px solid #E2DAC8' : 'none',
                    }}>
                      <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{step.icon}</span>
                      <div>
                        <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#1C1A17', margin: '0 0 2px' }}>{step.label}</p>
                        <p style={{ fontFamily: 'Jost', fontSize: 11, color: '#9E9590', margin: 0 }}>{step.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <button
                onClick={goOrders}
                style={{
                  width: '100%', background: '#1C1A17', color: '#F5F0E8',
                  border: 'none', borderRadius: 4,
                  fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em',
                  padding: '15px 0', cursor: 'pointer', transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#3A342E')}
                onMouseLeave={e => (e.currentTarget.style.background = '#1C1A17')}
              >
                Track Order
              </button>
              <button
                onClick={goCollection}
                style={{
                  width: '100%', background: 'none', color: '#6B6057',
                  border: '1px solid #E2DAC8', borderRadius: 4,
                  fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.16em',
                  padding: '15px 0', cursor: 'pointer', transition: 'border-color 150ms, color 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#C4B89A'; e.currentTarget.style.color = '#1C1A17' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2DAC8'; e.currentTarget.style.color = '#6B6057' }}
              >
                Continue Shopping
              </button>

              {/* Confirmation note */}
              <p style={{ fontFamily: 'Jost', fontSize: 11, color: '#B0A99F', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
                A confirmation email has been sent to your registered address.
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default CheckoutSuccessPage
