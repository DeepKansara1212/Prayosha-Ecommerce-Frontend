import type { FC, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  children: ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

const SectionTitle: FC<SectionTitleProps> = ({
  children,
  className,
  as: Tag = 'h2',
}) => (
  <Tag
    className={cn(
      'font-display font-light leading-[1.15] mb-3',
      'text-[clamp(2rem,5vw,3.5rem)]',
      className,
    )}
  >
    {children}
  </Tag>
)

export default SectionTitle
