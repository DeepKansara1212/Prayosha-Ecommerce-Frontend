import type { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBadgeProducts } from '@/hooks/useProducts'
import type { ProductDetail } from '@/types'
import SectionTitle from '@/components/ui/SectionTitle'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard: FC = () => (
  <div className="animate-pulse bg-cream">
    <div className="w-full aspect-[4/3] bg-warm" />
    <div className="px-3 pt-3 pb-3 space-y-2">
      <div className="h-2.5 bg-warm rounded w-1/2" />
      <div className="h-4 bg-warm rounded w-3/4" />
      <div className="h-3 bg-warm rounded w-1/3 mt-3" />
    </div>
  </div>
)

// ─── Product card ─────────────────────────────────────────────────────────────

const ProductCard: FC<{ product: ProductDetail; onNavigate: (id: string) => void }> = ({ product, onNavigate }) => (
  <article
    className="product-card bg-cream cursor-pointer group flex h-full flex-col transition-transform duration-300 hover:-translate-y-1"
    aria-label={`View ${product.name}`}
    onClick={() => onNavigate(product.id)}
  >
    <div
      className={cn(
        product.images.length === 0 && product.bgClass,
        'w-full aspect-[4/3] flex items-center justify-center overflow-hidden',
        'transition-transform duration-700 group-hover:scale-105',
      )}
      aria-hidden="true"
    >
      {product.images.length > 0
        ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
        : <span className="text-[clamp(2.5rem,5vw,4rem)]">{product.emoji}</span>
      }
    </div>

    <div className="px-3 pt-3 pb-3 flex flex-1 flex-col">
      <p className="font-body text-tag uppercase tracking-[0.05em] text-muted mb-1">
        {product.category}
      </p>
      <h3
        className="font-display text-base font-normal text-deep mb-2 leading-[1.2]"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 2,
          overflow: 'hidden',
        }}
      >
        {product.name}
      </h3>
      <div className="flex justify-between items-center mt-auto">
        <span className="font-body text-price text-bark">{product.priceDisplay}</span>
        <button
          onClick={e => { e.stopPropagation(); onNavigate(product.id) }}
          className="w-7 h-7 shrink-0 bg-deep text-cream flex items-center justify-center text-lg transition-colors duration-200 group-hover:bg-gold leading-none font-light"
          aria-label={`View ${product.name} details`}
        >
          +
        </button>
      </div>
    </div>
  </article>
)

// ─── Section ──────────────────────────────────────────────────────────────────

interface FeaturedProductsProps {
  title: string
  accent: string
  badge: 'HOT SELLING' | 'TRENDING' | 'NEW ARRIVAL'
  id: string
  warmBackground?: boolean
}

const FeaturedProducts: FC<FeaturedProductsProps> = ({ title, accent, badge, id, warmBackground = false }) => {
  const navigate = useNavigate()
  const headRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>()

  const { data: products = [], isLoading } = useBadgeProducts(badge)

  return (
    <section
      className={`section-p ${warmBackground ? 'bg-warm' : 'bg-cream'}`}
      aria-labelledby={id}
    >
      <div ref={headRef} className="reveal">
        <SectionTitle id={id} className="text-deep">
          {title} <em className="not-italic text-amethyst">{accent}</em>
        </SectionTitle>
      </div>

      <div
        ref={gridRef}
        className="reveal mt-10 grid gap-5
          grid-cols-1
          xs:grid-cols-2
          md:grid-cols-4
        "
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map(p => <ProductCard key={p.id} product={p} onNavigate={id => navigate(`/product/${id}`)} />)
        }
      </div>
    </section>
  )
}

export default FeaturedProducts
