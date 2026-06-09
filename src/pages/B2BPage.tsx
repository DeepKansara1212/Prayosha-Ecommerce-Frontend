import { useState, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getPublicSettings } from '@/api/settings.api'
import { cn } from '@/lib/utils'

// ─── Schema ───────────────────────────────────────────────────────────────────

const b2bSchema = z.object({
  name:         z.string().min(2, 'Name must be at least 2 characters'),
  mobileNumber: z
    .string()
    .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  message:      z.string().max(500).optional(),
})

type B2BFormData = z.infer<typeof b2bSchema>

// ─── Info items ───────────────────────────────────────────────────────────────

const INFO_ITEMS = [
  { icon: '🔮', text: 'Minimum order quantity: 10 pcs' },
  { icon: '📦', text: 'Custom packaging available' },
  { icon: '💎', text: 'Wholesale pricing on request' },
  { icon: '🚚', text: 'Pan-India shipping' },
]

// ─── B2BPage ──────────────────────────────────────────────────────────────────

const B2BPage: FC = () => {
  const [sent, setSent] = useState(false)

  const { data: settings } = useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  })

  const whatsappNumber = settings?.whatsappNumber?.trim() ?? ''
  const isAvailable = !!whatsappNumber

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<B2BFormData>({
    resolver: zodResolver(b2bSchema),
  })

  const onSubmit = (data: B2BFormData) => {
    const messageText = data.message?.trim() || 'No additional message'
    const waMessage = encodeURIComponent(
      `Hi! B2B Inquiry 🔮\n\nName: ${data.name}\nMobile: ${data.mobileNumber}\nMessage: ${messageText}\n\nI'm interested in placing a bulk/wholesale order with Prayosha Crystal.`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${waMessage}`, '_blank', 'noopener,noreferrer')
    setSent(true)
    setTimeout(() => {
      setSent(false)
      reset()
    }, 3000)
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-cream">

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden flex items-end"
          style={{
            minHeight: 'clamp(300px, 40vh, 480px)',
            paddingTop: '96px',
            background: 'radial-gradient(ellipse at 70% 50%, #2A1A2E 0%, #1A2530 50%, #1C1410 100%)',
          }}
        >
          <svg className="absolute left-0 top-0 w-1/2 h-full opacity-10 pointer-events-none" viewBox="0 0 500 500" fill="none" aria-hidden="true">
            <polygon points="200,50 420,160 420,340 200,450 -20,340 -20,160" stroke="#B8956A" strokeWidth="0.8" fill="none" />
            <circle cx="200" cy="250" r="150" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.4" />
          </svg>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full pointer-events-none" style={{ background: '#7B5EA7', opacity: 0.15, filter: 'blur(80px)' }} aria-hidden="true" />

          <div className="relative z-10 animate-fadeUp" style={{ padding: 'clamp(3rem,7vw,5rem) clamp(1.25rem,5vw,4rem)' }}>
            <p className="flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-5">
              <span className="w-8 h-px bg-gold-light" aria-hidden="true" />
              Wholesale & Bulk Orders
            </p>
            <h1 className="font-display font-light text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] text-cream mb-4">
              B2B / Bulk<br />
              <em className="italic text-gold-light">Inquiry</em>
            </h1>
            <p className="font-body font-extralight text-[0.88rem] leading-[1.85] text-cream/60 max-w-lg">
              Place a bulk or wholesale order with Prayosha Crystal. Fill in the form below and we'll connect with you on WhatsApp.
            </p>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ padding: 'clamp(3.5rem,7vw,6rem) clamp(1.25rem,5vw,4rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-16">

            {/* ── Form ── */}
            <div>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: 'rgba(37,211,102,0.15)' }}>
                    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#25D366" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="font-display font-light text-[2rem] text-deep mb-2">WhatsApp is opening!</h2>
                  <p className="font-body font-extralight text-[0.82rem] text-muted max-w-xs leading-relaxed">
                    Continue your conversation there. The form will reset in a moment.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="font-display font-light text-[clamp(1.8rem,3vw,2.4rem)] text-deep mb-2">
                    Send your inquiry
                  </h2>
                  <p className="font-body font-extralight text-[0.8rem] text-muted mb-8">
                    Fill in the form below and we'll connect with you on WhatsApp instantly.
                  </p>

                  <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-label="B2B inquiry form">

                    {/* Name */}
                    <div>
                      <label htmlFor="b2b-name" className="block font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">
                        Your Name <span className="text-rose ml-1" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="b2b-name"
                        type="text"
                        placeholder="Aria Sharma"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'b2b-name-err' : undefined}
                        {...register('name')}
                        className={cn(
                          'w-full font-body font-light text-[0.85rem] text-deep bg-cream border px-4 py-3.5 outline-none transition-colors duration-200 placeholder:text-muted/40',
                          errors.name ? 'border-rose' : 'border-warm focus:border-gold',
                        )}
                      />
                      {errors.name && (
                        <p id="b2b-name-err" role="alert" className="mt-1.5 font-body text-[0.68rem] text-rose">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Mobile */}
                    <div>
                      <label htmlFor="b2b-mobile" className="block font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">
                        Mobile Number <span className="text-rose ml-1" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="b2b-mobile"
                        type="tel"
                        placeholder="9876543210"
                        inputMode="numeric"
                        maxLength={10}
                        aria-invalid={!!errors.mobileNumber}
                        aria-describedby={errors.mobileNumber ? 'b2b-mobile-err' : undefined}
                        {...register('mobileNumber')}
                        className={cn(
                          'w-full font-body font-light text-[0.85rem] text-deep bg-cream border px-4 py-3.5 outline-none transition-colors duration-200 placeholder:text-muted/40',
                          errors.mobileNumber ? 'border-rose' : 'border-warm focus:border-gold',
                        )}
                      />
                      {errors.mobileNumber && (
                        <p id="b2b-mobile-err" role="alert" className="mt-1.5 font-body text-[0.68rem] text-rose">
                          {errors.mobileNumber.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="b2b-message" className="block font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">
                        Message
                      </label>
                      <textarea
                        id="b2b-message"
                        rows={4}
                        placeholder="Tell us about the crystals you need, quantities, and any specific requirements..."
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'b2b-message-err' : undefined}
                        {...register('message')}
                        className={cn(
                          'w-full font-body font-light text-[0.85rem] text-deep bg-cream border px-4 py-3.5 outline-none transition-colors duration-200 placeholder:text-muted/40 resize-none',
                          errors.message ? 'border-rose' : 'border-warm focus:border-gold',
                        )}
                      />
                      {errors.message && (
                        <p id="b2b-message-err" role="alert" className="mt-1.5 font-body text-[0.68rem] text-rose">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Unavailability note */}
                    {!isAvailable && (
                      <p className="font-body text-[0.78rem] text-muted border border-warm px-4 py-3 rounded">
                        WhatsApp contact is currently unavailable. Please use the{' '}
                        <Link to="/contact" className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors">
                          Contact page
                        </Link>
                        .
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!isAvailable || isSubmitting}
                      className={cn(
                        'w-full font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 transition-all duration-300 flex items-center justify-center gap-2',
                        !isAvailable || isSubmitting
                          ? 'bg-muted text-cream/70 cursor-not-allowed'
                          : 'text-white hover:opacity-90',
                      )}
                      style={isAvailable && !isSubmitting ? { background: '#25D366' } : undefined}
                      aria-busy={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2.5">
                          <span className="w-3.5 h-3.5 border border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
                          Opening WhatsApp…
                        </span>
                      ) : (
                        <>
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                          </svg>
                          Send Inquiry
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* ── Info card ── */}
            <div className="space-y-8">
              <div
                className="p-7"
                style={{
                  background: '#EDE8DC',
                  border: '1px solid #E2DAC8',
                  borderRadius: 16,
                }}
              >
                <h3
                  className="font-display font-light text-[1.3rem] text-deep mb-5"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1C1A17' }}
                >
                  Bulk & Wholesale Orders
                </h3>
                <div className="space-y-4">
                  {INFO_ITEMS.map(({ icon, text }) => (
                    <div key={text} className="flex items-start gap-4">
                      <span className="text-xl flex-none mt-0.5" aria-hidden="true">{icon}</span>
                      <p className="font-body font-light text-[0.82rem]" style={{ color: '#6B6057' }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t" style={{ borderColor: '#E2DAC8' }}>
                  <p className="font-body text-[0.62rem] uppercase tracking-[0.18em] mb-1" style={{ color: '#9E9590' }}>
                    Typical response time
                  </p>
                  <p className="font-body font-light text-[0.82rem]" style={{ color: '#6B6057' }}>
                    Within a few hours on WhatsApp
                  </p>
                </div>
              </div>

              <div className="p-7 border-l-2 border-gold" style={{ background: 'rgba(245,240,232,0.5)' }}>
                <p className="font-body text-[0.62rem] uppercase tracking-[0.2em] text-gold mb-3">
                  Quick links
                </p>
                {[
                  { label: 'Browse crystals', to: '/collection' },
                  { label: 'Contact us',       to: '/contact' },
                ].map(({ label, to }) => (
                  <Link
                    key={label}
                    to={to}
                    className="block font-body text-[0.78rem] py-2 border-b last:border-0 transition-colors duration-200 hover:text-gold"
                    style={{ color: '#6B6057', borderColor: '#E2DAC8' }}
                  >
                    {label} <span style={{ color: '#9E9590', opacity: 0.5 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default B2BPage
