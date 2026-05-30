import type { FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

// ─── Content ──────────────────────────────────────────────────────────────────

const INTRO = 'At Prayosha Crystals, accessible from https://prayoshacrystals.com, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your data.'

interface Section {
  id: string
  title: string
  body?: string[]
  bullets?: string[]
  contact?: { email: string; website: string }
}

const SECTIONS: Section[] = [
  {
    id: 'information-collected',
    title: 'Information We Collect',
    body: [
      'When you visit or shop on our Website or at our Showroom, we may collect the following information:',
    ],
    bullets: [
      'Full Name',
      'Email Address',
      'Phone Number',
      'Billing & Shipping Address',
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    body: ['We use the information collected for:'],
    bullets: [
      'Processing and delivering your orders',
      'Providing customer support',
      'Sending order updates, promotional offers, and newsletters (only if you opt-in)',
      'Improving our services and website experience',
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing of Information',
    bullets: [
      'We do not sell or rent your personal data to third parties.',
      'Information may be shared only with trusted service providers (such as courier, payment gateway, etc.) for order fulfilment.',
    ],
  },
  {
    id: 'data-security',
    title: 'Data Security',
    body: [
      'We use reasonable technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies & Tracking',
    body: [
      'Our Website may use cookies to enhance your browsing experience. You may disable cookies through your browser settings, but some features may not work properly.',
    ],
  },
  {
    id: 'international',
    title: 'International Orders',
    body: [
      'For international shipping, we may share your details with logistics partners outside India for delivery purposes.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    bullets: [
      'You may request access, correction, or deletion of your personal information by contacting us.',
      'You can unsubscribe from promotional emails at any time.',
    ],
  },
  {
    id: 'updates',
    title: 'Updates to Privacy Policy',
    body: [
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised date.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: ['If you have any questions, please contact us:'],
    contact: {
      email: 'prayoshacrystals@gmail.com',
      website: 'https://prayoshacrystals.com/contact',
    },
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

const RevealSection: FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useScrollReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={cn('reveal', className)}>
      {children}
    </div>
  )
}

// ─── PrivacyPage ──────────────────────────────────────────────────────────────

const PrivacyPage: FC = () => (
  <>
    <Navbar />
    <main id="main-content" className="bg-cream">

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden flex items-end"
        style={{
          minHeight: 'clamp(280px, 40vh, 440px)',
          paddingTop: '96px',
          background: 'radial-gradient(ellipse at 30% 70%, #2A3E5E 0%, #1A2A2E 45%, #1C1410 100%)',
        }}
      >
        <svg className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none" viewBox="0 0 500 400" fill="none" aria-hidden="true">
          <polygon points="300,30 460,140 460,300 300,360 140,300 140,140" stroke="#B8956A" strokeWidth="0.8" fill="none" />
          <circle cx="300" cy="200" r="100" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.5" />
        </svg>

        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none" style={{ background: '#5C7C8A', opacity: 0.15, filter: 'blur(80px)' }} aria-hidden="true" />

        <div className="relative z-10 animate-fadeUp" style={{ padding: 'clamp(2.5rem,6vw,4rem) clamp(1.25rem,5vw,4rem)' }}>
          <p className="flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-4">
            <span className="w-8 h-px bg-gold-light" aria-hidden="true" />
            Legal
          </p>
          <h1 className="font-display font-light text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] text-cream mb-4">
            Privacy Policy
          </h1>
          <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-cream/55 max-w-lg">
            How we collect, use, and protect your personal information. Last updated: 1 May 2025.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }} className="max-w-4xl mx-auto">

        {/* Intro */}
        <RevealSection>
          <p className="font-body font-extralight text-[0.86rem] leading-[2] text-bark mb-16 max-w-3xl">
            {INTRO}
          </p>
        </RevealSection>

        {/* Jump links */}
        <RevealSection>
          <nav aria-label="Page sections" className="mb-16 p-6 bg-warm border border-gold/15">
            <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-gold mb-4">Contents</p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 list-none">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="font-body text-[0.78rem] text-bark hover:text-amethyst transition-colors duration-200 flex items-baseline gap-2"
                  >
                    <span className="font-display font-light text-[0.65rem] text-gold/60 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </RevealSection>

        {/* Sections */}
        <div className="space-y-14">
          {SECTIONS.map((s, i) => (
            <RevealSection key={s.id}>
              <section id={s.id} aria-labelledby={`heading-${s.id}`}>
                <div className="flex items-start gap-5 mb-5">
                  <span className="font-display font-light text-[2.5rem] leading-none text-gold/25 tabular-nums select-none" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 id={`heading-${s.id}`} className="font-display font-light text-[clamp(1.3rem,3vw,1.75rem)] text-deep pt-1">
                    {s.title}
                  </h2>
                </div>

                <div className="pl-[calc(2.5rem+1.25rem)] space-y-4">
                  {s.body?.map((para, j) => (
                    <p key={j} className="font-body font-extralight text-[0.84rem] leading-[2] text-bark">
                      {para}
                    </p>
                  ))}

                  {s.bullets && (
                    <ul className="space-y-2.5">
                      {s.bullets.map((item, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span className="mt-[0.6rem] w-1 h-1 rounded-full bg-gold flex-none" aria-hidden="true" />
                          <span className="font-body font-extralight text-[0.84rem] leading-[2] text-bark">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.contact && (
                    <div className="mt-4 p-5 border-l-2 border-gold/40 bg-warm/50 space-y-2">
                      <p className="font-body text-[0.82rem] text-bark">
                        <span className="font-normal">Email:</span>{' '}
                        <a href={`mailto:${s.contact.email}`} className="text-amethyst hover:underline">
                          {s.contact.email}
                        </a>
                      </p>
                      <p className="font-body font-extralight text-[0.82rem] text-bark leading-relaxed">
                        <span className="font-normal">Website:</span>{' '}
                        <a href={s.contact.website} className="text-amethyst hover:underline">
                          {s.contact.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                {i < SECTIONS.length - 1 && (
                  <div className="mt-14 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" aria-hidden="true" />
                )}
              </section>
            </RevealSection>
          ))}
        </div>
      </div>

    </main>
    <Footer />
  </>
)

export default PrivacyPage
