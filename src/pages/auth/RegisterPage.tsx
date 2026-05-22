import { useState, useEffect, type FC } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import {
  AuthShell, FormField, PasswordField, FormError, AuthLink,
} from './_AuthShell'

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters'),
  phone:           z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  password:        z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  email:           z.string().email('Enter a valid email address').or(z.literal('')).optional(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormValues = z.infer<typeof schema>

// ─── RegisterPage ─────────────────────────────────────────────────────────────

const RegisterPage: FC = () => {
  const accessToken = useAuthStore(s => s.accessToken)
  const registerAction = useAuthStore(s => s.register)

  useEffect(() => {
    if (accessToken) {
      window.location.hash = '#/'
    }
  }, [accessToken])

  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', password: '', confirmPassword: '', email: '' },
  })

  const submit = async (data: FormValues) => {
    setServerError('')
    setLoading(true)
    try {
      await registerAction({
        name:     data.name,
        phone:    data.phone,
        password: data.password,
        email:    data.email || undefined,
      })
      window.location.hash = '#/auth/login'
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  const goToLogin = () => { window.location.hash = '#/auth/login' }

  return (
    <AuthShell
      headline="Begin your"
      headlineItalic="crystal journey"
      subtext="Create an account to track your orders, save favourites, and unlock a world of sacred stones."
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
          Create your account
        </h2>
      </div>

      <form onSubmit={handleSubmit(submit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {serverError && <FormError message={serverError} />}

        <FormField
          label="Full Name"
          error={errors.name?.message}
          placeholder="Your full name"
          autoComplete="name"
          {...register('name')}
        />

        <FormField
          label="Mobile Number"
          error={errors.phone?.message}
          type="tel"
          placeholder="10-digit mobile number"
          maxLength={10}
          autoComplete="tel"
          {...register('phone')}
        />

        <PasswordField
          label="Password"
          error={errors.password?.message}
          placeholder="Min 6 characters"
          autoComplete="new-password"
          {...register('password')}
        />

        <PasswordField
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          placeholder="Repeat password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        <FormField
          label="Email Address (optional)"
          error={errors.email?.message}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register('email')}
        />

        <button type="submit" disabled={loading} className="auth-btn-primary">
          {loading ? 'Creating account…' : 'Create Account'}
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
        Already have an account? <AuthLink onClick={goToLogin}>Sign in</AuthLink>
      </div>
    </AuthShell>
  )
}

export default RegisterPage
