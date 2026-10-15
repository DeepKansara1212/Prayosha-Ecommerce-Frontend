import { useState, useEffect, type FC } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { getActiveBanners, type HeroBanner } from '@/api/heroBanner.api'

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero: FC = () => {
  const [slides, setSlides] = useState<HeroBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(0)
  const total = slides.length

  useEffect(() => {
    getActiveBanners()
      .then(banners => setSlides(banners))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setActive(0) }, [slides])

  useEffect(() => {
    if (total < 2) return
    const id = setInterval(() => setActive(a => (a + 1) % total), 6000)
    return () => clearInterval(id)
  }, [total])

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="w-full bg-deep animate-pulse"
        style={{ marginTop: '72px', aspectRatio: '16/7' }}
        aria-hidden="true"
      />
    )
  }

  // ── No banners yet — render nothing ─────────────────────────────────────────
  if (total === 0) return null

  // ── Carousel ────────────────────────────────────────────────────────────────
  return (
    <section
      className="relative bg-deep w-full"
      aria-label="Hero"
      style={{ marginTop: '72px' }}
    >
      {/* Invisible sizer — keeps the container at the image's natural height */}
      <img src={slides[0].imageUrl} alt="" className="w-full h-auto block invisible" aria-hidden="true" />

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide._id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            i === active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
          )}
          aria-hidden={i !== active}
        >
          <img
            src={slide.imageUrl}
            alt={`Hero slide ${i + 1}`}
            className="w-full h-full object-contain"
            draggable={false}
          />

          {/* Overlay: title / subtitle / CTA (still supported if set via API) */}
          {(slide.title || slide.subtitle || slide.ctaText) && (
            <div className="absolute inset-0 flex flex-col items-start justify-end pb-16 px-8 sm:px-16 lg:px-24 z-20 bg-gradient-to-t from-deep/70 via-deep/20 to-transparent">
              <div className="max-w-2xl">
                {slide.subtitle && (
                  <p className="font-body text-xs sm:text-sm tracking-[0.05em] uppercase text-gold mb-3">
                    {slide.subtitle}
                  </p>
                )}
                {slide.title && (
                  <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-light text-cream leading-tight mb-5">
                    {slide.title}
                  </h1>
                )}
                {slide.ctaText && (
                  slide.ctaLink ? (
                    <Link
                      to={slide.ctaLink}
                      className="inline-flex items-center gap-2.5 px-7 py-3 bg-gold text-deep font-body text-sm tracking-[0.05em] uppercase font-medium hover:bg-gold/90 transition-colors duration-200"
                    >
                      {slide.ctaText}
                      <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-2.5 px-7 py-3 bg-gold text-deep font-body text-sm tracking-[0.05em] uppercase font-medium">
                      {slide.ctaText}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* ── Dot indicators (only when more than one slide) ───────────────────── */}
      {total > 1 && (
        <div
          className="absolute bottom-5 inset-x-0 z-30 flex justify-center gap-2.5"
          role="tablist"
          aria-label="Slide navigation"
        >
          {slides.map((_, i) => (
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
      )}
    </section>
  )
}

export default Hero
