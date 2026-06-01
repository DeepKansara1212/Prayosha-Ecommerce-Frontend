import type { FC } from 'react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onPage: (p: number) => void
}

const Pagination: FC<PaginationProps> = ({ page, totalPages, onPage }) => {
  if (totalPages <= 1) return null

  // Build page number list: always show first, last, current ±1, with ellipsis gaps
  const pages: (number | '...')[] = []
  const add = (n: number) => { if (!pages.includes(n)) pages.push(n) }

  add(1)
  if (page > 3) pages.push('...')
  if (page > 2) add(page - 1)
  add(page)
  if (page < totalPages - 1) add(page + 1)
  if (page < totalPages - 2) pages.push('...')
  add(totalPages)

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1 mt-10"
    >
      {/* Prev */}
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={cn(
          'w-9 h-9 flex items-center justify-center border font-body text-[0.65rem] transition-all duration-200',
          page === 1
            ? 'border-warm text-warm cursor-not-allowed'
            : 'border-warm text-bark hover:border-muted hover:text-deep',
        )}
      >
        ‹
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center font-body text-[0.7rem] text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'w-9 h-9 flex items-center justify-center border font-body text-[0.7rem] tracking-[0.05em] transition-all duration-200',
              p === page
                ? 'bg-deep text-cream border-deep'
                : 'border-warm text-bark hover:border-muted hover:text-deep',
            )}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={cn(
          'w-9 h-9 flex items-center justify-center border font-body text-[0.65rem] transition-all duration-200',
          page === totalPages
            ? 'border-warm text-warm cursor-not-allowed'
            : 'border-warm text-bark hover:border-muted hover:text-deep',
        )}
      >
        ›
      </button>
    </nav>
  )
}

export default Pagination
