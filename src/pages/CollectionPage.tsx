import { useState, type FC } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ProductCategory, SortOption } from '@/types'
import { useProducts } from '@/hooks/useProducts'

import Navbar         from '@/components/layout/Navbar'
import Footer         from '@/components/layout/Footer'
import CollectionHero from '@/components/collection/CollectionHero'
import FilterBar      from '@/components/collection/FilterBar'
import ProductGrid    from '@/components/collection/ProductGrid'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import EmptyState from '@/components/ui/EmptyState'
import { toast } from '@/store/toastStore'

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
  onAddToCart,
}) => {
  const navigate = useNavigate()
  const [category, setCategory] = useState<ProductCategory>('All')
  const [sort, setSort]         = useState<SortOption>('featured')

  const params = {
    category: category !== 'All' ? category : undefined,
    sort,
  }

  const { products, pagination, isLoading, isError } = useProducts(params)

  const handleAddToCart = (id: string) => {
    onAddToCart(id)
    toast.success('Added to cart')
  }

  const handleToggleWishlist = (id: string) => {
    const wasIn = wishlistIds.has(id)
    onToggleWishlist(id)
    toast.info(wasIn ? 'Removed from wishlist' : 'Saved to wishlist')
  }

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
            <EmptyState
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>}
              title="Could not load products"
              description="Please check your connection and try again."
              actionLabel="Retry"
              onAction={() => window.location.reload()}
            />
          ) : isLoading ? (
            <div className="grid gap-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" /></svg>}
              title="No crystals found"
              description="Try adjusting your filters or browsing all categories."
              actionLabel="Clear Filters"
              onAction={() => setCategory('All')}
            />
          ) : (
            <ProductGrid
              products={products}
              onSelect={p => onNavigateToProduct(p.id)}
              wishlist={wishlistIds}
              onWishlist={handleToggleWishlist}
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

          <button
            onClick={() => navigate('/about')}
            className="mt-8 font-body text-[0.7rem] uppercase tracking-[0.2em] border border-bark text-bark px-8 py-3.5 hover:bg-bark hover:text-cream transition-all duration-200 min-h-[44px]"
          >
            Our Story
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CollectionPage
