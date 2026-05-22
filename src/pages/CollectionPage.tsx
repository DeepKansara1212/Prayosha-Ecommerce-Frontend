import { useState, type FC } from 'react'
import type { ProductCategory, SortOption } from '@/types'
import { useProducts } from '@/hooks/useProducts'

import Navbar         from '@/components/layout/Navbar'
import Footer         from '@/components/layout/Footer'
import CollectionHero from '@/components/collection/CollectionHero'
import FilterBar      from '@/components/collection/FilterBar'
import ProductGrid    from '@/components/collection/ProductGrid'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonCard: FC = () => (
  <div className="animate-pulse bg-cream">
    <div className="w-full aspect-square bg-warm" />
    <div className="p-4 border-t border-warm space-y-2.5">
      <div className="h-2 bg-warm rounded w-2/3" />
      <div className="h-4 bg-warm rounded w-3/4" />
      <div className="h-2.5 bg-warm rounded w-1/2" />
      <div className="h-2 bg-warm rounded w-1/3 mt-3" />
    </div>
  </div>
)

// ─── Props ────────────────────────────────────────────────────────────────────

interface CollectionPageProps {
  wishlistIds: Set<string>
  cartIds: Set<string>
  onToggleWishlist: (id: string) => void
  onAddToCart: (id: string) => void
  onNavigateToProduct: (id: string) => void
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CollectionPage: FC<CollectionPageProps> = ({
  wishlistIds,
  onToggleWishlist,
  onNavigateToProduct,
}) => {
  const [category, setCategory] = useState<ProductCategory>('All')
  const [sort, setSort]         = useState<SortOption>('featured')

  const params = {
    category: category !== 'All' ? category : undefined,
    sort,
  }

  const { products, pagination, isLoading, isError } = useProducts(params)

  return (
    <>
      <Navbar />
      <main id="main-content">
        <CollectionHero />

        <FilterBar
          active={category}
          sort={sort}
          total={pagination?.total ?? 0}
          onCategory={setCategory}
          onSort={setSort}
        />

        <div style={{ padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)' }}>
          {isError ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-[3rem] mb-4" aria-hidden="true">⚠️</p>
              <p className="font-display font-light text-[1.4rem] text-bark mb-2">Could not load products</p>
              <p className="font-body font-extralight text-[0.82rem] text-muted">
                Please check your connection and try again.
              </p>
            </div>
          ) : isLoading ? (
            <div className="grid gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <ProductGrid
              products={products}
              onSelect={p => onNavigateToProduct(p.id)}
              wishlist={wishlistIds}
              onWishlist={onToggleWishlist}
            />
          )}
        </div>

        {/* Bottom strip */}
        <div className="border-t border-warm text-center" style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,4rem)' }}>
          <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-3">The Luminae Promise</p>
          <p className="font-display font-light text-[clamp(1.4rem,3vw,2rem)] text-bark max-w-2xl mx-auto leading-relaxed">
            Every stone is hand-selected, certified authentic, and moon-cleansed before it reaches you.
            <em className="italic text-amethyst"> No exceptions.</em>
          </p>
          <div className="flex justify-center gap-8 mt-8 flex-wrap">
            {[
              { icon: '🌍', label: 'Ethically Sourced',  sub: 'Direct mine partnerships' },
              { icon: '✦',  label: 'Certified Authentic', sub: 'Gemologist verified' },
              { icon: '🌙', label: 'Moon-Cleansed',       sub: 'Full moon ritual' },
              { icon: '📦', label: 'Sacred Packaging',    sub: 'Organic cotton & crystal guide' },
            ].map(b => (
              <div key={b.label} className="text-center min-w-[110px]">
                <p className="text-xl mb-2" aria-hidden="true">{b.icon}</p>
                <p className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-bark mb-1">{b.label}</p>
                <p className="font-body font-extralight text-[0.7rem] text-muted">{b.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CollectionPage
