import { type FC, type ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import Navbar from '@/components/layout/Navbar'

// ─── Shared CSS ───────────────────────────────────────────────────────────────

const ACCOUNT_CSS = `
  .acct-input {
    display: block; width: 100%;
    background: #EDE8DC; border: 1px solid #E2DAC8; border-radius: 4px;
    padding: 12px 16px;
    font-family: Jost, system-ui, sans-serif; font-size: 14px; color: #1C1A17;
    outline: none; box-sizing: border-box;
    transition: border-color 150ms, box-shadow 150ms;
  }
  .acct-input:focus { border-color: #7B5EA7; box-shadow: 0 0 0 3px #F0EAF7; }
  .acct-input::placeholder { color: #C4B89A; }
  .acct-input:disabled { opacity: 0.6; cursor: not-allowed; }

  .acct-btn-gold {
    display: inline-flex; align-items: center; justify-content: center;
    background: #C49A3C; color: #fff; border: none; border-radius: 4px;
    font-family: Jost, system-ui, sans-serif; font-size: 11px; font-weight: 400;
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 12px 28px; cursor: pointer;
    transition: background 150ms, transform 100ms;
  }
  .acct-btn-gold:hover:not(:disabled) { background: #D4B060; transform: translateY(-1px); }
  .acct-btn-gold:disabled { opacity: 0.6; cursor: not-allowed; }

  .acct-btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    background: none; color: #6B6057;
    border: 1px solid #E2DAC8; border-radius: 4px;
    font-family: Jost, system-ui, sans-serif; font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 12px 24px; cursor: pointer;
    transition: border-color 150ms, color 150ms;
  }
  .acct-btn-ghost:hover:not(:disabled) { border-color: #C4B89A; color: #1C1A17; }
  .acct-btn-ghost:disabled { opacity: 0.6; cursor: not-allowed; }

  .acct-btn-danger {
    display: inline-flex; align-items: center; justify-content: center;
    background: none; color: #A85050;
    border: 1px solid #E2C8C8; border-radius: 4px;
    font-family: Jost, system-ui, sans-serif; font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.1em;
    padding: 12px 24px; cursor: pointer;
    transition: background 150ms, border-color 150ms;
  }
  .acct-btn-danger:hover { background: #FDF0F0; border-color: #A85050; }

  .acct-label {
    display: block;
    font-family: Jost, system-ui, sans-serif; font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.08em; color: #6B6057;
    margin-bottom: 6px;
  }
  .acct-error {
    font-family: Jost, system-ui, sans-serif; font-size: 12px; color: #A85050;
    margin-top: 4px;
  }
  .acct-section-header {
    margin-bottom: 32px;
  }
  .acct-eyebrow {
    font-family: Jost, system-ui, sans-serif; font-size: 11px;
    text-transform: uppercase; letter-spacing: 0.18em; color: #C49A3C;
  }
  .acct-page-title {
    font-family: "Cormorant Garamond", Georgia, serif; font-weight: 300;
    font-size: clamp(24px, 4vw, 32px); color: #1C1A17; margin: 6px 0 0;
  }
`

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccountTab = 'orders' | 'rewards' | 'addresses' | 'profile'

interface AccountLayoutProps {
  children: ReactNode
  activeTab: AccountTab
}

const NAV_ITEMS: { key: AccountTab; label: string; mobileLabel: string; path: string }[] = [
  { key: 'orders',    label: 'My Orders',    mobileLabel: 'Orders',    path: '/account/orders' },
  { key: 'rewards',   label: 'My Rewards',   mobileLabel: 'Rewards',   path: '/account/rewards' },
  { key: 'addresses', label: 'My Addresses', mobileLabel: 'Addresses', path: '/account/addresses' },
  { key: 'profile',   label: 'Profile',      mobileLabel: 'Profile',   path: '/account/profile' },
]

// ─── Component ────────────────────────────────────────────────────────────────

const AccountLayout: FC<AccountLayoutProps> = ({ children, activeTab }) => {
  const navigate = useNavigate()
  const user   = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)

  useEffect(() => {
    if (!user) {
      navigate('/auth/login', { replace: true })
    }
  }, [user, navigate])

  if (!user) return null

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const handleNav = (path: string) => {
    navigate(path)
    window.scrollTo({ top: 0 })
  }

  const handleLogout = async () => {
    await logout()
    navigate('/')
    window.scrollTo({ top: 0 })
  }

  return (
    <>
      <style>{ACCOUNT_CSS}</style>
      <Navbar />

      {/* ── Page shell ── */}
      <div style={{ minHeight: '100vh', background: '#F5F0E8', paddingTop: 72, display: 'flex' }}>

        {/* ── Desktop sidebar ── */}
        <aside
          className="hidden md:flex"
          style={{
            width: 240, flexShrink: 0, flexDirection: 'column',
            background: '#EDE8DC', borderRight: '1px solid #E2DAC8',
            position: 'sticky', top: 72, height: 'calc(100vh - 72px)', overflowY: 'auto',
          }}
        >
          {/* User card */}
          <div style={{ padding: '32px 24px 20px' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: user.avatar ? 'transparent' : '#7B5EA7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12, overflow: 'hidden',
            }}>
              {user.avatar
                ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontFamily: 'Jost', fontSize: 18, fontWeight: 500, lineHeight: 1 }}>{initials}</span>
              }
            </div>
            <p style={{ fontFamily: 'Jost', fontWeight: 500, fontSize: 14, color: '#1C1A17', margin: 0 }}>{user.name}</p>
            <p style={{ fontFamily: 'Jost', fontSize: 12, color: '#6B6057', margin: '4px 0 0' }}>{user.phone}</p>
          </div>

          <div style={{ height: 1, background: '#E2DAC8' }} />

          {/* Nav items */}
          <nav style={{ paddingTop: 12, flex: 1 }}>
            {NAV_ITEMS.map(item => {
              const active = activeTab === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.path)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '11px 24px',
                    fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                    background: active ? '#F0EAF7' : 'none',
                    color: active ? '#7B5EA7' : '#6B6057',
                    border: 'none',
                    borderLeft: `2px solid ${active ? '#7B5EA7' : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'background 150ms, color 150ms',
                  }}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <div style={{ padding: '8px 0 28px' }}>
            <div style={{ height: 1, background: '#E2DAC8', marginBottom: 8 }} />
            <button
              onClick={() => { void handleLogout() }}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '11px 24px',
                fontFamily: 'Jost', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em',
                background: 'none', color: '#A85050',
                border: 'none', borderLeft: '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main
          style={{ flex: 1, minWidth: 0, padding: '48px clamp(24px, 5vw, 80px)' }}
          className="pb-24 md:pb-12"
        >
          {children}
        </main>
      </div>

      {/* ── Mobile tab bar (sticky top, below navbar) ── */}
      <div
        className="flex md:hidden"
        style={{
          position: 'fixed', top: 72, left: 0, right: 0, zIndex: 150,
          background: '#EDE8DC', borderBottom: '1px solid #E2DAC8',
        }}
      >
        {NAV_ITEMS.map(item => {
          const active = activeTab === item.key
          return (
            <button
              key={item.key}
              onClick={() => handleNav(item.path)}
              style={{
                flex: 1, padding: '10px 2px',
                fontFamily: 'Jost', fontSize: 8, textTransform: 'uppercase', letterSpacing: '0.06em',
                background: active ? '#F0EAF7' : 'none',
                color: active ? '#7B5EA7' : '#6B6057',
                border: 'none',
                borderBottom: `2px solid ${active ? '#7B5EA7' : 'transparent'}`,
                cursor: 'pointer', textAlign: 'center',
              }}
            >
              {item.mobileLabel}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default AccountLayout
