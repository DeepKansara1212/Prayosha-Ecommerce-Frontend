import { forwardRef, useState, useEffect, useRef, type FC, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchLocations, type SelectedLocation } from '@/api/calculators.api'

// ─── FormField ────────────────────────────────────────────────────────────────

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, className, ...inputProps }, ref) => (
    <div>
      <label className="block font-body text-[0.68rem] uppercase tracking-[0.15em] text-bark mb-2">
        {label}
      </label>
      <input
        ref={ref}
        className={`w-full border bg-cream px-4 py-3 font-body text-[0.85rem] text-deep placeholder:text-muted focus:outline-none focus:border-gold transition-colors ${error ? 'border-rose' : 'border-warm'} ${className ?? ''}`}
        {...inputProps}
      />
      {error && <p role="alert" className="mt-1.5 font-body text-[0.72rem] text-rose">{error}</p>}
    </div>
  ),
)
FormField.displayName = 'FormField'

// ─── SelectField ──────────────────────────────────────────────────────────────

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, className, children, ...selectProps }, ref) => (
    <div>
      <label className="block font-body text-[0.68rem] uppercase tracking-[0.15em] text-bark mb-2">
        {label}
      </label>
      <select
        ref={ref}
        className={`w-full border bg-cream px-4 py-3 font-body text-[0.85rem] text-deep focus:outline-none focus:border-gold transition-colors ${error ? 'border-rose' : 'border-warm'} ${className ?? ''}`}
        {...selectProps}
      >
        {children}
      </select>
      {error && <p role="alert" className="mt-1.5 font-body text-[0.72rem] text-rose">{error}</p>}
    </div>
  ),
)
SelectField.displayName = 'SelectField'

// ─── LocationSearchField ──────────────────────────────────────────────────────
// Debounced place search (Open-Meteo, via the backend) letting the user pick
// the correct city from up to 5 candidates — never asks for lat/lng/timezone
// directly, and never guesses when a name is ambiguous (e.g. multiple
// "Ahmedabad"s across countries).

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 350

interface LocationSearchFieldProps {
  label: string
  value: SelectedLocation | null
  onChange: (location: SelectedLocation | null) => void
  error?: string
}

export const LocationSearchField: FC<LocationSearchFieldProps> = ({ label, value, onChange, error }) => {
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [query])

  const trimmedDebounced = debouncedQuery.trim()
  const queryLongEnough = query.trim().length >= MIN_QUERY_LENGTH

  const { data: results, isFetching, isError } = useQuery({
    queryKey: ['location-search', trimmedDebounced],
    queryFn: () => searchLocations(trimmedDebounced),
    enabled: trimmedDebounced.length >= MIN_QUERY_LENGTH && !value,
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (location: SelectedLocation) => {
    onChange(location)
    setQuery('')
    setOpen(false)
  }

  const handleChange = () => {
    onChange(null)
    setQuery('')
    setOpen(true)
  }

  const searching = queryLongEnough && (query.trim() !== trimmedDebounced || isFetching)
  const showDropdown = open && !value && queryLongEnough

  return (
    <div ref={containerRef} className="relative">
      <label className="block font-body text-[0.68rem] uppercase tracking-[0.15em] text-bark mb-2">
        {label}
      </label>

      {value ? (
        <div className={`w-full border bg-cream px-4 py-3 font-body text-[0.85rem] text-deep flex items-center justify-between gap-3 ${error ? 'border-rose' : 'border-warm'}`}>
          <span className="truncate">{value.displayName}</span>
          <button
            type="button"
            onClick={handleChange}
            className="shrink-0 font-body text-[0.65rem] uppercase tracking-[0.1em] text-gold hover:text-bark transition-colors"
          >
            Change
          </button>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder="Search city, e.g. Ahmedabad"
          autoComplete="off"
          className={`w-full border bg-cream px-4 py-3 font-body text-[0.85rem] text-deep placeholder:text-muted focus:outline-none focus:border-gold transition-colors ${error ? 'border-rose' : 'border-warm'}`}
        />
      )}

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full max-h-60 overflow-y-auto border border-warm bg-cream shadow-lg">
          {searching ? (
            <div className="px-4 py-3 font-body text-[0.78rem] text-muted">Searching…</div>
          ) : isError ? (
            <div className="px-4 py-3 font-body text-[0.78rem] text-rose">Unable to search locations right now. Please try again.</div>
          ) : results && results.length > 0 ? (
            results.map((r, i) => (
              <button
                key={`${r.displayName}-${i}`}
                type="button"
                onClick={() => handleSelect(r)}
                className="block w-full text-left px-4 py-2.5 font-body text-[0.8rem] text-deep hover:bg-warm transition-colors"
              >
                {r.displayName}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 font-body text-[0.78rem] text-muted">No matching location found. Try a nearby city.</div>
          )}
        </div>
      )}

      {error && <p role="alert" className="mt-1.5 font-body text-[0.72rem] text-rose">{error}</p>}
    </div>
  )
}

// ─── Shared validation pieces (mirror src/validations/calculator.validation.ts) ──

export const NAME_RULES = { minLength: 2, maxLength: 100 } as const
export const DOB_PATTERN = /^\d{4}-\d{2}-\d{2}$/
export const TOB_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/
export const MOBILE_PATTERN = /^\+?[0-9]{10,15}$/
