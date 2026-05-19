import { useState, useEffect, type FC } from 'react'
import type { ProductDetail } from '@/types'
import { COLLECTION_PRODUCTS } from '@/data/collection'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn } from '@/lib/utils'

interface ProductDrawerProps {
  product: ProductDetail | null
  onClose: () => void
  wishlisted: boolean
  onWishlist: (id: string) => void
  onSelectRelated: (p: ProductDetail) => void
}

const CHAKRA_COLOURS: Record<string, string> = {
  Root:          '#8B3333',
  Sacral:        '#B85C20',
  'Solar Plexus':'#C4962A',
  Heart:         '#3A7A4A',
  Throat:        '#3A6A9A',
  'Third Eye':   '#4A4A9A',
  Crown:         '#7C5C8A',
}

const TabButton: FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={cn(
      'font-body text-[0.65rem] uppercase tracking-[0.18em] px-4 py-3 border-b-2 transition-all duration-200 whitespace-nowrap',
      active
        ? 'border-gold text-bark'
        : 'border-transparent text-muted hover:text-bark',
    )}
  >
    {children}
  </button>
)

type Tab = 'description' | 'how-to-use' | 'details'

const ProductDrawer: FC<ProductDrawerProps> = ({
  product,
  onClose,
  wishlisted,
  onWishlist,
  onSelectRelated,
}) => {
  const [tab, setTab] = useState<Tab>('description')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useLockBodyScroll(!!product)

  // Reset state when product changes
  useEffect(() => {
    setTab('description')
    setQty(1)
    setAdded(false)
  }, [product?.id])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleAddToCart = () => {
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const relatedProducts = product
    ? COLLECTION_PRODUCTS.filter(p => product.relatedIds.includes(p.id)).slice(0, 3)
    : []

  const chakraColour = product ? (CHAKRA_COLOURS[product.chakra] ?? '#7C5C8A') : '#7C5C8A'

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-[300] bg-deep/60 backdrop-blur-sm transition-opacity duration-400',
          product ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product ? `${product.name} details` : 'Product details'}
        className={cn(
          'fixed top-0 right-0 bottom-0 z-[301] flex flex-col',
          'w-full sm:w-[520px] lg:w-[600px]',
          'bg-cream overflow-y-auto',
          'transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.15,1)]',
          product ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        {product && (
          <>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-deep/10 hover:bg-deep/20 transition-colors duration-200"
              aria-label="Close product details"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Gem hero */}
            <div
              className={cn(
                product.bgClass,
                'w-full aspect-[4/3] flex items-center justify-center flex-shrink-0 relative overflow-hidden',
              )}
              aria-hidden="true"
            >
              <span className="text-[7rem] sm:text-[9rem] select-none">{product.emoji}</span>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.badge && (
                  <span className={cn(
                    'font-body text-[0.58rem] uppercase tracking-[0.18em] px-3 py-1.5',
                    product.badge === 'Bestseller' && 'bg-gold text-deep',
                    product.badge === 'New'        && 'bg-amethyst text-cream',
                    product.badge === 'Limited'    && 'bg-rose text-cream',
                    product.badge === 'Rare'       && 'bg-deep text-gold-light border border-gold/40',
                    product.badge === 'Gifting'    && 'bg-sage text-cream',
                  )}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => onWishlist(product.id)}
                className={cn(
                  'absolute top-4 right-4 w-10 h-10 flex items-center justify-center transition-all duration-300',
                  wishlisted ? 'bg-rose text-cream' : 'bg-deep/50 text-cream/80 hover:bg-rose backdrop-blur-sm',
                )}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg viewBox="0 0 20 18" className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M10 16.5S1 11 1 5.5A4.5 4.5 0 0 1 10 3.2 4.5 4.5 0 0 1 19 5.5C19 11 10 16.5 10 16.5Z" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-6 sm:p-8">

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted">
                    {product.category}
                  </span>
                  <span className="text-muted/40">·</span>
                  <span
                    className="font-body text-[0.58rem] uppercase tracking-[0.18em] px-2 py-0.5"
                    style={{ background: `${chakraColour}22`, color: chakraColour, border: `1px solid ${chakraColour}44` }}
                  >
                    {product.chakra} Chakra
                  </span>
                </div>

                <h2 className="font-display font-light text-[clamp(1.6rem,4vw,2.2rem)] leading-tight text-deep mb-1">
                  {product.name}
                </h2>
                <p className="font-body font-extralight text-[0.8rem] text-muted mb-3">
                  {product.subtitle}
                </p>

                {/* Rating row */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={cn('text-xs', n <= Math.floor(product.rating) ? 'text-gold' : 'text-warm')} aria-hidden="true">★</span>
                    ))}
                  </span>
                  <span className="font-body text-[0.7rem] text-muted">{product.rating} · {product.reviewCount} reviews</span>
                </div>

                {/* Intention tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.intention.split(' · ').map(i => (
                    <span key={i} className="font-body text-[0.6rem] uppercase tracking-[0.15em] px-3 py-1.5 bg-warm text-muted border border-warm">
                      {i}
                    </span>
                  ))}
                </div>

                {/* Origin */}
                <p className="font-body text-[0.72rem] text-muted">
                  <span className="text-bark">Origin:</span> {product.origin}
                </p>
              </div>

              {/* Price + stock */}
              <div className="flex items-end justify-between mb-6 pb-6 border-b border-warm">
                <div>
                  <p className="font-display text-[1.8rem] font-light text-deep">{product.priceDisplay}</p>
                  {product.inStock ? (
                    <p className={cn(
                      'font-body text-[0.65rem] uppercase tracking-[0.12em] mt-0.5',
                      product.stockCount <= 5 ? 'text-rose' : 'text-sage',
                    )}>
                      {product.stockCount <= 5 ? `Only ${product.stockCount} left` : 'In Stock'}
                    </p>
                  ) : (
                    <p className="font-body text-[0.65rem] uppercase tracking-[0.12em] mt-0.5 text-muted">Out of Stock</p>
                  )}
                </div>

                {/* Qty selector */}
                <div className="flex items-center border border-warm">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center text-bark hover:bg-warm transition-colors"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-body text-[0.8rem] text-bark" aria-live="polite" aria-label={`Quantity: ${qty}`}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stockCount, q + 1))}
                    className="w-9 h-9 flex items-center justify-center text-bark hover:bg-warm transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  'w-full font-body text-[0.72rem] uppercase tracking-[0.2em] py-4 mb-3',
                  'transition-all duration-300',
                  product.inStock
                    ? added
                      ? 'bg-sage text-cream'
                      : 'bg-deep text-cream hover:bg-bark'
                    : 'bg-warm text-muted cursor-not-allowed',
                )}
                aria-live="polite"
              >
                {!product.inStock ? 'Out of Stock' : added ? '✦ Added to Cart' : 'Add to Cart'}
              </button>

              {/* Buy now */}
              {product.inStock && (
                <button className="w-full font-body text-[0.72rem] uppercase tracking-[0.2em] py-4 mb-6 border border-deep text-deep hover:bg-warm transition-colors duration-200">
                  Buy Now
                </button>
              )}

              {/* Tabs */}
              <div className="border-b border-warm mb-5">
                <div className="flex gap-0 overflow-x-auto" role="tablist">
                  {(['description', 'how-to-use', 'details'] as Tab[]).map(t => (
                    <TabButton key={t} active={tab === t} onClick={() => setTab(t)}>
                      {t === 'description' ? 'About' : t === 'how-to-use' ? 'How to Use' : 'Details'}
                    </TabButton>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="mb-8 min-h-[120px]">
                {tab === 'description' && (
                  <div>
                    <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-bark mb-5">
                      {product.description}
                    </p>
                    <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-gold mb-3">Properties</p>
                    <ul className="space-y-2">
                      {product.properties.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5 font-body font-extralight text-[0.8rem] text-bark">
                          <span className="text-gold mt-0.5 flex-none text-[0.6rem]">✦</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tab === 'how-to-use' && (
                  <div>
                    <p className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-gold mb-3">Ritual guide</p>
                    <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-bark">
                      {product.howToUse}
                    </p>
                    <div
                      className="mt-5 p-4 border-l-2 bg-warm/60"
                      style={{ borderColor: chakraColour }}
                    >
                      <p className="font-body text-[0.65rem] uppercase tracking-[0.15em] mb-1" style={{ color: chakraColour }}>
                        {product.chakra} Chakra
                      </p>
                      <p className="font-body font-extralight text-[0.78rem] text-bark/80">
                        This stone primarily activates and balances the {product.chakra.toLowerCase()} chakra, enhancing {product.intention.toLowerCase()}.
                      </p>
                    </div>
                  </div>
                )}

                {tab === 'details' && (
                  <div className="space-y-3">
                    {[
                      { label: 'Dimensions', value: product.dimensions },
                      { label: 'Weight',     value: product.weight },
                      { label: 'Origin',     value: product.origin },
                      { label: 'Chakra',     value: product.chakra },
                      { label: 'Category',   value: product.category },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-baseline border-b border-warm pb-3 last:border-0">
                        <span className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-muted">{label}</span>
                        <span className="font-body font-light text-[0.8rem] text-bark text-right max-w-[55%]">{value}</span>
                      </div>
                    ))}
                    <div className="pt-2">
                      <p className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-muted mb-2">Care</p>
                      <p className="font-body font-extralight text-[0.78rem] text-bark/80 leading-relaxed">
                        Cleanse monthly under moonlight or with selenite. Avoid prolonged sunlight exposure. Handle with intention.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Related products */}
              {relatedProducts.length > 0 && (
                <div>
                  <p className="font-body text-[0.62rem] uppercase tracking-[0.28em] text-gold mb-4">
                    You may also like
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {relatedProducts.map(rp => (
                      <button
                        key={rp.id}
                        onClick={() => onSelectRelated(rp)}
                        className="group text-left transition-opacity duration-200 hover:opacity-80"
                        aria-label={`View ${rp.name}`}
                      >
                        <div className={cn(rp.bgClass, 'w-full aspect-square flex items-center justify-center text-2xl mb-2')} aria-hidden="true">
                          {rp.emoji}
                        </div>
                        <p className="font-display text-[0.82rem] font-light text-deep leading-tight mb-0.5 truncate">{rp.name}</p>
                        <p className="font-body text-[0.7rem] text-muted">{rp.priceDisplay}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-warm grid grid-cols-3 gap-3">
                {[
                  { icon: '🌍', label: 'Ethically sourced' },
                  { icon: '🌙', label: 'Moon-cleansed' },
                  { icon: '📦', label: 'Sacred packaging' },
                ].map(b => (
                  <div key={b.label} className="text-center">
                    <p className="text-lg mb-1" aria-hidden="true">{b.icon}</p>
                    <p className="font-body text-[0.58rem] uppercase tracking-[0.12em] text-muted leading-tight">{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default ProductDrawer
