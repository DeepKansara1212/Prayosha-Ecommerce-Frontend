import { useMemo, useCallback, useEffect, Suspense, lazy, type FC } from 'react'
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom'

import CustomCursor from '@/components/ui/CustomCursor'
import ToastContainer from '@/components/ui/Toast'
import WhatsAppChatButton from '@/components/ui/WhatsAppChatButton'
import Navbar   from '@/components/layout/Navbar'
import Footer   from '@/components/layout/Footer'

// Sections (home page)
import Hero             from '@/components/sections/Hero'
import Marquee          from '@/components/sections/Marquee'
import Collections      from '@/components/sections/Collections'
import Benefits         from '@/components/sections/Benefits'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import Testimonials     from '@/components/sections/Testimonials'

// Route chunks
const CollectionPage = lazy(() => import('@/pages/CollectionPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const AboutPage = lazy(() => import('@/pages/AboutPage'))
const ContactPage = lazy(() => import('@/pages/ContactPage'))
const WishlistPage = lazy(() => import('@/pages/WishlistPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const BraceletCalculatorPage = lazy(() => import('@/pages/BraceletCalculatorPage'))
const RudrakshaCalculatorPage = lazy(() => import('@/pages/RudrakshaCalculatorPage'))
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'))
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'))
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'))
const AddressesPage = lazy(() => import('@/pages/account/AddressesPage'))
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'))
const RewardsPage = lazy(() => import('@/pages/account/RewardsPage'))
const CheckoutPage = lazy(() => import('@/pages/checkout/CheckoutPage'))
const CheckoutSuccessPage = lazy(() => import('@/pages/checkout/CheckoutSuccessPage'))
const CheckoutFailedPage = lazy(() => import('@/pages/checkout/CheckoutFailedPage'))
const BlogPage = lazy(() => import('@/pages/BlogPage'))
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const B2BPage = lazy(() => import('@/pages/B2BPage'))
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'))
const HeroBannersPage = lazy(() => import('@/pages/admin/HeroBannersPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

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
      <Testimonials />
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

const RouteFallback: FC = () => (
  <div style={{
    minHeight: '50vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Jost, sans-serif',
    fontSize: 12,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#6B6057',
  }}>
    Loading…
  </div>
)

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
      <WhatsAppChatButton />

      <Suspense fallback={<RouteFallback />}>
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

          {/* Astrology calculators */}
          <Route path="/bracelet-calculator"  element={<BraceletCalculatorPage />} />
          <Route path="/rudraksha-calculator" element={<RudrakshaCalculatorPage />} />

          {/* Static pages */}
          <Route path="/about"   element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/b2b"     element={<B2BPage />} />
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
          <Route path="/account/rewards"       element={<RewardsPage />} />
          <Route path="/account/addresses"     element={<AddressesPage />} />
          <Route path="/account/profile"       element={<ProfilePage />} />

          {/* Blog */}
          <Route path="/blog" element={
            <BlogPage onNavigateToPost={(slug) => navigate(`/blog/${slug}`)} />
          } />
          <Route path="/blog/:slug" element={<BlogPostRoute />} />

          {/* Admin */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboardPage />
            </AdminLayout>
          } />
          <Route path="/admin/hero-banners" element={
            <AdminLayout>
              <HeroBannersPage />
            </AdminLayout>
          } />

          {/* Legacy hash-style redirects */}
          <Route path="/wishlist" element={<Navigate to="/account/wishlist" replace />} />

          {/* 404 fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
