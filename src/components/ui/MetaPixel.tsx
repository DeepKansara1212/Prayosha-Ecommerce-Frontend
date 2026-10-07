import { useEffect, useRef, useState, type FC } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { OrderSuccessResponse } from '@/api/orders.api'
import { selectTotal, useCartStore } from '@/store/cartStore'
import {
  getMarketingConsent,
  initializeMetaPixel,
  revokeMetaPixelConsent,
  setMarketingConsent,
  subscribeToCookiePreferences,
  subscribeToMarketingConsent,
  trackMetaEvent,
  trackMetaPageView,
  trackMetaPurchaseOnce,
  type MarketingConsent,
} from '@/lib/metaPixel'

const MetaPixel: FC = () => {
  const location = useLocation()
  const cartItems = useCartStore(s => s.items)
  const cartTotal = useCartStore(selectTotal)
  const [consent, setConsent] = useState<MarketingConsent>(getMarketingConsent)
  const [showPreferences, setShowPreferences] = useState(consent === null)
  const checkoutTracked = useRef(false)

  useEffect(() => subscribeToMarketingConsent(() => setConsent(getMarketingConsent())), [])

  useEffect(() => subscribeToCookiePreferences(() => setShowPreferences(true)), [])

  useEffect(() => {
    if (consent === 'granted') initializeMetaPixel()
    else revokeMetaPixelConsent()
  }, [consent])

  useEffect(() => {
    if (location.pathname !== '/checkout') checkoutTracked.current = false
    if (consent !== 'granted' || !initializeMetaPixel()) return

    const isInternalRoute = /^\/(admin|account|auth)(\/|$)/.test(location.pathname)
    if (!isInternalRoute) trackMetaPageView(`${location.pathname}${location.search}`)

    if (location.pathname === '/checkout/success') {
      try {
        const rawOrder = window.sessionStorage.getItem('prayosha_last_order')
        const order = rawOrder ? (JSON.parse(rawOrder) as OrderSuccessResponse).order : null
        if (order) trackMetaPurchaseOnce(order)
      } catch {
        // A malformed or unavailable confirmation payload should not break the page.
      }
    }

    if (location.pathname === '/checkout' && cartItems.length > 0 && !checkoutTracked.current) {
      const contents = cartItems.flatMap(item => item.product?.sku
        ? [{ id: item.product.sku, quantity: item.quantity, item_price: item.priceAtAdd }]
        : [])
      const tracked = trackMetaEvent('InitiateCheckout', {
        value: cartTotal,
        currency: 'INR',
        content_type: 'product',
        content_ids: contents.map(item => item.id),
        contents,
      })
      if (tracked) checkoutTracked.current = true
    }
  }, [consent, location.pathname, location.search, cartItems, cartTotal])

  if (!showPreferences) return null

  const chooseConsent = (choice: Exclude<MarketingConsent, null>) => {
    setMarketingConsent(choice)
    setConsent(choice)
    setShowPreferences(false)
  }

  return (
    <aside
      aria-label="Cookie preferences"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl border border-bark/20 bg-cream p-5 shadow-xl sm:inset-x-6 sm:p-6"
      role="dialog"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="font-body text-sm font-medium text-deep">Optional marketing cookies</p>
          <p className="mt-1 font-body text-xs leading-relaxed text-bark">
            With your permission, Meta Pixel measures visits and shopping actions to help us understand our ads. You can change this choice in our{' '}
            <Link to="/privacy" className="text-deep underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={() => chooseConsent('denied')}
            className="border border-bark/30 px-3 py-2 font-body text-xs text-bark transition-colors hover:border-deep hover:text-deep"
          >
            Reject optional
          </button>
          <button
            type="button"
            onClick={() => chooseConsent('granted')}
            className="bg-deep px-3 py-2 font-body text-xs text-cream transition-colors hover:bg-bark"
          >
            Accept optional
          </button>
        </div>
      </div>
    </aside>
  )
}

export default MetaPixel