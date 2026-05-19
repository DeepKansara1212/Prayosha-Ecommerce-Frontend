import type { FC } from 'react'
import { PRODUCTS } from '@/data'
import SectionLabel from '@/components/ui/SectionLabel'
import SectionTitle from '@/components/ui/SectionTitle'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'
import type { Product } from '@/types'

const ProductCard: FC<{ product: Product }> = ({ product }) => (
  <article
    className="product-card bg-cream cursor-pointer group transition-transform duration-300 hover:-translate-y-1"
    aria-label={product.name}
  >
    {/* Image / gem area */}
    <div
      className={cn(
        product.bgClass,
        'w-full aspect-square flex items-center justify-center',
        'text-[clamp(2.5rem,5vw,4rem)]',
      )}
      aria-hidden="true"
    >
      {product.emoji}
    </div>

    {/* Info */}
    <div className="px-4 pt-4 pb-5">
      <p className="font-body text-tag uppercase tracking-[0.22em] text-muted mb-1">
        {product.type}
      </p>
      <h3 className="font-display text-[1.1rem] font-normal text-deep mb-3">
        {product.name}
      </h3>
      <div className="flex justify-between items-center">
        <span className="font-body text-price text-bark">{product.price}</span>
        <button
          className="w-7 h-7 bg-deep text-cream flex items-center justify-center text-lg transition-colors duration-200 group-hover:bg-gold leading-none font-light"
          aria-label={`Add ${product.name} to cart`}
        >
          +
        </button>
      </div>
    </div>
  </article>
)

const FeaturedProducts: FC = () => {
  const headRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>()

  return (
    <section
      className="section-p bg-warm"
      aria-labelledby="featured-title"
    >
      <div ref={headRef} className="reveal">
        <SectionLabel>Hand-Picked</SectionLabel>
        <SectionTitle id="featured-title" className="text-deep">
          New <em className="italic text-amethyst">Arrivals</em>
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
        {PRODUCTS.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export default FeaturedProducts
