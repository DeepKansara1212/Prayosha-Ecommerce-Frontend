import { useState, useCallback, type FC, type FormEvent, type ChangeEvent } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = 'signin' | 'signup'

interface SignInForm { email: string; password: string; remember: boolean }
interface SignUpForm { firstName: string; lastName: string; email: string; password: string; confirm: string; newsletter: boolean }
type SignInErrors  = Partial<Record<keyof SignInForm, string>>
type SignUpErrors  = Partial<Record<keyof SignUpForm, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateSignIn(f: SignInForm): SignInErrors {
  const e: SignInErrors = {}
  if (!f.email)                      e.email    = 'Email is required.'
  else if (!EMAIL_RE.test(f.email))  e.email    = 'Enter a valid email.'
  if (!f.password)                   e.password = 'Password is required.'
  else if (f.password.length < 6)    e.password = 'Minimum 6 characters.'
  return e
}

function validateSignUp(f: SignUpForm): SignUpErrors {
  const e: SignUpErrors = {}
  if (!f.firstName.trim())              e.firstName = 'First name is required.'
  if (!f.lastName.trim())               e.lastName  = 'Last name is required.'
  if (!f.email)                         e.email     = 'Email is required.'
  else if (!EMAIL_RE.test(f.email))     e.email     = 'Enter a valid email.'
  if (!f.password)                      e.password  = 'Password is required.'
  else if (f.password.length < 8)       e.password  = 'Minimum 8 characters.'
  else if (!/[A-Z]/.test(f.password))   e.password  = 'Include at least one uppercase letter.'
  if (f.confirm !== f.password)         e.confirm   = 'Passwords do not match.'
  return e
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

const Field: FC<{ id: string; label: string; type?: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; autoComplete?: string; required?: boolean }> = ({
  id, label, type = 'text', value, onChange, error, placeholder, autoComplete, required,
}) => (
  <div>
    <label htmlFor={id} className="block font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">
      {label}{required && <span className="text-rose ml-1" aria-hidden="true">*</span>}
    </label>
    <input
      id={id} type={type} value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder} autoComplete={autoComplete}
      aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined}
      className={cn(
        'w-full font-body font-light text-[0.85rem] text-deep bg-cream border px-4 py-3.5 outline-none transition-colors duration-200 placeholder:text-muted/40',
        error ? 'border-rose' : 'border-warm focus:border-gold',
      )}
    />
    {error && <p id={`${id}-e`} role="alert" className="mt-1.5 font-body text-[0.68rem] text-rose">{error}</p>}
  </div>
)

const PasswordField: FC<{ id: string; label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string; autoComplete?: string; required?: boolean }> = ({
  id, label, value, onChange, error, placeholder, autoComplete, required,
}) => {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className="block font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">
        {label}{required && <span className="text-rose ml-1" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <input
          id={id} type={show ? 'text' : 'password'} value={value}
          onChange={e => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={error ? `${id}-e` : undefined}
          className={cn(
            'w-full font-body font-light text-[0.85rem] text-deep bg-cream border px-4 py-3.5 pr-12 outline-none transition-colors duration-200 placeholder:text-muted/40',
            error ? 'border-rose' : 'border-warm focus:border-gold',
          )}
        />
        <button type="button" onClick={() => setShow(s => !s)} aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-bark transition-colors">
          {show
            ? <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            : <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
        </button>
      </div>
      {error && <p id={`${id}-e`} role="alert" className="mt-1.5 font-body text-[0.68rem] text-rose">{error}</p>}
    </div>
  )
}

const Checkbox: FC<{ id: string; label: React.ReactNode; checked: boolean; onChange: (v: boolean) => void }> = ({ id, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
    <div className={cn('relative mt-0.5 w-4 h-4 border flex-none transition-colors duration-200', checked ? 'border-gold bg-gold' : 'border-warm group-hover:border-muted bg-cream')}>
      <input id={id} type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
      {checked && (
        <svg viewBox="0 0 10 8" className="absolute inset-0 m-auto w-2.5 h-2 fill-none stroke-deep" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 4l3 3 5-6" />
        </svg>
      )}
    </div>
    <span className="font-body font-light text-[0.75rem] text-muted leading-snug">{label}</span>
  </label>
)

const SocialBtn: FC<{ symbol: string; label: string }> = ({ symbol, label }) => (
  <button type="button" aria-label={`Continue with ${label}`}
    className="flex-1 flex items-center justify-center gap-2 border border-warm py-3 font-body text-[0.65rem] uppercase tracking-[0.15em] text-muted hover:border-muted hover:text-bark transition-all duration-200">
    <span className="text-sm" aria-hidden="true">{symbol}</span>{label}
  </button>
)

function pwStrength(pw: string): { score: number; label: string; colour: string } {
  if (!pw) return { score: 0, label: '', colour: 'bg-warm' }
  let s = 0
  if (pw.length >= 8) s++; if (pw.length >= 12) s++
  if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { score: s, label: 'Weak', colour: 'bg-rose' }
  if (s <= 3) return { score: s, label: 'Fair', colour: 'bg-[#D4921A]' }
  return { score: s, label: 'Strong', colour: 'bg-sage' }
}

// ─── Sign In form ─────────────────────────────────────────────────────────────

const SignInForm: FC<{ onSwitch: () => void; onSuccess: () => void }> = ({ onSwitch, onSuccess }) => {
  const [form, setForm]   = useState<SignInForm>({ email: '', password: '', remember: false })
  const [errs, setErrs]   = useState<SignInErrors>({})
  const [loading, setLd]  = useState(false)
  const [serverErr, setSe] = useState('')

  const set = useCallback(<K extends keyof SignInForm>(k: K, v: SignInForm[K]) => {
    setForm(f => ({ ...f, [k]: v })); setErrs(e => ({ ...e, [k]: undefined })); setSe('')
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const e2 = validateSignIn(form)
    if (Object.keys(e2).length) { setErrs(e2); return }
    setLd(true); await new Promise(r => setTimeout(r, 1200)); setLd(false)
    if (form.password === 'wrong') { setSe('Invalid email or password.'); return }
    onSuccess()
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {serverErr && (
        <div role="alert" className="border border-rose/40 bg-rose/5 px-4 py-3 flex gap-2.5">
          <span className="text-rose text-sm flex-none">✕</span>
          <p className="font-body text-[0.78rem] text-rose">{serverErr}</p>
        </div>
      )}
      <Field id="si-email" label="Email" type="email" value={form.email} onChange={v => set('email', v)} error={errs.email} placeholder="you@example.com" autoComplete="email" required />
      <PasswordField id="si-pw" label="Password" value={form.password} onChange={v => set('password', v)} error={errs.password} placeholder="Your password" autoComplete="current-password" required />
      <div className="flex items-center justify-between">
        <Checkbox id="remember" label="Remember me" checked={form.remember} onChange={v => set('remember', v)} />
        <button type="button" className="font-body text-[0.7rem] text-gold hover:text-gold-light transition-colors underline-offset-2 hover:underline">Forgot password?</button>
      </div>
      <button type="submit" disabled={loading}
        className={cn('w-full font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 transition-all duration-300', loading ? 'bg-muted text-cream/70 cursor-not-allowed' : 'bg-deep text-cream hover:bg-bark')}
        aria-busy={loading}>
        {loading ? <span className="flex items-center justify-center gap-2"><span className="w-3.5 h-3.5 border border-cream/40 border-t-cream rounded-full animate-spin" aria-hidden="true" />Signing in…</span> : 'Sign In'}
      </button>
      <div className="relative flex items-center gap-3"><div className="flex-1 h-px bg-warm" /><span className="font-body text-[0.6rem] uppercase tracking-[0.18em] text-muted/60 flex-none">or</span><div className="flex-1 h-px bg-warm" /></div>
      <div className="flex gap-3"><SocialBtn symbol="G" label="Google" /><SocialBtn symbol="⌘" label="Apple" /></div>
      <p className="text-center font-body text-[0.75rem] text-muted">New to Luminae? <button type="button" onClick={onSwitch} className="text-gold hover:text-gold-light transition-colors underline-offset-2 hover:underline">Create an account</button></p>
    </form>
  )
}

// ─── Sign Up form ─────────────────────────────────────────────────────────────

const SignUpForm: FC<{ onSwitch: () => void; onSuccess: () => void }> = ({ onSwitch, onSuccess }) => {
  const [form, setForm] = useState<SignUpForm>({ firstName: '', lastName: '', email: '', password: '', confirm: '', newsletter: true })
  const [errs, setErrs] = useState<SignUpErrors>({})
  const [loading, setLd] = useState(false)

  const set = useCallback(<K extends keyof SignUpForm>(k: K, v: SignUpForm[K]) => {
    setForm(f => ({ ...f, [k]: v })); setErrs(e => ({ ...e, [k]: undefined }))
  }, [])

  const strength = pwStrength(form.password)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const e2 = validateSignUp(form)
    if (Object.keys(e2).length) { setErrs(e2); return }
    setLd(true); await new Promise(r => setTimeout(r, 1400)); setLd(false); onSuccess()
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
        <Field id="su-fn" label="First name" value={form.firstName} onChange={v => set('firstName', v)} error={errs.firstName} placeholder="Aria" autoComplete="given-name" required />
        <Field id="su-ln" label="Last name"  value={form.lastName}  onChange={v => set('lastName', v)}  error={errs.lastName}  placeholder="Sharma" autoComplete="family-name" required />
      </div>
      <Field id="su-email" label="Email" type="email" value={form.email} onChange={v => set('email', v)} error={errs.email} placeholder="you@example.com" autoComplete="email" required />
      <div>
        <PasswordField id="su-pw" label="Password" value={form.password} onChange={v => set('password', v)} error={errs.password} placeholder="Min. 8 characters" autoComplete="new-password" required />
        {form.password && (
          <div className="mt-2" aria-live="polite">
            <div className="flex gap-1 mb-1" aria-hidden="true">
              {[1,2,3,4,5].map(n => <div key={n} className={cn('h-0.5 flex-1 rounded-full transition-colors duration-300', n <= strength.score ? strength.colour : 'bg-warm')} />)}
            </div>
            <p className="font-body text-[0.62rem] text-muted">Strength: <span className={strength.score <= 1 ? 'text-rose' : strength.score <= 3 ? 'text-[#D4921A]' : 'text-sage'}>{strength.label}</span></p>
          </div>
        )}
      </div>
      <PasswordField id="su-conf" label="Confirm password" value={form.confirm} onChange={v => set('confirm', v)} error={errs.confirm} placeholder="Repeat password" autoComplete="new-password" required />
      <div className="space-y-3 pt-1">
        <Checkbox id="nl" label="Send me moon-phase drops, crystal wisdom and exclusive offers" checked={form.newsletter} onChange={v => set('newsletter', v)} />
        <Checkbox id="terms" label={<>I agree to the <button type="button" className="text-gold hover:text-gold-light underline-offset-2 hover:underline">Terms</button> &amp; <button type="button" className="text-gold hover:text-gold-light underline-offset-2 hover:underline">Privacy Policy</button></>} checked={true} onChange={() => {}} />
      </div>
      <button type="submit" disabled={loading}
        className={cn('w-full font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 transition-all duration-300 mt-2', loading ? 'bg-muted text-cream/70 cursor-not-allowed' : 'bg-deep text-cream hover:bg-bark')}
        aria-busy={loading}>
        {loading ? <span className="flex items-center justify-center gap-2"><span className="w-3.5 h-3.5 border border-cream/40 border-t-cream rounded-full animate-spin" aria-hidden="true" />Creating account…</span> : 'Create Account'}
      </button>
      <div className="relative flex items-center gap-3"><div className="flex-1 h-px bg-warm" /><span className="font-body text-[0.6rem] uppercase tracking-[0.18em] text-muted/60 flex-none">or</span><div className="flex-1 h-px bg-warm" /></div>
      <div className="flex gap-3"><SocialBtn symbol="G" label="Google" /><SocialBtn symbol="⌘" label="Apple" /></div>
      <p className="text-center font-body text-[0.75rem] text-muted">Already have an account? <button type="button" onClick={onSwitch} className="text-gold hover:text-gold-light transition-colors underline-offset-2 hover:underline">Sign in</button></p>
    </form>
  )
}

// ─── Success screen ───────────────────────────────────────────────────────────

const SuccessScreen: FC<{ mode: AuthMode }> = ({ mode }) => (
  <div className="text-center py-8">
    <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-5">
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#6A8570" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
    </div>
    <h2 className="font-display font-light text-[2rem] text-deep mb-2">{mode === 'signin' ? 'Welcome back.' : 'Welcome to Luminae.'}</h2>
    <p className="font-body font-extralight text-[0.82rem] text-muted max-w-xs mx-auto leading-relaxed mb-7">
      {mode === 'signin' ? 'You\'re signed in. Your crystal collection awaits.' : 'Your account is ready. Begin your sacred stone journey.'}
    </p>
    <button onClick={() => { window.location.hash = '#/collection'; window.scrollTo({ top: 0 }) }}
      className="font-body text-[0.7rem] uppercase tracking-[0.2em] bg-deep text-cream px-8 py-4 hover:bg-bark transition-colors duration-200">
      Explore Collection
    </button>
  </div>
)

// ─── AuthPage ─────────────────────────────────────────────────────────────────

const AuthPage: FC = () => {
  const [mode, setMode]     = useState<AuthMode>('signin')
  const [success, setSuccess] = useState(false)

  const switchMode = useCallback(() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setSuccess(false) }, [])

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream">

        {/* Page hero strip */}
        <div
          className="relative overflow-hidden flex items-center justify-center text-center"
          style={{
            paddingTop: '96px',
            paddingBottom: 'clamp(2.5rem,5vw,4rem)',
            paddingLeft: 'clamp(1.25rem,5vw,4rem)',
            paddingRight: 'clamp(1.25rem,5vw,4rem)',
            background: 'radial-gradient(ellipse at 50% 0%, #2A1A2E 0%, #1C1410 80%)',
          }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 240" fill="none" aria-hidden="true">
            <polygon points="400,20 760,100 760,200 400,220 40,200 40,100" stroke="#B8956A" strokeWidth="0.8" fill="none" />
            <circle cx="400" cy="120" r="80" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.4" />
          </svg>
          <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full pointer-events-none" style={{ background: '#7C5C8A', opacity: 0.12, filter: 'blur(80px)' }} aria-hidden="true" />
          <div className="relative z-10">
            <p className="inline-flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-3">
              <span className="w-6 h-px bg-gold-light" aria-hidden="true" />
              {mode === 'signin' ? 'Welcome Back' : 'Join Luminae'}
              <span className="w-6 h-px bg-gold-light" aria-hidden="true" />
            </p>
            <h1 className="font-display font-light text-[clamp(2rem,5vw,3.2rem)] text-cream">
              {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
            </h1>
          </div>
        </div>

        {/* Form container */}
        <div style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,4rem)' }}>
          <div className="max-w-md mx-auto">

            {success ? (
              <SuccessScreen mode={mode} />
            ) : (
              <>
                {/* Mode tabs */}
                <div className="flex border-b border-warm mb-8" role="tablist">
                  {(['signin', 'signup'] as AuthMode[]).map(m => (
                    <button key={m} role="tab" aria-selected={mode === m}
                      onClick={() => { setMode(m); setSuccess(false) }}
                      className={cn(
                        'flex-1 pb-4 font-body text-[0.68rem] uppercase tracking-[0.2em] transition-all duration-200 border-b-2 -mb-px bg-transparent border-l-0 border-r-0 border-t-0 cursor-pointer',
                        mode === m ? 'text-deep border-gold' : 'text-muted border-transparent hover:text-bark',
                      )}>
                      {m === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                  ))}
                </div>

                {mode === 'signin'
                  ? <SignInForm onSwitch={switchMode} onSuccess={() => setSuccess(true)} />
                  : <SignUpForm onSwitch={switchMode} onSuccess={() => setSuccess(true)} />
                }
              </>
            )}
          </div>

          {/* Trust strip */}
          <div className="flex justify-center gap-8 mt-12 pt-8 border-t border-warm flex-wrap max-w-md mx-auto">
            {[['🔒','Secure login'],['✦','Authentic stones'],['📦','Sacred packaging'],['🌙','Moon-cleansed']].map(([icon, label]) => (
              <div key={label as string} className="text-center">
                <p className="text-base mb-1" aria-hidden="true">{icon}</p>
                <p className="font-body text-[0.58rem] uppercase tracking-[0.12em] text-muted">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default AuthPage
