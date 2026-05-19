import { useState, useCallback, type FC } from 'react'
import Navbar  from '@/components/layout/Navbar'
import Footer  from '@/components/layout/Footer'
import { COLLECTION_PRODUCTS } from '@/data/collection'
import { cn } from '@/lib/utils'
import type { ProductDetail } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WishlistPageProps {
  /** IDs already in the wishlist (passed from App-level state) */
  wishlistIds: Set<string>
  /** IDs already in the cart (passed from App-level state) */
  cartIds: Set<string>
  onRemoveFromWishlist: (id: string) => void
  onMoveToCart: (id: string) => void
  onNavigateToCollection: () => void
  onNavigateToCart: () => void
}

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyWishlist: FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-6">
    {/* Animated heart */}
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 rounded-full bg-rose/10 animate-ping opacity-60" aria-hidden="true" />
      <div className="relative w-20 h-20 rounded-full bg-rose/15 flex items-center justify-center">
        <svg viewBox="0 0 24 22" className="w-9 h-9" fill="none" stroke="#C9837A" strokeWidth="1.5">
          <path d="M12 21S1 13.5 1 6.5A5.5 5.5 0 0 1 12 3.7 5.5 5.5 0 0 1 23 6.5C23 13.5 12 21 12 21Z" />
        </svg>
      </div>
    </div>
    <h2 className="font-display font-light text-[1.8rem] text-deep mb-2">Your wishlist is empty</h2>
    <p className="font-body font-extralight text-[0.82rem] text-muted max-w-xs leading-relaxed mb-7">
      Save the stones that call to you. Browse our collection and tap the heart on any crystal.
    </p>
    <button
      onClick={onBrowse}
      className="font-body text-[0.7rem] uppercase tracking-[0.22em] bg-deep text-cream px-8 py-4 hover:bg-bark transition-colors duration-200"
    >
      Browse Collection
    </button>
  </div>
)

// ─── Wishlist product card ────────────────────────────────────────────────────

interface WishlistCardProps {
  product: ProductDetail
  inCart: boolean
  onRemove: () => void
  onMoveToCart: () => void
  onViewDetails: () => void
}

const WishlistCard: FC<WishlistCardProps> = ({ product, inCart, onRemove, onMoveToCart, onViewDetails }) => {
  const [removing, setRemoving] = useState(false)

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(() => onRemove(), 350)
  }

  return (
    <article
      className={cn(
        'group bg-cream border border-warm transition-all duration-350',
        removing && 'opacity-0 scale-95',
      )}
      aria-label={product.name}
    >
      {/* Product visual */}
      <div className="relative overflow-hidden cursor-pointer" onClick={onViewDetails}>
        <div
          className={cn(product.bgClass, 'w-full aspect-square flex items-center justify-center text-[clamp(3rem,8vw,4.5rem)] transition-transform duration-500 group-hover:scale-105')}
          aria-hidden="true"
        >
          {product.emoji}
        </div>

        {/* Badge */}
        {product.badge && (
          <span className={cn(
            'absolute top-3 left-3 font-body text-[0.55rem] uppercase tracking-[0.18em] px-2.5 py-1',
            product.badge === 'Bestseller' && 'bg-gold text-deep',
            product.badge === 'New'        && 'bg-amethyst text-cream',
            product.badge === 'Limited'    && 'bg-rose text-cream',
            product.badge === 'Rare'       && 'bg-bark text-gold-light border border-gold/40',
            product.badge === 'Gifting'    && 'bg-sage text-cream',
          )}>
            {product.badge}
          </span>
        )}

        {/* Remove from wishlist */}
        <button
          onClick={e => { e.stopPropagation(); handleRemove() }}
          className="absolute top-3 right-3 w-8 h-8 bg-rose text-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose/80"
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <svg viewBox="0 0 20 18" className="w-4 h-4" fill="currentColor" stroke="none">
            <path d="M10 16.5S1 11 1 5.5A4.5 4.5 0 0 1 10 3.2 4.5 4.5 0 0 1 19 5.5C19 11 10 16.5 10 16.5Z" />
          </svg>
        </button>

        {/* Stock warning */}
        {product.inStock && product.stockCount <= 5 && (
          <div className="absolute bottom-0 inset-x-0 bg-deep/80 backdrop-blur-sm py-2 px-3">
            <p className="font-body text-[0.58rem] uppercase tracking-[0.15em] text-gold-light text-center">
              Only {product.stockCount} left
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 border-t border-warm">
        <p className="font-body text-[0.58rem] uppercase tracking-[0.2em] text-muted mb-1">
          {product.category}
        </p>
        <h3 className="font-display text-[1.1rem] font-normal text-deep leading-tight mb-0.5">
          {product.name}
        </h3>
        <p className="font-body font-extralight text-[0.72rem] text-muted mb-3 leading-snug line-clamp-1">
          {product.intention}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="font-display text-[1.05rem] font-light text-bark">{product.priceDisplay}</span>
          <span className={cn(
            'font-body text-[0.58rem] uppercase tracking-[0.12em]',
            product.inStock ? 'text-sage' : 'text-muted',
          )}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <button
          onClick={onMoveToCart}
          disabled={!product.inStock || inCart}
          className={cn(
            'w-full font-body text-[0.65rem] uppercase tracking-[0.18em] py-3 transition-all duration-200',
            inCart
              ? 'bg-sage/20 text-sage border border-sage/30 cursor-default'
              : product.inStock
                ? 'bg-deep text-cream hover:bg-gold hover:text-deep'
                : 'bg-warm text-muted cursor-not-allowed',
          )}
          aria-label={inCart ? 'Already in cart' : `Move ${product.name} to cart`}
        >
          {inCart ? '✦ In Cart' : product.inStock ? 'Move to Cart' : 'Out of Stock'}
        </button>
      </div>
    </article>
  )
}

// ─── Main WishlistPage ────────────────────────────────────────────────────────

const WishlistPage: FC<WishlistPageProps> = ({
  wishlistIds,
  cartIds,
  onRemoveFromWishlist,
  onMoveToCart,
  onNavigateToCollection,
  onNavigateToCart,
}) => {
  const [drawerProduct, setDrawerProduct] = useState<ProductDetail | null>(null)

  const wishlistProducts = COLLECTION_PRODUCTS.filter(p => wishlistIds.has(p.id))

  const handleMoveAll = useCallback(() => {
    wishlistProducts
      .filter(p => p.inStock && !cartIds.has(p.id))
      .forEach(p => onMoveToCart(p.id))
  }, [wishlistProducts, cartIds, onMoveToCart])

  const movableCount = wishlistProducts.filter(p => p.inStock && !cartIds.has(p.id)).length

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream">

        {/* Page header */}
        <div
          className="relative overflow-hidden flex flex-col items-center justify-center text-center"
          style={{
            paddingTop: 'clamp(5.5rem,12vw,8rem)',
            paddingBottom: 'clamp(2.5rem,5vw,4rem)',
            paddingLeft: 'clamp(1.25rem,5vw,4rem)',
            paddingRight: 'clamp(1.25rem,5vw,4rem)',
            background: 'radial-gradient(ellipse at 50% 0%, #6B2435 0%, #2A1218 50%, #1C1410 100%)',
          }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 300" fill="none" aria-hidden="true">
            <polygon points="400,20 760,140 760,260 400,280 40,260 40,140" stroke="#B8956A" strokeWidth="0.8" fill="none" />
            <circle cx="400" cy="150" r="100" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.4" />
          </svg>
          <div className="absolute top-0 left-1/3 w-56 h-56 rounded-full pointer-events-none" style={{ background: '#C9837A', opacity: 0.15, filter: 'blur(70px)' }} aria-hidden="true" />

          <div className="relative z-10">
            <p className="inline-flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-4">
              <span className="w-7 h-px bg-gold-light" aria-hidden="true" />
              Your Wishlist
              <span className="w-7 h-px bg-gold-light" aria-hidden="true" />
            </p>
            <h1 className="font-display font-light text-[clamp(2rem,6vw,3.5rem)] leading-[1.05] text-cream mb-3">
              Stones you <em className="italic text-rose">love</em>
            </h1>
            {wishlistProducts.length > 0 && (
              <p className="font-body font-extralight text-[0.8rem] text-cream/55">
                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'stone' : 'stones'} saved
              </p>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)' }}>

          {wishlistProducts.length === 0 ? (
            <EmptyWishlist onBrowse={onNavigateToCollection} />
          ) : (
            <>
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-warm">
                <p className="font-body text-[0.75rem] text-muted">
                  <span className="text-bark font-normal">{wishlistProducts.length}</span> saved {wishlistProducts.length === 1 ? 'item' : 'items'}
                  {cartIds.size > 0 && (
                    <span className="ml-2 text-sage">
                      · {[...wishlistIds].filter(id => cartIds.has(id)).length} in cart
                    </span>
                  )}
                </p>
                <div className="flex gap-3">
                  {movableCount > 0 && (
                    <button
                      onClick={handleMoveAll}
                      className="font-body text-[0.65rem] uppercase tracking-[0.18em] px-5 py-2.5 bg-deep text-cream hover:bg-bark transition-colors duration-200"
                    >
                      Move All to Cart
                    </button>
                  )}
                  {cartIds.size > 0 && (
                    <button
                      onClick={onNavigateToCart}
                      className="font-body text-[0.65rem] uppercase tracking-[0.18em] px-5 py-2.5 border border-gold text-gold hover:bg-gold hover:text-deep transition-all duration-200"
                    >
                      View Cart ({cartIds.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Grid */}
              <div className="grid gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {wishlistProducts.map(p => (
                  <WishlistCard
                    key={p.id}
                    product={p}
                    inCart={cartIds.has(p.id)}
                    onRemove={() => onRemoveFromWishlist(p.id)}
                    onMoveToCart={() => onMoveToCart(p.id)}
                    onViewDetails={() => setDrawerProduct(p)}
                  />
                ))}
              </div>

              {/* Continue shopping */}
              <div className="mt-14 pt-10 border-t border-warm text-center">
                <p className="font-display font-light text-[1.3rem] text-bark mb-4">
                  Discover more <em className="italic text-amethyst">sacred stones</em>
                </p>
                <button
                  onClick={onNavigateToCollection}
                  className="font-body text-[0.7rem] uppercase tracking-[0.2em] border border-deep text-deep px-8 py-3.5 hover:bg-deep hover:text-cream transition-all duration-200"
                >
                  Browse Full Collection
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Quick-view drawer (inline, lightweight) */}
      {drawerProduct && (
        <>
          <div
            className="fixed inset-0 z-[300] bg-deep/50 backdrop-blur-sm"
            onClick={() => setDrawerProduct(null)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${drawerProduct.name} details`}
            className="fixed right-0 top-0 bottom-0 z-[301] w-full sm:w-[480px] bg-cream overflow-y-auto transition-transform duration-500"
          >
            <button
              onClick={() => setDrawerProduct(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-warm hover:bg-warm/70 transition-colors"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className={cn(drawerProduct.bgClass, 'w-full aspect-[4/3] flex items-center justify-center text-[7rem]')} aria-hidden="true">
              {drawerProduct.emoji}
            </div>

            <div className="p-6 sm:p-8">
              <p className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted mb-1">{drawerProduct.category} · {drawerProduct.chakra} Chakra</p>
              <h2 className="font-display font-light text-[1.8rem] text-deep mb-1 leading-tight">{drawerProduct.name}</h2>
              <p className="font-body font-extralight text-[0.78rem] text-muted mb-4">{drawerProduct.subtitle}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {drawerProduct.intention.split(' · ').map(i => (
                  <span key={i} className="font-body text-[0.6rem] uppercase tracking-[0.15em] px-3 py-1.5 bg-warm text-muted">{i}</span>
                ))}
              </div>
              <p className="font-body font-extralight text-[0.82rem] leading-[1.9] text-bark mb-6">{drawerProduct.description}</p>
              <div className="flex items-center justify-between mb-5">
                <span className="font-display text-[1.5rem] font-light text-deep">{drawerProduct.priceDisplay}</span>
                <span className={cn('font-body text-[0.62rem] uppercase tracking-[0.12em]', drawerProduct.inStock ? 'text-sage' : 'text-muted')}>
                  {drawerProduct.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { onMoveToCart(drawerProduct.id); setDrawerProduct(null) }}
                  disabled={!drawerProduct.inStock || cartIds.has(drawerProduct.id)}
                  className={cn(
                    'flex-1 font-body text-[0.65rem] uppercase tracking-[0.18em] py-4 transition-all duration-200',
                    cartIds.has(drawerProduct.id)
                      ? 'bg-sage/20 text-sage border border-sage/30'
                      : drawerProduct.inStock
                        ? 'bg-deep text-cream hover:bg-gold hover:text-deep'
                        : 'bg-warm text-muted cursor-not-allowed',
                  )}
                >
                  {cartIds.has(drawerProduct.id) ? '✦ In Cart' : 'Move to Cart'}
                </button>
                <button
                  onClick={() => { onRemoveFromWishlist(drawerProduct.id); setDrawerProduct(null) }}
                  className="w-12 h-12 border border-warm flex items-center justify-center text-muted hover:border-rose hover:text-rose transition-colors duration-200"
                  aria-label="Remove from wishlist"
                >
                  <svg viewBox="0 0 20 18" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M10 16.5S1 11 1 5.5A4.5 4.5 0 0 1 10 3.2 4.5 4.5 0 0 1 19 5.5C19 11 10 16.5 10 16.5Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </>
  )
}

export default WishlistPage
