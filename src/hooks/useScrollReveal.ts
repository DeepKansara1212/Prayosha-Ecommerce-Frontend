import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, the 'visible' class is added,
 * triggering the CSS reveal animation defined in index.css.
 */
export function useScrollReveal<T extends Element>(
  options: IntersectionObserverInit = {},
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.08, ...options },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options])

  return ref
}
