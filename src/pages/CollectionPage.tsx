import { useState, useMemo, useCallback, type FC } from 'react'
import type { ProductCategory, SortOption } from '@/types'
import { COLLECTION_PRODUCTS } from '@/data/collection'

import Navbar         from '@/components/layout/Navbar'
import Footer         from '@/components/layout/Footer'
import CollectionHero from '@/components/collection/CollectionHero'
import FilterBar      from '@/components/collection/FilterBar'
import ProductGrid    from '@/components/collection/ProductGrid'

interface CollectionPageProps {
  wishlistIds: Set<string>
  cartIds: Set<string>
  onToggleWishlist: (id: string) => void
  onAddToCart: (id: string) => void
  onNavigateToProduct: (id: string) => void
}

const CollectionPage: FC<CollectionPageProps> = ({
  wishlistIds,
  cartIds,
  onToggleWishlist,
  onAddToCart,
  onNavigateToProduct,
}) => {
  const [category, setCategory] = useState<ProductCategory>('All')
  const [sort, setSort]         = useState<SortOption>('featured')

  const filteredProducts = useMemo(() => {
    let list = category === 'All'
      ? [...COLLECTION_PRODUCTS]
      : COLLECTION_PRODUCTS.filter(p => p.category === category)

    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price);                                     break
      case 'price-desc': list.sort((a, b) => b.price - a.price);                                     break
      case 'newest':     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));                 break
      case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name));                           break
      default:           list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));   break
    }
    return list
  }, [category, sort])

  return (
    <>
      <Navbar />
      <main id="main-content">
        <CollectionHero />

        <FilterBar
          active={category}
          sort={sort}
          total={filteredProducts.length}
          onCategory={setCategory}
          onSort={setSort}
        />

        <div style={{ padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)' }}>
          <ProductGrid
            products={filteredProducts}
            onSelect={p => onNavigateToProduct(p.id)}
            wishlist={wishlistIds}
            onWishlist={onToggleWishlist}
          />
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
