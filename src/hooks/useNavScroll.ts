import { useEffect, useState } from 'react'

/**
 * Returns true when the page has scrolled past `threshold` pixels.
 * Used to apply the frosted-dark tint to the navbar on scroll.
 */
export function useNavScroll(threshold = 60): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])

  return scrolled
}
