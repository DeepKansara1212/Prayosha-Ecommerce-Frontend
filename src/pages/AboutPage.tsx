import type { FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

// ─── Team ─────────────────────────────────────────────────────────────────────

const TEAM = [
  { name: 'Aria Sharma', role: 'Founder & Crystal Curator', emoji: '🔮', bio: 'A geologist-turned-crystal healer with 12 years of sourcing experience across India, Brazil and Madagascar. Aria hand-selects every stone in the Luminae collection.' },
  { name: 'Rohan Mehta', role: 'Head of Sourcing', emoji: '🌍', bio: 'Rohan leads our ethical sourcing partnerships, maintaining direct relationships with responsible mines across three continents and ensuring full provenance documentation.' },
  { name: 'Priya Nair', role: 'Ritual & Healing Guide', emoji: '🌙', bio: 'A certified crystal healer and sound practitioner, Priya creates all of our ritual guides and leads our monthly new-moon ceremonies and online crystal workshops.' },
  { name: 'Dev Kapoor', role: 'Creative Director', emoji: '✦', bio: 'Dev shapes the Luminae aesthetic — from our sacred packaging to our visual world — ensuring every touchpoint reflects the beauty of the stones themselves.' },
]

// ─── Values ───────────────────────────────────────────────────────────────────

const VALUES = [
  { icon: '🌍', title: 'Ethical sourcing', text: 'Every crystal is traceable to its source. We maintain direct partnerships with responsible miners, paying fair wages and funding environmental restoration in mining communities.' },
  { icon: '✦',  title: 'Certified authenticity', text: 'Each stone is assessed by a qualified gemologist. No dyed, heat-treated or synthetic stones, ever. We provide full provenance documentation with every purchase.' },
  { icon: '🌙', title: 'Ritual intention', text: 'Before dispatch, every crystal undergoes a full moon cleansing ritual. We believe the energy with which a stone is handled is as important as the stone itself.' },
  { icon: '🌱', title: 'Conscious business', text: 'We donate 3% of every sale to indigenous land preservation programs in mining regions. Our packaging is 100% organic cotton, recycled paper and plant-based inks.' },
]

// ─── Timeline ─────────────────────────────────────────────────────────────────

const MILESTONES = [
  { year: '2019', text: 'Aria returns from a year-long sourcing journey across Minas Gerais, Brazil, discovering the first Luminae amethyst cathedral.' },
  { year: '2020', text: 'Luminae launches from a small Bangalore studio with 12 hand-selected crystals and 200 founding community members.' },
  { year: '2021', text: 'First direct mine partnership established in Madagascar. Sacred packaging line launched — fully compostable and botanically scented.' },
  { year: '2022', text: 'Moon-cleansing ritual certified. First live crystal sourcing journey with 40 community members in Rajasthan, India.' },
  { year: '2023', text: 'Expanded to 100+ crystal varieties. Gemologist partnership established for in-house authentication of every stone.' },
  { year: '2025', text: 'Sacred Earth Collection launches — our most ambitious curation yet, spanning 7 countries and 18 rare crystal varieties.' },
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

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden flex items-end"
        style={{
          minHeight: 'clamp(400px, 60vh, 640px)',
          paddingTop: '96px',
          background: 'radial-gradient(ellipse at 30% 70%, #4A2D5E 0%, #2A1A2E 45%, #1C1410 100%)',
        }}
      >
        {/* Geo SVG */}
        <svg className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none" viewBox="0 0 500 600" fill="none" aria-hidden="true">
          <polygon points="300,50 480,200 480,400 300,550 120,400 120,200" stroke="#B8956A" strokeWidth="0.8" fill="none" />
          <circle cx="300" cy="300" r="120" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.5" />
          <circle cx="300" cy="300" r="200" stroke="#B8956A" strokeWidth="0.3" fill="none" opacity="0.25" />
        </svg>

        {/* Ambient orbs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none" style={{ background: '#7C5C8A', opacity: 0.2, filter: 'blur(80px)' }} aria-hidden="true" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 rounded-full pointer-events-none" style={{ background: '#C9837A', opacity: 0.15, filter: 'blur(60px)' }} aria-hidden="true" />

        <div className="relative z-10 animate-fadeUp" style={{ padding: 'clamp(3rem,7vw,5rem) clamp(1.25rem,5vw,4rem)' }}>
          <p className="flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-5">
            <span className="w-8 h-px bg-gold-light" aria-hidden="true" />
            Our Story
          </p>
          <h1 className="font-display font-light text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] text-cream mb-5">
            Born from a love of<br />
            <em className="italic text-gold-light">the earth's secrets</em>
          </h1>
          <p className="font-body font-extralight text-[clamp(0.82rem,2vw,0.92rem)] leading-[1.9] text-cream/60 max-w-xl">
            Luminae began not as a business, but as an obsession — with the ancient, the authentic, and the extraordinary beauty that the earth has been quietly creating for millions of years.
          </p>
        </div>
      </div>

      {/* ── Origin story ── */}
      <RevealSection>
        <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-4">How it began</p>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-deep leading-tight mb-6">
              A geode in the mountains<br />
              <em className="italic text-amethyst">changed everything</em>
            </h2>
            <div className="space-y-4 font-body font-extralight text-[0.85rem] leading-[2] text-bark">
              <p>In 2019, our founder Aria Sharma was hiking through the mineral-rich mountains of Minas Gerais, Brazil, when she came across a local miner carrying a cathedral amethyst geode of extraordinary violet depth. She had seen amethyst before. She had never seen amethyst like this.</p>
              <p>That encounter ignited a year-long journey through Brazil, Madagascar, Morocco and India — meeting miners, learning provenance, studying the difference between genuine sacred stones and the heat-treated, dyed imitations flooding the market.</p>
              <p>She returned with 12 hand-selected crystals, a deep reverence for the earth, and an unshakeable belief that people deserved access to the real thing.</p>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="bg-gem-amethyst aspect-square flex items-center justify-center text-[8rem] relative overflow-hidden">
              <span className="select-none">🔮</span>
              <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: 'linear-gradient(to top, rgba(28,20,16,0.5), transparent)' }} aria-hidden="true" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-warm p-5 shadow-lg max-w-[200px]">
              <p className="font-display font-light text-[1.8rem] text-amethyst">2019</p>
              <p className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-muted mt-1">Year Luminae was born</p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── Values ── */}
      <div className="bg-bark">
        <RevealSection>
          <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }}>
            <div className="text-center mb-12">
              <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold-light mb-3">What we stand for</p>
              <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-cream">
                Our <em className="italic text-gold-light">guiding principles</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-cream/10">
              {VALUES.map((v, i) => (
                <div
                  key={v.title}
                  className={cn(
                    'p-8 transition-colors duration-300 hover:bg-cream/[0.03]',
                    i % 2 === 0 && 'sm:border-r border-cream/10',
                    i < 2 && 'border-b border-cream/10',
                  )}
                >
                  <p className="text-2xl mb-4" aria-hidden="true">{v.icon}</p>
                  <h3 className="font-display text-[1.2rem] font-normal text-cream mb-3">{v.title}</h3>
                  <p className="font-body font-extralight text-[0.8rem] leading-[1.9] text-cream/55">{v.text}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      </div>

      {/* ── Timeline ── */}
      <RevealSection>
        <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }}>
          <div className="text-center mb-12">
            <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-3">Our journey</p>
            <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-deep">
              Six years of <em className="italic text-amethyst">sacred stone</em>
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            {MILESTONES.map((m, i) => (
              <div key={m.year} className="flex gap-6 pb-8 relative">
                {/* Line */}
                {i < MILESTONES.length - 1 && (
                  <div className="absolute left-[27px] top-[36px] bottom-0 w-px bg-warm" aria-hidden="true" />
                )}
                {/* Year badge */}
                <div className="flex-none w-14 h-14 rounded-full border-2 border-gold/40 bg-warm flex items-center justify-center z-10">
                  <span className="font-display font-light text-[0.75rem] text-gold">{m.year}</span>
                </div>
                {/* Text */}
                <div className="flex-1 pt-3.5">
                  <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-bark">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── Team ── */}
      <div className="bg-warm">
        <RevealSection>
          <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }}>
            <div className="text-center mb-12">
              <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-3">The people</p>
              <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-deep">
                Meet the <em className="italic text-amethyst">seekers</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEAM.map(member => (
                <div key={member.name} className="bg-cream p-6 text-center group hover:shadow-sm transition-shadow duration-300">
                  <div className="w-16 h-16 rounded-full bg-warm flex items-center justify-center text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {member.emoji}
                  </div>
                  <h3 className="font-display font-normal text-[1.1rem] text-deep mb-0.5">{member.name}</h3>
                  <p className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-gold mb-3">{member.role}</p>
                  <p className="font-body font-extralight text-[0.75rem] leading-[1.8] text-muted">{member.bio}</p>
                </div>
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
          <p className="font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-4">✦ &nbsp;Join the journey</p>
          <h2 className="font-display font-light text-[clamp(2rem,5vw,3.5rem)] text-cream leading-tight mb-5">
            Find your sacred stone<br />
            <em className="italic text-gold-light">today</em>
          </h2>
          <p className="font-body font-extralight text-[0.85rem] text-cream/55 max-w-md mx-auto mb-8 leading-relaxed">
            Every crystal in our collection carries our promise: ethically sourced, certified authentic, and delivered with deep intention.
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
