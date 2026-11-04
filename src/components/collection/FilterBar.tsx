import type { FC } from 'react'

interface FilterBarProps {
  total: number
}

const FilterBar: FC<FilterBarProps> = ({ total }) => (
  <div className="border-b border-warm bg-cream/95 backdrop-blur-sm">
    <div
      className="flex items-center justify-between gap-4"
      style={{ padding: '0.875rem clamp(1.25rem,5vw,4rem)' }}
    >
      <span className="font-body text-xs text-muted tracking-[0.05em]">
        {total} {total === 1 ? 'stone' : 'stones'}
      </span>
      <span
        className="inline-flex items-center gap-2 border border-warm px-3 py-2 font-body text-xs uppercase tracking-[0.05em] text-bark"
        aria-label="Products sorted by Featured"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
        Featured
      </span>
    </div>
  </div>
)

export default FilterBar
