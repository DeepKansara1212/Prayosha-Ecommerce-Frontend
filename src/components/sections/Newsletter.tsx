import { useState, type FC, type FormEvent } from 'react'

const Newsletter: FC = () => {
  const [email, setEmail]     = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  return (
    <section
      className="bg-amethyst section-p text-center"
      aria-labelledby="newsletter-title"
    >
      <p className="flex items-center justify-center gap-3 font-body text-label uppercase tracking-[0.3em] text-cream/70 mb-3">
        <span className="block w-9 h-px bg-cream/40 flex-none" aria-hidden="true" />
        Stay Connected
        <span className="block w-9 h-px bg-cream/40 flex-none" aria-hidden="true" />
      </p>

      <h2
        id="newsletter-title"
        className="font-display font-light text-[clamp(2rem,5vw,3.5rem)] leading-[1.15] text-cream mb-3"
      >
        The Crystal{' '}
        <em className="italic" style={{ color: '#E5C5F0' }}>Chronicle</em>
      </h2>

      <p className="font-body font-extralight text-[0.83rem] leading-[1.8] text-cream/65 max-w-[400px] mx-auto mb-7">
        New moon drops, crystal wisdom, exclusive offers and rituals — delivered to your inbox. Join 12,000+ seekers.
      </p>

      {submitted ? (
        <p className="font-body text-[0.85rem] text-cream/90 tracking-[0.05em]" role="status">
          ✦ &nbsp;Thank you — your journey begins now.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row max-w-[440px] mx-auto"
          noValidate
          aria-label="Newsletter signup"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Your email address"
            autoComplete="email"
            className="
              flex-1 min-w-0 bg-cream/10 border border-cream/25
              sm:border-r-0
              text-cream font-body text-[0.8rem] tracking-[0.05em]
              px-4 py-[0.85rem]
              placeholder:text-cream/40
              outline-none focus:border-cream/50
            "
            aria-describedby={error ? 'newsletter-error' : undefined}
          />
          <button
            type="submit"
            className="
              bg-gold text-deep font-body text-[0.68rem] uppercase tracking-[0.2em]
              px-6 py-[0.85rem] border-none cursor-pointer whitespace-nowrap
              transition-colors duration-300 hover:bg-gold-light
            "
          >
            Subscribe
          </button>
        </form>
      )}

      {error && (
        <p id="newsletter-error" role="alert" className="mt-2 font-body text-[0.75rem] text-cream/80">
          {error}
        </p>
      )}
    </section>
  )
}

export default Newsletter
