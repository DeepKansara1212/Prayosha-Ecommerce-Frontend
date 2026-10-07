import type { FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

// ─── Who We Serve ─────────────────────────────────────────────────────────────

const CLIENTS = [
  { icon: '🛍️', title: 'Retail Crystal Shops & Boutiques', text: 'Eye-catching inventory that keeps your customers coming back.' },
  { icon: '🛒', title: 'E-commerce Brands', text: 'Reliable supply chains with consistent quality for online sellers.' },
  { icon: '🧘', title: 'Holistic Healers & Reiki Practitioners', text: 'High-vibrational, authentic tools for spiritual and energy work.' },
  { icon: '🏛️', title: 'Interior Designers & Architects', text: 'Large statement pieces, geodes, and clusters for luxury home decor.' },
]

// ─── Quality Standard ─────────────────────────────────────────────────────────

const QUALITY = [
  { icon: '🔍', title: 'Rigorous Quality Control', text: 'Every batch is inspected for structural integrity, color density, and authenticity before dispatch.' },
  { icon: '📦', title: 'Secure Bulk Packaging', text: 'Crystals are fragile. We use specialized, heavy-duty packaging material to ensure your wholesale orders arrive completely undamaged.' },
  { icon: '✦', title: 'Custom Orders', text: 'Looking for specific dimensions, unique carvings, or precise geometric shapes? Our manufacturing facility can customize orders to match your exact business specifications.' },
]

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQS = [
  { q: 'Are your crystals treated or dyed?', a: 'No. We guarantee 100% natural crystals. We do not sell heat-treated, chemically dyed, or synthetic stones.' },
  { q: 'What is your Minimum Order Quantity (MOQ) for wholesale?', a: 'We support businesses of all sizes. Please contact our sales team to discuss our flexible MOQ tiers for bulk buyers.' },
  { q: 'Do you ship internationally?', a: 'Yes, we provide safe and reliable shipping worldwide, complete with tracking information.' },
]

// ─── Section wrapper with reveal ─────────────────────────────────────────────

const RevealSection: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useScrollReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={cn('reveal', className)}>
      {children}
    </div>
  )
}

// ─── AboutPage ────────────────────────────────────────────────────────────────

const AboutPage: FC = () => (
  <>
    <Navbar />
    <main id="main-content" className="bg-cream">

      {/* ── Ethical Sourcing & Journey ── */}
      <RevealSection>
        <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-4">🌍 Our promise</p>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-deep leading-tight mb-6">
              Responsibly sourced,<br />
              <em className="italic text-amethyst">hands-on every step</em>
            </h2>
            <div className="space-y-4 font-body font-extralight text-[0.85rem] leading-[2] text-bark">
              <p>At Prayosha Crystals, we believe that the journey of a crystal matters as much as its beauty. We work closely with trusted mining partners globally to ensure all our 100% natural crystals are sourced responsibly and ethically.</p>
              <p>Our team oversees the entire process — from selecting raw minerals at the mines to the final quality check in our manufacturing unit. This hands-on approach guarantees that you receive crystals with the purest vibrational energy and zero artificial alterations.</p>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-gem-amethyst aspect-square flex items-center justify-center text-[8rem] relative overflow-hidden">
              <span className="select-none">🔮</span>
              <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: 'linear-gradient(to top, rgba(28,20,16,0.5), transparent)' }} aria-hidden="true" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-warm p-5 shadow-lg max-w-[220px]">
              <p className="font-display font-light text-[1.8rem] text-amethyst">100%</p>
              <p className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-muted mt-1">Natural, untreated, undyed crystals</p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── Who We Serve ── */}
      <div className="bg-bark">
        <RevealSection>
          <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }}>
            <div className="text-center mb-12">
              <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold-light mb-3">💼 Who we serve</p>
              <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-cream">
                Our <em className="italic text-gold-light">wholesale clients</em>
              </h2>
              <p className="font-body font-extralight text-[0.8rem] leading-[1.9] text-cream/70 max-w-xl mx-auto mt-4">
                As a leading crystal manufacturer, we cater to a diverse global clientele by offering flexible bulk ordering options.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-cream/10">
              {CLIENTS.map((c, i) => (
                <div
                  key={c.title}
                  className={cn(
                    'p-8 transition-colors duration-300 hover:bg-cream/[0.03]',
                    i % 2 === 0 && 'sm:border-r border-cream/10',
                    i < 2 && 'border-b border-cream/10',
                  )}
                >
                  <p className="text-2xl mb-4" aria-hidden="true">{c.icon}</p>
                  <h3 className="font-display text-[1.2rem] font-normal text-cream mb-3">{c.title}</h3>
                  <p className="font-body font-normal text-[0.8rem] leading-[1.9] text-cream/85">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>

      {/* ── Quality Standard ── */}
      <RevealSection>
        <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }}>
          <div className="text-center mb-12">
            <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-3">✨ The Prayosha standard</p>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-deep">
              Complete <em className="italic text-amethyst">transparency</em>
            </h2>
            <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-bark max-w-xl mx-auto mt-4">
              Buying crystals online in bulk can be challenging, which is why we offer complete transparency at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {QUALITY.map(q => (
              <div key={q.title} className="bg-warm p-8 text-center">
                <p className="text-2xl mb-4" aria-hidden="true">{q.icon}</p>
                <h3 className="font-display text-[1.05rem] font-normal text-deep mb-3">{q.title}</h3>
                <p className="font-body font-extralight text-[0.8rem] leading-[1.9] text-muted">{q.text}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── FAQ ── */}
      <div className="bg-warm">
        <RevealSection>
          <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }}>
            <div className="text-center mb-12">
              <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-3">❓ FAQ</p>
              <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-deep">
                Frequently asked <em className="italic text-amethyst">questions</em>
              </h2>
            </div>

            <div className="max-w-2xl mx-auto divide-y divide-bark/10">
              {FAQS.map(f => (
                <details key={f.q} className="group py-6">
                  <summary className="flex items-center justify-between cursor-pointer list-none font-display text-[1rem] font-normal text-deep">
                    {f.q}
                    <span className="font-body text-gold text-lg transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-bark mt-4">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>

      {/* ── CTA strip ── */}
      <RevealSection>
        <div
          className="text-center"
          style={{
            padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,4rem)',
            background: 'radial-gradient(ellipse at 50% 50%, #3D1E4A 0%, #1C1410 100%)',
          }}
        >
          <p className="font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-4">🤝 &nbsp;Partner with us</p>
          <h2 className="font-display font-light text-[clamp(2rem,5vw,3.5rem)] text-cream leading-tight mb-5">
            Elevate your inventory<br />
            <em className="italic text-gold-light">with the purest energy</em>
          </h2>
          <p className="font-body font-normal text-[0.85rem] text-cream/85 max-w-md mx-auto mb-8 leading-relaxed">
            We believe in building long-term partnerships based on transparency, trust, and premium quality. Reach out for custom manufacturing requests, wholesale catalogs, or bulk pricing inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => { window.location.hash = '#/collection'; window.scrollTo({ top: 0 }) }}
              className="font-body text-[0.7rem] uppercase tracking-[0.22em] bg-gold text-deep px-8 py-4 hover:bg-gold-light transition-all duration-300"
            >
              Explore Collection
            </button>
            <button
              onClick={() => { window.location.hash = '#/contact'; window.scrollTo({ top: 0 }) }}
              className="font-body text-[0.7rem] uppercase tracking-[0.18em] border border-cream/30 text-cream px-8 py-4 hover:border-gold-light hover:text-gold-light transition-all duration-300"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </RevealSection>
    </main>
    <Footer />
  </>
)

export default AboutPage