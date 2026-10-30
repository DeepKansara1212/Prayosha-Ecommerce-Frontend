import { useState, type FC } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AccountLayout from './AccountLayout'
import { getWalletBalance, getWalletHistory } from '@/api/wallet.api'
import Skeleton from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import Pagination from '@/components/ui/Pagination'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

function fmtPrice(n: number) {
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// ─── How it works steps ───────────────────────────────────────────────────────

const HOW_STEPS = [
  { icon: '🛒', title: 'Shop', desc: 'Purchase any product' },
  { icon: '✨', title: 'Earn', desc: 'Get 2% cashback after coupons' },
  { icon: '🎁', title: 'Use', desc: '50% of the lower eligible amount is applied at checkout' },
] as const

// ─── Row skeleton ─────────────────────────────────────────────────────────────

const RowSkeleton: FC = () => (
  <div className="wallet-history-row-skeleton" style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid #E2DAC8', alignItems: 'center' }}>
    <Skeleton width="120px" height="14px" />
    <Skeleton width="90px"  height="14px" className="flex-1" />
    <Skeleton width="80px"  height="14px" />
    <Skeleton width="60px"  height="14px" />
  </div>
)

// ─── WalletPage ───────────────────────────────────────────────────────────────

const WalletPage: FC = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const balanceQuery = useQuery({
    queryKey: ['wallet-balance'],
    queryFn: getWalletBalance,
  })

  const historyQuery = useQuery({
    queryKey: ['wallet-history', page],
    queryFn: () => getWalletHistory(page),
  })

  const cashbackBalance = balanceQuery.data?.cashbackBalance ?? 0
  const transactions = historyQuery.data?.transactions ?? []
  const pagination   = historyQuery.data?.pagination

  return (
    <AccountLayout activeTab="wallet">

      {/* ── Header ── */}
      <div className="acct-section-header">
        <p className="acct-eyebrow">✨ Cashback</p>
        <h1 className="acct-page-title">Cashback Wallet</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057', margin: '8px 0 0' }}>
          Earn cashback with every purchase
        </p>
      </div>

      {/* ── Balance card ── */}
      <div style={{
        background: 'linear-gradient(135deg, #3A2E1A 0%, #2A2010 100%)',
        border: '1px solid rgba(196,154,60,0.35)',
        borderRadius: 10,
        padding: 'clamp(28px, 5vw, 40px)',
        textAlign: 'center',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div aria-hidden="true" style={{
          position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 240, height: 240, borderRadius: '50%',
          background: '#C49A3C', opacity: 0.07, filter: 'blur(60px)', pointerEvents: 'none',
        }} />

        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase',
          letterSpacing: '0.05em', color: '#C49A3C', margin: '0 0 12px',
          position: 'relative',
        }}>
          ✦ Available Cashback
        </p>

        {balanceQuery.isError ? (
          <div role="alert" style={{ position: 'relative', color: '#F5F0E8', fontFamily: 'var(--font-body)', fontSize: 13 }}>
            Could not load your wallet balance.{' '}
            <button
              type="button"
              onClick={() => void balanceQuery.refetch()}
              style={{ color: '#C49A3C', background: 'none', border: 0, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Retry
            </button>
          </div>
        ) : balanceQuery.isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 12px' }}>
            <Skeleton width="120px" height="56px" />
          </div>
        ) : (
          <p style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 400,
            fontSize: 'clamp(52px, 10vw, 72px)',
            color: '#F5F0E8',
            margin: '0 0 8px',
            lineHeight: 1,
            position: 'relative',
          }}>
            ₹{cashbackBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        )}
      </div>

      {/* ── How it works ── */}
      <div style={{
        background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 8,
        padding: '24px', marginBottom: 32,
      }}>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: '#5A4638', margin: '0 0 20px',
        }}>
          How It Works
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: 16,
        }}>
          {HOW_STEPS.map((step, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', margin: '0 auto 12px',
                background: '#F5F0E8', border: '1px solid #E2DAC8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {step.icon}
              </div>
              <p style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 17, color: '#1C1A17', margin: '0 0 4px',
              }}>
                {step.title}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057', margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Transaction history ── */}
      <div style={{ background: '#EDE8DC', border: '1px solid #E2DAC8', borderRadius: 8, overflow: 'hidden' }}>

        {/* Table header */}
        <div className="wallet-history-title" style={{ padding: '16px 24px', borderBottom: '1px solid #E2DAC8' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase',
            letterSpacing: '0.05em', color: '#5A4638', margin: 0,
          }}>
            Transaction History
          </p>
        </div>

        <div className="wallet-history-content" style={{ padding: '0 24px' }}>

          {/* Column headers */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 110px 110px 80px',
            padding: '12px 0',
            borderBottom: '1px solid #E2DAC8',
          }} className="wallet-history-header">
            {['Product', 'Date', 'Order total', 'Cashback'].map(col => (
              <span key={col} style={{
                fontFamily: 'var(--font-body)', fontSize: 13, textTransform: 'uppercase',
                letterSpacing: '0.05em', color: '#B0A99F',
              }}>
                {col}
              </span>
            ))}
          </div>

          {/* Skeleton */}
          {historyQuery.isLoading && (
            <div>
              {[1, 2, 3].map(i => <RowSkeleton key={i} />)}
            </div>
          )}

          {historyQuery.isError && (
            <div role="alert" style={{ padding: '20px 0', fontFamily: 'var(--font-body)', fontSize: 13, color: '#A85050' }}>
              Could not load wallet transactions.{' '}
              <button
                type="button"
                onClick={() => void historyQuery.refetch()}
                style={{ color: '#7B5EA7', background: 'none', border: 0, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty state */}
          {!historyQuery.isLoading && !historyQuery.isError && transactions.length === 0 && (
            <EmptyState
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              }
              title="No cashback yet"
              description="Complete your first purchase to start building your cashback balance."
              actionLabel="Shop Now"
              onAction={() => { navigate('/collection'); window.scrollTo({ top: 0 }) }}
            />
          )}

          {/* Rows */}
          {!historyQuery.isLoading && transactions.map((tx, i) => (
            <div
              key={tx._id}
              className="wallet-history-row"
              style={{
                display: 'grid', gridTemplateColumns: '1fr 110px 110px 80px',
                padding: '14px 0', alignItems: 'center',
                borderBottom: i < transactions.length - 1 ? '1px solid #E2DAC8' : 'none',
              }}
            >
              <p
                title={tx.order?.items.map(item => item.name).join(', ')}
                className="wallet-history-product"
                style={{
                  fontFamily: 'var(--font-body)', fontSize: 13, color: '#1C1A17', margin: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}
              >
                {tx.order?.items.length
                  ? tx.order.items.map(item => `${item.name}${item.quantity > 1 ? ` ×${item.quantity}` : ''}`).join(', ')
                  : '—'}
              </p>
              <p className="wallet-history-date" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057', margin: 0 }}>
                {fmtDate(tx.createdAt)}
              </p>
              <p className="wallet-history-amount" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: '#6B6057', margin: 0 }}>
                {fmtPrice(tx.orderTotal)}
              </p>
              <p className="wallet-history-cashback" style={{
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                color: tx.type === 'redeemed' ? '#A85050' : '#C49A3C', margin: 0,
              }}>
                {tx.type === 'redeemed' ? '−' : '+'}{fmtPrice(tx.cashbackAmount)}
              </p>
            </div>
          ))}

        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div style={{ padding: '8px 24px 20px' }}>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            />
          </div>
        )}

      </div>
    </AccountLayout>
  )
}

export default WalletPage
