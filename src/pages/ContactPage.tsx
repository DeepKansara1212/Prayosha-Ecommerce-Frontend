import { useState, type FC, type FormEvent, type ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'
import { sendContactMessage } from '@/api/contact.api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

type ContactErrors = Partial<Record<keyof ContactForm, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SUBJECTS = [
  'Product enquiry',
  'Order / shipping',
  'Returns & refunds',
  'Crystal guidance',
  'Wholesale / bulk',
  'Press & media',
  'Other',
]

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  { q: 'Are your crystals genuine and authentic?', a: 'Every stone is assessed by a qualified gemologist before inclusion in our collection. We provide full provenance documentation and never sell dyed, heat-treated or synthetic stones.' },
  { q: 'How do you cleanse the crystals before shipping?', a: 'Each crystal undergoes a full-moon cleansing ritual — placed under open sky during the full moon and cleared with selenite and sound. Your stone arrives energetically fresh.' },
  { q: 'What is your return policy?', a: 'We offer hassle-free returns within 7 days of delivery. The crystal must be returned in its original sacred packaging. Gift sets are non-returnable once opened.' },
  { q: 'How long does shipping take?', a: 'Standard delivery across India takes 3–5 business days. Express delivery (1–2 days) is available at checkout. All orders above ₹999 receive free shipping.' },
  { q: 'Do you offer wholesale or bulk pricing?', a: 'Yes — we work with wellness studios, retreat centres, and gift boutiques. Please reach out via the contact form selecting "Wholesale / bulk" and we will respond within 48 hours.' },
  { q: 'Can I request a specific crystal or custom set?', a: 'We love personal curation requests. Use the Crystal Guidance subject in our contact form and describe your intention — we will suggest the perfect combination.' },
]

// ─── FAQ accordion ────────────────────────────────────────────────────────────

const FAQItem: FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-warm last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          'w-full flex items-center justify-between gap-4 py-5 text-left transition-colors duration-200',
          'bg-transparent border-none cursor-pointer',
          open ? 'text-bark' : 'text-muted hover:text-bark',
        )}
        aria-expanded={open}
      >
        <span className="font-body text-[0.82rem] leading-snug pr-4">{q}</span>
        <span
          className={cn('flex-none w-5 h-5 border border-current rounded-full flex items-center justify-center text-[0.6rem] transition-transform duration-300', open && 'rotate-45')}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <div
        className={cn(
          'overflow-hidden transition-all duration-350',
          open ? 'max-h-48 pb-5' : 'max-h-0',
        )}
      >
        <p className="font-body font-extralight text-[0.8rem] leading-[1.9] text-muted">{a}</p>
      </div>
    </div>
  )
}

// ─── Input field ──────────────────────────────────────────────────────────────

interface InputProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  placeholder?: string
  required?: boolean
}

const Field: FC<InputProps> = ({ id, label, value, onChange, error, type = 'text', placeholder, required }) => (
  <div>
    <label htmlFor={id} className="block font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">
      {label}{required && <span className="text-rose ml-1" aria-hidden="true">*</span>}
    </label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-err` : undefined}
      className={cn(
        'w-full font-body font-light text-[0.85rem] text-deep bg-cream border px-4 py-3.5 outline-none transition-colors duration-200 placeholder:text-muted/40',
        error ? 'border-rose' : 'border-warm focus:border-gold',
      )}
    />
    {error && <p id={`${id}-err`} role="alert" className="mt-1.5 font-body text-[0.68rem] text-rose">{error}</p>}
  </div>
)

// ─── Contact info block ───────────────────────────────────────────────────────
// NOTE: This is the single source of truth for the studio address. The map
// embed below reads from STUDIO_ADDRESS so the two can never drift apart again.

const STUDIO_ADDRESS = 'SHOP NO.7, OPPO. BAPS SWAMINARAYAN TEMPLE, Khambhat, 388620'

const INFO_ITEMS = [
  { icon: '📍', label: 'Studio', value: STUDIO_ADDRESS },
  { icon: '📧', label: 'Email', value: 'prayoshacrytals@gmail.com' },
  { icon: '📞', label: 'Phone', value: '+91 94294 15057' },
]

const BRANCHES = [
  { city: 'Khambhat', state: 'Gujarat', location: STUDIO_ADDRESS },
  { city: 'Surat', state: 'Gujarat', location: 'Surat, Gujarat, India' },
  { city: 'Pune', state: 'Maharashtra', location: 'Pune, Maharashtra, India' },
  { city: 'Delhi', state: 'India', location: 'Delhi, India' },
]

// Google Maps embed URL (no API key required) — encodes the address as a query.
const MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(STUDIO_ADDRESS)}&output=embed`
// "Get Directions" deep link — opens full Google Maps in a new tab.
const MAPS_DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(STUDIO_ADDRESS)}`

// ─── ContactPage ──────────────────────────────────────────────────────────────

const ContactPage: FC = () => {
  const [searchParams] = useSearchParams()
  const inquiryProduct = searchParams.get('product')?.slice(0, 100)
  const inquiryProductUrl = searchParams.get('productUrl') ?? undefined
  const [form, setForm]       = useState<ContactForm>(() => ({
    name: '',
    email: '',
    subject: inquiryProduct ? 'Product enquiry' : SUBJECTS[0],
    message: inquiryProduct
      ? `I'd like to enquire about ${inquiryProduct}. Please share more information and pricing.`
      : '',
  }))
  const [errors, setErrors]   = useState<ContactErrors>({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [submitError, setSubmitError] = useState('')

  const set = <K extends keyof ContactForm>(k: K, v: ContactForm[K]) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
    setSubmitError('')
  }

  const validate = (): ContactErrors => {
    const e: ContactErrors = {}
    if (!form.name.trim())                    e.name    = 'Your name is required.'
    if (!form.email)                          e.email   = 'Email is required.'
    else if (!EMAIL_RE.test(form.email))      e.email   = 'Enter a valid email address.'
    if (!form.message.trim())                 e.message = 'Please write your message.'
    else if (form.message.trim().length < 20) e.message = 'Message must be at least 20 characters.'
    return e
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    setSubmitError('')
    try {
      await sendContactMessage({ ...form, productUrl: inquiryProductUrl })
      setSent(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to send your message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const revealRef1 = useScrollReveal<HTMLDivElement>()
  const revealRef2 = useScrollReveal<HTMLDivElement>()
  const revealRef3 = useScrollReveal<HTMLDivElement>()

  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-cream">

        {/* ── Main content ── */}
        <div style={{
          paddingTop: 'calc(88px + clamp(2rem,5vw,4rem))',
          paddingBottom: 'clamp(3.5rem,7vw,6rem)',
          paddingLeft: 'clamp(1.25rem,5vw,4rem)',
          paddingRight: 'clamp(1.25rem,5vw,4rem)',
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-12 xl:gap-16">

            {/* ── Contact form ── */}
            <div ref={revealRef1} className="reveal">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mb-5">
                    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#6A8570" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  <h2 className="font-display font-light text-[2rem] text-deep mb-2">Message received.</h2>
                  <p className="font-body font-extralight text-[0.82rem] text-muted max-w-xs leading-relaxed mb-6">
                    Thank you, {form.name.split(' ')[0]}. We'll respond to <strong>{form.email}</strong> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }) }}
                    className="font-body text-[0.68rem] uppercase tracking-[0.18em] text-gold hover:text-gold-light transition-colors underline-offset-2 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-display font-light text-[clamp(1.8rem,3vw,2.4rem)] text-deep mb-2">Send us a message</h2>
                  <p className="font-body font-extralight text-[0.8rem] text-muted mb-8">
                    Fill in the form below and a member of our team will reply within one business day.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="Contact form">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-5">
                      <Field id="c-name"  label="Your name"  value={form.name}  onChange={v => set('name', v)}  error={errors.name}  placeholder="Aria Sharma" required />
                      <Field id="c-email" label="Email"       value={form.email} onChange={v => set('email', v)} error={errors.email} placeholder="you@example.com" type="email" required />
                    </div>

                    {/* Subject select */}
                    <div>
                      <label htmlFor="c-subject" className="block font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">Subject</label>
                      <div className="relative">
                        <select
                          id="c-subject"
                          value={form.subject}
                          onChange={e => set('subject', e.target.value)}
                          className="w-full font-body font-light text-[0.85rem] text-deep bg-cream border border-warm px-4 py-3.5 outline-none focus:border-gold transition-colors appearance-none cursor-pointer"
                        >
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted text-[0.65rem]">▾</span>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="c-message" className="block font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">
                        Message <span className="text-rose" aria-hidden="true">*</span>
                      </label>
                      <textarea
                        id="c-message"
                        value={form.message}
                        onChange={e => set('message', e.target.value)}
                        rows={6}
                        placeholder="Tell us about the crystal you're looking for, your order query, or anything else on your mind…"
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? 'msg-err' : undefined}
                        className={cn(
                          'w-full font-body font-light text-[0.85rem] text-deep bg-cream border px-4 py-3.5 outline-none transition-colors duration-200 placeholder:text-muted/40 resize-none',
                          errors.message ? 'border-rose' : 'border-warm focus:border-gold',
                        )}
                      />
                      {errors.message && <p id="msg-err" role="alert" className="mt-1.5 font-body text-[0.68rem] text-rose">{errors.message}</p>}
                      <p className="mt-1.5 font-body text-[0.62rem] text-muted/60">{form.message.length} / 500 characters</p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={cn(
                        'w-full font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 transition-all duration-300',
                        loading ? 'bg-muted text-cream/70 cursor-not-allowed' : 'bg-deep text-cream hover:bg-bark',
                      )}
                      aria-busy={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2.5">
                          <span className="w-3.5 h-3.5 border border-cream/40 border-t-cream rounded-full animate-spin" aria-hidden="true" />
                          Sending…
                        </span>
                      ) : 'Send Message'}
                    </button>
                    {submitError && (
                      <p role="alert" className="font-body text-[0.72rem] leading-relaxed text-rose">
                        {submitError}
                      </p>
                    )}
                  </form>
                </>
              )}
            </div>

            {/* ── Right sidebar ── */}
            <div ref={revealRef2} className="reveal space-y-8">

              {/* Contact info */}
              <div className="bg-warm p-7">
                <h3 className="font-display font-light text-[1.3rem] text-deep mb-5">Contact information</h3>
                <div className="space-y-5">
                  {INFO_ITEMS.map(({ icon, label, value }) => (
                    <div key={label} className="flex items-start gap-4">
                      <span className="text-xl flex-none mt-0.5" aria-hidden="true">{icon}</span>
                      <div>
                        <p className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-muted mb-0.5">{label}</p>
                        <p className="font-body font-light text-[0.8rem] text-bark">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="border border-warm p-7">
                <h3 className="font-display font-light text-[1.1rem] text-deep mb-4">Studio hours</h3>
                <div className="space-y-2">
                  {[
                    { day: 'Monday – Saturday', hours: '9:00 am – 6:00 pm' },
                    { day: 'Sunday',          hours: 'Closed' },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between font-body text-[0.75rem]">
                      <span className="text-muted">{day}</span>
                      <span className={cn('text-bark', hours === 'Closed' && 'text-muted italic')}>{hours}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-4 font-body font-extralight text-[0.72rem] text-muted leading-relaxed">
                  Online support responds within 24 hours on all days.
                </p>
              </div>

              {/* Quick links */}
              <div className="p-7 border-l-2 border-gold bg-warm/50">
                <p className="font-body text-[0.62rem] uppercase tracking-[0.2em] text-gold mb-3">Quick links</p>
                {[
                  { label: 'Browse crystals',    hash: '#/collection' },
                  { label: 'Track my order',     hash: '#/auth' },
                  { label: 'Returns & refunds',  hash: '#/contact' },
                  { label: 'Crystal guidance',   hash: '#/contact' },
                ].map(({ label, hash }) => (
                  <button
                    key={label}
                    onClick={() => { window.location.hash = hash; window.scrollTo({ top: 0 }) }}
                    className="block w-full text-left font-body text-[0.78rem] text-bark hover:text-gold py-2 border-b border-warm/60 last:border-0 transition-colors duration-200 bg-transparent border-l-0 border-r-0 cursor-pointer"
                  >
                    {label} <span className="text-muted/50">→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FAQ section ── */}
        <div className="bg-warm">
          <div style={{ padding: 'clamp(4rem,8vw,6rem) clamp(1.25rem,5vw,4rem)' }}>
            <div className="text-center mb-10">
              <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-3">Have questions?</p>
              <h2 className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-deep">
                Frequently <em className="italic text-amethyst">asked</em>
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              {FAQS.map(faq => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Our branches ── */}
        <section aria-labelledby="branches-heading" className="section-p">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-3">Closer to you</p>
              <h2 id="branches-heading" className="font-display font-light text-[clamp(2rem,4vw,3rem)] text-deep">
                Our <em className="italic text-amethyst">branches</em>
              </h2>
              <p className="font-body font-extralight text-[0.82rem] text-muted mt-3">
                Find Prayosha Crystals across India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {BRANCHES.map(({ city, state, location }, index) => (
                <article
                  key={city}
                  className="group relative overflow-hidden border border-warm bg-cream p-6 sm:p-7 transition-colors duration-300 hover:bg-warm/50"
                >
                  <div className="absolute left-0 top-0 h-0.5 w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-body text-[0.62rem] tracking-[0.2em] text-gold">
                      0{index + 1}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-gold"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </div>
                  <h3 className="font-display font-light text-[1.8rem] leading-none text-deep">{city}</h3>
                  <p className="font-body text-[0.68rem] uppercase tracking-[0.18em] text-muted mt-2">{state}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-7 font-body text-[0.62rem] uppercase tracking-[0.16em] text-gold transition-colors hover:text-bark"
                    aria-label={`Find our ${city} branch on Google Maps`}
                  >
                    Find on map <span aria-hidden="true">→</span>
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Map ── */}
        <div ref={revealRef3} className="reveal relative overflow-hidden">
          <iframe
            title={`Map showing our studio location: ${STUDIO_ADDRESS}`}
            src={MAPS_EMBED_URL}
            style={{ border: 0, width: '100%', height: 'clamp(280px, 40vh, 440px)', display: 'block', filter: 'grayscale(0.15) contrast(1.05)' }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {/* Floating info card over the map */}
          <div className="absolute left-4 bottom-4 sm:left-8 sm:bottom-8 bg-cream shadow-lg p-5 sm:p-6 max-w-[280px]">
            <p className="font-body text-[0.6rem] uppercase tracking-[0.2em] text-gold mb-2">Visit our studio</p>
            <p className="font-display font-normal text-[1rem] text-deep mb-1">Prayosha Crystals</p>
            <p className="font-body font-extralight text-[0.75rem] text-bark leading-relaxed mb-4">{STUDIO_ADDRESS}</p>
            <a
              href={MAPS_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-body text-[0.68rem] uppercase tracking-[0.15em] text-gold hover:text-gold-light transition-colors"
            >
              Get Directions <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ContactPage