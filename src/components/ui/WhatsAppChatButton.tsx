import { useState, useEffect, useRef, useCallback, type FC } from 'react'
import { useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicSettings } from '@/api/settings.api'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toTitleCase(slug: string): string {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function buildDefaultMessage(pathname: string, customOverride?: string): string {
  if (customOverride?.trim()) return customOverride.trim()

  const productMatch = pathname.match(/^\/product\/(.+)$/)
  if (productMatch) {
    const name = toTitleCase(productMatch[1])
    return `Hi! I'm interested in ${name} and have a question.`
  }
  if (pathname === '/cart') return "Hi! I have a question about my cart."
  if (pathname === '/checkout') return "Hi! I need help completing my order."

  const orderMatch = pathname.match(/^\/account\/orders\/(.+)$/)
  if (orderMatch) return `Hi! I have a question about my order #${orderMatch[1]}.`

  return "Hi! I need help with something on Prayosha Crystal."
}

// ─── WhatsApp Icon ────────────────────────────────────────────────────────────

const WhatsAppIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    fill="white"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
)

// ─── WhatsAppChatButton ───────────────────────────────────────────────────────

const WhatsAppChatButton: FC = () => {
  const location = useLocation()
  const [cardOpen, setCardOpen] = useState(false)
  const [message, setMessage]   = useState('')
  const fabRef      = useRef<HTMLButtonElement>(null)
  const cardRef     = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const headingId   = 'wa-chat-heading'

  const { data: settings } = useQuery({
    queryKey: ['public-settings'],
    queryFn: getPublicSettings,
    staleTime: 5 * 60 * 1000,
  })

  // Update default message when route or settings change
  useEffect(() => {
    setMessage(buildDefaultMessage(location.pathname, settings?.whatsappDefaultMessage))
  }, [location.pathname, settings?.whatsappDefaultMessage])

  // Hide on admin routes or when number is not configured
  const isAdmin        = location.pathname.startsWith('/admin')
  const whatsappNumber = settings?.whatsappNumber?.trim() ?? ''

  // Close on Escape
  useEffect(() => {
    if (!cardOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCardOpen(false)
        fabRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [cardOpen])

  // Trap focus into textarea when card opens; return to FAB when it closes
  useEffect(() => {
    if (cardOpen) {
      setTimeout(() => textareaRef.current?.focus(), 50)
    } else {
      fabRef.current?.focus()
    }
  }, [cardOpen])

  // Close on outside click
  useEffect(() => {
    if (!cardOpen) return
    const handler = (e: MouseEvent) => {
      if (
        cardRef.current && !cardRef.current.contains(e.target as Node) &&
        fabRef.current  && !fabRef.current.contains(e.target as Node)
      ) {
        setCardOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [cardOpen])

  const startChat = useCallback(() => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [whatsappNumber, message])

  if (isAdmin || !whatsappNumber) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      style={{ fontFamily: "'Jost', sans-serif" }}
    >
      {/* ── Chat Card ── */}
      {cardOpen && (
        <div
          ref={cardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          className={cn(
            'bg-white rounded-2xl shadow-2xl border p-5 w-[min(340px,calc(100vw-3rem))]',
            'animate-fadeUp',
          )}
          style={{ borderColor: '#E2DAC8' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2
                id={headingId}
                className="font-display text-deep text-[1.1rem] leading-tight"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1C1A17' }}
              >
                Chat with us on WhatsApp
              </h2>
              <p className="font-body text-[0.72rem] mt-0.5" style={{ color: '#9E9590' }}>
                Typically replies within minutes
              </p>
            </div>
            <button
              onClick={() => { setCardOpen(false); fabRef.current?.focus() }}
              aria-label="Close chat"
              className="flex-none w-7 h-7 flex items-center justify-center rounded-full bg-transparent border-none cursor-pointer"
              style={{ color: '#9E9590' }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Editable message */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full font-body text-[0.82rem] border rounded-lg px-3 py-2.5 outline-none resize-none placeholder:text-muted/40 transition-colors"
            style={{
              fontFamily: "'Jost', sans-serif",
              color: '#1C1A17',
              borderColor: '#E2DAC8',
              background: '#F5F0E8',
            }}
            aria-label="Message to send on WhatsApp"
          />

          {/* Start Chat button */}
          <button
            onClick={startChat}
            className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-lg font-body text-[0.78rem] uppercase tracking-[0.12em] text-white transition-all duration-200"
            style={{ background: '#25D366', border: 'none', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1ebe57' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#25D366' }}
          >
            <WhatsAppIcon />
            Start Chat
          </button>
        </div>
      )}

      {/* ── FAB ── */}
      <div className="relative">
        {/* Always-online dot — 24/7 support */}
        <span
          className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white z-10"
          aria-label="Support is available"
          title="We're available 24/7"
        />
        <button
          ref={fabRef}
          onClick={() => setCardOpen((o) => !o)}
          aria-label="Chat with us on WhatsApp"
          aria-expanded={cardOpen}
          aria-haspopup="dialog"
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-none cursor-pointer',
            'transition-all duration-200 motion-safe:hover:scale-105',
          )}
          style={{ background: '#25D366', minWidth: 56, minHeight: 56 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1ebe57' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#25D366' }}
        >
          <WhatsAppIcon />
        </button>
      </div>
    </div>
  )
}

export default WhatsAppChatButton
