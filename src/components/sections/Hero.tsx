import { useState, useEffect, useCallback, type FC } from 'react'
import { cn } from '@/lib/utils'

// ─── Announcement Ticker ──────────────────────────────────────────────────────

const ANNOUNCEMENTS = [
  { id: 1, tag: 'New',      text: 'Sacred Earth Collection 2025 — just arrived from Minas Gerais, Brazil', cta: 'Shop Now', hash: '#/collection' },
  { id: 2, tag: 'Offer',    text: 'Free sacred packaging on all orders above ₹999 — this month only',      cta: 'Learn More', hash: '#/collection' },
  { id: 3, tag: 'Limited',  text: 'Only 4 Amethyst Cathedrals left — each one a unique world of violet',   cta: 'Grab Yours', hash: '#/collection' },
  { id: 4, tag: 'New Moon', text: 'New moon cleansing ritual drops — subscribe to receive on each cycle',   cta: 'Subscribe', hash: '#' },
  { id: 5, tag: 'Gift',     text: 'Sacred Heart Gift Sets now available — perfect for gifting this season', cta: 'See Sets', hash: '#/collection' },
]

const TAG_COLOURS: Record<string, string> = {
  'New':      'bg-amethyst text-cream',
  'Offer':    'bg-gold text-deep',
  'Limited':  'bg-rose text-cream',
  'New Moon': 'bg-bark text-gold-light border border-gold/30',
  'Gift':     'bg-sage text-cream',
}

const AnnouncementTicker: FC = () => {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(true)
  const total = ANNOUNCEMENTS.length

  const goTo = useCallback((index: number) => {
    setVisible(false)
    setTimeout(() => {
      setCurrent(index)
      setVisible(true)
    }, 300)
  }, [])

  const prev = useCallback(() => goTo((current - 1 + total) % total), [current, total, goTo])
  const next = useCallback(() => goTo((current + 1) % total), [current, total, goTo])

  // Auto-advance every 4s
  useEffect(() => {
    const id = setInterval(next, 4000)
    return () => clearInterval(id)
  }, [next])

  const ann = ANNOUNCEMENTS[current]

  return (
    <div
      className="relative z-20 flex items-center justify-center gap-3 px-4 py-2.5 text-center"
      style={{ background: 'rgba(28,20,16,0.7)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(184,149,106,0.15)' }}
      role="marquee"
      aria-live="polite"
      aria-label="Announcements"
    >
      {/* Prev arrow */}
      <button onClick={prev} className="flex-none text-cream/40 hover:text-cream transition-colors p-1" aria-label="Previous announcement">
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M10 12 6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        className={cn(
          'flex items-center gap-2.5 transition-all duration-300 flex-1 justify-center min-w-0',
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1',
        )}
      >
        <span className={cn('flex-none font-body text-[0.55rem] uppercase tracking-[0.18em] px-2 py-0.5', TAG_COLOURS[ann.tag] ?? 'bg-gold text-deep')}>
          {ann.tag}
        </span>
        <p className="font-body font-light text-[0.72rem] text-cream/80 truncate hidden xs:block">
          {ann.text}
        </p>
        <p className="font-body font-light text-[0.72rem] text-cream/80 xs:hidden block leading-tight">
          {ann.text.length > 50 ? ann.text.slice(0, 50) + '…' : ann.text}
        </p>
        <a
          href={ann.hash}
          onClick={e => { e.preventDefault(); window.location.hash = ann.hash.replace('#/', '#/') }}
          className="flex-none font-body text-[0.62rem] uppercase tracking-[0.18em] text-gold-light hover:text-gold transition-colors whitespace-nowrap underline-offset-2 hover:underline"
        >
          {ann.cta} →
        </a>
      </div>

      {/* Next arrow */}
      <button onClick={next} className="flex-none text-cream/40 hover:text-cream transition-colors p-1" aria-label="Next announcement">
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute right-3 bottom-1 flex gap-1" aria-hidden="true">
        {ANNOUNCEMENTS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn('w-1 h-1 rounded-full transition-all duration-300', i === current ? 'bg-gold scale-125' : 'bg-cream/25')}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Geometric SVG ────────────────────────────────────────────────────────────

const GeoSVG: FC = () => (
  <svg
    className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[clamp(240px,52vw,680px)] h-[clamp(240px,52vw,680px)] opacity-[0.15] pointer-events-none"
    viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
  >
    <polygon points="250,50 450,200 450,350 250,450 50,350 50,200" stroke="#B8956A" strokeWidth="1" fill="none" />
    <polygon points="250,100 400,220 400,330 250,400 100,330 100,220" stroke="#B8956A" strokeWidth="0.5" fill="none" opacity="0.5" />
    <polygon points="250,150 360,240 360,310 250,360 140,310 140,240" stroke="#B8956A" strokeWidth="0.5" fill="none" opacity="0.3" />
    <line x1="250" y1="50" x2="250" y2="450" stroke="#B8956A" strokeWidth="0.5" opacity="0.3" />
    <line x1="50" y1="200" x2="450" y2="350" stroke="#B8956A" strokeWidth="0.5" opacity="0.3" />
    <line x1="450" y1="200" x2="50" y2="350" stroke="#B8956A" strokeWidth="0.5" opacity="0.3" />
    <circle cx="250" cy="250" r="60" stroke="#B8956A" strokeWidth="0.5" fill="none" opacity="0.4" />
    <circle cx="250" cy="250" r="120" stroke="#B8956A" strokeWidth="0.3" fill="none" opacity="0.2" />
  </svg>
)

// ─── Stat counters ────────────────────────────────────────────────────────────

const STATS = [
  { value: '18+', label: 'Crystal varieties' },
  { value: '12k+', label: 'Happy seekers' },
  { value: '100%', label: 'Ethically sourced' },
  { value: '4.9★', label: 'Average rating' },
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero: FC = () => {
  const navigate = (hash: string) => {
    window.location.hash = hash
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="relative bg-bark overflow-hidden flex flex-col" aria-label="Hero" style={{ minHeight: '100svh' }}>
      {/* Announcement ticker — sits right below fixed nav */}
      <div className="pt-[72px]">
        <AnnouncementTicker />
      </div>

      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 60% 50%, #5B3A52 0%, #2A1A2E 40%, #1C100E 100%)' }}
        aria-hidden="true"
      />

      {/* Ambient orbs — desktop only */}
      <div className="hidden sm:block absolute rounded-full pointer-events-none" style={{ width: 'clamp(160px,35vw,400px)', height: 'clamp(160px,35vw,400px)', background: '#7C5C8A', opacity: 0.25, top: '-10%', right: '15%', filter: 'blur(60px)' }} aria-hidden="true" />
      <div className="hidden sm:block absolute rounded-full pointer-events-none" style={{ width: 'clamp(130px,28vw,300px)', height: 'clamp(130px,28vw,300px)', background: '#C9837A', opacity: 0.18, bottom: '5%', right: '30%', filter: 'blur(60px)' }} aria-hidden="true" />
      <div className="hidden sm:block absolute rounded-full pointer-events-none" style={{ width: 'clamp(110px,22vw,250px)', height: 'clamp(110px,22vw,250px)', background: '#5B8FA0', opacity: 0.2, top: '30%', right: '2%', filter: 'blur(60px)' }} aria-hidden="true" />

      <GeoSVG />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center animate-fadeUp" style={{ padding: 'clamp(2rem,6vw,5rem) clamp(1.25rem,5vw,4rem) clamp(1.5rem,4vw,3rem)' }}>
        <div className="max-w-[680px]">
          <p className="flex items-center gap-3 font-body text-[0.65rem] uppercase tracking-[0.32em] text-gold-light mb-5">
            <span className="block w-8 h-px bg-gold-light flex-none" aria-hidden="true" />
            Sacred Earth Collection 2025
          </p>

          <h1 className="font-display font-light text-[clamp(2.8rem,8vw,6rem)] leading-[1.05] text-cream mb-5">
            Stones that<br />
            speak to the<br />
            <em className="italic text-gold-light">soul</em>
          </h1>

          <p className="font-body font-extralight text-[clamp(0.82rem,2vw,0.9rem)] leading-[1.85] text-cream/65 max-w-[420px] mb-8">
            Ethically sourced crystals, raw gems and healing stones from around the world. Each piece carries the memory of the earth and the energy of creation.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center mb-10">
            <button
              onClick={() => navigate('#/collection')}
              className="font-body text-[0.7rem] uppercase tracking-[0.22em] bg-gold text-deep px-8 py-4 hover:bg-gold-light transition-all duration-300 hover:-translate-y-px"
            >
              Explore Collection
            </button>
            <button
              onClick={() => navigate('#/about')}
              className="font-body text-[0.7rem] uppercase tracking-[0.15em] text-cream/75 hover:text-cream transition-colors flex items-center gap-2 duration-200"
            >
              Our Story <span aria-hidden="true">→</span>
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-5 max-w-[500px]">
            {STATS.map(s => (
              <div key={s.label} className="border-l border-cream/15 pl-4">
                <p className="font-display font-light text-[1.4rem] text-gold-light mb-0.5">{s.value}</p>
                <p className="font-body font-extralight text-[0.62rem] uppercase tracking-[0.15em] text-cream/45 leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="hidden sm:flex relative z-10 justify-center pb-8 flex-col items-center gap-2 font-body text-[0.6rem] tracking-[0.25em] uppercase text-cream/35"
        aria-hidden="true"
      >
        <div className="w-px h-10 animate-scrollPulse" style={{ background: 'linear-gradient(to bottom, rgba(184,149,106,0.8), transparent)' }} />
        <span>Scroll</span>
      </div>
    </section>
  )
}

export default Hero
