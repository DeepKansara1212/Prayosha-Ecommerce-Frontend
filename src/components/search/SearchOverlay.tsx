import React, { useState, useRef, useEffect, useCallback, type FC, type KeyboardEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { searchProducts, type ApiProduct } from '@/api/products.api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUGGESTED_CATEGORIES = ['Bracelets', 'Pendants', 'Amethyst', 'Chakra Stones']

const OVERLAY_CSS = `
  @keyframes srFadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes srPulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.45; }
  }
  .sr-input::placeholder { color: #9E9590; }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryName(cat: ApiProduct['category']): string {
  if (typeof cat === 'string') return cat
  return (cat as { name: string }).name ?? ''
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel: FC<{ text: string }> = ({ text }) => (
  <p style={{
    fontFamily: 'Jost, sans-serif',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: '#6B6057',
    margin: '0 0 12px',
  }}>
    ✦ {text}
  </p>
)

const SkeletonRow: FC = () => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 8px', borderBottom: '1px solid #E2DAC8',
  }}>
    <div style={{ width: 52, height: 52, borderRadius: 2, background: '#E2DAC8', animation: 'srPulse 1.5s ease-in-out infinite', flexShrink: 0 }} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ width: '60%', height: 12, borderRadius: 2, background: '#E2DAC8', animation: 'srPulse 1.5s ease-in-out infinite' }} />
      <div style={{ width: '35%', height: 10, borderRadius: 2, background: '#EDE8DC', animation: 'srPulse 1.5s ease-in-out 0.2s infinite' }} />
    </div>
    <div style={{ width: 48, height: 14, borderRadius: 2, background: '#E2DAC8', animation: 'srPulse 1.5s ease-in-out infinite' }} />
  </div>
)

// ─── SearchOverlay ────────────────────────────────────────────────────────────

const SearchOverlay: FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery]               = useState('')
  const [debouncedQuery, setDebounced]  = useState('')
  const [activeIndex, setActiveIndex]   = useState(-1)
  const [inputFocused, setInputFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce query → debouncedQuery
  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const { data: rawResults = [], isLoading } = useQuery({
    queryKey: ['search-overlay', debouncedQuery],
    queryFn:  () => searchProducts(debouncedQuery),
    enabled:  debouncedQuery.length >= 2,
  })

  const displayResults = rawResults.slice(0, 8)

  // Focus input on open; reset state on close
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    } else {
      setQuery('')
      setDebounced('')
      setActiveIndex(-1)
    }
  }, [isOpen])

  // ESC closes the overlay from anywhere
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  // Reset highlight when result list changes
  useEffect(() => { setActiveIndex(-1) }, [displayResults.length])

  const navigateTo = useCallback((slug: string) => {
    window.location.hash = `#/product/${slug}`
    window.scrollTo({ top: 0 })
    onClose()
  }, [onClose])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, displayResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      navigateTo(displayResults[activeIndex].slug)
    }
  }

  const showSuggestions = query.length === 0
  const showLoading     = isLoading && debouncedQuery.length >= 2
  const showNoResults   = !isLoading && debouncedQuery.length >= 2 && displayResults.length === 0
  const showResults     = displayResults.length > 0

  if (!isOpen) return null

  return (
    <>
      <style>{OVERLAY_CSS}</style>

      {/* Backdrop — click anywhere outside the search panel to close */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 250,
          background: 'rgba(245, 240, 232, 0.96)',
          backdropFilter: 'blur(12px)',
          animation: 'srFadeIn 250ms ease both',
          display: 'flex', justifyContent: 'center',
          paddingTop: '20vh', paddingInline: '1rem',
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close search"
          style={{
            position: 'absolute', top: 24, right: 24,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, lineHeight: 1, fontSize: 20, color: '#6B6057',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#1C1A17')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B6057')}
        >
          ✕
        </button>

        {/* Search panel — stop propagation so clicks inside don't close overlay */}
        <div
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 640, height: 'fit-content' }}
        >
          {/* Input row */}
          <div style={{
            display: 'flex', alignItems: 'center',
            borderBottom: `1px solid ${inputFocused ? '#7B5EA7' : '#C4B89A'}`,
            transition: 'border-color 0.2s',
          }}>
            <svg
              width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5"
              style={{ stroke: '#C4B89A', fill: 'none', flexShrink: 0, marginRight: 12 }}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Search crystals, chakras, intentions..."
              className="sr-input"
              aria-label="Search products"
              aria-autocomplete="list"
              style={{
                flex: 1,
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 32,
                fontWeight: 300,
                color: '#1C1A17',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                padding: '12px 0',
                width: '100%',
                caretColor: '#7B5EA7',
              }}
            />
          </div>

          {/* Results area */}
          <div
            role="listbox"
            aria-label="Search results"
            style={{ maxHeight: 400, overflowY: 'auto', marginTop: 16 }}
          >
            {/* Empty state — suggested categories */}
            {showSuggestions && (
              <div>
                <SectionLabel text="SUGGESTED CATEGORIES" />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {SUGGESTED_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setQuery(cat); inputRef.current?.focus() }}
                      style={{
                        background: '#EDE8DC', border: 'none', borderRadius: 100,
                        padding: '6px 16px',
                        fontFamily: 'Jost, sans-serif', fontSize: 11,
                        color: '#6B6057', cursor: 'pointer', letterSpacing: '0.04em',
                        transition: 'background 0.15s, color 0.15s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#C4B89A'
                        e.currentTarget.style.color = '#1C1A17'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#EDE8DC'
                        e.currentTarget.style.color = '#6B6057'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading skeletons */}
            {showLoading && (
              <div>
                <SectionLabel text="RESULTS" />
                {[0, 1, 2].map(i => <SkeletonRow key={i} />)}
              </div>
            )}

            {/* No results */}
            {showNoResults && (
              <div style={{ paddingTop: 8 }}>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: 14, color: '#6B6057', margin: '0 0 6px' }}>
                  No results for{' '}
                  <strong style={{ color: '#1C1A17' }}>"{debouncedQuery}"</strong>
                </p>
                <p style={{ fontFamily: 'Jost, sans-serif', fontSize: 12, color: '#9E9590', margin: 0 }}>
                  Try: amethyst, rose quartz, healing
                </p>
              </div>
            )}

            {/* Result rows */}
            {showResults && (
              <div>
                <SectionLabel text="RESULTS" />
                {displayResults.map((product, idx) => {
                  const imageUrl = product.images?.[0]
                  const catName  = getCategoryName(product.category)
                  const active   = idx === activeIndex

                  return (
                    <button
                      key={product._id}
                      role="option"
                      aria-selected={active}
                      onClick={() => navigateTo(product.slug)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(-1)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        width: '100%', textAlign: 'left',
                        background: active ? '#EDE8DC' : 'transparent',
                        border: 'none', borderBottom: '1px solid #E2DAC8',
                        padding: '10px 8px', cursor: 'pointer',
                        transition: 'background 0.12s',
                      }}
                    >
                      {/* Product image */}
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{
                          width: 52, height: 52, borderRadius: 2, flexShrink: 0,
                          background: '#EDE8DC', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', fontSize: 22,
                        }}>
                          💎
                        </div>
                      )}

                      {/* Name + category */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: 'Jost, sans-serif', fontSize: 14, fontWeight: 500,
                          color: '#1C1A17', margin: 0,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {product.name}
                        </p>
                        <p style={{
                          fontFamily: 'Jost, sans-serif', fontSize: 11,
                          color: '#9E9590', margin: '2px 0 0',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {catName}
                        </p>
                      </div>

                      {/* Price */}
                      <span style={{
                        fontFamily: 'Jost, sans-serif', fontSize: 14, fontWeight: 500,
                        color: '#C49A3C', flexShrink: 0,
                      }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchOverlay
