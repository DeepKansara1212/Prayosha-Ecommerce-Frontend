import type { FC, ReactNode, AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode
  variant?: 'primary' | 'ghost'
}

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className,
  href = '#',
  onClick,
  ...rest
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      target?.scrollIntoView({ behavior: 'smooth' })
    }
    onClick?.(e)
  }

  if (variant === 'ghost') {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-2 font-body text-[0.7rem] uppercase tracking-[0.15em]',
          'text-cream opacity-75 no-underline transition-opacity duration-300',
          'hover:opacity-100 whitespace-nowrap',
          className,
        )}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn(
        'inline-block font-body text-[0.7rem] uppercase tracking-[0.2em]',
        'bg-gold text-deep px-8 py-[0.9rem] no-underline whitespace-nowrap',
        'transition-all duration-300 hover:bg-gold-light hover:-translate-y-px',
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  )
}

export default Button
