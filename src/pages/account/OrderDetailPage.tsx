import { useState, useEffect, type FC, type ReactNode } from 'react'
import AccountLayout from './AccountLayout'
import * as ordersApi from '@/api/orders.api'
import type { Order, OrderStatus } from '@/api/orders.api'
import StatusTimeline, { StatusTimelineSkeleton } from '@/components/ui/StatusTimeline'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function fmtPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

// ─── Status tracker ───────────────────────────────────────────────────────────

const STEPS: OrderStatus[] = ['placed', 'confirmed', 'processing', 'shipped', 'delivered']

const STEP_LABELS: Record<string, string> = {
  placed:     'Placed',
  confirmed:  'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
}

const StatusTracker: FC<{ status: OrderStatus }> = ({ status }) => {
  if (status === 'cancelled') {
    return (
      <div style={{
        background: '#FDF0F0', border: '1px solid #E2C8C8', borderRadius: 6,
        padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#A85050" strokeWidth="1.5" width={20} height={20}>
          <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
        </svg>
        <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#A85050', margin: 0 }}>
          This order has been cancelled.
        </p>
      </div>
    )
  }

  const currentIdx = STEPS.indexOf(status)

  return (
    <div style={{ position: 'relative', padding: '8px 0 4px' }}>
      {/* Connector line */}
      <div style={{
        position: 'absolute', top: 19, left: 0, right: 0, height: 2,
        background: '#E2DAC8', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: 19, left: 0, height: 2,
        width: `${(currentIdx / (STEPS.length - 1)) * 100}%`,
        background: '#7B5EA7', zIndex: 1,
        transition: 'width 0.6s ease',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
        {STEPS.map((step, idx) => {
          const completed = idx < currentIdx
          const current   = idx === currentIdx

          return (
            <div key={step} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {/* Dot */}
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: completed ? '#7B5EA7' : current ? '#fff' : '#fff',
                border: `2px solid ${completed ? '#7B5EA7' : current ? '#C49A3C' : '#C4B89A'}`,
                flexShrink: 0,
                boxShadow: current ? '0 0 0 3px rgba(196,154,60,0.2)' : 'none',
                animation: current ? 'acctPulse 2s ease-in-out infinite' : 'none',
              }}>
                {completed && (
                  <svg viewBox="0 0 10 8" fill="none" stroke="#fff" strokeWidth="1.5" width={10} height={8}>
                    <path d="M1 4l3 3 5-6" />
                  </svg>
                )}
                {current && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C49A3C' }} />
                )}
              </div>

              {/* Label */}
              <span style={{
                fontFamily: 'Jost', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
                color: completed ? '#7B5EA7' : current ? '#C49A3C' : '#C4B89A',
                textAlign: 'center',
              }}>
                {STEP_LABELS[step]}
              </span>
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes acctPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(196,154,60,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(196,154,60,0.08); }
        }
      `}</style>
    </div>
  )
}

// ─── Price row ────────────────────────────────────────────────────────────────

const PriceRow: FC<{ label: string; value: string; bold?: boolean; accent?: boolean }> = ({
  label, value, bold, accent,
}) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    padding: '7px 0',
  }}>
    <span style={{
      fontFamily: 'Jost', fontSize: 13,
      fontWeight: bold ? 500 : 400,
      color: bold ? '#1C1A17' : '#6B6057',
    }}>
      {label}
    </span>
    <span style={{
      fontFamily: 'Jost', fontSize: bold ? 16 : 13,
      fontWeight: bold ? 600 : 400,
      color: accent ? '#C49A3C' : bold ? '#1C1A17' : '#1C1A17',
    }}>
      {value}
    </span>
  </div>
)

// ─── Section card ─────────────────────────────────────────────────────────────

const Card: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <div style={{
    background: '#fff', border: '1px solid #E2DAC8', borderRadius: 6, marginBottom: 20,
  }}>
    <div style={{
      padding: '14px 20px', borderBottom: '1px solid #E2DAC8',
      fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: '#6B6057',
    }}>
      {title}
    </div>
    <div style={{ padding: '20px' }}>{children}</div>
  </div>
)

// ─── OrderDetailPage ──────────────────────────────────────────────────────────

interface OrderDetailPageProps {
  orderNumber: string
}

const OrderDetailPage: FC<OrderDetailPageProps> = ({ orderNumber }) => {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    ordersApi.getOrderByNumber(orderNumber)
      .then(setOrder)
      .catch(() => setError('Order not found.'))
      .finally(() => setLoading(false))
  }, [orderNumber])

  const goBack = () => {
    window.location.hash = '#/account/orders'
    window.scrollTo({ top: 0 })
  }

  return (
    <AccountLayout activeTab="orders">
      {/* Back */}
      <button
        onClick={goBack}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 24px',
          fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: '#7B5EA7', display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        ← Back to Orders
      </button>

      {loading && (
        <div aria-busy="true" aria-label="Loading order">
          {/* Header skeleton */}
          <div style={{ marginBottom: 32 }}>
            <div className="skeleton-pulse" style={{ height: 10, width: 100, borderRadius: 2, marginBottom: 10 }} />
            <div className="skeleton-pulse" style={{ height: 22, width: 160, borderRadius: 2 }} />
          </div>

          {/* Status card skeleton */}
          <div style={{ background: '#fff', border: '1px solid #E2DAC8', borderRadius: 6, marginBottom: 20 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2DAC8' }}>
              <div className="skeleton-pulse" style={{ height: 9, width: 80, borderRadius: 2 }} />
            </div>
            <div style={{ padding: 20 }}>
              <StatusTimelineSkeleton />
            </div>
          </div>

          {/* Items card skeleton */}
          <div style={{ background: '#fff', border: '1px solid #E2DAC8', borderRadius: 6 }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #E2DAC8' }}>
              <div className="skeleton-pulse" style={{ height: 9, width: 60, borderRadius: 2 }} />
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[1, 2].map(i => (
                <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div className="skeleton-pulse" style={{ width: 56, height: 56, borderRadius: 4, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-pulse" style={{ height: 13, width: '60%', borderRadius: 2, marginBottom: 8 }} />
                    <div className="skeleton-pulse" style={{ height: 10, width: 40, borderRadius: 2 }} />
                  </div>
                  <div className="skeleton-pulse" style={{ height: 14, width: 60, borderRadius: 2 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#A85050', textAlign: 'center', padding: '60px 0' }}>
          {error}
        </p>
      )}

      {!loading && !error && order && (
        <>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <p className="acct-eyebrow">Order #{order.orderNumber}</p>
            <h1 className="acct-page-title" style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}>
              Order Details
            </h1>
            <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#9A8F85', margin: '6px 0 0' }}>
              Placed on {fmtDate(order.createdAt)}
            </p>
          </div>

          {/* Two-column layout on desktop */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 20 }} className="block md:grid">

            {/* Left column */}
            <div>
              {/* Status tracker */}
              <Card title="Order Status">
                <StatusTracker status={order.orderStatus} />
                {order.orderStatus === 'shipped' && (
                  <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057', margin: '16px 0 0' }}>
                    Tracking: <span style={{ color: '#1C1A17', fontWeight: 500 }}>—</span>
                  </p>
                )}
              </Card>

              {/* Items */}
              <Card title={`Items (${order.items.length})`}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {order.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      {/* Image */}
                      <div style={{
                        width: 56, height: 56, borderRadius: 4, overflow: 'hidden',
                        background: '#EDE8DC', flexShrink: 0,
                        border: '1px solid #E2DAC8',
                      }}>
                        {item.product?.images?.[0] && (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: '"Cormorant Garamond", Georgia, serif',
                          fontWeight: 400, fontSize: 15, color: '#1C1A17',
                          margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {item.product?.name ?? 'Product'}
                        </p>
                        <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#9A8F85', margin: '4px 0 0' }}>
                          Qty: {item.quantity}
                        </p>
                      </div>

                      {/* Price */}
                      <p style={{ fontFamily: 'Jost', fontSize: 14, fontWeight: 500, color: '#1C1A17', margin: 0, flexShrink: 0 }}>
                        {fmtPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Status history timeline */}
              <Card title="Status History">
                <StatusTimeline
                  statusHistory={order.statusHistory ?? []}
                  currentStatus={order.orderStatus}
                />
              </Card>

              {/* Shipping address */}
              <Card title="Shipping Address">
                <address style={{ fontStyle: 'normal' }}>
                  <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: '0 0 6px' }}>
                    {order.shippingAddress.fullName}
                  </p>
                  <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057', margin: '0 0 2px', lineHeight: 1.6 }}>
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && `, ${order.shippingAddress.line2}`}
                  </p>
                  <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057', margin: '0 0 2px' }}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                  </p>
                  <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057', margin: '8px 0 0' }}>
                    {order.shippingAddress.phone}
                  </p>
                </address>
              </Card>
            </div>

            {/* Right column — price breakdown */}
            <div>
              <Card title="Price Breakdown">
                <PriceRow label="Subtotal"  value={fmtPrice(order.subtotal)} />
                {order.discount > 0 && (
                  <PriceRow label="Discount" value={`−${fmtPrice(order.discount)}`} />
                )}
                <PriceRow label="Shipping" value="Free" />
                <div style={{ height: 1, background: '#E2DAC8', margin: '8px 0' }} />
                <PriceRow label="Total" value={fmtPrice(order.total)} bold accent />
              </Card>

              <Card title="Payment">
                <p style={{ fontFamily: 'Jost', fontSize: 13, color: '#6B6057', margin: 0, textTransform: 'capitalize' }}>
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </p>
                <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#9A8F85', margin: '6px 0 0', textTransform: 'capitalize' }}>
                  Status: {order.paymentStatus}
                </p>
              </Card>
            </div>
          </div>
        </>
      )}
    </AccountLayout>
  )
}

export default OrderDetailPage
