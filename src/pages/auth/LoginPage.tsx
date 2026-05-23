import { useState, useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import * as authApi from '@/api/auth.api'
import {
  AuthShell, FormField, PasswordField, FormError, AuthLink,
} from './_AuthShell'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
})

const step2Schema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type Step1Values = z.infer<typeof step1Schema>
type Step2Values = z.infer<typeof step2Schema>

// ─── Step 1 — Phone ───────────────────────────────────────────────────────────

const Step1: FC<{ onSuccess: (phone: string) => void }> = ({ onSuccess }) => {
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
  })

  const submit = async (data: Step1Values) => {
    setServerError('')
    setLoading(true)
    try {
      await authApi.sendOtp({ phone: data.phone, purpose: 'login' })
      onSuccess(data.phone)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {serverError && <FormError message={serverError} />}

      <FormField
        label="Mobile Number"
        error={errors.phone?.message}
        type="tel"
        placeholder="10-digit mobile number"
        maxLength={10}
        autoComplete="tel"
        {...register('phone')}
      />

      <button type="submit" disabled={loading} className="auth-btn-primary">
        {loading ? 'Sending OTP…' : 'Send OTP'}
      </button>
    </form>
  )
}

// ─── Step 2 — OTP + Password ──────────────────────────────────────────────────

const Step2: FC<{ phone: string; onBack: () => void }> = ({ phone, onBack }) => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const login = useAuthStore(s => s.login)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
  })

  const resendOtp = async () => {
    setServerError('')
    setResending(true)
    try {
      await authApi.sendOtp({ phone, purpose: 'login' })
      setValue('otp', '')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not resend OTP.'
      setServerError(msg)
    } finally {
      setResending(false)
    }
  }

  const submit = async (data: Step2Values) => {
    setServerError('')
    setLoading(true)
    try {
      await login({ phone, otp: data.otp, password: data.password })
      navigate('/')
      window.scrollTo({ top: 0 })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP or password.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {serverError && <FormError message={serverError} />}

      <p style={{ fontFamily: 'Jost, system-ui, sans-serif', fontSize: '13px', color: '#6B6057', margin: 0 }}>
        OTP sent to <strong style={{ color: '#1C1A17' }}>{phone}</strong>
      </p>

      <FormField
        label="OTP"
        error={errors.otp?.message}
        type="text"
        inputMode="numeric"
        placeholder="6-digit OTP"
        maxLength={6}
        autoComplete="one-time-code"
        {...register('otp')}
      />

      <PasswordField
        label="Password"
        error={errors.password?.message}
        placeholder="Your password"
        autoComplete="current-password"
        {...register('password')}
      />

      <button type="submit" disabled={loading} className="auth-btn-primary">
        {loading ? 'Signing in…' : 'Login'}
      </button>

      <div style={{ textAlign: 'center' }}>
        <AuthLink onClick={resending ? undefined : resendOtp}>
          {resending ? 'Resending…' : 'Resend OTP'}
        </AuthLink>
      </div>
    </form>
  )
}

// ─── LoginPage ────────────────────────────────────────────────────────────────

const LoginPage: FC = () => {
  const navigate    = useNavigate()
  const accessToken = useAuthStore(s => s.accessToken)

  useEffect(() => {
    if (accessToken) navigate('/', { replace: true })
  }, [accessToken, navigate])

  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState('')

  return (
    <AuthShell
      headline="Welcome back to"
      headlineItalic="Prayosha Crystal"
      subtext="Sign in to access your orders, wishlist, and the sacred stone collection curated for your journey."
    >
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Jost, system-ui, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6057', marginBottom: '8px' }}>
          {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
        </p>
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontSize: '28px', color: '#1C1A17', margin: 0 }}>
          {step === 1 ? 'Enter your number' : 'Verify & sign in'}
        </h2>
      </div>

      {step === 1
        ? <Step1 onSuccess={p => { setPhone(p); setStep(2) }} />
        : <Step2 phone={phone} onBack={() => setStep(1)} />
      }

      <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E2DAC8', display: 'flex', flexWrap: 'wrap', gap: '6px 16px', justifyContent: 'center', fontFamily: 'Jost, system-ui, sans-serif', fontSize: '13px', color: '#6B6057' }}>
        <span>New here? <AuthLink onClick={() => navigate('/auth/register')}>Create account</AuthLink></span>
        <span style={{ color: '#E2DAC8' }}>·</span>
        <AuthLink onClick={() => navigate('/auth/forgot')}>Forgot password?</AuthLink>
      </div>
    </AuthShell>
  )
}

export default LoginPage
