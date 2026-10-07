import type { Order } from '@/api/orders.api'

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push?: MetaPixelFunction
  loaded?: boolean
  version?: string
}

declare global {
  interface Window {
    fbq?: MetaPixelFunction
    _fbq?: MetaPixelFunction
  }
}

export type MarketingConsent = 'granted' | 'denied' | null

const CONSENT_KEY = 'prayosha_marketing_consent'
const CONSENT_CHANGE_EVENT = 'prayosha:marketing-consent-change'
const PREFERENCES_EVENT = 'prayosha:cookie-preferences'

let activePixelId: string | null = null
let lastPageView: string | null = null
let sessionConsent: MarketingConsent = null

export function getMarketingConsent(): MarketingConsent {
  try {
    const consent = window.localStorage.getItem(CONSENT_KEY)
    if (consent === 'granted' || consent === 'denied') return consent
    return sessionConsent
  } catch {
    return sessionConsent
  }
}

export function setMarketingConsent(consent: Exclude<MarketingConsent, null>): void {
  sessionConsent = consent
  try {
    window.localStorage.setItem(CONSENT_KEY, consent)
  } catch {
    // Keep the choice active for this page even when storage is unavailable.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT))
}

export function requestCookiePreferences(): void {
  window.dispatchEvent(new Event(PREFERENCES_EVENT))
}

export function subscribeToMarketingConsent(callback: () => void): () => void {
  window.addEventListener(CONSENT_CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CONSENT_CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

export function subscribeToCookiePreferences(callback: () => void): () => void {
  window.addEventListener(PREFERENCES_EVENT, callback)
  return () => window.removeEventListener(PREFERENCES_EVENT, callback)
}

export function initializeMetaPixel(): boolean {
  const pixelId = import.meta.env.VITE_META_PIXEL_ID?.trim()
  if (!pixelId || getMarketingConsent() !== 'granted') return false

  if (!window.fbq) {
    const fbq: MetaPixelFunction = (...args) => {
      if (fbq.callMethod) fbq.callMethod(...args)
      else fbq.queue.push(args)
    }
    fbq.queue = []
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    window.fbq = fbq
    window._fbq = fbq

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
  }

  if (activePixelId !== pixelId) {
    window.fbq('init', pixelId)
    activePixelId = pixelId
  }
  window.fbq('consent', 'grant')
  return true
}

export function revokeMetaPixelConsent(): void {
  if (activePixelId && window.fbq) window.fbq('consent', 'revoke')
  document.cookie = '_fbp=; Max-Age=0; path=/; SameSite=Lax'
  document.cookie = '_fbc=; Max-Age=0; path=/; SameSite=Lax'
}

export function trackMetaEvent(
  eventName: string,
  parameters: Record<string, unknown> = {},
  eventId?: string,
): boolean {
  if (!activePixelId || !window.fbq || getMarketingConsent() !== 'granted') return false
  if (eventId) window.fbq('track', eventName, parameters, { eventID: eventId })
  else window.fbq('track', eventName, parameters)
  return true
}

export function trackMetaPageView(page: string): void {
  if (lastPageView === page) return
  if (trackMetaEvent('PageView')) lastPageView = page
}

export function trackMetaPurchaseOnce(order: Order): void {
  const storageKey = `prayosha_meta_purchase_${order.orderNumber}`
  try {
    if (window.localStorage.getItem(storageKey)) return
  } catch {
    // Continue with event-ID deduplication if storage is unavailable.
  }

  const tracked = trackMetaEvent('Purchase', {
    value: order.total,
    currency: 'INR',
    content_type: 'product',
    content_ids: order.items.map(item => item.sku),
    contents: order.items.map(item => ({
      id: item.sku,
      quantity: item.quantity,
      item_price: item.price,
    })),
  }, order.orderNumber)

  if (tracked) {
    try {
      window.localStorage.setItem(storageKey, '1')
    } catch {
      // The Meta event has still been queued for delivery.
    }
  }
}