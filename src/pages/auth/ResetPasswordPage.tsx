import { useState, useEffect, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import * as authApi from '@/api/auth.api'
import {
  AuthShell, FormField, PasswordField, FormError, AuthLink,
} from './_AuthShell'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  phone:           z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  otp:             z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
  newPassword:     z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof schema>

// ─── ResetPasswordPage ────────────────────────────────────────────────────────

const ResetPasswordPage: FC = () => {
  const accessToken = useAuthStore(s => s.accessToken)

  useEffect(() => {
    if (accessToken) {
      window.location.hash = '#/'
    }
  }, [accessToken])

  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // Pre-fill phone from URL hash query, e.g. #/auth/reset?phone=9876543210
  const prefillPhone = (() => {
    const search = window.location.hash.split('?')[1] ?? ''
    return new URLSearchParams(search).get('phone') ?? ''
  })()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { phone: prefillPhone, otp: '', newPassword: '', confirmPassword: '' },
  })

  const submit = async (data: FormValues) => {
    setServerError('')
    setLoading(true)
    try {
      await authApi.resetPassword({ phone: data.phone, otp: data.otp, newPassword: data.newPassword })
      window.location.hash = '#/auth/login'
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not reset password. Please try again.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  const goToLogin = () => { window.location.hash = '#/auth/login' }

  return (
    <AuthShell
      headline="Reset your"
      headlineItalic="sacred access"
      subtext="Enter the OTP sent to your phone and choose a new password for your account."
    >
      {/* Page title */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontFamily: '"Cormorant Garamond", Georgia, serif',
          fontWeight: 300,
          fontSize: '28px',
          color: '#1C1A17',
          margin: 0,
        }}>
          Reset password
        </h2>
      </div>

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
          label="New Password"
          error={errors.newPassword?.message}
          placeholder="Min 6 characters"
          autoComplete="new-password"
          {...register('newPassword')}
        />

        <PasswordField
          label="Confirm New Password"
          error={errors.confirmPassword?.message}
          placeholder="Repeat new password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        <button type="submit" disabled={loading} className="auth-btn-primary">
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>

      {/* Nav link */}
      <div style={{
        marginTop: '28px',
        paddingTop: '20px',
        borderTop: '1px solid #E2DAC8',
        textAlign: 'center',
        fontFamily: 'Jost, system-ui, sans-serif',
        fontSize: '13px',
        color: '#6B6057',
      }}>
        <AuthLink onClick={goToLogin}>Back to sign in</AuthLink>
      </div>
    </AuthShell>
  )
}

export default ResetPasswordPage
