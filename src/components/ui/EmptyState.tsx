import type { FC, ReactNode } from 'react'

// ─── EmptyState ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

const EmptyState: FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-6">
    <div
      className="mb-6 flex items-center justify-center"
      style={{ color: '#C4B89A', width: 40, height: 40 }}
      aria-hidden="true"
    >
      {icon}
    </div>

    <h2
      className="font-display font-light mb-2 leading-tight"
      style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontSize: 24, color: '#1C1A17' }}
    >
      {title}
    </h2>

    {description && (
      <p
        className="font-body font-extralight leading-relaxed max-w-xs mb-7"
        style={{ fontSize: 14, color: '#6B6057' }}
      >
        {description}
      </p>
    )}

    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="font-body text-[0.7rem] uppercase tracking-[0.22em] bg-deep text-cream px-8 py-4 hover:bg-bark transition-colors duration-200 min-w-[44px] min-h-[44px]"
      >
        {actionLabel}
      </button>
    )}
  </div>
)

export default EmptyState
