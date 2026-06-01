import { useState, useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import AccountLayout from './AccountLayout'
import * as ordersApi from '@/api/orders.api'
import type { Order, PaginatedOrders } from '@/api/orders.api'
import { OrderCardSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  placed:     { label: 'Placed',     color: '#4A7A9B' },
  confirmed:  { label: 'Confirmed',  color: '#4A7A9B' },
  processing: { label: 'Processing', color: '#C49A3C' },
  shipped:    { label: 'Shipped',    color: '#7B5EA7' },
  delivered:  { label: 'Delivered',  color: '#5A8A6A' },
  cancelled:  { label: 'Cancelled',  color: '#A85050' },
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function fmtPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`
}

// ─── Status badge ─────────────────────────────────────────────────────────────

const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const { label, color } = STATUS_MAP[status] ?? { label: status, color: '#6B6057' }
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 12,
      border: `1px solid ${color}`, color, background: '#fff',
      fontFamily: 'Jost', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
    }}>
      {label}
    </span>
  )
}

// ─── Order card ───────────────────────────────────────────────────────────────

const OrderCard: FC<{ order: Order; onView: () => void }> = ({ order, onView }) => {
  const thumbs = order.items.slice(0, 3)
  const thumbCount = thumbs.length
  const thumbWidth = 44 + (thumbCount - 1) * 18

  return (
    <div style={{
      background: '#fff', borderRadius: 6, border: '1px solid #E2DAC8',
      padding: '20px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>

        {/* Stacked thumbnails */}
        <div style={{ position: 'relative', width: thumbWidth, height: 44, flexShrink: 0 }}>
          {thumbs.map((item, i) => (
            <div key={i} style={{
              position: 'absolute', left: i * 18, top: 0, zIndex: thumbCount - i,
              width: 44, height: 44, borderRadius: 4, overflow: 'hidden',
              border: '2px solid #F5F0E8', background: '#EDE8DC',
            }}>
              {item.product?.images?.[0] && (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 160 }}>
          <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#6B6057', margin: '0 0 3px', letterSpacing: '0.04em' }}>
            #{order.orderNumber}
          </p>
          <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#9A8F85', margin: '0 0 10px' }}>
            {fmtDate(order.createdAt)}
          </p>
          <StatusBadge status={order.status} />
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>
          <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 16, color: '#C49A3C', margin: 0 }}>
            {fmtPrice(order.total)}
          </p>
          <button
            onClick={onView}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#7B5EA7',
            }}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── OrdersPage ───────────────────────────────────────────────────────────────

const OrdersPage: FC = () => {
  const navigate = useNavigate()
  const [data, setData] = useState<PaginatedOrders | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    ordersApi.getUserOrders(1)
      .then(setData)
      .catch(() => setError('Could not load orders. Please try again.'))
      .finally(() => setLoading(false))
  }, [])

  const loadMore = async () => {
    if (!data) return
    setLoadingMore(true)
    try {
      const next = await ordersApi.getUserOrders(data.page + 1)
      setData({ ...next, orders: [...data.orders, ...next.orders] })
    } catch {
      // silently ignore
    } finally {
      setLoadingMore(false)
    }
  }

  const goOrder = (orderNumber: string) => {
    navigate(`/account/orders/${orderNumber}`)
    window.scrollTo({ top: 0 })
  }

  return (
    <AccountLayout activeTab="orders">
      {/* Header */}
      <div className="acct-section-header">
        <p className="acct-eyebrow">✦ My Orders</p>
        <h1 className="acct-page-title">Order History</h1>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2, 3].map(i => <OrderCardSkeleton key={i} />)}
        </div>
      )}

      {error && (
        <EmptyState
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>}
          title="Could not load orders"
          description="Please check your connection and try again."
          actionLabel="Retry"
          onAction={() => window.location.reload()}
        />
      )}

      {!loading && !error && data && (
        data.orders.length === 0
          ? (
            <EmptyState
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>}
              title="No orders yet"
              description="Your crystal journey awaits."
              actionLabel="Start Shopping"
              onAction={() => navigate('/collection')}
            />
          )
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {data.orders.map(order => (
                <OrderCard key={order._id} order={order} onView={() => goOrder(order.orderNumber)} />
              ))}

              {data.page < data.totalPages && (
                <div style={{ textAlign: 'center', marginTop: 8 }}>
                  <button onClick={loadMore} disabled={loadingMore} className="acct-btn-ghost">
                    {loadingMore ? 'Loading…' : 'Load More'}
                  </button>
                </div>
              )}
            </div>
          )
      )}
    </AccountLayout>
  )
}

export default OrdersPage
