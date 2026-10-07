import type { FC } from 'react'
import { useCategories } from '@/hooks/useCategories'
import type { SortOption } from '@/types'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { getPurposes } from '@/api/calculators.api'
import { getSubCategories } from '@/api/subcategories.api'

interface FilterBarProps {
  active: string
  purpose: string
  subCategory: string
  sort: SortOption
  total: number
  onCategory: (slug: string) => void
  onPurpose: (id: string) => void
  onSubCategory: (id: string) => void
  onSort: (s: SortOption) => void
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'name-asc',   label: 'Name A → Z' },
]

const pillClass = (selected: boolean) =>
  cn(
    'flex-none font-body text-[0.65rem] uppercase tracking-[0.18em] px-4 py-2 border transition-all duration-200 whitespace-nowrap',
    selected
      ? 'bg-deep text-cream border-deep'
      : 'bg-transparent text-muted border-warm hover:border-muted hover:text-bark',
  )

const FilterBar: FC<FilterBarProps> = ({ active, purpose, subCategory, sort, total, onCategory, onPurpose, onSubCategory, onSort }) => {
  const { data: categories = [] } = useCategories()
  const selectedCategory = categories.find(category => category.slug === active)
  const { data: subcategories = [] } = useQuery({
    queryKey: ['collection-subcategories', active],
    queryFn: () => getSubCategories(active),
    enabled: !!active,
    staleTime: 5 * 60_000,
  })
  const { data: purposes = [] } = useQuery({
    queryKey: ['collection-purposes'],
    queryFn: getPurposes,
    staleTime: 5 * 60_000,
  })

  return (
    <div className="sticky top-[68px] z-50 bg-cream/95 backdrop-blur-sm border-b border-warm">
      <div
        className="flex flex-col gap-3"
        style={{ padding: '1rem clamp(1.25rem,5vw,4rem)' }}
      >
        <div className="flex flex-col gap-3">
          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Filter by category">
            <button
              role="tab"
              aria-selected={active === ''}
              onClick={() => onCategory('')}
              className={pillClass(active === '')}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.slug}
                role="tab"
                aria-selected={active === cat.slug}
                onClick={() => onCategory(cat.slug)}
                className={pillClass(active === cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {selectedCategory && subcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label={`Filter by ${selectedCategory.name} sub-category`}>
              <button
                role="tab"
                aria-selected={subCategory === ''}
                onClick={() => onSubCategory('')}
                className={pillClass(subCategory === '')}
              >
                All {selectedCategory.name}
              </button>
              {subcategories.map(item => (
                <button
                  key={item._id}
                  role="tab"
                  aria-selected={subCategory === item._id}
                  onClick={() => onSubCategory(item._id)}
                  className={pillClass(subCategory === item._id)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: count + sort */}
        <div className="flex items-center gap-4 flex-shrink-0 sm:self-end">
          <div className="relative">
            <select
              value={purpose}
              onChange={e => onPurpose(e.target.value)}
              aria-label="Filter by purpose"
              className="font-body text-[0.7rem] uppercase tracking-[0.12em] text-bark bg-transparent border border-warm pl-3 pr-7 py-2 appearance-none cursor-pointer focus:outline-none focus:border-muted"
            >
              <option value="">All purposes</option>
              {purposes.map(item => (
                <option key={item._id} value={item._id}>{item.name}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted text-[0.6rem]">▾</span>
          </div>
          <span className="font-body text-[0.7rem] text-muted tracking-[0.05em]">
            {total} {total === 1 ? 'stone' : 'stones'}
          </span>
          <div className="relative">
            <select
              value={sort}
              onChange={e => onSort(e.target.value as SortOption)}
              aria-label="Sort products"
              className="font-body text-[0.7rem] uppercase tracking-[0.12em] text-bark bg-transparent border border-warm pl-3 pr-7 py-2 appearance-none cursor-pointer focus:outline-none focus:border-muted"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted text-[0.6rem]">▾</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterBar
