import { useState, type InputHTMLAttributes } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export default function PasswordInput({ style, ...inputProps }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        {...inputProps}
        className={`auth-input ${inputProps.className ?? ''}`.trim()}
        type={visible ? 'text' : 'password'}
        style={{ ...style, paddingRight: 48 }}
      />
      <button
        type="button"
        onClick={() => setVisible(value => !value)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        style={{
          position: 'absolute',
          top: '50%',
          right: 12,
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          border: 0,
          background: 'transparent',
          color: '#6B6057',
          cursor: 'pointer',
        }}
      >
        {visible ? <FiEyeOff aria-hidden="true" size={18} /> : <FiEye aria-hidden="true" size={18} />}
      </button>
    </div>
  )
}
