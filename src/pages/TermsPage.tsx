import type { FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

// ─── Content ──────────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'acceptance',
    title: 'Acceptance of Terms',
    body: [
      'By using our services, you agree to provide accurate information and comply with these Terms & Conditions.',
    ],
  },
  {
    id: 'products',
    title: 'Products & Services',
    body: [
      'All products displayed are subject to availability.',
      'We reserve the right to modify or discontinue any product without prior notice.',
      'Prices may change at any time without notice.',
    ],
  },
  {
    id: 'orders',
    title: 'Orders & Payments',
    body: [
      'By placing an order, you agree to provide accurate and complete details.',
      'Payments must be made using the payment methods available on our Website or at our Showroom.',
      'We are not responsible for delays due to payment gateway or banking issues.',
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & Delivery',
    body: [
      'We provide shipping across India and International locations.',
      'Delivery timelines are estimates and may vary depending on the destination & Transport Companies.',
      'Any customs duties, import taxes, or additional charges for international orders are the responsibility of the buyer.',
    ],
  },
  {
    id: 'returns',
    title: 'Return & Refund Policy',
    body: [
      'Due to the natural and metaphysical nature of crystals, all sales are final.',
      'We do not accept returns, exchanges, or refunds once the order is confirmed and shipped.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    body: [
      'All logos, designs, images, text, and content on this Website are the intellectual property of Prayosha Crystals.',
      'You may not copy, reproduce, or use our content without prior written permission.',
    ],
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    body: [
      'We are not liable for any losses or damages arising from improper use of our products.',
      'We are not liable for delays or failures in delivery due to circumstances beyond our control (courier delays, customs clearance, natural events, etc.).',
    ],
  },
  {
    id: 'indemnification',
    title: 'Indemnification',
    body: [
      'You agree to indemnify and hold harmless Prayosha Crystals from any claims, damages, or expenses resulting from your misuse of our Website or products.',
    ],
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    body: [
      'These Terms are governed by and construed under the laws of India. Any disputes shall be subject to the jurisdiction of courts in Gujarat, India.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to Terms',
    body: [
      'We may revise or update these Terms at any time. Changes will be effective once posted on our Website.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    body: [
      'For any queries regarding these Terms, contact us:',
    ],
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

// ─── TermsPage ────────────────────────────────────────────────────────────────

const TermsPage: FC = () => (
  <>
    <Navbar />
    <main id="main-content" className="bg-cream">

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden flex items-end"
        style={{
          minHeight: 'clamp(280px, 40vh, 440px)',
          paddingTop: '96px',
          background: 'radial-gradient(ellipse at 30% 70%, #4A2D5E 0%, #2A1A2E 45%, #1C1410 100%)',
        }}
      >
        {/* Geo SVG */}
        <svg className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none" viewBox="0 0 500 400" fill="none" aria-hidden="true">
          <polygon points="300,30 460,140 460,300 300,360 140,300 140,140" stroke="#B8956A" strokeWidth="0.8" fill="none" />
          <circle cx="300" cy="200" r="100" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.5" />
        </svg>

        <div className="absolute top-1/4 right-1/4 w-72 h-72 rounded-full pointer-events-none" style={{ background: '#7C5C8A', opacity: 0.15, filter: 'blur(80px)' }} aria-hidden="true" />

        <div className="relative z-10 animate-fadeUp" style={{ padding: 'clamp(2.5rem,6vw,4rem) clamp(1.25rem,5vw,4rem)' }}>
          <p className="flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-4">
            <span className="w-8 h-px bg-gold-light" aria-hidden="true" />
            Legal
          </p>
          <h1 className="font-display font-light text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] text-cream mb-4">
            Terms &amp; Conditions
          </h1>
          <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-cream/55 max-w-lg">
            Please read these terms carefully before using our website or placing an order. Last updated: 1 May 2025.
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }} className="max-w-4xl mx-auto">

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
                  {s.body.map((para, j) => (
                    <p key={j} className="font-body font-extralight text-[0.84rem] leading-[2] text-bark">
                      {para}
                    </p>
                  ))}

                  {s.contact && (
                    <div className="mt-4 p-5 border-l-2 border-gold/40 bg-warm/50 space-y-2">
                      <p className="font-body text-[0.82rem] text-bark">
                        <span className="font-normal">Email:</span>{' '}
                        <a href={`mailto:${s.contact.email}`} className="text-amethyst hover:underline">
                          {s.contact.email}
                        </a>
                      </p>
                      {'website' in s.contact && (
                        <p className="font-body font-extralight text-[0.82rem] text-bark leading-relaxed">
                          <span className="font-normal">Website:</span>{' '}
                          <a href={s.contact.website} className="text-amethyst hover:underline">
                            {s.contact.website}
                          </a>
                        </p>
                      )}
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

export default TermsPage
