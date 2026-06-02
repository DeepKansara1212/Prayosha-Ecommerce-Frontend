import { useState, type FC } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import BannerManagementPanel, { type BannerStats } from '@/components/admin/BannerManagementPanel'

// ─── Stat card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  accent?: 'gold' | 'emerald' | 'rose' | 'neutral'
  icon: React.ReactNode
}

const StatCard: FC<StatCardProps> = ({ label, value, sub, accent = 'neutral', icon }) => {
  const accentClasses = {
    gold: 'text-gold bg-gold/8 border-gold/15',
    emerald: 'text-emerald-400 bg-emerald-400/8 border-emerald-400/15',
    rose: 'text-rose-400 bg-rose-400/8 border-rose-400/15',
    neutral: 'text-cream/50 bg-cream/5 border-cream/10',
  }

  return (
    <div className="bg-[#141414] border border-cream/8 p-5 flex items-start gap-4">
      <div className={`w-9 h-9 shrink-0 border flex items-center justify-center ${accentClasses[accent]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-body text-[10px] tracking-[0.15em] uppercase text-cream/35 mb-1">{label}</p>
        <p className="font-display text-2xl text-cream leading-none">{value}</p>
        {sub && <p className="font-body text-[10px] text-cream/25 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Quick action card ────────────────────────────────────────────────────────

interface QuickActionProps {
  label: string
  description: string
  href: string
  icon: React.ReactNode
}

const QuickAction: FC<QuickActionProps> = ({ label, description, href, icon }) => (
  <Link
    to={href}
    className="flex items-center gap-4 p-4 bg-[#141414] border border-cream/8 hover:border-gold/20 hover:bg-[#171714] transition-all group"
  >
    <div className="w-8 h-8 shrink-0 border border-cream/10 group-hover:border-gold/20 flex items-center justify-center text-cream/40 group-hover:text-gold/60 transition-colors">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-body text-xs text-cream/70 group-hover:text-cream transition-colors">{label}</p>
      <p className="font-body text-[10px] text-cream/30 mt-0.5 truncate">{description}</p>
    </div>
    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 text-cream/20 group-hover:text-gold/40 shrink-0 transition-colors" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </Link>
)

// ─── Dashboard ────────────────────────────────────────────────────────────────

const AdminDashboardPage: FC = () => {
  const user = useAuthStore(s => s.user)
  const [bannerStats, setBannerStats] = useState<BannerStats>({ total: 0, active: 0, hidden: 0 })

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="p-8 space-y-10">

      {/* ── Page header ──────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="font-body text-xs tracking-[0.2em] uppercase text-gold/60 mb-1">
            Admin Panel
          </p>
          <h1 className="font-display text-3xl text-cream tracking-wide">
            {greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
          </h1>
          <p className="font-body text-xs text-cream/30 mt-1.5">
            Here's an overview of your store's content.
          </p>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 border border-cream/10 text-cream/40 font-body text-xs hover:text-cream/70 hover:border-cream/20 transition-colors"
        >
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 1L1 7h2v7h4v-4h2v4h4V7h2L8 1z" strokeLinejoin="round" />
          </svg>
          View Store
        </Link>
      </div>

      {/* ── Stats row ─────────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-cream/25">Overview</p>
          <div className="flex-1 h-px bg-cream/6" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Total Banners"
            value={bannerStats.total}
            sub="In the carousel"
            accent="neutral"
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="4" width="14" height="8" rx="1" />
                <path d="M4 8h8" strokeLinecap="round" />
              </svg>
            }
          />
          <StatCard
            label="Live Banners"
            value={bannerStats.active}
            sub="Visible on homepage"
            accent="emerald"
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8a6 6 0 1012 0A6 6 0 002 8zm4 0l1.5 1.5L10 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <StatCard
            label="Hidden Banners"
            value={bannerStats.hidden}
            sub="Not shown to visitors"
            accent={bannerStats.hidden > 0 ? 'rose' : 'neutral'}
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 2l12 12M6.5 3.5A7 7 0 0114 8c-.5 1-1.3 2-2.3 2.7M3.3 5.3A7 7 0 002 8c1.3 2.5 3.8 4 6 4a6.5 6.5 0 002.2-.4" strokeLinecap="round" />
              </svg>
            }
          />
          <StatCard
            label="Carousel Slots"
            value={`${bannerStats.active} / ${bannerStats.total}`}
            sub="Active out of total"
            accent="gold"
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 5h12M2 8h8M2 11h5" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
      </div>

      {/* ── Quick actions ─────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-cream/25">Quick Actions</p>
          <div className="flex-1 h-px bg-cream/6" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction
            href="/admin/hero-banners"
            label="Manage Hero Banners"
            description="Full-page banner editor with all controls"
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="4" width="14" height="8" rx="1" />
                <path d="M5 8h6M9 6l2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <QuickAction
            href="/"
            label="Preview Homepage"
            description="See the live hero carousel in the storefront"
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8z" />
                <circle cx="8" cy="8" r="1.5" />
              </svg>
            }
          />
          <QuickAction
            href="/collection"
            label="Browse Collection"
            description="View the product catalogue as a customer would"
            icon={
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="1" y="1" width="6" height="6" rx="0.5" />
                <rect x="9" y="1" width="6" height="6" rx="0.5" />
                <rect x="1" y="9" width="6" height="6" rx="0.5" />
                <rect x="9" y="9" width="6" height="6" rx="0.5" />
              </svg>
            }
          />
        </div>
      </div>

      {/* ── Hero Banner Management ────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <p className="font-body text-[10px] tracking-[0.2em] uppercase text-cream/25">Hero Banners</p>
            <div className="flex-1 h-px bg-cream/6 w-16" />
          </div>
          <Link
            to="/admin/hero-banners"
            className="font-body text-[10px] tracking-[0.15em] uppercase text-cream/30 hover:text-gold/60 transition-colors flex items-center gap-1.5"
          >
            Full page
            <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <BannerManagementPanel onStatsChange={setBannerStats} />
      </div>

    </div>
  )
}

export default AdminDashboardPage
