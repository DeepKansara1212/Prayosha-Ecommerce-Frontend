import { useState, useMemo, useCallback, type FC, type FormEvent } from 'react'
import Navbar  from '@/components/layout/Navbar'
import Footer  from '@/components/layout/Footer'
import { COLLECTION_PRODUCTS } from '@/data/collection'
import { cn } from '@/lib/utils'
import type { ProductDetail } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string
  quantity: number
}

interface CartPageProps {
  items: CartItem[]
  wishlistIds: Set<string>
  onUpdateQty: (productId: string, qty: number) => void
  onRemoveItem: (productId: string) => void
  onMoveToWishlist: (productId: string) => void
  onNavigateToCollection: () => void
  onNavigateToWishlist: () => void
  onClearCart: () => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SHIPPING_THRESHOLD = 999
const SHIPPING_COST      = 149
const TAX_RATE           = 0.18

const VALID_PROMOS: Record<string, number> = {
  LUMINAE10: 0.10,
  MOON20:    0.20,
  CRYSTAL15: 0.15,
}

// ─── Empty cart ───────────────────────────────────────────────────────────────

const EmptyCart: FC<{ onBrowse: () => void }> = ({ onBrowse }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-6">
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 rounded-full bg-gold/10 animate-pulse" aria-hidden="true" />
      <div className="relative w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#B8956A" strokeWidth="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
    </div>
    <h2 className="font-display font-light text-[1.8rem] text-deep mb-2">Your cart is empty</h2>
    <p className="font-body font-extralight text-[0.82rem] text-muted max-w-xs leading-relaxed mb-7">
      The perfect crystal is waiting for you. Browse our ethically sourced collection and find your stone.
    </p>
    <button
      onClick={onBrowse}
      className="font-body text-[0.7rem] uppercase tracking-[0.22em] bg-deep text-cream px-8 py-4 hover:bg-bark transition-colors duration-200"
    >
      Browse Collection
    </button>
  </div>
)

// ─── Cart line item ───────────────────────────────────────────────────────────

interface CartLineProps {
  product: ProductDetail
  qty: number
  inWishlist: boolean
  onQtyChange: (q: number) => void
  onRemove: () => void
  onMoveToWishlist: () => void
}

const CartLine: FC<CartLineProps> = ({ product, qty, inWishlist, onQtyChange, onRemove, onMoveToWishlist }) => {
  const [removing, setRemoving] = useState(false)

  const handleRemove = () => {
    setRemoving(true)
    setTimeout(onRemove, 350)
  }

  return (
    <div
      className={cn(
        'flex gap-4 sm:gap-6 py-6 border-b border-warm last:border-0 transition-all duration-350',
        removing && 'opacity-0 translate-x-4',
      )}
    >
      {/* Product image */}
      <div
        className={cn(product.bgClass, 'w-20 h-20 sm:w-24 sm:h-24 flex-none flex items-center justify-center text-[2rem] sm:text-[2.5rem] cursor-pointer flex-shrink-0')}
        aria-hidden="true"
      >
        {product.emoji}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <div className="min-w-0">
            <p className="font-body text-[0.58rem] uppercase tracking-[0.2em] text-muted mb-0.5">{product.category}</p>
            <h3 className="font-display text-[1.1rem] font-normal text-deep leading-tight truncate">{product.name}</h3>
            <p className="font-body font-extralight text-[0.7rem] text-muted mt-0.5 line-clamp-1">{product.subtitle}</p>
          </div>
          <button
            onClick={handleRemove}
            className="flex-none text-muted hover:text-rose transition-colors duration-200 p-1"
            aria-label={`Remove ${product.name} from cart`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
            </svg>
          </button>
        </div>

        {/* Chakra + origin pills */}
        <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
          <span className="font-body text-[0.55rem] uppercase tracking-[0.15em] px-2 py-1 bg-warm text-muted">{product.chakra} Chakra</span>
          <span className="font-body text-[0.55rem] uppercase tracking-[0.15em] px-2 py-1 bg-warm text-muted">{product.origin}</span>
        </div>

        {/* Price + qty + wishlist row */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Qty stepper */}
          <div className="flex items-center border border-warm">
            <button
              onClick={() => onQtyChange(Math.max(1, qty - 1))}
              className="w-8 h-8 flex items-center justify-center text-bark hover:bg-warm transition-colors text-sm"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span
              className="w-8 text-center font-body text-[0.8rem] text-bark"
              aria-live="polite"
              aria-label={`Quantity: ${qty}`}
            >
              {qty}
            </span>
            <button
              onClick={() => onQtyChange(Math.min(product.stockCount, qty + 1))}
              className="w-8 h-8 flex items-center justify-center text-bark hover:bg-warm transition-colors text-sm"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Line total */}
          <span className="font-display text-[1.1rem] font-light text-deep">
            ₹{(product.price * qty).toLocaleString('en-IN')}
          </span>

          {/* Move to wishlist */}
          <button
            onClick={onMoveToWishlist}
            className={cn(
              'flex items-center gap-1.5 font-body text-[0.62rem] uppercase tracking-[0.15em] transition-colors duration-200',
              inWishlist ? 'text-rose' : 'text-muted hover:text-rose',
            )}
            aria-label={inWishlist ? 'Already in wishlist' : `Save ${product.name} to wishlist`}
          >
            <svg viewBox="0 0 20 18" className="w-3.5 h-3.5" fill={inWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M10 16.5S1 11 1 5.5A4.5 4.5 0 0 1 10 3.2 4.5 4.5 0 0 1 19 5.5C19 11 10 16.5 10 16.5Z" />
            </svg>
            {inWishlist ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Promo code input ─────────────────────────────────────────────────────────

interface PromoProps {
  onApply: (discount: number, code: string) => void
  applied: string
  onClear: () => void
}

const PromoCode: FC<PromoProps> = ({ onApply, applied, onClear }) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const handleApply = async (e: FormEvent) => {
    e.preventDefault()
    if (!code.trim()) { setError('Enter a promo code.'); return }
    setChecking(true)
    await new Promise(r => setTimeout(r, 700))
    setChecking(false)
    const disc = VALID_PROMOS[code.trim().toUpperCase()]
    if (disc) {
      onApply(disc, code.trim().toUpperCase())
      setError('')
    } else {
      setError('Invalid or expired promo code.')
    }
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between bg-sage/10 border border-sage/30 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 20 20" className="w-4 h-4 text-sage flex-none" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16.5 7.5 8 16l-4-4 1.5-1.5L8 13l7-7 1.5 1.5Z"/></svg>
          <span className="font-body text-[0.72rem] text-sage">
            Code <strong>{applied}</strong> applied
          </span>
        </div>
        <button onClick={onClear} className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-muted hover:text-rose transition-colors">
          Remove
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleApply} aria-label="Apply promo code">
      <label htmlFor="promo" className="block font-body text-[0.65rem] uppercase tracking-[0.2em] text-muted mb-2">
        Promo Code
      </label>
      <div className="flex gap-0">
        <input
          id="promo"
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError('') }}
          placeholder="e.g. MOON20"
          className="flex-1 min-w-0 font-body text-[0.8rem] text-deep bg-cream border border-warm border-r-0 px-4 py-3 outline-none focus:border-gold transition-colors placeholder:text-muted/40 uppercase"
          aria-describedby={error ? 'promo-error' : undefined}
        />
        <button
          type="submit"
          disabled={checking}
          className="font-body text-[0.65rem] uppercase tracking-[0.15em] px-5 py-3 bg-bark text-cream hover:bg-deep transition-colors duration-200 whitespace-nowrap flex-none"
        >
          {checking ? '…' : 'Apply'}
        </button>
      </div>
      {error && (
        <p id="promo-error" role="alert" className="mt-1.5 font-body text-[0.68rem] text-rose">{error}</p>
      )}
      <p className="mt-1.5 font-body text-[0.62rem] text-muted/60">Try: LUMINAE10 · MOON20 · CRYSTAL15</p>
    </form>
  )
}

// ─── Order summary ────────────────────────────────────────────────────────────

interface SummaryProps {
  subtotal: number
  promoDiscount: number
  promoCode: string
  onPromoApply: (disc: number, code: string) => void
  onPromoClear: () => void
  onCheckout: () => void
  itemCount: number
}

const OrderSummary: FC<SummaryProps> = ({
  subtotal, promoDiscount, promoCode,
  onPromoApply, onPromoClear, onCheckout, itemCount,
}) => {
  const discountAmount = subtotal * promoDiscount
  const discountedSubtotal = subtotal - discountAmount
  const shipping = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = discountedSubtotal * TAX_RATE
  const total = discountedSubtotal + shipping + tax

  const freeShippingRemaining = SHIPPING_THRESHOLD - discountedSubtotal
  const freeShippingPct = Math.min(100, (discountedSubtotal / SHIPPING_THRESHOLD) * 100)

  return (
    <div className="bg-warm p-6 sm:p-7 sticky top-24">
      <h2 className="font-display font-light text-[1.3rem] text-deep mb-5">Order Summary</h2>

      {/* Free shipping progress */}
      {shipping > 0 && (
        <div className="mb-5 pb-5 border-b border-warm/60">
          <div className="flex justify-between items-center mb-2">
            <p className="font-body text-[0.68rem] text-muted">
              Add <span className="text-bark font-normal">₹{Math.ceil(freeShippingRemaining).toLocaleString('en-IN')}</span> for free shipping
            </p>
            <span className="font-body text-[0.62rem] text-muted">{Math.round(freeShippingPct)}%</span>
          </div>
          <div className="h-1 bg-warm rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${freeShippingPct}%` }}
              role="progressbar"
              aria-valuenow={Math.round(freeShippingPct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progress toward free shipping"
            />
          </div>
        </div>
      )}
      {shipping === 0 && (
        <div className="mb-5 pb-5 border-b border-warm/60 flex items-center gap-2 text-sage">
          <svg viewBox="0 0 20 20" className="w-4 h-4 flex-none" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16.5 7.5 8 16l-4-4 1.5-1.5L8 13l7-7 1.5 1.5Z"/></svg>
          <p className="font-body text-[0.68rem] uppercase tracking-[0.12em]">Free shipping unlocked!</p>
        </div>
      )}

      {/* Line items */}
      <div className="space-y-3 mb-5">
        <div className="flex justify-between">
          <span className="font-body text-[0.75rem] text-muted">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-body text-[0.8rem] text-bark">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        {promoDiscount > 0 && (
          <div className="flex justify-between text-sage">
            <span className="font-body text-[0.75rem]">Discount ({promoCode})</span>
            <span className="font-body text-[0.8rem]">−₹{Math.round(discountAmount).toLocaleString('en-IN')}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="font-body text-[0.75rem] text-muted">Shipping</span>
          <span className="font-body text-[0.8rem] text-bark">
            {shipping === 0 ? <span className="text-sage">Free</span> : `₹${shipping}`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-body text-[0.75rem] text-muted">GST (18%)</span>
          <span className="font-body text-[0.8rem] text-bark">₹{Math.round(tax).toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Promo code */}
      <div className="mb-5 pb-5 border-b border-warm/60">
        <PromoCode onApply={onPromoApply} applied={promoCode} onClear={onPromoClear} />
      </div>

      {/* Total */}
      <div className="flex justify-between items-baseline mb-6">
        <span className="font-body text-[0.75rem] uppercase tracking-[0.15em] text-muted">Total</span>
        <span className="font-display text-[1.6rem] font-light text-deep">₹{Math.round(total).toLocaleString('en-IN')}</span>
      </div>

      {/* Checkout button */}
      <button
        onClick={onCheckout}
        className="w-full font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 bg-deep text-cream hover:bg-bark transition-colors duration-200 mb-3"
        aria-label="Proceed to checkout"
      >
        Proceed to Checkout
      </button>
      <button className="w-full font-body text-[0.72rem] uppercase tracking-[0.22em] py-4 border border-deep text-deep hover:bg-warm transition-colors duration-200">
        Buy with UPI / GPay
      </button>

      {/* Trust signals */}
      <div className="mt-5 pt-5 border-t border-warm/60 grid grid-cols-3 gap-3">
        {[['🔒','Secure payment'],['📦','Free returns'],['✦','Authentic']].map(([icon, label]) => (
          <div key={label} className="text-center">
            <p className="text-base mb-1" aria-hidden="true">{icon}</p>
            <p className="font-body text-[0.55rem] uppercase tracking-[0.1em] text-muted leading-tight">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Checkout success ─────────────────────────────────────────────────────────

const CheckoutSuccess: FC<{ onContinue: () => void }> = ({ onContinue }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-6">
    <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center mx-auto mb-6">
      <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="#6A8570" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
    <p className="font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold mb-3">
      ✦ &nbsp;Order Placed
    </p>
    <h2 className="font-display font-light text-[2rem] text-deep mb-2 leading-tight">
      Thank you for your<br /><em className="italic text-amethyst">sacred order</em>
    </h2>
    <p className="font-body font-extralight text-[0.82rem] text-muted max-w-xs leading-relaxed mt-3 mb-8">
      Your crystals have been moon-cleansed and are being wrapped in sacred packaging. You'll receive a confirmation email shortly.
    </p>
    <div className="flex gap-8 justify-center mb-10 flex-wrap">
      {[['📦','Packed with intention'],['🌙','Moon-cleansed'],['✦','Certified authentic']].map(([icon, label]) => (
        <div key={label} className="text-center">
          <p className="text-xl mb-1.5" aria-hidden="true">{icon}</p>
          <p className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-muted">{label}</p>
        </div>
      ))}
    </div>
    <button
      onClick={onContinue}
      className="font-body text-[0.7rem] uppercase tracking-[0.22em] bg-deep text-cream px-8 py-4 hover:bg-bark transition-colors duration-200"
    >
      Continue Shopping
    </button>
  </div>
)

// ─── Main CartPage ────────────────────────────────────────────────────────────

const CartPage: FC<CartPageProps> = ({
  items,
  wishlistIds,
  onUpdateQty,
  onRemoveItem,
  onMoveToWishlist,
  onNavigateToCollection,
  onNavigateToWishlist,
  onClearCart,
}) => {
  const [promoDiscount, setPromoDiscount] = useState(0)
  const [promoCode, setPromoCode]         = useState('')
  const [checkedOut, setCheckedOut]       = useState(false)

  // Resolve products from IDs
  const cartProducts: Array<{ product: ProductDetail; qty: number }> = useMemo(
    () =>
      items
        .map(item => ({
          product: COLLECTION_PRODUCTS.find(p => p.id === item.productId)!,
          qty: item.quantity,
        }))
        .filter(({ product }) => Boolean(product)),
    [items],
  )

  const subtotal = useMemo(
    () => cartProducts.reduce((acc, { product, qty }) => acc + product.price * qty, 0),
    [cartProducts],
  )

  const itemCount = useMemo(
    () => cartProducts.reduce((acc, { qty }) => acc + qty, 0),
    [cartProducts],
  )

  const handleCheckout = useCallback(() => {
    setCheckedOut(true)
    onClearCart()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [onClearCart])

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-cream">

        {/* Page header */}
        <div
          className="relative overflow-hidden flex flex-col items-center justify-center text-center"
          style={{
            paddingTop: 'clamp(5.5rem,12vw,8rem)',
            paddingBottom: 'clamp(2.5rem,5vw,4rem)',
            paddingLeft: 'clamp(1.25rem,5vw,4rem)',
            paddingRight: 'clamp(1.25rem,5vw,4rem)',
            background: 'radial-gradient(ellipse at 50% 0%, #2A3D2F 0%, #1A251E 50%, #1C1410 100%)',
          }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 800 300" fill="none" aria-hidden="true">
            <polygon points="400,20 760,140 760,260 400,280 40,260 40,140" stroke="#B8956A" strokeWidth="0.8" fill="none" />
            <circle cx="400" cy="150" r="100" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.4" />
          </svg>
          <div className="absolute top-0 right-1/3 w-56 h-56 rounded-full pointer-events-none" style={{ background: '#6A8570', opacity: 0.15, filter: 'blur(70px)' }} aria-hidden="true" />

          <div className="relative z-10">
            <p className="inline-flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-4">
              <span className="w-7 h-px bg-gold-light" aria-hidden="true" />
              Your Cart
              <span className="w-7 h-px bg-gold-light" aria-hidden="true" />
            </p>
            <h1 className="font-display font-light text-[clamp(2rem,6vw,3.5rem)] leading-[1.05] text-cream mb-3">
              Your sacred <em className="italic text-sage">selection</em>
            </h1>
            {cartProducts.length > 0 && !checkedOut && (
              <p className="font-body font-extralight text-[0.8rem] text-cream/55">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} · ₹{subtotal.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>

        {/* Cart content */}
        <div style={{ padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)' }}>
          {checkedOut ? (
            <CheckoutSuccess onContinue={() => { setCheckedOut(false); onNavigateToCollection() }} />
          ) : cartProducts.length === 0 ? (
            <EmptyCart onBrowse={onNavigateToCollection} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

              {/* Cart items */}
              <div>
                {/* Breadcrumb nav */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-warm">
                  <p className="font-body text-[0.72rem] text-muted">
                    <span className="text-bark font-normal">{cartProducts.length}</span> {cartProducts.length === 1 ? 'item' : 'items'} in your cart
                  </p>
                  <div className="flex gap-3">
                    {wishlistIds.size > 0 && (
                      <button
                        onClick={onNavigateToWishlist}
                        className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-muted hover:text-bark transition-colors flex items-center gap-1.5"
                        aria-label={`View wishlist (${wishlistIds.size} items)`}
                      >
                        <svg viewBox="0 0 20 18" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M10 16.5S1 11 1 5.5A4.5 4.5 0 0 1 10 3.2 4.5 4.5 0 0 1 19 5.5C19 11 10 16.5 10 16.5Z" />
                        </svg>
                        Wishlist ({wishlistIds.size})
                      </button>
                    )}
                    <button
                      onClick={onNavigateToCollection}
                      className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-gold hover:text-gold-light transition-colors"
                    >
                      + Add more
                    </button>
                  </div>
                </div>

                {/* Line items */}
                <div>
                  {cartProducts.map(({ product, qty }) => (
                    <CartLine
                      key={product.id}
                      product={product}
                      qty={qty}
                      inWishlist={wishlistIds.has(product.id)}
                      onQtyChange={q => onUpdateQty(product.id, q)}
                      onRemove={() => onRemoveItem(product.id)}
                      onMoveToWishlist={() => onMoveToWishlist(product.id)}
                    />
                  ))}
                </div>

                {/* Upsell strip */}
                <div className="mt-8 pt-8 border-t border-warm">
                  <p className="font-body text-[0.62rem] uppercase tracking-[0.28em] text-gold mb-4">
                    You might also love
                  </p>
                  <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {COLLECTION_PRODUCTS
                      .filter(p => !items.some(i => i.productId === p.id) && p.isBestseller)
                      .slice(0, 4)
                      .map(p => (
                        <div key={p.id} className="flex-none w-32 cursor-pointer group">
                          <div className={cn(p.bgClass, 'w-32 h-32 flex items-center justify-center text-3xl mb-2 transition-transform duration-300 group-hover:scale-105')} aria-hidden="true">
                            {p.emoji}
                          </div>
                          <p className="font-display text-[0.85rem] font-light text-deep leading-tight truncate">{p.name}</p>
                          <p className="font-body text-[0.72rem] text-muted">{p.priceDisplay}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <OrderSummary
                subtotal={subtotal}
                promoDiscount={promoDiscount}
                promoCode={promoCode}
                onPromoApply={(disc, code) => { setPromoDiscount(disc); setPromoCode(code) }}
                onPromoClear={() => { setPromoDiscount(0); setPromoCode('') }}
                onCheckout={handleCheckout}
                itemCount={itemCount}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CartPage
