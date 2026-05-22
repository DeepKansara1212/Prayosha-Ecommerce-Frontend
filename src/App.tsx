import { useState, useEffect, useMemo, useCallback, type FC } from 'react'

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
import AboutPage         from '@/pages/AboutPage'
import ContactPage       from '@/pages/ContactPage'
import WishlistPage      from '@/pages/WishlistPage'
import CartPage          from '@/pages/CartPage'

// Auth pages
import LoginPage          from '@/pages/auth/LoginPage'
import RegisterPage       from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'
import ResetPasswordPage  from '@/pages/auth/ResetPasswordPage'

// Account pages
import OrdersPage      from '@/pages/account/OrdersPage'
import OrderDetailPage from '@/pages/account/OrderDetailPage'
import AddressesPage   from '@/pages/account/AddressesPage'
import ProfilePage     from '@/pages/account/ProfilePage'

// Checkout pages
import CheckoutPage        from '@/pages/checkout/CheckoutPage'
import CheckoutSuccessPage from '@/pages/checkout/CheckoutSuccessPage'
import CheckoutFailedPage  from '@/pages/checkout/CheckoutFailedPage'

// Stores
import { useAuthStore }     from '@/store/authStore'
import { useCartStore }     from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

// ─── Router ───────────────────────────────────────────────────────────────────

type Page =
  | 'home'
  | 'collection'
  | 'product'
  | 'auth-login'
  | 'auth-register'
  | 'auth-forgot'
  | 'auth-reset'
  | 'about'
  | 'contact'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'checkout-success'
  | 'checkout-failed'
  | 'account-orders'
  | 'account-order-detail'
  | 'account-addresses'
  | 'account-profile'

function getPage(): { page: Page; param: string | null } {
  const hash = window.location.hash
  if (hash === '#/collection')    return { page: 'collection',    param: null }
  if (hash === '#/auth/login' || hash === '#/auth')
                                  return { page: 'auth-login',    param: null }
  if (hash === '#/auth/register') return { page: 'auth-register', param: null }
  if (hash === '#/auth/forgot')   return { page: 'auth-forgot',   param: null }
  if (hash.startsWith('#/auth/reset'))
                                  return { page: 'auth-reset',    param: null }
  if (hash === '#/about')         return { page: 'about',         param: null }
  if (hash === '#/contact')       return { page: 'contact',       param: null }
  if (hash === '#/wishlist')      return { page: 'wishlist',      param: null }
  if (hash === '#/cart')              return { page: 'cart',             param: null }
  if (hash === '#/checkout')          return { page: 'checkout',         param: null }
  if (hash === '#/checkout/success')  return { page: 'checkout-success', param: null }
  if (hash === '#/checkout/failed')   return { page: 'checkout-failed',  param: null }
  if (hash.startsWith('#/product/')) {
    return { page: 'product', param: hash.replace('#/product/', '') }
  }
  if (hash === '#/account' || hash === '#/account/orders') {
    return { page: 'account-orders',    param: null }
  }
  if (hash.startsWith('#/account/orders/')) {
    return { page: 'account-order-detail', param: hash.replace('#/account/orders/', '') }
  }
  if (hash === '#/account/addresses') return { page: 'account-addresses', param: null }
  if (hash === '#/account/profile')   return { page: 'account-profile',   param: null }
  return { page: 'home', param: null }
}

function navigate(page: Page, id?: string) {
  const hashes: Record<Page, string> = {
    home:                   '',
    collection:             '#/collection',
    'auth-login':           '#/auth/login',
    'auth-register':        '#/auth/register',
    'auth-forgot':          '#/auth/forgot',
    'auth-reset':           '#/auth/reset',
    about:                  '#/about',
    contact:                '#/contact',
    wishlist:               '#/wishlist',
    cart:                   '#/cart',
    checkout:               '#/checkout',
    'checkout-success':     '#/checkout/success',
    'checkout-failed':      '#/checkout/failed',
    product:                `#/product/${id ?? ''}`,
    'account-orders':       '#/account/orders',
    'account-order-detail': `#/account/orders/${id ?? ''}`,
    'account-addresses':    '#/account/addresses',
    'account-profile':      '#/account/profile',
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
  const [{ page, param }, setRoute] = useState(getPage)

  // ── Store slices ──────────────────────────────────────────────────────────
  const fetchMe       = useAuthStore(s => s.fetchMe)
  const accessToken   = useAuthStore(s => s.accessToken)

  const cartItems     = useCartStore(s => s.items)
  const fetchCart     = useCartStore(s => s.fetchCart)
  const addItemStore  = useCartStore(s => s.addItem)
  const updateItemStore  = useCartStore(s => s.updateItem)
  const removeItemStore  = useCartStore(s => s.removeItem)
  const clearCartStore   = useCartStore(s => s.clearCart)

  const wishlistIds_  = useWishlistStore(s => s.productIds)
  const fetchWishlist = useWishlistStore(s => s.fetchWishlist)
  const toggleStore   = useWishlistStore(s => s.toggle)

  // ── Derived sets (stable references via useMemo) ──────────────────────────
  const wishlistIds = useMemo(() => new Set(wishlistIds_), [wishlistIds_])
  const cartIds     = useMemo(() => new Set(cartItems.map(i => i.productId)), [cartItems])

  // ── Bootstrap session on mount ────────────────────────────────────────────
  useEffect(() => {
    // Read current store state without subscribing — avoids re-running on token change
    if (useAuthStore.getState().accessToken) {
      void fetchMe()
      void fetchCart()
      void fetchWishlist()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch when the user logs in during this session (token goes from null → value)
  useEffect(() => {
    if (accessToken) {
      void fetchMe()
      void fetchCart()
      void fetchWishlist()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // ── Hash router ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = () => setRoute(getPage())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  // ── Cart actions ──────────────────────────────────────────────────────────
  const addToCart = useCallback((id: string) => {
    void addItemStore(id, 1)
  }, [addItemStore])

  const updateCartQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) void removeItemStore(id)
    else void updateItemStore(id, qty)
  }, [updateItemStore, removeItemStore])

  const removeFromCart = useCallback((id: string) => {
    void removeItemStore(id)
  }, [removeItemStore])

  const clearCart = useCallback(() => {
    void clearCartStore()
  }, [clearCartStore])

  // ── Wishlist actions ──────────────────────────────────────────────────────
  const toggleWishlist = useCallback((id: string) => {
    void toggleStore(id)
  }, [toggleStore])

  // removeFromWishlist and moveToWishlist both go through toggle
  // (toggle removes when the item is already in the list)
  const removeFromWishlist = useCallback((id: string) => {
    void toggleStore(id)
  }, [toggleStore])

  const moveToWishlist = useCallback((id: string) => {
    void toggleStore(id)
  }, [toggleStore])

  // ── Nav helpers ───────────────────────────────────────────────────────────
  const goCollection = () => navigate('collection')
  const goCart       = () => navigate('cart')
  const goWishlist   = () => navigate('wishlist')
  const goProduct    = (id: string) => navigate('product', id)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <CustomCursor />

      {page === 'home'            && <HomePage />}
      {page === 'about'           && <AboutPage />}
      {page === 'contact'         && <ContactPage />}
      {page === 'auth-login'      && <LoginPage />}
      {page === 'auth-register'   && <RegisterPage />}
      {page === 'auth-forgot'     && <ForgotPasswordPage />}
      {page === 'auth-reset'      && <ResetPasswordPage />}

      {page === 'collection' && (
        <CollectionPage
          wishlistIds={wishlistIds}
          cartIds={cartIds}
          onToggleWishlist={toggleWishlist}
          onAddToCart={addToCart}
          onNavigateToProduct={goProduct}
        />
      )}

      {page === 'product' && param && (
        <ProductDetailPage
          productId={param}
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

      {page === 'checkout'         && <CheckoutPage />}
      {page === 'checkout-success' && <CheckoutSuccessPage />}
      {page === 'checkout-failed'  && <CheckoutFailedPage />}

      {page === 'account-orders'       && <OrdersPage />}
      {page === 'account-order-detail' && param && <OrderDetailPage orderNumber={param} />}
      {page === 'account-addresses'    && <AddressesPage />}
      {page === 'account-profile'      && <ProfilePage />}
    </>
  )
}

export default App
