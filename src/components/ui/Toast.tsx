import { useEffect, useState, type FC } from 'react'
import { useToastStore, type Toast, type ToastType } from '@/store/toastStore'
import { cn } from '@/lib/utils'

// ─── Semantic colour map ──────────────────────────────────────────────────────

const BORDER_COLOUR: Record<ToastType, string> = {
  success: '#5A8A6A',
  error:   '#A85050',
  info:    '#4A7A9B',
  warning: '#C49A3C',
}

const ICON: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '!',
}

// ─── Single toast item ────────────────────────────────────────────────────────

const ToastItem: FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)

  // Slide-in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10)
    return () => clearTimeout(t)
  }, [])

  const handleDismiss = () => {
    setLeaving(true)
    setTimeout(() => onDismiss(toast.id), 300)
  }

  const borderColor = BORDER_COLOUR[toast.type]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex items-start gap-3 px-4 py-3.5 shadow-lg transition-all duration-300',
        visible && !leaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
      )}
      style={{
        background: '#EDE8DC',
        borderLeft: `3px solid ${borderColor}`,
        minWidth: 280,
        maxWidth: 360,
        borderRadius: 2,
      }}
    >
      <span
        className="flex-none w-5 h-5 flex items-center justify-center text-[0.7rem] font-bold rounded-full text-white"
        style={{ background: borderColor }}
        aria-hidden="true"
      >
        {ICON[toast.type]}
      </span>

      <p className="flex-1 font-body text-[0.8rem] text-deep leading-snug pt-0.5">
        {toast.message}
      </p>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="flex-none text-muted hover:text-deep transition-colors p-0.5 min-w-[44px] min-h-[44px] flex items-center justify-center"
        style={{ marginRight: -8, marginTop: -4 }}
      >
        <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 4 4 12M4 4l8 8" />
        </svg>
      </button>
    </div>
  )
}

// ─── Toast container ──────────────────────────────────────────────────────────

const ToastContainer: FC = () => {
  const toasts   = useToastStore(s => s.toasts)
  const dismiss  = useToastStore(s => s.dismiss)

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5"
      aria-label="Notifications"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
      ))}
    </div>
  )
}

export default ToastContainer
