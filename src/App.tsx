import { useState, useEffect, useCallback, type FC } from 'react'

import CustomCursor from '@/components/ui/CustomCursor'
import Navbar       from '@/components/layout/Navbar'
import Footer       from '@/components/layout/Footer'

// Sections (home page)
import Hero             from '@/components/sections/Hero'
import Marquee          from '@/components/sections/Marquee'
import Collections      from '@/components/sections/Collections'
import Benefits         from '@/components/sections/Benefits'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import RitualBanner     from '@/components/sections/RitualBanner'
import Testimonials     from '@/components/sections/Testimonials'
import Newsletter       from '@/components/sections/Newsletter'

// Pages
import CollectionPage    from '@/pages/CollectionPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import AuthPage          from '@/pages/AuthPage'
import AboutPage         from '@/pages/AboutPage'
import ContactPage       from '@/pages/ContactPage'
import WishlistPage      from '@/pages/WishlistPage'
import CartPage, { type CartItem } from '@/pages/CartPage'

// ─── Router ───────────────────────────────────────────────────────────────────

type Page =
  | 'home'
  | 'collection'
  | 'product'
  | 'auth'
  | 'about'
  | 'contact'
  | 'wishlist'
  | 'cart'

function getPage(): { page: Page; productId: string | null } {
  const hash = window.location.hash
  if (hash === '#/collection') return { page: 'collection', productId: null }
  if (hash === '#/auth')       return { page: 'auth',       productId: null }
  if (hash === '#/about')      return { page: 'about',      productId: null }
  if (hash === '#/contact')    return { page: 'contact',    productId: null }
  if (hash === '#/wishlist')   return { page: 'wishlist',   productId: null }
  if (hash === '#/cart')       return { page: 'cart',       productId: null }
  if (hash.startsWith('#/product/')) {
    return { page: 'product', productId: hash.replace('#/product/', '') }
  }
  return { page: 'home', productId: null }
}

function navigate(page: Page, id?: string) {
  const hashes: Record<Page, string> = {
    home: '', collection: '#/collection', auth: '#/auth',
    about: '#/about', contact: '#/contact', wishlist: '#/wishlist', cart: '#/cart',
    product: `#/product/${id ?? ''}`,
  }
  window.location.hash = hashes[page]
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ─── Home page ────────────────────────────────────────────────────────────────

const HomePage: FC = () => (
  <>
    <Navbar />
    <main id="main-content">
      <Hero />
      <Marquee />
      <Collections />
      <Benefits />
      <FeaturedProducts />
      <RitualBanner />
      <Testimonials />
      <Newsletter />
    </main>
    <Footer />
  </>
)

// ─── App ──────────────────────────────────────────────────────────────────────

const App: FC = () => {
  const [{ page, productId }, setRoute] = useState(getPage)

  useEffect(() => {
    const handler = () => setRoute(getPage())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())

  const toggleWishlist = useCallback((id: string) => {
    setWishlistIds(prev => {
      const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s
    })
  }, [])

  const removeFromWishlist = useCallback((id: string) => {
    setWishlistIds(prev => { const s = new Set(prev); s.delete(id); return s })
  }, [])

  // ── Cart ──────────────────────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const cartIds = new Set(cartItems.map(i => i.productId))

  const addToCart = useCallback((productId: string) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.productId === productId)
      return ex
        ? prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { productId, quantity: 1 }]
    })
  }, [])

  const updateCartQty = useCallback((productId: string, qty: number) => {
    setCartItems(prev =>
      qty <= 0
        ? prev.filter(i => i.productId !== productId)
        : prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i),
    )
  }, [])

  const removeFromCart  = useCallback((id: string) => setCartItems(p => p.filter(i => i.productId !== id)), [])
  const clearCart       = useCallback(() => setCartItems([]), [])
  const moveToWishlist  = useCallback((id: string) => toggleWishlist(id), [toggleWishlist])

  // ── Shared nav helpers ────────────────────────────────────────────────────
  const goCollection = () => navigate('collection')
  const goCart       = () => navigate('cart')
  const goWishlist   = () => navigate('wishlist')
  const goProduct    = (id: string) => navigate('product', id)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <CustomCursor />

      {page === 'home'    && <HomePage />}
      {page === 'about'   && <AboutPage />}
      {page === 'contact' && <ContactPage />}
      {page === 'auth'    && <AuthPage />}

      {page === 'collection' && (
        <CollectionPage
          wishlistIds={wishlistIds}
          cartIds={cartIds}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onNavigateToProduct={goProduct}
        />
      )}

      {page === 'product' && productId && (
        <ProductDetailPage
          productId={productId}
          wishlistIds={wishlistIds}
          cartIds={cartIds}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onNavigateToCollection={goCollection}
          onNavigateToProduct={goProduct}
          onNavigateToCart={goCart}
        />
      )}

      {page === 'wishlist' && (
        <WishlistPage
          wishlistIds={wishlistIds}
          cartIds={cartIds}
          onRemoveFromWishlist={removeFromWishlist}
          onMoveToCart={id => { addToCart(id); goCart() }}
          onNavigateToCollection={goCollection}
          onNavigateToCart={goCart}
        />
      )}

      {page === 'cart' && (
        <CartPage
          items={cartItems}
          wishlistIds={wishlistIds}
          onUpdateQty={updateCartQty}
          onRemoveItem={removeFromCart}
          onMoveToWishlist={moveToWishlist}
          onNavigateToCollection={goCollection}
          onNavigateToWishlist={goWishlist}
          onClearCart={clearCart}
        />
      )}
    </>
  )
}

export default App
