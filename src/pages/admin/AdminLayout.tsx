import { type FC, type ReactNode } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/authStore'

// ─── Nav items ────────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
  {
    label: 'General',
    items: [
      {
        label: 'Dashboard',
        href: '/admin',
        exact: true,
        icon: (
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="7" height="7" rx="0.75" />
            <rect x="11" y="2" width="7" height="7" rx="0.75" />
            <rect x="2" y="11" width="7" height="7" rx="0.75" />
            <rect x="11" y="11" width="7" height="7" rx="0.75" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Content',
    items: [
      {
        label: 'Hero Banners',
        href: '/admin/hero-banners',
        exact: false,
        icon: (
          <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="5" width="16" height="10" rx="1" />
            <path d="M6 10h8M10 7.5l2 2.5-2 2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
    ],
  },
]

// ─── Admin guard ──────────────────────────────────────────────────────────────

interface AdminLayoutProps {
  children: ReactNode
}

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation()
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)

  if (!user || user.role !== 'admin') {
    return <Navigate to="/auth/login" replace state={{ from: location }} />
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-cream flex">
      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-60 shrink-0 border-r border-cream/8 flex flex-col">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-cream/8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 bg-gold/10 border border-gold/30 flex items-center justify-center">
              <span className="text-gold text-xs font-display font-medium">P</span>
            </div>
            <div>
              <p className="font-display text-sm text-cream tracking-wider">Prayosha</p>
              <p className="font-body text-[10px] text-cream/35 tracking-[0.15em] uppercase">Admin</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5">
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 font-body text-[9px] tracking-[0.2em] uppercase text-cream/25">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map(item => {
                  const active = item.exact
                    ? location.pathname === item.href
                    : location.pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 font-body text-xs tracking-wide transition-colors duration-150',
                        active
                          ? 'bg-gold/10 text-gold border-l-2 border-gold pl-[10px]'
                          : 'text-cream/50 hover:text-cream hover:bg-cream/5',
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-cream/8 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 font-body text-xs text-cream/40 hover:text-cream/70 transition-colors"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 8h10M6 4l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Store
          </Link>
          <button
            onClick={() => void logout()}
            className="flex w-full items-center gap-2.5 px-3 py-2 font-body text-xs text-cream/40 hover:text-rose-400 transition-colors"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 8H3M6 5l-3 3 3 3M11 5V3H5v10h6v-2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default AdminLayout
