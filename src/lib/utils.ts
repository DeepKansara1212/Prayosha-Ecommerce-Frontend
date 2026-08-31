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

export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Mirrors the backend's Category slug auto-generation (category.model.ts pre-validate hook) */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
