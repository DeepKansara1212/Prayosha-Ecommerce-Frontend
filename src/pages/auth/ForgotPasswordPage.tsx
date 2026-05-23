import { useState, useEffect, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import * as authApi from '@/api/auth.api'
import {
  AuthShell, FormField, PasswordField, FormError, FormHint, AuthLink,
} from './_AuthShell'

// ─── Schemas ──────────────────────────────────────────────────────────────────

const step1Schema = z.object({
  phone: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
})

const step2Schema = z.object({
  otp:             z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  newPassword:     z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
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
      <FormField label="Mobile Number" error={errors.phone?.message} type="tel" placeholder="10-digit mobile number" maxLength={10} autoComplete="tel" {...register('phone')} />
      <button type="submit" disabled={loading} className="auth-btn-primary">
        {loading ? 'Sending OTP…' : 'Send OTP'}
      </button>
    </form>
  )
}

// ─── Step 2 — OTP + New password ──────────────────────────────────────────────

const Step2: FC<{ phone: string }> = ({ phone }) => {
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

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
      await authApi.resetPassword({ phone, otp: data.otp, newPassword: data.newPassword })
      navigate('/auth/login')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not reset password. Please try again.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {serverError && <FormError message={serverError} />}
      <FormHint message="If this number is registered, you'll receive an OTP shortly." />
      <FormField label="OTP" error={errors.otp?.message} type="text" inputMode="numeric" placeholder="6-digit OTP" maxLength={6} autoComplete="one-time-code" {...register('otp')} />
      <PasswordField label="New Password" error={errors.newPassword?.message} placeholder="Min 6 characters" autoComplete="new-password" {...register('newPassword')} />
      <PasswordField label="Confirm New Password" error={errors.confirmPassword?.message} placeholder="Repeat new password" autoComplete="new-password" {...register('confirmPassword')} />
      <button type="submit" disabled={loading} className="auth-btn-primary">
        {loading ? 'Resetting…' : 'Reset Password'}
      </button>
      <div style={{ textAlign: 'center' }}>
        <AuthLink onClick={resending ? undefined : resendOtp}>
          {resending ? 'Resending…' : 'Resend OTP'}
        </AuthLink>
      </div>
    </form>
  )
}

// ─── ForgotPasswordPage ───────────────────────────────────────────────────────

const ForgotPasswordPage: FC = () => {
  const navigate    = useNavigate()
  const accessToken = useAuthStore(s => s.accessToken)

  useEffect(() => {
    if (accessToken) navigate('/', { replace: true })
  }, [accessToken, navigate])

  const [step, setStep] = useState<1 | 2>(1)
  const [phone, setPhone] = useState('')

  return (
    <AuthShell
      headline="Recover your"
      headlineItalic="sacred access"
      subtext="Reset your password with a one-time code sent to your registered mobile number."
    >
      <div style={{ marginBottom: '32px' }}>
        <p style={{ fontFamily: 'Jost, system-ui, sans-serif', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6057', marginBottom: '8px' }}>
          {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
        </p>
        <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontSize: '28px', color: '#1C1A17', margin: 0 }}>
          {step === 1 ? 'Enter your number' : 'Set new password'}
        </h2>
      </div>

      {step === 1
        ? <Step1 onSuccess={p => { setPhone(p); setStep(2) }} />
        : <Step2 phone={phone} />
      }

      <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #E2DAC8', textAlign: 'center', fontFamily: 'Jost, system-ui, sans-serif', fontSize: '13px', color: '#6B6057' }}>
        <AuthLink onClick={() => navigate('/auth/login')}>Back to sign in</AuthLink>
      </div>
    </AuthShell>
  )
}

export default ForgotPasswordPage
