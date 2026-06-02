import { useState, useEffect, useCallback, type FC } from 'react'
import { cn } from '@/lib/utils'

// ─── Slide image paths ────────────────────────────────────────────────────────

const SLIDES = [
  '/Hero-Slides/banner-1.png',
  '/Hero-Slides/banner-2.png',
  '/Hero-Slides/banner-1.png',
]

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero: FC = () => {
  const [active, setActive] = useState(0)
  const total = SLIDES.length

  const prev = useCallback(() => setActive(a => (a - 1 + total) % total), [total])
  const next = useCallback(() => setActive(a => (a + 1) % total), [total])

  useEffect(() => {
    const id = setInterval(() => setActive(a => (a + 1) % total), 6000)
    return () => clearInterval(id)
  }, [total])

  return (
    <section className="relative bg-deep w-full" aria-label="Hero" style={{ marginTop: '72px' }}>
      {/* Invisible first image — sizes the container to the image's natural height */}
      <img src={SLIDES[0]} alt="" className="w-full h-auto block invisible" aria-hidden="true" />

      {/* Slides stacked on top */}
      {SLIDES.map((src, i) => (
        <div
          key={i}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            i === active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
          )}
          aria-hidden={i !== active}
        >
          <img
            src={src}
            alt={`Hero slide ${i + 1}`}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>
      ))}

      {/* ── Arrow navigation ────────────────────────────────────────────────── */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-7 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-cream/20 text-cream/55 hover:text-cream hover:border-gold/50 hover:bg-deep/30 backdrop-blur-sm transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 12 6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-7 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center border border-cream/20 text-cream/55 hover:text-cream hover:border-gold/50 hover:bg-deep/30 backdrop-blur-sm transition-all duration-300"
        aria-label="Next slide"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* ── Dot indicators ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-5 inset-x-0 z-30 flex justify-center gap-2.5" role="tablist" aria-label="Slide navigation">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            role="tab"
            aria-selected={i === active}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              'transition-all duration-500',
              i === active
                ? 'w-7 h-[3px] bg-gold rounded-sm'
                : 'w-[7px] h-[7px] rounded-full bg-cream/40 hover:bg-cream/70',
            )}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
