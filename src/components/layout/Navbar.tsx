import React, { useState, useRef, useEffect, type FC } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { useSearchOverlay } from '@/hooks/useSearchOverlay'
import { useCategories } from '@/hooks/useCategories'
import SearchOverlay from '@/components/search/SearchOverlay'
import { cn, slugify } from '@/lib/utils'
import type { ApiCategory } from '@/api/categories.api'

// Resolves a mega-menu label to a real admin category's slug when one exists
// (matched by name, so a category with a custom slug still resolves correctly);
// otherwise falls back to a best-effort slug that will start working automatically
// once admin creates a matching category with the default auto-slug.
function categoryPath(label: string, categories: ApiCategory[]): string {
  if (label.trim().toLowerCase() === 'meaning') return '/collection'
  const match = categories.find(c => c.name.trim().toLowerCase() === label.trim().toLowerCase())
  return `/collection?category=${encodeURIComponent(match?.slug ?? slugify(label))}`
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const SearchIcon: FC = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-current fill-none" aria-hidden="true">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
)
const HeartIcon: FC<{ filled?: boolean }> = ({ filled }) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 fill-none" stroke={filled ? '#C9837A' : 'currentColor'} aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={filled ? '#C9837A' : 'none'} />
  </svg>
)
const BagIcon: FC = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-current fill-none" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)
const UserIcon: FC = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-current fill-none" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const ChevronDownIcon: FC<{ open?: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    className={cn('w-3 h-3 stroke-current fill-none transition-transform duration-300', open && 'rotate-180')}
    aria-hidden="true"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

// ─── Mega Dropdown Data ───────────────────────────────────────────────────────

interface DropdownColumn {
  title: string
  items: string[]
}

const MEANING_ITEMS = [
  'Control Anger',
  'Success',
  'Money Magnet',
  'Dhanyog',
  'Protection',
  'Love & Relationships',
  'Health',
  'Chakra Balance',
  'Antidepression',
  'Stress Relief',
  'Good Luck',
  'Pregnancy',
  'Addiction',
  'Prosperity',
  'Peace',
  'Study',
  'Concentration',
  'Confidence',
  'Growth',
  'Happiness',
  'Meditation',
  'Motivation',
  'Negative Energy Remover',
  'Opportunities',
  'Strength',
]

const DROPDOWN_COLUMNS: DropdownColumn[] = [
  {
    title: 'Purpose',
    items: ['Zodiac Sign', 'Meaning'],
  },
  {
    title: 'Category',
    items: [
      'Bracelets', 'Japmalas', 'Pyramids', 'Wands', 'Trees', 'Oval',
      'Healing Egg Stone', 'Pendants', 'Pendulum', 'Energy Generator',
      'Markaba', 'Hanger', 'Massage Tools', 'Spheres', 'Coaster',
      'Selenite', 'Orgonite', 'Angels', 'Idols', 'Shreeyantra',
      'Tumbles', 'Chips', 'Cluster & Geodes', 'Raw', 'Keychain',
      '7 Chakra', '9 Graha', 'Frame', 'Crystal Bottle', 'Vastu',
      'Chart Board', 'Bowl',
    ],
  },
  {
    title: 'Energy Cleansing',
    items: [
      'Vastu Purity Cone', 'Camphore Cone', 'Bath Salt', 'Healing Oil',
      'Vastu Spray', 'Bhimseni Camphor', 'Gir Cow Dung Dhoop Stick',
      'Sage', 'Palosanto', 'Soap',
    ],
  },
  {
    title: 'Rudraksha',
    items: [
      '1 Mukhi', '1 Mukhi', '2 Mukhi', '3 Mukhi', '4 Mukhi', '5 Mukhi',
      '6 Mukhi', '7 Mukhi', '8 Mukhi', '9 Mukhi', '10 Mukhi', '11 Mukhi',
      '12 Mukhi', '13 Mukhi', '14 Mukhi', '15 Mukhi', '16 Mukhi',
      '17 Mukhi', '18 Mukhi', '19 Mukhi', '20 Mukhi', '21 Mukhi',
      '22 Mukhi', '23 Mukhi', '24 Mukhi', 'Gauri Shankar',
      'Garbh Gauri', 'Ganesh Mukhi',
    ],
  },
  {
    title: 'Gemstone',
    items: [
      'Yellow Sapphire', 'Emerald', 'Blue Sapphire', 'Pearl', 'Gomed',
      'Ruby', 'Diamond', 'Red Corel', "Cat's Eye", 'Opal', 'Turquoise',
      'Topaz', 'Amethyst',
    ],
  },
  {
    title: 'Food',
    items: [],
  },
]

// ─── Nav config ───────────────────────────────────────────────────────────────

interface NavItem {
  label: string
  path: string
  hasDropdown?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Collections',         path: '/collection', hasDropdown: true },
  { label: 'Blog',                path: '/blog' },
  { label: 'Calculator',          path: '/bracelet-calculator', hasDropdown: true },
  { label: 'About Us',            path: '/about' },
  { label: 'Contact',             path: '/contact' },
  { label: 'B2B',                 path: '/b2b' },
]

// ─── Mega Dropdown ────────────────────────────────────────────────────────────

interface MegaDropdownProps {
  open: boolean
  onClose: () => void
  onNavigate: (path: string) => void
}

const MegaDropdown: FC<MegaDropdownProps> = ({ open, onClose, onNavigate }) => {
  const [meaningOpen, setMeaningOpen] = useState(false)
  const { data: categories = [] } = useCategories()

  const handleItemClick = (item: string) => {
    onNavigate(categoryPath(item, categories))
    onClose()
  }

  const itemStyle: React.CSSProperties = {
    background: 'none', border: 'none', padding: '0.28rem 0', cursor: 'pointer',
    display: 'block', width: '100%', textAlign: 'left',
    fontSize: '0.8rem', letterSpacing: '0.04em',
    color: 'rgba(61,43,31,0.82)', transition: 'color 0.15s ease, padding-left 0.15s ease',
    lineHeight: 1.45, whiteSpace: 'normal', wordBreak: 'break-word',
  }

  const colHeaderStyle: React.CSSProperties = {
    fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'rgba(184,149,106,0.95)', fontWeight: 600,
  }

  const dividerDot = (
    <span style={{
      display: 'inline-block', width: '3px', height: '3px',
      borderRadius: '50%', background: 'rgba(184,149,106,0.45)',
      flexShrink: 0, marginLeft: '6px',
    }} />
  )

  const renderItems = (items: string[]) => (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item, idx) => (
        <li key={`${item}-${idx}`}>
          {item === 'Meaning' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => handleItemClick(item)}
                  style={{ ...itemStyle, flex: 1 }}
                          onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement
                            el.style.color = 'rgba(28,20,16,1)'
                    el.style.paddingLeft = '5px'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement
                            el.style.color = 'rgba(61,43,31,0.82)'
                    el.style.paddingLeft = '0'
                  }}
                >
                  {item}
                </button>
                <button
                  type="button"
                  aria-label="Expand Meaning options"
                  onClick={() => setMeaningOpen(prev => !prev)}
                  style={{ ...itemStyle, width: 'auto', padding: '0.28rem 0.35rem', flexShrink: 0 }}
                >
                  {meaningOpen ? '▴' : '▾'}
                </button>
              </div>
              {meaningOpen && (
                <ul style={{ listStyle: 'none', padding: '0.25rem 0 0.25rem 0.7rem', margin: 0 }}>
                  {MEANING_ITEMS.map((meaning, meaningIdx) => (
                    <li key={`${meaning}-${meaningIdx}`}>
                      <button
                        onClick={() => handleItemClick(meaning)}
                        style={{
                          ...itemStyle,
                          padding: '0.18rem 0',
                          fontSize: '0.74rem',
                          color: 'rgba(61,43,31,0.72)',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLButtonElement
                          el.style.color = 'rgba(28,20,16,1)'
                          el.style.paddingLeft = '5px'
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLButtonElement
                          el.style.color = 'rgba(61,43,31,0.72)'
                          el.style.paddingLeft = '0'
                        }}
                      >
                        {meaning}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleItemClick(item)}
              style={itemStyle}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.color = 'rgba(28,20,16,1)'
                el.style.paddingLeft = '5px'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.color = 'rgba(61,43,31,0.82)'
                el.style.paddingLeft = '0'
              }}
            >
              {item}
            </button>
          )}
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={cn(
        'absolute top-full left-0 right-0 z-[190]',
        'transition-all duration-400 origin-top',
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none',
      )}
      style={{
        background: 'rgba(237, 229, 216, 0.98)', backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(184,149,106,0.15)',
        borderBottom: '1px solid rgba(184,149,106,0.08)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
      }}
      onMouseLeave={onClose}
    >
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(184,149,106,0.4) 30%, rgba(184,149,106,0.4) 70%, transparent)' }} />

      <div style={{ padding: '2rem clamp(1.5rem, 5vw, 4rem) 1.75rem' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(61,43,31,0.72)', marginBottom: '1.5rem' }}>
          Browse Collections
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr 1fr',
          gap: '0', alignItems: 'start', width: '100%',
        }}>
          {DROPDOWN_COLUMNS.map((col, colIdx) => {
            const isMultiCol = col.items.length > 14
            const showDivider = colIdx < DROPDOWN_COLUMNS.length - 1

            return (
              <div
                key={col.title}
                style={{
                  paddingLeft: colIdx === 0 ? '0' : 'clamp(0.75rem, 1.5vw, 1.5rem)',
                  paddingRight: showDivider ? 'clamp(0.75rem, 1.5vw, 1.5rem)' : '0',
                  borderRight: showDivider ? '1px solid rgba(184,149,106,0.1)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(184,149,106,0.18)', paddingBottom: '0.6rem', marginBottom: '0.85rem' }}>
                  <span style={colHeaderStyle}>{col.title}</span>
                  {dividerDot}
                </div>

                {col.items.length === 0 ? (
                  <span style={{ fontSize: '0.72rem', color: 'rgba(61,43,31,0.62)', letterSpacing: '0.08em' }}>Coming soon</span>
                ) : isMultiCol ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '0.75rem' }}>
                    {[col.items.slice(0, Math.ceil(col.items.length / 2)), col.items.slice(Math.ceil(col.items.length / 2))].map((half, hIdx) => (
                      <ul key={hIdx} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {half.map((item, idx) => (
                          <li key={`${item}-${idx}`}>
                            <button onClick={() => handleItemClick(item)} style={itemStyle}
                              onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = 'rgba(28,20,16,1)'; el.style.paddingLeft = '5px' }}
                              onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.color = 'rgba(61,43,31,0.82)'; el.style.paddingLeft = '0' }}>
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                ) : renderItems(col.items)}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(184,149,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'rgba(61,43,31,0.72)', textTransform: 'uppercase' }}>
            All handcrafted · Ethically sourced
          </p>
          <button
            onClick={() => { onNavigate('/collection'); onClose() }}
            style={{
              background: 'none', border: '1px solid rgba(184,149,106,0.35)', padding: '0.45rem 1.4rem',
              cursor: 'pointer', fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(61,43,31,0.9)', transition: 'border-color 0.2s, color 0.2s, background 0.2s',
              borderRadius: '1px', whiteSpace: 'nowrap', minHeight: '44px',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(184,149,106,0.8)'; el.style.color = 'rgba(28,20,16,1)'; el.style.background = 'rgba(184,149,106,0.12)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'rgba(184,149,106,0.35)'; el.style.color = 'rgba(61,43,31,0.9)'; el.style.background = 'none' }}
          >
            View All Collections
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Mobile Collection Accordion ─────────────────────────────────────────────

interface MobileAccordionProps {
  onNavigate: (path: string) => void
}

const MobileCollectionAccordion: FC<MobileAccordionProps> = ({ onNavigate }) => {
  const [openCol, setOpenCol] = useState<string | null>(null)
  const { data: categories = [] } = useCategories()

  return (
    <div className="w-full px-6 mt-2" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
      {DROPDOWN_COLUMNS.map((col) => (
        <div key={col.title} style={{ borderBottom: '1px solid rgba(184,149,106,0.12)' }}>
          <button
            onClick={() => setOpenCol(openCol === col.title ? null : col.title)}
            className="w-full flex items-center justify-between py-3 bg-transparent border-none cursor-pointer min-h-[44px]"
            aria-expanded={openCol === col.title}
          >
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: openCol === col.title ? 'rgba(61,43,31,1)' : 'rgba(61,43,31,0.82)', transition: 'color 0.2s' }}>
              {col.title}
            </span>
            <ChevronDownIcon open={openCol === col.title} />
          </button>

          <div style={{ maxHeight: openCol === col.title ? '400px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
            <div className="pb-3 flex flex-wrap gap-x-4 gap-y-1">
              {col.items.map((item, idx) => (
                <button
                  key={`${item}-${idx}`}
                  onClick={() => onNavigate(categoryPath(item, categories))}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.06em', color: 'rgba(61,43,31,0.82)', padding: '0.2rem 0', textAlign: 'left', minHeight: '44px' }}
                >
                  {item}
                </button>
              ))}
              {col.items.length === 0 && (
                <span style={{ fontSize: '0.65rem', color: 'rgba(61,43,31,0.62)' }}>Coming soon</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar: FC = () => {
  const navigate  = useNavigate()
  const location  = useLocation()

  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [calculatorOpen, setCalculatorOpen] = useState(false)
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false)
  const [mobileCalculatorOpen, setMobileCalculatorOpen] = useState(false)
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { isOpen: searchOpen, open: openSearch, close: closeSearch } = useSearchOverlay()
  useLockBodyScroll(searchOpen)

  const pathname = location.pathname

  const isActive = (path: string) => path === '/bracelet-calculator'
    ? pathname === '/bracelet-calculator' || pathname === '/rudraksha-calculator'
    : pathname === path || (path !== '/' && pathname.startsWith(path))

  const closeMenu = () => {
    setOpen(false)
    setMobileCollectionOpen(false)
    setMobileCalculatorOpen(false)
    document.body.style.overflow = ''
  }

  const go = (path: string) => {
    closeMenu()
    navigate(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleMenu = () => {
    const next = !open
    setOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
    if (!next) {
      setMobileCollectionOpen(false)
      setMobileCalculatorOpen(false)
    }
  }

  const handleCollectionMouseEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current)
    setDropdownOpen(true)
  }
  const handleCollectionMouseLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setDropdownOpen(false), 120)
  }
  const handleDropdownMouseEnter = () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current)
  }

  useEffect(() => () => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current)
  }, [])

  return (
    <>
      {/* ── Mobile full-screen drawer ── */}
      <div
        className={cn(
          'fixed inset-0 z-[199] bg-warm transition-opacity duration-350',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        style={{
          display: open ? 'flex' : 'none',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
          paddingTop: '6rem', gap: '0', overflowY: 'auto',
        }}
        aria-hidden={!open}
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
      >
        {/* Collections with accordion */}
        <div className="w-full flex flex-col items-center">
          <div className="flex items-center gap-3 min-h-[44px]" style={{ marginBottom: '0.25rem' }}>
            <button
              onClick={() => go('/collection')}
              className={cn(
                'font-display font-light tracking-[0.1em] bg-transparent border-none cursor-pointer transition-all duration-200',
                isActive('/collection') ? 'text-deep opacity-100' : 'text-bark opacity-90 hover:opacity-100 hover:text-deep',
              )}
              style={{ fontSize: 'clamp(1.6rem,6vw,2.5rem)' }}
            >
              Collections
            </button>
            <button
              onClick={() => setMobileCollectionOpen(v => !v)}
              className="bg-transparent border-none cursor-pointer text-bark opacity-90 hover:opacity-100 transition-all duration-200 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-expanded={mobileCollectionOpen}
              aria-label="Toggle collection categories"
            >
              <ChevronDownIcon open={mobileCollectionOpen} />
            </button>
          </div>

          <div style={{ maxHeight: mobileCollectionOpen ? '60vh' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease', width: '100%' }}>
            <MobileCollectionAccordion onNavigate={go} />
          </div>
        </div>

        {/* Other nav links */}
        {NAV_ITEMS.filter(i => !i.hasDropdown || i.path === '/bracelet-calculator').map(item => (
          <div key={item.path} className="flex flex-col items-center">
            <button
              onClick={() => item.path === '/bracelet-calculator'
                ? setMobileCalculatorOpen(v => !v)
                : go(item.path)}
              className={cn(
                'font-display font-light text-[clamp(1.6rem,6vw,2.5rem)] tracking-[0.1em] bg-transparent border-none cursor-pointer transition-all duration-200 mt-2 min-h-[44px]',
                isActive(item.path) ? 'text-deep opacity-100' : 'text-bark opacity-90 hover:opacity-100 hover:text-deep',
              )}
              aria-expanded={item.path === '/bracelet-calculator' ? mobileCalculatorOpen : undefined}
            >
              {item.label}
            </button>
            {item.path === '/bracelet-calculator' && mobileCalculatorOpen && (
              <div className="flex flex-wrap justify-center gap-x-6">
                {[
                  ['Bracelet Calculator', '/bracelet-calculator'],
                  ['Rudraksha Calculator', '/rudraksha-calculator'],
                ].map(([label, path]) => (
                  <button
                    key={path}
                    onClick={() => go(path)}
                    className="min-h-[44px] bg-transparent border-none cursor-pointer font-body text-xs tracking-[0.12em] uppercase text-bark"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="h-px w-16 bg-cream/20 my-4" aria-hidden="true" />

        {/* Mobile utility links */}
        <div className="flex gap-10 items-center">
          {[
            { label: 'Account',  path: '/account', Icon: UserIcon },
            { label: 'Wishlist', path: '/account/wishlist', Icon: () => <HeartIcon filled={isActive('/account/wishlist')} /> },
            { label: 'Cart',     path: '/cart', Icon: BagIcon },
          ].map(({ label, path, Icon }) => (
            <button
              key={label}
              onClick={() => go(path)}
              className="flex flex-col items-center gap-1.5 text-bark opacity-90 hover:opacity-100 bg-transparent border-none cursor-pointer transition-opacity min-w-[44px] min-h-[44px] justify-center"
              aria-label={label}
            >
              <Icon />
              <span className="font-body text-[0.55rem] uppercase tracking-[0.18em]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main navbar ── */}
      <nav
        className={cn('fixed top-0 left-0 right-0 z-[200]', 'transition-all duration-400')}
        aria-label="Main navigation"
      >
        <div
          className={cn(
            'flex items-center justify-between',
            'px-[clamp(1.25rem,5vw,4rem)] py-5',
            'transition-all duration-400',
            'bg-warm backdrop-blur-[12px] shadow-[0_1px_0_rgba(61,43,31,0.16)]',
          )}
        >
          {/* Logo */}
          <button
            onClick={() => go('/')}
            className="flex items-center z-[201] bg-transparent border-none cursor-pointer opacity-100 hover:opacity-80 transition-opacity duration-200 min-h-[44px]"
            aria-label="Prayosha Crystal — go to home"
          >
            <img src="/prayosha-logo.png" alt="Prayosha Crystals" className="h-10 md:h-12 w-auto object-contain mix-blend-multiply" />
          </button>

          {/* Desktop nav links */}
          <ul className="hidden md:flex gap-8 list-none" role="list">
            {NAV_ITEMS.map(item => (
              <li
                key={item.path}
                className="relative"
                onMouseEnter={item.path === '/collection'
                  ? handleCollectionMouseEnter
                  : item.path === '/bracelet-calculator'
                    ? () => setCalculatorOpen(true)
                    : undefined}
                onMouseLeave={item.path === '/collection'
                  ? handleCollectionMouseLeave
                  : item.path === '/bracelet-calculator'
                    ? () => setCalculatorOpen(false)
                    : undefined}
              >
                <button
                  onClick={() => item.path === '/bracelet-calculator'
                    ? setCalculatorOpen(v => !v)
                    : go(item.path)}
                  className={cn(
                    'font-body text-[0.72rem] tracking-[0.2em] uppercase transition-all duration-200 bg-transparent border-none cursor-pointer relative pb-0.5 flex items-center gap-1.5 min-h-[44px]',
                    'after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold-light after:transition-all after:duration-300',
                    isActive(item.path) || (item.path === '/collection' && dropdownOpen) || (item.path === '/bracelet-calculator' && calculatorOpen)
                      ? 'text-deep after:w-full'
                      : 'text-bark hover:text-deep after:w-0 hover:after:w-full',
                  )}
                  aria-expanded={item.path === '/collection'
                    ? dropdownOpen
                    : item.path === '/bracelet-calculator'
                      ? calculatorOpen
                      : undefined}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <ChevronDownIcon open={item.path === '/collection' ? dropdownOpen : calculatorOpen} />
                  )}
                </button>
                {item.path === '/bracelet-calculator' && calculatorOpen && (
                  <div className="absolute left-0 top-full z-20 min-w-56 bg-warm py-2 shadow-lg">
                    {[
                      ['Bracelet Calculator', '/bracelet-calculator'],
                      ['Rudraksha Calculator', '/rudraksha-calculator'],
                    ].map(([label, path]) => (
                      <button
                        key={path}
                        onClick={() => go(path)}
                        className="block w-full bg-transparent border-none px-5 py-3 text-left font-body text-xs uppercase tracking-[0.12em] text-bark hover:text-deep"
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Icon group */}
          <div className="flex items-center gap-4 text-bark">
            <button
              onClick={openSearch}
              aria-label="Open search"
              className="opacity-90 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0 text-bark min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <SearchIcon />
            </button>
            <button
              onClick={() => go('/account')}
              aria-label="Go to account"
              className={cn('opacity-75 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0 min-w-[44px] min-h-[44px] flex items-center justify-center', (pathname.startsWith('/auth') || pathname.startsWith('/account')) && 'opacity-100')}
            >
              <UserIcon />
            </button>
            <button
              onClick={() => go('/account/wishlist')}
              aria-label="Go to wishlist"
              className={cn('opacity-75 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0 min-w-[44px] min-h-[44px] flex items-center justify-center', isActive('/account/wishlist') && 'opacity-100')}
            >
              <HeartIcon filled={isActive('/account/wishlist')} />
            </button>
            <button
              onClick={() => go('/cart')}
              aria-label="Go to cart"
              className={cn('opacity-75 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0 min-w-[44px] min-h-[44px] flex items-center justify-center', isActive('/cart') && 'opacity-100')}
            >
              <BagIcon />
            </button>

            {/* Hamburger — mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1 z-[201] min-w-[44px] min-h-[44px] items-center justify-center"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <span className={cn('block w-6 h-[1.5px] bg-cream transition-transform duration-300', open && 'translate-y-[6.5px] rotate-45')} />
              <span className={cn('block w-6 h-[1.5px] bg-cream transition-opacity duration-300', open && 'opacity-0')} />
              <span className={cn('block w-6 h-[1.5px] bg-cream transition-transform duration-300', open && '-translate-y-[6.5px] -rotate-45')} />
            </button>
          </div>
        </div>

        {/* Mega dropdown — desktop only */}
        <div
          className="hidden md:block"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleCollectionMouseLeave}
        >
          <MegaDropdown open={dropdownOpen} onClose={() => setDropdownOpen(false)} onNavigate={navigate} />
        </div>
      </nav>

      <SearchOverlay isOpen={searchOpen} onClose={closeSearch} />
    </>
  )
}

export default Navbar
