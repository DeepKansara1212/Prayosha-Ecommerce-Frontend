import { useMemo, type FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import { COLLECTION_PRODUCTS } from '@/data/collection'
import type { Order } from '@/api/orders.api'

// ─── CheckoutSuccessPage ──────────────────────────────────────────────────────

const CheckoutSuccessPage: FC = () => {
  const order: Order | null = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('prayosha_last_order')
      return raw ? (JSON.parse(raw) as Order) : null
    } catch {
      return null
    }
  }, [])

  const goOrders = () => {
    window.location.hash = order ? `#/account/orders/${order.orderNumber}` : '#/account/orders'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goCollection = () => {
    window.location.hash = '#/collection'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Thumbnail row: up to 4 items from the order
  const thumbItems = useMemo(() => {
    if (!order) return []
    return order.items.slice(0, 4).map(item => {
      const product = COLLECTION_PRODUCTS.find(p => p.id === item.product.slug)
      return { ...item, product }
    })
  }, [order])

  return (
    <>
      <Navbar />
      <main style={{
        minHeight: '100vh', paddingTop: 72,
        background: 'radial-gradient(ellipse at 50% 30%, #E8DFF5 0%, #F5F0E8 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(40px, 8vw, 80px) clamp(24px, 5vw, 60px)',
      }}>
        <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>

          {/* Icon */}
          <div style={{
            width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px',
            background: 'linear-gradient(135deg, #F0EAF7, #E8DFF5)',
            border: '1px solid #D4C5E8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, color: '#7B5EA7',
          }}>
            ✦
          </div>

          {/* Eyebrow */}
          <p style={{
            fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase',
            letterSpacing: '0.28em', color: '#C49A3C', margin: '0 0 12px',
          }}>
            ✦ &nbsp;Order Placed
          </p>

          {/* Headline */}
          <h1 style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300,
            fontSize: 'clamp(28px, 5vw, 42px)', color: '#1C1A17', lineHeight: 1.15, margin: '0 0 8px',
          }}>
            Your order is placed
          </h1>
          <p style={{
            fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300,
            fontSize: 'clamp(20px, 3vw, 28px)', color: '#7B5EA7', fontStyle: 'italic', margin: '0 0 28px',
          }}>
            beautifully
          </p>

          {/* Order number */}
          {order && (
            <div style={{
              display: 'inline-block', padding: '14px 28px', marginBottom: 32,
              background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 6,
            }}>
              <p style={{ fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6B6057', margin: '0 0 4px' }}>
                Order Number
              </p>
              <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 16, color: '#1C1A17', margin: 0 }}>
                {order.orderNumber}
              </p>
            </div>
          )}

          {/* Item thumbnails */}
          {thumbItems.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
              {thumbItems.map((item, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  {item.product ? (
                    <div
                      className={item.product.bgClass ?? ''}
                      style={{
                        width: 56, height: 56, borderRadius: 6, margin: '0 auto 4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                      }}
                    >
                      {item.product.emoji}
                    </div>
                  ) : (
                    <div style={{
                      width: 56, height: 56, borderRadius: 6, background: '#EDE8DC',
                      margin: '0 auto 4px',
                    }} />
                  )}
                  <p style={{ fontFamily: 'Jost', fontSize: 10, color: '#9E9590', margin: 0 }}>
                    ×{item.quantity}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Subtext */}
          <p style={{
            fontFamily: 'Jost', fontSize: 13, color: '#6B6057', lineHeight: 1.75,
            maxWidth: 380, margin: '0 auto 36px',
          }}>
            Your crystals have been moon-cleansed and are being wrapped with intention.
            You'll receive a confirmation shortly.
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={goOrders}
              style={{
                background: '#7B5EA7', color: '#fff', border: 'none', borderRadius: 4,
                fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                padding: '14px 28px', cursor: 'pointer',
                transition: 'background 150ms',
              }}
            >
              Track Order
            </button>
            <button
              onClick={goCollection}
              style={{
                background: 'none', color: '#6B6057',
                border: '1px solid #E2DAC8', borderRadius: 4,
                fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                padding: '14px 28px', cursor: 'pointer',
                transition: 'border-color 150ms, color 150ms',
              }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default CheckoutSuccessPage
