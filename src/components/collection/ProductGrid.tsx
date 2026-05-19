import type { FC } from 'react'
import type { ProductDetail } from '@/types'
import ProductCard from './ProductCard'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface ProductGridProps {
  products: ProductDetail[]
  onSelect: (p: ProductDetail) => void
  wishlist: Set<string>
  onWishlist: (id: string) => void
}

const EmptyState: FC = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <p className="text-[3rem] mb-4" aria-hidden="true">🔮</p>
    <p className="font-display font-light text-[1.4rem] text-bark mb-2">No stones found</p>
    <p className="font-body font-extralight text-[0.82rem] text-muted">
      Try a different category or reset your filters
    </p>
  </div>
)

const ProductGrid: FC<ProductGridProps> = ({ products, onSelect, wishlist, onWishlist }) => {
  const ref = useScrollReveal<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className="reveal grid gap-5
        grid-cols-1
        xs:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-4
      "
    >
      {products.length === 0
        ? <EmptyState />
        : products.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelect}
              wishlisted={wishlist.has(p.id)}
              onWishlist={onWishlist}
            />
          ))
      }
    </div>
  )
}

export default ProductGrid
