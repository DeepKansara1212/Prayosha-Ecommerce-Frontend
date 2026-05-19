import type { FC } from 'react'
import type { ProductDetail } from '@/types'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: ProductDetail
  onSelect: (p: ProductDetail) => void
  wishlisted: boolean
  onWishlist: (id: string) => void
}

const StarRating: FC<{ rating: number }> = ({ rating }) => (
  <span className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(n => (
      <span
        key={n}
        className={cn(
          'text-[0.55rem]',
          n <= Math.floor(rating) ? 'text-gold' : 'text-warm',
        )}
        aria-hidden="true"
      >
        ★
      </span>
    ))}
    <span className="font-body text-[0.6rem] text-muted ml-1">({rating})</span>
  </span>
)

const ProductCard: FC<ProductCardProps> = ({ product, onSelect, wishlisted, onWishlist }) => {
  const lowStock = product.inStock && product.stockCount <= 5

  return (
    <article
      className="group bg-cream cursor-pointer relative"
      onClick={() => onSelect(product)}
      aria-label={`View ${product.name} details`}
    >
      {/* Gem visual */}
      <div className="relative overflow-hidden">
        <div
          className={cn(
            product.bgClass,
            'w-full aspect-square flex items-center justify-center',
            'text-[clamp(3rem,8vw,5rem)]',
            'transition-transform duration-700 group-hover:scale-105',
          )}
          aria-hidden="true"
        >
          {product.emoji}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={cn(
              'font-body text-[0.55rem] uppercase tracking-[0.18em] px-2.5 py-1',
              product.badge === 'Bestseller' && 'bg-gold text-deep',
              product.badge === 'New'        && 'bg-amethyst text-cream',
              product.badge === 'Limited'    && 'bg-rose text-cream',
              product.badge === 'Rare'       && 'bg-bark text-gold-light border border-gold/40',
              product.badge === 'Gifting'    && 'bg-sage text-cream',
            )}>
              {product.badge}
            </span>
          )}
          {lowStock && (
            <span className="font-body text-[0.55rem] uppercase tracking-[0.18em] px-2.5 py-1 bg-deep/80 text-gold-light backdrop-blur-sm">
              Only {product.stockCount} left
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={e => { e.stopPropagation(); onWishlist(product.id) }}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 flex items-center justify-center',
            'transition-all duration-300',
            wishlisted
              ? 'bg-rose text-cream opacity-100'
              : 'bg-deep/60 text-cream/70 opacity-0 group-hover:opacity-100 backdrop-blur-sm hover:bg-rose hover:text-cream',
          )}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <svg viewBox="0 0 20 18" className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
            <path d="M10 16.5S1 11 1 5.5A4.5 4.5 0 0 1 10 3.2 4.5 4.5 0 0 1 19 5.5C19 11 10 16.5 10 16.5Z" />
          </svg>
        </button>

        {/* Quick-view overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-3 bg-deep/85 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-cream">View Details</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-warm">
        <p className="font-body text-[0.58rem] uppercase tracking-[0.22em] text-muted mb-1">
          {product.category} · {product.chakra} Chakra
        </p>
        <h3 className="font-display text-[1.1rem] font-normal text-deep mb-0.5 leading-tight">
          {product.name}
        </h3>
        <p className="font-body font-extralight text-[0.72rem] text-muted mb-3 leading-snug">
          {product.subtitle}
        </p>

        <StarRating rating={product.rating} />

        <div className="flex items-center justify-between mt-3">
          <span className="font-display text-[1.1rem] font-light text-bark">
            {product.priceDisplay}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onSelect(product) }}
            className="font-body text-[0.6rem] uppercase tracking-[0.18em] px-3 py-2 bg-deep text-cream hover:bg-gold hover:text-deep transition-colors duration-200"
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProductCard
