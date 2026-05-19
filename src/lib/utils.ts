/** Lightweight class-name merger (no clsx dependency needed) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/** Smooth scroll to a hash target */
export function scrollTo(href: string) {
  if (!href.startsWith('#')) return
  const el = document.querySelector(href)
  el?.scrollIntoView({ behavior: 'smooth' })
}
