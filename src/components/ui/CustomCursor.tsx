import type { FC } from 'react'
import { useCustomCursor } from '@/hooks/useCustomCursor'

/**
 * Renders the gold custom cursor dot + trailing ring.
 * Only visible on pointer-fine (mouse) devices via CSS media query.
 */
const CustomCursor: FC = () => {
  useCustomCursor()

  return (
    <>
      <div
        id="cursor"
        className="
          hidden pointer-fine:block
          fixed w-[10px] h-[10px] bg-gold rounded-full
          pointer-events-none z-[9999]
          -translate-x-1/2 -translate-y-1/2
          transition-[width,height] duration-200
        "
        style={{ left: 0, top: 0 }}
        aria-hidden="true"
      />
      <div
        id="cursor-ring"
        className="
          hidden pointer-fine:block
          fixed w-9 h-9 border border-gold rounded-full
          pointer-events-none z-[9998]
          -translate-x-1/2 -translate-y-1/2
          transition-all duration-[120ms] opacity-50
        "
        style={{ left: 0, top: 0 }}
        aria-hidden="true"
      />
    </>
  )
}

export default CustomCursor
