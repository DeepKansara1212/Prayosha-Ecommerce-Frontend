import type { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: ReactNode
  className?: string
  /** Light variant for dark backgrounds */
  light?: boolean
}

const SectionLabel: FC<SectionLabelProps> = ({ children, className, light }) => (
  <p
    className={cn(
      'flex items-center gap-3 text-label font-body uppercase tracking-[0.3em] mb-3',
      light ? 'text-gold-light' : 'text-gold',
      className,
    )}
  >
    {children}
    <span
      className={cn(
        'block h-px w-9 flex-none',
        light ? 'bg-gold-light' : 'bg-gold',
      )}
    />
  </p>
)

export default SectionLabel
