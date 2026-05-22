import { forwardRef, useState, type FC, type ReactNode } from 'react'

// ─── Global CSS injected by AuthShell ─────────────────────────────────────────

const AUTH_CSS = `
  .auth-shell {
    display: grid;
    grid-template-columns: 5fr 7fr;
    min-height: 100vh;
  }
  .auth-input {
    display: block;
    width: 100%;
    background: #EDE8DC;
    border-radius: 4px;
    padding: 12px 16px;
    font-family: Jost, system-ui, sans-serif;
    font-size: 14px;
    color: #1C1A17;
    outline: none;
    transition: border-color 150ms, box-shadow 150ms;
    box-sizing: border-box;
  }
  .auth-input:focus {
    border-color: #7B5EA7 !important;
    box-shadow: 0 0 0 3px #F0EAF7;
  }
  .auth-btn-primary {
    display: block;
    width: 100%;
    background: #C49A3C;
    color: #fff;
    font-family: Jost, system-ui, sans-serif;
    font-size: 11px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 14px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: background 150ms, transform 150ms;
  }
  .auth-btn-primary:hover:not(:disabled) {
    background: #D4B060;
    transform: translateY(-1px);
  }
  .auth-btn-primary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
  .auth-btn-secondary {
    display: block;
    width: 100%;
    background: transparent;
    border: 1px solid #C49A3C;
    color: #C49A3C;
    font-family: Jost, system-ui, sans-serif;
    font-size: 11px;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 150ms;
  }
  .auth-btn-secondary:hover:not(:disabled) {
    background: #FBF6EC;
  }
  .auth-btn-secondary:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
  @media (max-width: 899px) {
    .auth-shell {
      grid-template-columns: 1fr;
    }
    .auth-shell-left {
      height: 100px !important;
      padding: 0 1.5rem !important;
      overflow: hidden;
      justify-content: flex-start !important;
    }
    .auth-shell-left .auth-left-body {
      flex-direction: row !important;
      align-items: center;
      gap: 0.85rem;
      max-width: none !important;
    }
    .auth-shell-left .auth-headline,
    .auth-shell-left .auth-headline-italic,
    .auth-shell-left .auth-subtext { display: none; }
    .auth-shell-right-inner {
      padding: 2rem 1.5rem !important;
    }
  }
`

// ─── Layout shell ─────────────────────────────────────────────────────────────

interface AuthShellProps {
  headline: string
  headlineItalic: string
  subtext: string
  children: ReactNode
}

export const AuthShell: FC<AuthShellProps> = ({ headline, headlineItalic, subtext, children }) => (
  <>
    <style>{AUTH_CSS}</style>
    <div className="auth-shell">

      {/* Left panel */}
      <div
        className="auth-shell-left"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, #E8DFF5 0%, #F5F0E8 50%, #EDE4D0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative orb */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #9B7EC8, #C49A3C)',
            boxShadow: '0 0 28px rgba(123,94,167,0.45), 0 0 60px rgba(196,154,60,0.2)',
            flexShrink: 0,
          }}
        />

        <div
          className="auth-left-body"
          style={{ maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <p style={{
            fontFamily: 'Jost, system-ui, sans-serif',
            fontSize: '10px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#6B6057',
            margin: '0 0 1.75rem',
          }}>
            ✦ PRAYOSHA CRYSTAL
          </p>

          <h1
            className="auth-headline"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 300,
              fontSize: 'clamp(32px, 4vw, 52px)',
              color: '#1C1A17',
              lineHeight: 1.12,
              margin: '0 0 0.2rem',
            }}
          >
            {headline}
          </h1>

          <p
            className="auth-headline-italic"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(28px, 3.5vw, 46px)',
              color: '#7B5EA7',
              lineHeight: 1.12,
              margin: '0 0 1.5rem',
            }}
          >
            {headlineItalic}
          </p>

          <p
            className="auth-subtext"
            style={{
              fontFamily: 'Jost, system-ui, sans-serif',
              fontWeight: 300,
              fontSize: '15px',
              color: '#6B6057',
              maxWidth: '340px',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {subtext}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div
        className="auth-shell-right"
        style={{
          background: '#F5F0E8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          className="auth-shell-right-inner"
          style={{ maxWidth: '400px', width: '100%', padding: '48px 40px' }}
        >
          {children}
        </div>
      </div>

    </div>
  </>
)

// ─── Style constants shared by pages ──────────────────────────────────────────

export const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Jost, system-ui, sans-serif',
  fontSize: '11px',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#6B6057',
  marginBottom: '6px',
}

export const errorTextStyle: React.CSSProperties = {
  fontFamily: 'Jost, system-ui, sans-serif',
  fontSize: '11px',
  color: '#A85050',
  marginTop: '4px',
}

export function inputBorderStyle(hasError: boolean): React.CSSProperties {
  return { border: `1px solid ${hasError ? '#A85050' : '#E2DAC8'}` }
}

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, ...inputProps }, ref) => (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        ref={ref}
        className="auth-input"
        style={inputBorderStyle(!!error)}
        {...inputProps}
      />
      {error && <p role="alert" style={errorTextStyle}>{error}</p>}
    </div>
  ),
)
FormField.displayName = 'FormField'

// ─── PasswordField ────────────────────────────────────────────────────────────

interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
}

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, style: _style, ...inputProps }, ref) => {
    const [show, setShow] = useState(false)
    return (
      <div>
        <label style={labelStyle}>{label}</label>
        <div style={{ position: 'relative' }}>
          <input
            ref={ref}
            className="auth-input"
            type={show ? 'text' : 'password'}
            style={{ ...inputBorderStyle(!!error), paddingRight: '44px' }}
            {...inputProps}
          />
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6B6057',
              padding: 0,
              lineHeight: 0,
            }}
          >
            {show
              ? <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
              : <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
            }
          </button>
        </div>
        {error && <p role="alert" style={errorTextStyle}>{error}</p>}
      </div>
    )
  },
)
PasswordField.displayName = 'PasswordField'

// ─── FormError (server error banner) ─────────────────────────────────────────

export const FormError: FC<{ message: string }> = ({ message }) => (
  <div
    role="alert"
    style={{
      background: '#FDF0F0',
      border: '1px solid rgba(168,80,80,0.3)',
      borderRadius: '4px',
      padding: '12px 14px',
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-start',
    }}
  >
    <span style={{ color: '#A85050', fontSize: '14px', lineHeight: 1, flexShrink: 0 }}>✕</span>
    <p style={{ fontFamily: 'Jost, system-ui, sans-serif', fontSize: '13px', color: '#A85050', margin: 0 }}>
      {message}
    </p>
  </div>
)

// ─── AuthLink ─────────────────────────────────────────────────────────────────

export const AuthLink: FC<{ children: ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      fontFamily: 'Jost, system-ui, sans-serif',
      fontSize: '13px',
      color: '#7B5EA7',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
      textDecoration: 'underline',
      textDecorationColor: 'rgba(123,94,167,0.4)',
      textUnderlineOffset: '2px',
    }}
  >
    {children}
  </button>
)

// ─── Hint (success message) ───────────────────────────────────────────────────

export const FormHint: FC<{ message: string }> = ({ message }) => (
  <div style={{
    background: '#F0F7F0',
    border: '1px solid rgba(80,140,80,0.3)',
    borderRadius: '4px',
    padding: '12px 14px',
    fontFamily: 'Jost, system-ui, sans-serif',
    fontSize: '13px',
    color: '#3D6B40',
  }}>
    {message}
  </div>
)
