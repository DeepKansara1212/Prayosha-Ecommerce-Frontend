import { useEffect, useState, type FC, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { AuthShell, AuthLink, FormError } from './_AuthShell'

const RegisterPage: FC = () => {
  const navigate = useNavigate()
  const accessToken = useAuthStore(s => s.accessToken)
  const googleLogin = useAuthStore(s => s.googleLogin)
  const registerWithEmail = useAuthStore(s => s.registerWithEmail)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (accessToken) navigate('/', { replace: true })
  }, [accessToken, navigate])

  const submitEmailRegistration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError('')
    setLoading(true)
    try {
      await registerWithEmail({ name, email, password })
      navigate('/')
      window.scrollTo({ top: 0 })
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Could not create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      headline="Begin your"
      headlineItalic="crystal journey"
      subtext="Create an account with Google to track your orders, save favourites, and unlock a world of sacred stones."
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 400, fontSize: '28px', color: '#1C1A17', margin: 0 }}>
          Create your account
        </h2>
      </div>

      {serverError && <div style={{ marginBottom: '16px' }}><FormError message={serverError} /></div>}

      <form onSubmit={submitEmailRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-body)', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B6057' }}>
          Full name
          <input
            className="auth-input"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={50}
            required
            value={name}
            onChange={event => setName(event.target.value)}
            style={{ border: '1px solid #E2DAC8' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-body)', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B6057' }}>
          Email address
          <input
            className="auth-input"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={event => setEmail(event.target.value)}
            style={{ border: '1px solid #E2DAC8' }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-body)', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6B6057' }}>
          Password
          <input
            className="auth-input"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
            style={{ border: '1px solid #E2DAC8' }}
          />
        </label>
        <button type="submit" disabled={loading} className="auth-btn-primary">
          {loading ? 'Creating account…' : 'Create account with email'}
        </button>
      </form>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', color: '#9A8F85', fontFamily: 'var(--font-body)', fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        <span style={{ flex: 1, height: 1, background: '#E2DAC8' }} />
        or
        <span style={{ flex: 1, height: 1, background: '#E2DAC8' }} />
      </div>

      <GoogleSignInButton onCredential={async credential => {
        await googleLogin(credential)
        navigate('/')
        window.scrollTo({ top: 0 })
      }} />

      <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E2DAC8', textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '13px', color: '#6B6057' }}>
        Already have an account? <AuthLink onClick={() => navigate('/auth/login')}>Sign in</AuthLink>
      </div>
    </AuthShell>
  )
}

export default RegisterPage
