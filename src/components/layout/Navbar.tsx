import React, { useState, useRef, useEffect, type FC } from 'react'
import { useNavScroll } from '@/hooks/useNavScroll'
import { cn } from '@/lib/utils'

// ─── Icons ────────────────────────────────────────────────────────────────────

const SearchIcon: FC = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-current fill-none">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
)
const HeartIcon: FC<{ filled?: boolean }> = ({ filled }) => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 fill-none" stroke={filled ? '#C9837A' : 'currentColor'}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={filled ? '#C9837A' : 'none'} />
  </svg>
)
const BagIcon: FC = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-current fill-none">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
)
const UserIcon: FC = () => (
  <svg viewBox="0 0 24 24" strokeWidth="1.5" className="w-5 h-5 stroke-current fill-none">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const ChevronDownIcon: FC<{ open?: boolean }> = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    className={cn('w-3 h-3 stroke-current fill-none transition-transform duration-300', open && 'rotate-180')}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
)

// ─── Mega Dropdown Data ───────────────────────────────────────────────────────

interface DropdownColumn {
  title: string
  items: string[]
}

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

type PageHash = '#/collection' | '#/about' | '#/contact' | '#/auth' | '#/wishlist' | '#/cart' | ''

interface NavItem {
  label: string
  hash: PageHash
  hasDropdown?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Collections', hash: '#/collection', hasDropdown: true },
  { label: 'About Us',    hash: '#/about' },
  { label: 'Contact',     hash: '#/contact' },
]

const go = (hash: PageHash) => {
  window.location.hash = hash
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── Mega Dropdown ────────────────────────────────────────────────────────────

interface MegaDropdownProps {
  open: boolean
  onClose: () => void
}

const MegaDropdown: FC<MegaDropdownProps> = ({ open, onClose }) => {
  const handleItemClick = (item: string) => {
    go('#/collection')
    onClose()
    console.log('Filter by:', item)
  }

  // Shared item button style
  const itemStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    padding: '0.28rem 0',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.8rem',
    letterSpacing: '0.04em',
    color: 'rgba(245,238,228,0.65)',
    transition: 'color 0.15s ease, padding-left 0.15s ease',
    lineHeight: 1.45,
    whiteSpace: 'normal',     // allow wrapping — critical fix
    wordBreak: 'break-word',
  }

  const colHeaderStyle: React.CSSProperties = {
    fontSize: '0.68rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: 'rgba(184,149,106,0.95)',
    fontWeight: 600,
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
          <button
            onClick={() => handleItemClick(item)}
            style={itemStyle}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.color = 'rgba(245,238,228,1)'
              el.style.paddingLeft = '5px'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.color = 'rgba(245,238,228,0.65)'
              el.style.paddingLeft = '0'
            }}
          >
            {item}
          </button>
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
        background: 'rgba(18, 12, 8, 0.98)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(184,149,106,0.15)',
        borderBottom: '1px solid rgba(184,149,106,0.08)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
      }}
      onMouseLeave={onClose}
    >
      {/* Top gold gradient rule */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(184,149,106,0.4) 30%, rgba(184,149,106,0.4) 70%, transparent)',
      }} />

      <div style={{ padding: '2rem clamp(1.5rem, 5vw, 4rem) 1.75rem' }}>

        {/* "Browse Collections" label */}
        <p style={{
          fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(184,149,106,0.5)', marginBottom: '1.5rem',
        }}>
          Browse Collections
        </p>

        {/*
          ── Grid layout: 9 equal columns total ──
          Purpose        → 1 col
          Category       → 2 cols  (32 items split across 2 auto sub-cols)
          Energy Cleans. → 2 cols
          Rudraksha      → 2 cols  (27 items split across 2 auto sub-cols)
          Gemstone       → 1 col
          Food           → 1 col
          Total = 9 cols. Each col is 1fr so they share the full width evenly.
          Long sections get 2fr allocation giving them room without overflow.
        */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr 2fr 2fr 1fr 1fr',
          gap: '0',
          alignItems: 'start',
          width: '100%',
        }}>

          {DROPDOWN_COLUMNS.map((col, colIdx) => {
            const isMultiCol = col.items.length > 14  // Category & Rudraksha
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
                {/* Column title */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  borderBottom: '1px solid rgba(184,149,106,0.18)',
                  paddingBottom: '0.6rem', marginBottom: '0.85rem',
                }}>
                  <span style={colHeaderStyle}>{col.title}</span>
                  {dividerDot}
                </div>

                {/* Items */}
                {col.items.length === 0 ? (
                  <span style={{ fontSize: '0.72rem', color: 'rgba(245,238,228,0.2)', letterSpacing: '0.08em' }}>
                    Coming soon
                  </span>
                ) : isMultiCol ? (
                  // Two equal sub-columns side by side using nested grid
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    columnGap: '0.75rem',
                  }}>
                    {/* Split items into two halves */}
                    {[
                      col.items.slice(0, Math.ceil(col.items.length / 2)),
                      col.items.slice(Math.ceil(col.items.length / 2)),
                    ].map((half, hIdx) => (
                      <ul key={hIdx} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {half.map((item, idx) => (
                          <li key={`${item}-${idx}`}>
                            <button
                              onClick={() => handleItemClick(item)}
                              style={itemStyle}
                              onMouseEnter={e => {
                                const el = e.currentTarget as HTMLButtonElement
                                el.style.color = 'rgba(245,238,228,1)'
                                el.style.paddingLeft = '5px'
                              }}
                              onMouseLeave={e => {
                                const el = e.currentTarget as HTMLButtonElement
                                el.style.color = 'rgba(245,238,228,0.65)'
                                el.style.paddingLeft = '0'
                              }}
                            >
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ))}
                  </div>
                ) : (
                  renderItems(col.items)
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom strip */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(184,149,106,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <p style={{ fontSize: '0.62rem', letterSpacing: '0.16em', color: 'rgba(245,238,228,0.28)', textTransform: 'uppercase' }}>
            All handcrafted · Ethically sourced
          </p>
          <button
            onClick={() => { go('#/collection'); onClose() }}
            style={{
              background: 'none',
              border: '1px solid rgba(184,149,106,0.35)',
              padding: '0.45rem 1.4rem',
              cursor: 'pointer',
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(184,149,106,0.85)',
              transition: 'border-color 0.2s, color 0.2s, background 0.2s',
              borderRadius: '1px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'rgba(184,149,106,0.8)'
              el.style.color = 'rgba(245,238,228,1)'
              el.style.background = 'rgba(184,149,106,0.08)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = 'rgba(184,149,106,0.35)'
              el.style.color = 'rgba(184,149,106,0.85)'
              el.style.background = 'none'
            }}
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
  onNavigate: (hash: PageHash) => void
}

const MobileCollectionAccordion: FC<MobileAccordionProps> = ({ onNavigate }) => {
  const [openCol, setOpenCol] = useState<string | null>(null)

  return (
    <div className="w-full px-6 mt-2" style={{ maxHeight: '55vh', overflowY: 'auto' }}>
      {DROPDOWN_COLUMNS.map((col) => (
        <div
          key={col.title}
          style={{ borderBottom: '1px solid rgba(184,149,106,0.12)' }}
        >
          <button
            onClick={() => setOpenCol(openCol === col.title ? null : col.title)}
            className="w-full flex items-center justify-between py-3 bg-transparent border-none cursor-pointer"
          >
            <span
              style={{
                fontSize: '0.65rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: openCol === col.title ? 'rgba(184,149,106,1)' : 'rgba(245,238,228,0.65)',
                transition: 'color 0.2s',
              }}
            >
              {col.title}
            </span>
            <ChevronDownIcon open={openCol === col.title} />
          </button>

          <div
            style={{
              maxHeight: openCol === col.title ? '400px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.35s ease',
            }}
          >
            <div className="pb-3 flex flex-wrap gap-x-4 gap-y-1">
              {col.items.map((item, idx) => (
                <button
                  key={`${item}-${idx}`}
                  onClick={() => { onNavigate('#/collection') }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    letterSpacing: '0.06em',
                    color: 'rgba(245,238,228,0.6)',
                    padding: '0.2rem 0',
                    textAlign: 'left',
                  }}
                >
                  {item}
                </button>
              ))}
              {col.items.length === 0 && (
                <span style={{ fontSize: '0.65rem', color: 'rgba(245,238,228,0.25)' }}>Coming soon</span>
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
  const scrolled  = useNavScroll(60)
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false)
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const currentHash = typeof window !== 'undefined' ? window.location.hash : ''

  const isActive = (hash: string) => currentHash === hash

  const closeMenu = () => {
    setOpen(false)
    setMobileCollectionOpen(false)
    document.body.style.overflow = ''
  }

  const handleItem = (hash: PageHash) => {
    closeMenu()
    go(hash)
  }

  const toggleMenu = () => {
    const next = !open
    setOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
    if (!next) setMobileCollectionOpen(false)
  }

  // Hover intent for desktop dropdown
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
          'fixed inset-0 z-[199] bg-deep transition-opacity duration-350',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        style={{
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: '6rem',
          gap: '0',
          overflowY: 'auto',
        }}
        aria-hidden={!open}
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Collections with accordion */}
        <div className="w-full flex flex-col items-center">
          <button
            onClick={() => setMobileCollectionOpen(v => !v)}
            className={cn(
              'font-display font-light tracking-[0.1em] bg-transparent border-none cursor-pointer transition-all duration-200 flex items-center gap-3',
              isActive('#/collection') ? 'text-gold-light opacity-100' : 'text-cream opacity-75 hover:opacity-100 hover:text-gold-light',
            )}
            style={{ fontSize: 'clamp(1.6rem,6vw,2.5rem)', marginBottom: '0.25rem' }}
          >
            Collections
            <ChevronDownIcon open={mobileCollectionOpen} />
          </button>

          <div
            style={{
              maxHeight: mobileCollectionOpen ? '60vh' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.4s ease',
              width: '100%',
            }}
          >
            <MobileCollectionAccordion onNavigate={handleItem} />
          </div>
        </div>

        {/* Other nav links */}
        {NAV_ITEMS.filter(i => !i.hasDropdown).map(item => (
          <button
            key={item.hash}
            onClick={() => handleItem(item.hash)}
            className={cn(
              'font-display font-light text-[clamp(1.6rem,6vw,2.5rem)] tracking-[0.1em] bg-transparent border-none cursor-pointer transition-all duration-200 mt-2',
              isActive(item.hash) ? 'text-gold-light opacity-100' : 'text-cream opacity-75 hover:opacity-100 hover:text-gold-light',
            )}
          >
            {item.label}
          </button>
        ))}

        <div className="h-px w-16 bg-cream/20 my-4" aria-hidden="true" />

        {/* Mobile utility links */}
        <div className="flex gap-10 items-center">
          {[
            { label: 'Account',  hash: '#/auth'     as PageHash, Icon: UserIcon },
            { label: 'Wishlist', hash: '#/wishlist' as PageHash, Icon: () => <HeartIcon filled={isActive('#/wishlist')} /> },
            { label: 'Cart',     hash: '#/cart'     as PageHash, Icon: BagIcon },
          ].map(({ label, hash, Icon }) => (
            <button
              key={label}
              onClick={() => handleItem(hash)}
              className="flex flex-col items-center gap-1.5 text-cream opacity-70 hover:opacity-100 bg-transparent border-none cursor-pointer transition-opacity"
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
        className={cn(
          'fixed top-0 left-0 right-0 z-[200]',
          'transition-all duration-400',
        )}
        aria-label="Main navigation"
      >
        {/* Bar row */}
        <div
          className={cn(
            'flex items-center justify-between',
            'px-[clamp(1.25rem,5vw,4rem)] py-5',
            'transition-all duration-400',
            scrolled
              ? 'bg-[rgba(28,20,16,0.94)] backdrop-blur-[12px] shadow-[0_1px_0_rgba(184,149,106,0.1)]'
              : 'bg-transparent',
          )}
        >
          {/* Logo */}
          <button
            onClick={() => { closeMenu(); go('') }}
            className="font-display font-light text-[clamp(1.2rem,3vw,1.5rem)] tracking-[0.15em] text-cream z-[201] bg-transparent border-none cursor-pointer hover:text-gold-light transition-colors duration-200"
            aria-label="Luminae — go to home"
          >
            LUMINAE
          </button>

          {/* Desktop nav links */}
          <ul className="hidden md:flex gap-8 list-none" role="list">
            {NAV_ITEMS.map(item => (
              <li
                key={item.hash}
                className="relative"
                onMouseEnter={item.hasDropdown ? handleCollectionMouseEnter : undefined}
                onMouseLeave={item.hasDropdown ? handleCollectionMouseLeave : undefined}
              >
                <button
                  onClick={() => !item.hasDropdown && handleItem(item.hash)}
                  className={cn(
                    'font-body text-[0.72rem] tracking-[0.2em] uppercase transition-all duration-200 bg-transparent border-none cursor-pointer relative pb-0.5 flex items-center gap-1.5',
                    'after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold-light after:transition-all after:duration-300',
                    isActive(item.hash) || (item.hasDropdown && dropdownOpen)
                      ? 'text-gold-light after:w-full'
                      : 'text-cream/80 hover:text-cream after:w-0 hover:after:w-full',
                  )}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDownIcon open={dropdownOpen} />}
                </button>
              </li>
            ))}
          </ul>

          {/* Icon group */}
          <div className="flex items-center gap-4 text-cream">
            <button aria-label="Search" className="opacity-75 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0 text-cream">
              <SearchIcon />
            </button>
            <button
              onClick={() => go('#/auth')}
              aria-label="Account"
              className={cn('opacity-75 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0', isActive('#/auth') && 'opacity-100')}
            >
              <UserIcon />
            </button>
            <button
              onClick={() => go('#/wishlist')}
              aria-label="Wishlist"
              className={cn('opacity-75 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0', isActive('#/wishlist') && 'opacity-100')}
            >
              <HeartIcon filled={isActive('#/wishlist')} />
            </button>
            <button
              onClick={() => go('#/cart')}
              aria-label="Cart"
              className={cn('opacity-75 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-0', isActive('#/cart') && 'opacity-100')}
            >
              <BagIcon />
            </button>

            {/* Hamburger — mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1 z-[201]"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
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
          <MegaDropdown open={dropdownOpen} onClose={() => setDropdownOpen(false)} />
        </div>
      </nav>
    </>
  )
}

export default Navbar