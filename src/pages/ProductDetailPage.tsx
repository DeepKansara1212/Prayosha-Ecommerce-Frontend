import { useState, useEffect, useCallback, useRef, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import type { ProductDetail } from '@/types'
import { useProduct, useRelatedProducts } from '@/hooks/useProducts'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { cn } from '@/lib/utils'
import ReviewsList from '@/components/product/ReviewsList'
import ReviewForm from '@/components/product/ReviewForm'
import { ProductDetailSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import { toast } from '@/store/toastStore'
import { getPublicSettings } from '@/api/settings.api'
import { getProductInquiryUrl, hasWhatsAppNumber } from '@/lib/productInquiry'
import {
  getMarketingConsent,
  subscribeToMarketingConsent,
  trackMetaEvent,
  type MarketingConsent,
} from '@/lib/metaPixel'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProductDetailPageProps {
  productId: string
  wishlistIds: Set<string>
  cartIds: Set<string>
  onToggleWishlist: (id: string) => void
  onAddToCart: (id: string, quantity?: number) => void
  onNavigateToCollection: () => void
  onNavigateToProduct: (id: string) => void
  onNavigateToCart: () => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CHAKRA_COLOURS: Record<string, string> = {
  Root: '#8B3333', Sacral: '#B85C20', 'Solar Plexus': '#C4962A',
  Heart: '#3A7A4A', Throat: '#3A6A9A', 'Third Eye': '#4A4A9A', Crown: '#7C5C8A',
}

// ─── Star rating ──────────────────────────────────────────────────────────────

const StarRating: FC<{ rating: number; reviewCount: number }> = ({ rating, reviewCount }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1,2,3,4,5].map(n => (
        <svg key={n} viewBox="0 0 12 12" className="w-4 h-4" fill={n <= Math.floor(rating) ? '#B8956A' : '#3D2B1F'}>
          <path d="M6 1l1.2 3.7H11L8.1 6.6l1.2 3.7L6 8.3 2.7 10.3l1.2-3.7L1 4.7h3.8z" />
        </svg>
      ))}
    </div>
    <span className="font-body text-[0.75rem] text-gold">{rating}</span>
    <span className="font-body text-[0.72rem] text-muted">({reviewCount} reviews)</span>
  </div>
)

// ─── Image gallery panel ──────────────────────────────────────────────────────

const ImageGallery: FC<{ product: ProductDetail }> = ({ product }) => {
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const hasMedia = product.images.length > 0 || !!product.video

  useEffect(() => setActive(0), [product.id])

  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxOpen])

  if (!hasMedia) {
    return (
      <div className={cn(product.bgClass, 'w-full aspect-square sm:aspect-[4/3] flex items-center justify-center relative overflow-hidden rounded-sm')}>
        <span className="text-[clamp(6rem,20vw,12rem)] select-none">{product.emoji}</span>
        {product.badge && (
          <span className={cn(
            'absolute top-4 left-4 font-body text-[0.6rem] uppercase tracking-[0.18em] px-3 py-1.5',
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
    )
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-x-visible">
        {product.images.map((url, i) => (
          <button
            key={url}
            onClick={() => setActive(i)}
            className={cn(
              'flex-none w-16 h-16 sm:w-20 sm:h-20 transition-all duration-200 overflow-hidden rounded-sm bg-warm',
              i === active
                ? 'ring-2 ring-gold ring-offset-2 ring-offset-cream opacity-100'
                : 'opacity-60 hover:opacity-85',
            )}
            aria-label={`View image ${i + 1}`}
          >
            <img src={url} alt="" className="w-full h-full object-contain p-1" />
          </button>
        ))}
        {product.video && (
          <button
            onClick={() => setActive(product.images.length)}
            className={cn(
              'flex-none w-16 h-16 sm:w-20 sm:h-20 transition-all duration-200 overflow-hidden rounded-sm bg-deep relative',
              active === product.images.length
                ? 'ring-2 ring-gold ring-offset-2 ring-offset-cream opacity-100'
                : 'opacity-60 hover:opacity-85',
            )}
            aria-label="View product video"
          >
            <video src={product.video} muted preload="metadata" className="w-full h-full object-contain" />
            <span className="absolute inset-0 flex items-center justify-center text-cream text-lg" aria-hidden="true">▶</span>
          </button>
        )}
      </div>

      {/* Main image */}
      <div className="flex-1 min-w-0 aspect-square sm:aspect-[4/3] max-h-[min(72vh,680px)] relative overflow-hidden rounded-sm border border-warm bg-[#f8f6f2] shadow-[0_12px_36px_rgba(61,43,31,0.08)]">
        {active < product.images.length
          ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute inset-0 flex h-full w-full cursor-zoom-in items-center justify-center border-0 bg-transparent p-3 sm:p-6"
              aria-label={`Expand image of ${product.name}`}
            >
              <img
                src={product.images[active]}
                alt={product.name}
                className="h-full w-full object-contain transition-opacity duration-300"
              />
            </button>
          )
          : <video
              src={product.video}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
              aria-label={`${product.name} product video`}
            />}
        {product.badge && (
          <span className={cn(
            'absolute top-4 left-4 font-body text-[0.6rem] uppercase tracking-[0.18em] px-3 py-1.5',
            product.badge === 'Bestseller' && 'bg-gold text-deep',
            product.badge === 'New'        && 'bg-amethyst text-cream',
            product.badge === 'Limited'    && 'bg-rose text-cream',
            product.badge === 'Rare'       && 'bg-deep text-gold-light border border-gold/40',
            product.badge === 'Gifting'    && 'bg-sage text-cream',
          )}>
            {product.badge}
          </span>
        )}
        {product.images.length + (product.video ? 1 : 0) > 1 && (
          <span className="absolute bottom-3 right-3 font-body text-[0.6rem] uppercase tracking-[0.15em] text-cream/70 bg-deep/50 backdrop-blur-sm px-2 py-1">
            {active + 1} / {product.images.length + (product.video ? 1 : 0)}
          </span>
        )}
      </div>

      {lightboxOpen && active < product.images.length && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image of ${product.name}`}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[#1c1410]/95 p-4 sm:p-8"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center border border-white/30 bg-black/20 text-2xl text-white transition-colors hover:bg-white/15"
            aria-label="Close enlarged image"
          >
            ×
          </button>
          <img
            src={product.images[active]}
            alt={`${product.name} — enlarged view`}
            className="max-h-full max-w-full object-contain"
            onClick={event => event.stopPropagation()}
          />
          {product.images.length > 1 && (
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/30 px-3 py-1 font-body text-xs tracking-[0.15em] text-white/85">
              {active + 1} / {product.images.length}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Quantity selector ────────────────────────────────────────────────────────

const QuantitySelector: FC<{ qty: number; max: number; onChange: (q: number) => void }> = ({ qty, max, onChange }) => (
  <div className="flex items-center border border-warm">
    <button onClick={() => onChange(Math.max(1, qty - 1))} className="w-11 h-11 flex items-center justify-center text-bark hover:bg-warm transition-colors" aria-label="Decrease quantity">−</button>
    <span className="w-12 text-center font-body text-[0.85rem] text-bark" aria-live="polite">{qty}</span>
    <button onClick={() => onChange(Math.min(max, qty + 1))} className="w-11 h-11 flex items-center justify-center text-bark hover:bg-warm transition-colors" aria-label="Increase quantity">+</button>
  </div>
)

// ─── Related products row ─────────────────────────────────────────────────────

const RelatedProducts: FC<{ related: ProductDetail[]; onNavigate: (id: string) => void }> = ({ related, onNavigate }) => {
  if (!related.length) return null

  return (
    <div className="mt-12 pt-10 border-t border-warm">
      <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-6">You may also like</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {related.slice(0, 4).map(rp => (
          <button
            key={rp.id}
            onClick={() => onNavigate(rp.id)}
            className="group text-left transition-transform duration-200 hover:-translate-y-1"
          >
            <div className={cn(rp.images.length === 0 && rp.bgClass, 'w-full aspect-square flex items-center justify-center text-[2.5rem] mb-3 overflow-hidden transition-transform duration-400 group-hover:scale-105')} aria-hidden="true">
              {rp.images.length > 0
                ? <img src={rp.images[0]} alt={rp.name} className="w-full h-full object-cover" />
                : rp.emoji
              }
            </div>
            <p className="font-body text-[0.58rem] uppercase tracking-[0.18em] text-muted mb-0.5">{rp.category}</p>
            <p className="font-display text-[1rem] font-light text-deep leading-tight mb-1">{rp.name}</p>
            <p className="font-display text-[0.95rem] font-light text-bark">{rp.priceDisplay}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

const ProductDetailPage: FC<ProductDetailPageProps> = ({
  productId,
  wishlistIds,
  cartIds,
  onToggleWishlist,
  onAddToCart,
  onNavigateToCollection,
  onNavigateToProduct,
  onNavigateToCart,
}) => {
  const navigate = useNavigate()
  const { data: product, isLoading, isError } = useProduct(productId)
  const { data: relatedProducts = [] }        = useRelatedProducts(productId)
  const { data: publicSettings } = useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  })

  const [qty, setQty]               = useState(1)
  const [addedToCart, setAddedToCart]   = useState(false)
  const [activeTab, setActiveTab]       = useState<'description'|'details'|'reviews'>('description')
  const [marketingConsent, setMarketingConsentState] = useState<MarketingConsent>(getMarketingConsent)

  const isWishlisted = wishlistIds.has(productId)
  const isInCart     = cartIds.has(productId)
  const chakraColour = product ? (CHAKRA_COLOURS[product.chakra] ?? '#7C5C8A') : '#7C5C8A'
  const viewedProductSku = useRef<string | null>(null)
  const descriptionLines = product?.description
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean) ?? []

  useEffect(() => subscribeToMarketingConsent(() => setMarketingConsentState(getMarketingConsent())), [])

  useEffect(() => {
    if (!product || marketingConsent !== 'granted') return
    const contentId = product.sku ?? product.id
    if (viewedProductSku.current === contentId) return
    const tracked = trackMetaEvent('ViewContent', {
      content_ids: [contentId],
      content_type: 'product',
      content_name: product.name,
      content_category: product.category,
      ...(product.price !== undefined && { value: product.price }),
      currency: 'INR',
    })
    if (tracked) viewedProductSku.current = contentId
  }, [product, marketingConsent])

  const handleAddToCart = useCallback(() => {
    if (!product || product.price === undefined) return
    onAddToCart(product.id, qty)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
    toast.success('Added to cart')
  }, [product, qty, onAddToCart])

  const handleToggleWishlist = useCallback(() => {
    if (!product) return
    const wasIn = wishlistIds.has(product.id)
    onToggleWishlist(product.id)
    toast.info(wasIn ? 'Removed from wishlist' : 'Saved to wishlist')
  }, [product, wishlistIds, onToggleWishlist])

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <main id="main-content" className="min-h-screen bg-cream pt-[88px]">
          <ProductDetailSkeleton />
        </main>
        <Footer />
      </>
    )
  }

  // Error / not found
  if (isError || !product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cream pt-[88px]">
          <EmptyState
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3m.08 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
            title="Stone not found"
            description="This crystal may have found its home. Browse our collection for more."
            actionLabel="Browse Collection"
            onAction={onNavigateToCollection}
          />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream">

        {/* Breadcrumb */}
        <div
          className="border-b border-warm"
          style={{ paddingTop: '88px', paddingBottom: '0.75rem', paddingLeft: 'clamp(1.25rem,5vw,4rem)', paddingRight: 'clamp(1.25rem,5vw,4rem)' }}
        >
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 font-body text-[0.65rem] uppercase tracking-[0.15em] text-muted flex-wrap">
              <li><button onClick={() => { navigate('/'); window.scrollTo({ top: 0 }) }} className="hover:text-bark transition-colors bg-transparent border-none cursor-pointer">Home</button></li>
              <li aria-hidden="true" className="text-muted/40">›</li>
              <li><button onClick={onNavigateToCollection} className="hover:text-bark transition-colors bg-transparent border-none cursor-pointer">Collection</button></li>
              <li aria-hidden="true" className="text-muted/40">›</li>
              <li><button onClick={onNavigateToCollection} className="hover:text-bark transition-colors bg-transparent border-none cursor-pointer">{product.category}</button></li>
              <li aria-hidden="true" className="text-muted/40">›</li>
              <li className="text-bark font-normal truncate max-w-[180px]">{product.name}</li>
            </ol>
          </nav>
        </div>

        {/* Main product layout */}
        <div style={{ padding: 'clamp(2rem,5vw,3.5rem) clamp(1.25rem,5vw,4rem)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px] xl:grid-cols-[minmax(0,1fr)_520px] gap-10 xl:gap-16">

            {/* ── Left: Image gallery ── */}
            <div className="min-w-0">
              <ImageGallery product={product} />
            </div>

            {/* ── Right: Product info ── */}
            <div className="min-w-0">
              {/* Category + chakra */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="font-body text-[0.6rem] uppercase tracking-[0.2em] text-muted">{product.category}</span>
                <span className="text-muted/30">·</span>
                <span
                  className="font-body text-[0.6rem] uppercase tracking-[0.15em] px-2.5 py-1 border"
                  style={{ color: chakraColour, borderColor: `${chakraColour}50`, background: `${chakraColour}12` }}
                >
                  {product.chakra} Chakra
                </span>
                {product.badge && (
                  <span className={cn(
                    'font-body text-[0.58rem] uppercase tracking-[0.18em] px-2.5 py-1',
                    product.badge === 'Bestseller' && 'bg-gold text-deep',
                    product.badge === 'New'        && 'bg-amethyst text-cream',
                    product.badge === 'Limited'    && 'bg-rose text-cream',
                    product.badge === 'Rare'       && 'bg-bark text-gold-light border border-gold/40',
                    product.badge === 'Gifting'    && 'bg-sage text-cream',
                  )}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-display font-light text-[clamp(1.8rem,4vw,2.6rem)] leading-tight text-deep mb-1">
                {product.name}
              </h1>
              <p className="font-body font-extralight text-[0.82rem] text-muted mb-4">{product.subtitle}</p>

              {/* Rating */}
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />

              <div className="h-px bg-warm my-5" />

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display font-light text-[2.2rem] text-deep">{product.priceDisplay}</span>
                {product.price !== undefined && (
                  <>
                    <span className="font-body text-[0.7rem] text-muted line-through">₹{Math.round(product.price * 1.2).toLocaleString('en-IN')}</span>
                    <span className="font-body text-[0.68rem] text-sage font-normal">Save 17%</span>
                  </>
                )}
              </div>
              {product.price !== undefined && (
                <p className="font-body text-[0.7rem] text-muted mb-5">Inclusive of all taxes · Free returns within 7 days</p>
              )}

              {/* Intention tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {product.intention.split(' · ').map(tag => (
                  <span key={tag} className="font-body text-[0.62rem] uppercase tracking-[0.12em] px-3 py-1.5 bg-warm text-muted border border-warm">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 mb-5">
                <div className={cn('w-2 h-2 rounded-full', product.inStock && product.stockCount > 5 ? 'bg-sage' : product.inStock ? 'bg-[#D4921A]' : 'bg-rose')} aria-hidden="true" />
                <p className={cn(
                  'font-body text-[0.72rem] uppercase tracking-[0.12em]',
                  product.inStock && product.stockCount > 5 ? 'text-sage' : product.inStock ? 'text-[#D4921A]' : 'text-rose',
                )}>
                  {product.inStock && product.stockCount > 5 ? 'In Stock' : product.inStock ? `Only ${product.stockCount} remaining — order soon` : 'Out of Stock'}
                </p>
              </div>

              {/* Origin */}
              <div className="flex items-center gap-2 mb-6 font-body text-[0.72rem] text-muted">
                <span className="text-base" aria-hidden="true">🌍</span>
                <span>Sourced from <span className="text-bark">{product.origin}</span></span>
              </div>

              <div className="h-px bg-warm mb-6" />

              {/* Quantity + CTA */}
              <div className="space-y-3">
                {product.price === undefined ? (
                  <a
                    href={getProductInquiryUrl(product, publicSettings?.whatsappNumber)}
                    target={hasWhatsAppNumber(publicSettings?.whatsappNumber) ? '_blank' : undefined}
                    rel={hasWhatsAppNumber(publicSettings?.whatsappNumber) ? 'noopener noreferrer' : undefined}
                    className="block w-full text-center font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 bg-gold text-deep hover:bg-gold-light transition-colors duration-200"
                  >
                    Add to Inquiry
                  </a>
                ) : (
                  <>
                    <div className="flex items-center gap-4 flex-wrap">
                      <QuantitySelector qty={qty} max={product.stockCount} onChange={setQty} />
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className={cn(
                        'w-full font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 transition-all duration-300',
                        !product.inStock
                          ? 'bg-warm text-muted cursor-not-allowed'
                          : addedToCart
                            ? 'bg-sage text-cream'
                            : 'bg-deep text-cream hover:bg-bark',
                      )}
                      aria-live="polite"
                    >
                      {!product.inStock ? 'Out of Stock' : addedToCart ? '✦ Added to Cart' : 'Add to Cart'}
                    </button>

                    {product.inStock && (
                      <button
                        onClick={() => { onAddToCart(product.id); onNavigateToCart() }}
                        className="w-full font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 bg-gold text-deep hover:bg-gold-light transition-colors duration-200"
                      >
                        Buy Now
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={handleToggleWishlist}
                  className={cn(
                    'w-full flex items-center justify-center gap-2.5 font-body text-[0.68rem] uppercase tracking-[0.18em] py-3.5 border transition-all duration-200',
                    isWishlisted
                      ? 'border-rose text-rose bg-rose/5'
                      : 'border-warm text-muted hover:border-muted hover:text-bark',
                  )}
                >
                  <svg viewBox="0 0 20 18" className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 16.5S1 11 1 5.5A4.5 4.5 0 0 1 10 3.2 4.5 4.5 0 0 1 19 5.5C19 11 10 16.5 10 16.5Z" />
                  </svg>
                  {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                </button>

                {isInCart && !addedToCart && (
                  <button
                    onClick={onNavigateToCart}
                    className="w-full font-body text-[0.68rem] uppercase tracking-[0.15em] py-2.5 text-gold hover:text-gold-light transition-colors text-center"
                  >
                    View Cart →
                  </button>
                )}
              </div>

              {/* Delivery info */}
              <div className="mt-6 pt-6 border-t border-warm space-y-3">
                {[
                  { icon: '📦', title: 'Sacred packaging', desc: 'Organic cotton wrap with ritual card' },
                  { icon: '🌙', title: 'Moon-cleansed', desc: 'Energetically cleared before dispatch' },
                  { icon: '🔄', title: 'Free returns', desc: '7-day hassle-free returns' },
                  { icon: '✦',  title: 'Certified authentic', desc: 'Gemologist-verified, provenance guaranteed' },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3">
                    <span className="text-base flex-none mt-0.5" aria-hidden="true">{icon}</span>
                    <div>
                      <p className="font-body text-[0.7rem] text-bark">{title}</p>
                      <p className="font-body font-extralight text-[0.68rem] text-muted">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tabbed details ── */}
          <div className="mt-14">
            <div className="flex border-b border-warm gap-0 overflow-x-auto scrollbar-hide" role="tablist">
              {(['description', 'details', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'flex-none font-body text-[0.68rem] uppercase tracking-[0.2em] px-6 py-4 border-b-2 -mb-px transition-all duration-200 whitespace-nowrap',
                    activeTab === tab
                      ? 'border-gold text-bark'
                      : 'border-transparent text-muted hover:text-bark',
                  )}
                >
                  {tab === 'description' ? 'About This Stone' : tab === 'details' ? 'Dimensions & Care' : `Reviews (${product.reviewCount})`}
                </button>
              ))}
            </div>

            <div className="py-8 max-w-3xl">
              {activeTab === 'description' && (
                <div>
                  {descriptionLines.length > 1 ? (
                    <ul className="space-y-3 mb-8">
                      {descriptionLines.map((line, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-gold text-[0.6rem] mt-1.5 flex-none">✦</span>
                          <p className="font-body font-extralight text-[0.85rem] leading-[2] text-bark">{line}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body font-extralight text-[0.85rem] leading-[2] text-bark mb-8">{descriptionLines[0] ?? product.description}</p>
                  )}
                  {product.properties.length > 0 && (
                    <>
                      <p className="font-body text-[0.62rem] uppercase tracking-[0.25em] text-gold mb-4">Properties & Benefits</p>
                      <ul className="space-y-3">
                        {product.properties.map((p, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-gold text-[0.6rem] mt-1.5 flex-none">✦</span>
                            <p className="font-body font-extralight text-[0.83rem] leading-relaxed text-bark">{p}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {product.howToUse.length > 0 && (
                    <div className="mt-8 p-5 bg-warm border-l-2" style={{ borderColor: chakraColour }}>
                      <p className="font-body text-[0.62rem] uppercase tracking-[0.2em] mb-2" style={{ color: chakraColour }}>
                        How to Use — Ritual Guide
                      </p>
                      <ul className="space-y-2">
                        {product.howToUse.map((step, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-gold text-[0.6rem] mt-1.5 flex-none">✦</span>
                            <p className="font-body font-extralight text-[0.83rem] leading-[1.9] text-bark">{step}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border border-warm">
                    {[
                      { label: 'Weight', value: product.productDetails?.weight ?? product.weight },
                      { label: 'Length', value: product.productDetails?.length },
                      { label: 'Breadth', value: product.productDetails?.breadth },
                      { label: 'Height', value: product.productDetails?.height },
                      { label: 'Dimensions', value: product.productDetails?.dimensions ?? product.dimensions },
                      { label: 'Size', value: product.productDetails?.size ?? product.size },
                      { label: 'Origin', value: product.origin },
                      { label: 'Chakra', value: product.chakra },
                      { label: 'Category', value: product.category },
                      { label: 'Intention', value: product.intention },
                    ].filter(({ value }) => value?.trim()).map(({ label, value }, i) => (
                      <div key={label} className={cn('flex p-4 gap-4 border-b border-warm', i % 2 === 0 && 'sm:border-r')}>
                        <span className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-muted w-24 flex-none pt-0.5">{label}</span>
                        <span className="font-body text-[0.82rem] text-bark break-words">{value}</span>
                      </div>
                    ))}
                  </div>

                  {product.careInstructions.length > 0 && (
                    <div className="mt-6 p-5 bg-warm">
                      <p className="font-body text-[0.62rem] uppercase tracking-[0.2em] text-muted mb-2">Crystal Care</p>
                      <ul className="space-y-2">
                        {product.careInstructions.map((instruction, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="text-gold text-[0.6rem] mt-1.5 flex-none">✦</span>
                            <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-bark">{instruction}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <ReviewsList slug={productId} />
                  <ReviewForm slug={productId} />
                </div>
              )}
            </div>
          </div>

          {/* Related products */}
          <RelatedProducts related={relatedProducts} onNavigate={onNavigateToProduct} />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ProductDetailPage
