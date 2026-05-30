import { useMemo, useCallback, useEffect, type FC } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'

import CustomCursor from '@/components/ui/CustomCursor'
import ToastContainer from '@/components/ui/Toast'
import Navbar   from '@/components/layout/Navbar'
import Footer   from '@/components/layout/Footer'

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

// Blog pages
import BlogPage     from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'

// Legal pages
import TermsPage   from '@/pages/TermsPage'
import PrivacyPage from '@/pages/PrivacyPage'

// 404
import NotFoundPage from '@/pages/NotFoundPage'

// Stores
import { useAuthStore }     from '@/store/authStore'
import { useCartStore }     from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'

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

// ─── Route wrappers that need URL params ─────────────────────────────────────

interface ProductRouteProps {
  wishlistIds: Set<string>
  cartIds: Set<string>
  onToggleWishlist: (id: string) => void
  onAddToCart: (id: string) => void
}

const ProductRoute: FC<ProductRouteProps> = ({ wishlistIds, cartIds, onToggleWishlist, onAddToCart }) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  if (!id) return <Navigate to="/collection" replace />

  return (
    <ProductDetailPage
      productId={id}
      wishlistIds={wishlistIds}
      cartIds={cartIds}
      onToggleWishlist={onToggleWishlist}
      onAddToCart={onAddToCart}
      onNavigateToCollection={() => navigate('/collection')}
      onNavigateToProduct={(pid) => navigate(`/product/${pid}`)}
      onNavigateToCart={() => navigate('/cart')}
    />
  )
}

const BlogPostRoute: FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  if (!slug) return <Navigate to="/blog" replace />

  return (
    <BlogPostPage
      slug={slug}
      onNavigateToJournal={() => navigate('/blog')}
      onNavigateToPost={(s) => navigate(`/blog/${s}`)}
    />
  )
}

const OrderDetailRoute: FC = () => {
  const { num } = useParams<{ num: string }>()
  if (!num) return <Navigate to="/account/orders" replace />
  return <OrderDetailPage orderNumber={num} />
}

// ─── App ──────────────────────────────────────────────────────────────────────

const App: FC = () => {
  const navigate = useNavigate()

  // ── Store slices ──────────────────────────────────────────────────────────
  const fetchMe     = useAuthStore(s => s.fetchMe)
  const accessToken = useAuthStore(s => s.accessToken)

  const cartItems      = useCartStore(s => s.items)
  const fetchCart      = useCartStore(s => s.fetchCart)
  const addItemStore   = useCartStore(s => s.addItem)
  const updateItemStore   = useCartStore(s => s.updateItem)
  const removeItemStore   = useCartStore(s => s.removeItem)
  const clearCartStore    = useCartStore(s => s.clearCart)

  const wishlistIds_ = useWishlistStore(s => s.productIds)
  const fetchWishlist = useWishlistStore(s => s.fetchWishlist)
  const toggleStore   = useWishlistStore(s => s.toggle)

  // ── Derived sets ──────────────────────────────────────────────────────────
  const wishlistIds = useMemo(() => new Set(wishlistIds_), [wishlistIds_])
  const cartIds     = useMemo(() => new Set(cartItems.map(i => i.productId)), [cartItems])

  // ── Bootstrap session on mount ────────────────────────────────────────────
  useEffect(() => {
    if (useAuthStore.getState().accessToken) {
      void fetchMe()
      void fetchCart()
      void fetchWishlist()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (accessToken) {
      void fetchMe()
      void fetchCart()
      void fetchWishlist()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

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

  const removeFromWishlist = useCallback((id: string) => {
    void toggleStore(id)
  }, [toggleStore])

  const moveToWishlist = useCallback((id: string) => {
    void toggleStore(id)
  }, [toggleStore])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <CustomCursor />
      <ToastContainer />

      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />

        {/* Shop */}
        <Route path="/collection" element={
          <CollectionPage
            wishlistIds={wishlistIds}
            cartIds={cartIds}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onNavigateToProduct={(id) => navigate(`/product/${id}`)}
          />
        } />
        <Route path="/product/:id" element={
          <ProductRoute
            wishlistIds={wishlistIds}
            cartIds={cartIds}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
          />
        } />

        {/* Static pages */}
        <Route path="/about"   element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms"   element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Auth */}
        <Route path="/auth/login"    element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot"   element={<ForgotPasswordPage />} />
        <Route path="/auth/reset"    element={<ResetPasswordPage />} />

        {/* Cart & Wishlist */}
        <Route path="/account/wishlist" element={
          <WishlistPage
            wishlistIds={wishlistIds}
            cartIds={cartIds}
            onRemoveFromWishlist={removeFromWishlist}
            onMoveToCart={(id) => { addToCart(id); navigate('/cart') }}
            onNavigateToCollection={() => navigate('/collection')}
            onNavigateToCart={() => navigate('/cart')}
          />
        } />
        <Route path="/cart" element={
          <CartPage
            items={cartItems}
            wishlistIds={wishlistIds}
            onUpdateQty={updateCartQty}
            onRemoveItem={removeFromCart}
            onMoveToWishlist={moveToWishlist}
            onNavigateToCollection={() => navigate('/collection')}
            onNavigateToWishlist={() => navigate('/account/wishlist')}
            onClearCart={clearCart}
          />
        } />

        {/* Checkout */}
        <Route path="/checkout"         element={<CheckoutPage />} />
        <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        <Route path="/checkout/failed"  element={<CheckoutFailedPage />} />

        {/* Account */}
        <Route path="/account"               element={<Navigate to="/account/orders" replace />} />
        <Route path="/account/orders"        element={<OrdersPage />} />
        <Route path="/account/orders/:num"   element={<OrderDetailRoute />} />
        <Route path="/account/addresses"     element={<AddressesPage />} />
        <Route path="/account/profile"       element={<ProfilePage />} />

        {/* Blog */}
        <Route path="/blog" element={
          <BlogPage onNavigateToPost={(slug) => navigate(`/blog/${slug}`)} />
        } />
        <Route path="/blog/:slug" element={<BlogPostRoute />} />

        {/* Legacy hash-style redirects */}
        <Route path="/wishlist" element={<Navigate to="/account/wishlist" replace />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App
