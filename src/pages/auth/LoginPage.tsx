import { useEffect, useState, type FC, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import { AuthShell, AuthLink, FormError } from './_AuthShell'

const LoginPage: FC = () => {
  const navigate = useNavigate()
  const accessToken = useAuthStore(s => s.accessToken)
  const googleLogin = useAuthStore(s => s.googleLogin)
  const emailLogin = useAuthStore(s => s.emailLogin)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (accessToken) navigate('/', { replace: true })
  }, [accessToken, navigate])

  const submitEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setServerError('')
    setLoading(true)
    try {
      await emailLogin({ email, password })
      navigate('/')
      window.scrollTo({ top: 0 })
    } catch (err: unknown) {
      setServerError(err instanceof Error ? err.message : 'Could not sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      headline="Welcome back to"
      headlineItalic="Prayosha Crystal"
      subtext="Sign in with Google to access your orders, wishlist, and the sacred stone collection curated for your journey."
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontSize: '28px', color: '#1C1A17', margin: 0 }}>
          Sign in
        </h2>
      </div>

      {serverError && <div style={{ marginBottom: '16px' }}><FormError message={serverError} /></div>}

      <form onSubmit={submitEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'Jost, system-ui, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6057' }}>
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
        <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'Jost, system-ui, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B6057' }}>
          Password
          <input
            className="auth-input"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={event => setPassword(event.target.value)}
            style={{ border: '1px solid #E2DAC8' }}
          />
        </label>
        <button type="submit" disabled={loading} className="auth-btn-primary">
          {loading ? 'Signing in…' : 'Sign in with email'}
        </button>
      </form>
      <p style={{ margin: '10px 0 0', textAlign: 'center', fontFamily: 'Jost, system-ui, sans-serif', fontSize: '12px', color: '#9A8F85' }}>
        Password recovery is temporarily unavailable while phone verification is paused.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0', color: '#9A8F85', fontFamily: 'Jost, system-ui, sans-serif', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        <span style={{ flex: 1, height: 1, background: '#E2DAC8' }} />
        or
        <span style={{ flex: 1, height: 1, background: '#E2DAC8' }} />
      </div>

      <GoogleSignInButton onCredential={async credential => {
        await googleLogin(credential)
        navigate('/')
        window.scrollTo({ top: 0 })
      }} />

      <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E2DAC8', textAlign: 'center', fontFamily: 'Jost, system-ui, sans-serif', fontSize: '13px', color: '#6B6057' }}>
        New here? <AuthLink onClick={() => navigate('/auth/register')}>Create an account</AuthLink>
      </div>
    </AuthShell>
  )
}

export default LoginPage
