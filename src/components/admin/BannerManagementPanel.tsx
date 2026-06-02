import {
  useState,
  useEffect,
  useRef,
  type FC,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { cn } from '@/lib/utils'
import {
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  toggleBanner,
  deleteBanner,
  reorderBanners,
  type HeroBanner,
  type BannerFormData,
} from '@/api/heroBanner.api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  order: string
  isActive: boolean
  imageFile: File | null
  imagePreview: string | null
}

const EMPTY_FORM: FormState = {
  title: '',
  subtitle: '',
  ctaText: '',
  ctaLink: '',
  order: '0',
  isActive: true,
  imageFile: null,
  imagePreview: null,
}

export interface BannerStats {
  total: number
  active: number
  hidden: number
}

interface Props {
  onStatsChange?: (stats: BannerStats) => void
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const FieldLabel: FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="block font-body text-[10px] tracking-[0.15em] uppercase text-cream/40 mb-1.5">
    {children}
  </label>
)

const TextInput: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
  <input
    {...props}
    className={cn(
      'w-full bg-[#1a1a1a] border border-cream/10 text-cream/80 font-body text-xs px-3 py-2.5',
      'placeholder:text-cream/20 focus:outline-none focus:border-gold/40 transition-colors',
      className,
    )}
  />
)

// ─── BannerManagementPanel ────────────────────────────────────────────────────

const BannerManagementPanel: FC<Props> = ({ onStatsChange }) => {
  const [banners, setBanners] = useState<HeroBanner[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<HeroBanner | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  const [deleteTarget, setDeleteTarget] = useState<HeroBanner | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Stats sync ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!onStatsChange) return
    const active = banners.filter(b => b.isActive).length
    onStatsChange({ total: banners.length, active, hidden: banners.length - active })
  }, [banners, onStatsChange])

  // ── Load ────────────────────────────────────────────────────────────────────
  const load = async () => {
    setLoading(true)
    try {
      setBanners(await getAllBannersAdmin())
    } catch {
      flash('error', 'Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  // ── Toast ───────────────────────────────────────────────────────────────────
  const flash = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 3500)
  }

  // ── Modal ───────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (b: HeroBanner) => {
    setEditTarget(b)
    setForm({
      title: b.title ?? '',
      subtitle: b.subtitle ?? '',
      ctaText: b.ctaText ?? '',
      ctaLink: b.ctaLink ?? '',
      order: String(b.order),
      isActive: b.isActive,
      imageFile: null,
      imagePreview: b.imageUrl,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTarget(null)
    setForm(EMPTY_FORM)
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setForm(f => ({ ...f, imageFile: file, imagePreview: URL.createObjectURL(file) }))
  }

  const onField = (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  // ── Submit ──────────────────────────────────────────────────────────────────
  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!editTarget && !form.imageFile) { flash('error', 'Please upload a banner image'); return }
    setSaving(true)
    try {
      const payload: BannerFormData = {
        title: form.title || undefined,
        subtitle: form.subtitle || undefined,
        ctaText: form.ctaText || undefined,
        ctaLink: form.ctaLink || undefined,
        order: parseInt(form.order, 10) || 0,
        isActive: form.isActive,
        ...(form.imageFile ? { image: form.imageFile } : {}),
      }
      if (editTarget) {
        const updated = await updateBanner(editTarget._id, payload)
        setBanners(bs => bs.map(b => (b._id === updated._id ? updated : b)))
        flash('success', 'Banner updated')
      } else {
        const created = await createBanner(payload)
        setBanners(bs => [...bs, created].sort((a, b) => a.order - b.order))
        flash('success', 'Banner created')
      }
      closeModal()
    } catch (err: unknown) {
      flash('error', err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  // ── Toggle ──────────────────────────────────────────────────────────────────
  const onToggle = async (b: HeroBanner) => {
    try {
      const updated = await toggleBanner(b._id)
      setBanners(bs => bs.map(x => (x._id === updated._id ? updated : x)))
    } catch { flash('error', 'Toggle failed') }
  }

  // ── Delete ──────────────────────────────────────────────────────────────────
  const onDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteBanner(deleteTarget._id)
      setBanners(bs => bs.filter(b => b._id !== deleteTarget._id))
      setDeleteTarget(null)
      flash('success', 'Banner deleted')
    } catch { flash('error', 'Delete failed') }
    finally { setDeleting(false) }
  }

  // ── Reorder ─────────────────────────────────────────────────────────────────
  const swap = async (banner: HeroBanner, direction: 'up' | 'down') => {
    const idx = banners.findIndex(b => b._id === banner._id)
    const sibIdx = direction === 'up' ? idx - 1 : idx + 1
    if (sibIdx < 0 || sibIdx >= banners.length) return
    const sib = banners[sibIdx]
    try {
      const updated = await reorderBanners([
        { id: banner._id, order: sib.order },
        { id: sib._id, order: banner.order },
      ])
      setBanners(updated)
    } catch { flash('error', 'Reorder failed') }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Toolbar ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <p className="font-body text-xs text-cream/35 tracking-wide">
          {loading ? 'Loading…' : `${banners.length} banner${banners.length !== 1 ? 's' : ''} total`}
        </p>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gold text-deep font-body text-xs tracking-widest uppercase font-medium hover:bg-gold/90 transition-colors"
        >
          <svg viewBox="0 0 16 16" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M8 3v10M3 8h10" strokeLinecap="round" />
          </svg>
          Add Banner
        </button>
      </div>

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={cn(
            'mb-4 flex items-center gap-2.5 px-4 py-3 font-body text-xs',
            toast.type === 'success'
              ? 'bg-emerald-900/30 border border-emerald-500/20 text-emerald-400'
              : 'bg-rose-900/30 border border-rose-500/20 text-rose-400',
          )}
        >
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
            {toast.type === 'success' ? (
              <path d="M3 8l3.5 3.5L13 4" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <path d="M8 5v4M8 11v1" strokeLinecap="round" />
                <circle cx="8" cy="8" r="6" />
              </>
            )}
          </svg>
          {toast.msg}
        </div>
      )}

      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[0, 1, 2].map(i => (
            <div key={i} className="bg-[#141414] border border-cream/6 animate-pulse">
              <div className="aspect-[16/7] bg-cream/5" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-cream/8 w-2/3 rounded" />
                <div className="h-2.5 bg-cream/5 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-cream/10">
          <div className="w-12 h-12 border border-cream/10 flex items-center justify-center mb-4">
            <svg viewBox="0 0 20 20" className="w-5 h-5 text-cream/20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="5" width="16" height="10" rx="1" />
              <path d="M6 10h8" strokeLinecap="round" />
            </svg>
          </div>
          <p className="font-body text-sm text-cream/30">No banners yet</p>
          <p className="font-body text-xs text-cream/20 mt-1">Click "Add Banner" to create the first slide</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {banners.map((banner, idx) => (
            <div
              key={banner._id}
              className={cn(
                'bg-[#141414] border transition-colors group',
                banner.isActive ? 'border-cream/8' : 'border-cream/4 opacity-60',
              )}
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/7] bg-[#0a0a0a] overflow-hidden">
                <img
                  src={banner.imageUrl}
                  alt={banner.title ?? `Banner ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className={cn(
                    'font-body text-[9px] tracking-[0.15em] uppercase px-2 py-1',
                    banner.isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                      : 'bg-cream/5 text-cream/30 border border-cream/10',
                  )}>
                    {banner.isActive ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="font-body text-[9px] tracking-widest bg-deep/60 backdrop-blur-sm text-cream/50 border border-cream/10 px-2 py-1">
                    #{banner.order}
                  </span>
                </div>
              </div>

              {/* Meta */}
              <div className="p-4">
                <div className="mb-3 min-h-[2.5rem]">
                  {banner.title
                    ? <p className="font-display text-sm text-cream/80 truncate">{banner.title}</p>
                    : <p className="font-body text-xs text-cream/20 italic">No title</p>
                  }
                  {banner.subtitle && (
                    <p className="font-body text-[11px] text-cream/40 truncate mt-0.5">{banner.subtitle}</p>
                  )}
                  {banner.ctaText && (
                    <span className="inline-block mt-2 font-body text-[9px] tracking-[0.15em] uppercase text-gold/60 bg-gold/5 border border-gold/10 px-2 py-0.5">
                      CTA: {banner.ctaText}
                    </span>
                  )}
                </div>

                {/* Action bar */}
                <div className="flex items-center gap-1 pt-3 border-t border-cream/6">
                  <button onClick={() => void swap(banner, 'up')} disabled={idx === 0}
                    className="p-2 text-cream/30 hover:text-cream/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move up">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 12V4M4 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button onClick={() => void swap(banner, 'down')} disabled={idx === banners.length - 1}
                    className="p-2 text-cream/30 hover:text-cream/70 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    aria-label="Move down">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M8 4v8M12 9l-4 4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <div className="flex-1" />

                  <button onClick={() => void onToggle(banner)}
                    className={cn('p-2 transition-colors', banner.isActive
                      ? 'text-emerald-400/70 hover:text-emerald-400'
                      : 'text-cream/25 hover:text-cream/60')}
                    aria-label={banner.isActive ? 'Deactivate' : 'Activate'}>
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      {banner.isActive
                        ? <path d="M2 8a6 6 0 1012 0A6 6 0 002 8zm4 0l1.5 1.5L10 6" strokeLinecap="round" strokeLinejoin="round" />
                        : <path d="M2 8a6 6 0 1012 0A6 6 0 002 8zm3-1h5M8 7v4" strokeLinecap="round" strokeLinejoin="round" />
                      }
                    </svg>
                  </button>

                  <button onClick={() => openEdit(banner)}
                    className="p-2 text-cream/35 hover:text-gold/70 transition-colors" aria-label="Edit">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M11 2l3 3-8 8H3v-3L11 2z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  <button onClick={() => setDeleteTarget(banner)}
                    className="p-2 text-cream/25 hover:text-rose-400 transition-colors" aria-label="Delete">
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5L11 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ───────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-deep/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-[#141414] border border-cream/10 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream/8">
              <div>
                <h2 className="font-display text-base text-cream tracking-wide">
                  {editTarget ? 'Edit Banner' : 'New Banner'}
                </h2>
                <p className="font-body text-[10px] text-cream/30 mt-0.5">
                  {editTarget ? 'Update details below' : 'Upload an image and configure the slide'}
                </p>
              </div>
              <button onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center text-cream/30 hover:text-cream/70 hover:bg-cream/5 transition-colors">
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <form onSubmit={(e) => { void onSubmit(e) }}
              className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* Image */}
              <div>
                <FieldLabel>
                  Banner Image {!editTarget && <span className="text-rose-400">*</span>}
                </FieldLabel>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    'relative border-2 border-dashed cursor-pointer transition-colors',
                    form.imagePreview ? 'border-gold/20' : 'border-cream/10 hover:border-cream/20',
                  )}
                >
                  {form.imagePreview ? (
                    <div className="relative aspect-[16/7] overflow-hidden">
                      <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-deep/40 opacity-0 hover:opacity-100 transition-opacity">
                        <span className="font-body text-xs text-cream tracking-wider">Change Image</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[16/7] flex flex-col items-center justify-center gap-2 text-cream/20">
                      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <p className="font-body text-xs">Click to upload</p>
                      <p className="font-body text-[10px] text-cream/15">JPG, PNG, WebP — max 5 MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                  className="sr-only" onChange={onImageChange} />
              </div>

              {/* Title */}
              <div>
                <FieldLabel>Title <span className="text-cream/20 normal-case">(optional overlay)</span></FieldLabel>
                <TextInput placeholder="e.g. Discover Crystal Energy" value={form.title} onChange={onField('title')} />
              </div>

              {/* Subtitle */}
              <div>
                <FieldLabel>Subtitle <span className="text-cream/20 normal-case">(optional tagline)</span></FieldLabel>
                <TextInput placeholder="e.g. New Arrivals 2026" value={form.subtitle} onChange={onField('subtitle')} />
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>CTA Button Text</FieldLabel>
                  <TextInput placeholder="Shop Now" value={form.ctaText} onChange={onField('ctaText')} />
                </div>
                <div>
                  <FieldLabel>CTA Link</FieldLabel>
                  <TextInput placeholder="/collection" value={form.ctaLink} onChange={onField('ctaLink')} />
                </div>
              </div>

              {/* Order + Active */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <FieldLabel>Display Order</FieldLabel>
                  <TextInput type="number" min="0" placeholder="0" value={form.order} onChange={onField('order')} />
                </div>
                <div className="pb-0.5">
                  <div
                    onClick={() => setForm(f => ({ ...f, isActive: !f.isActive }))}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div className={cn(
                      'relative w-9 h-5 rounded-full transition-colors',
                      form.isActive ? 'bg-gold' : 'bg-cream/15',
                    )}>
                      <div className={cn(
                        'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                        form.isActive ? 'translate-x-4' : 'translate-x-0.5',
                      )} />
                    </div>
                    <span className="font-body text-xs text-cream/50">
                      {form.isActive ? 'Active (live)' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-cream/8 bg-[#111]">
              <button type="button" onClick={closeModal}
                className="px-5 py-2.5 font-body text-xs text-cream/40 hover:text-cream/70 tracking-wider transition-colors">
                Cancel
              </button>
              <button
                onClick={(e) => { void onSubmit(e as unknown as FormEvent) }}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gold text-deep font-body text-xs tracking-widest uppercase font-medium hover:bg-gold/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving && (
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create Banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation ───────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep/80 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-sm bg-[#141414] border border-cream/10 shadow-2xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-9 h-9 shrink-0 bg-rose-900/20 border border-rose-500/20 flex items-center justify-center">
                <svg viewBox="0 0 16 16" className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M8 5v4M8 11v1" strokeLinecap="round" />
                  <circle cx="8" cy="8" r="6" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-sm text-cream mb-1">Delete Banner?</h3>
                <p className="font-body text-xs text-cream/40 leading-relaxed">
                  This permanently removes the banner and deletes its image from Cloudinary. Cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 font-body text-xs text-cream/40 hover:text-cream/70 transition-colors">
                Cancel
              </button>
              <button onClick={() => void onDelete()} disabled={deleting}
                className="flex items-center gap-2 px-5 py-2 bg-rose-500/90 text-white font-body text-xs tracking-widest uppercase hover:bg-rose-500 disabled:opacity-50 transition-colors">
                {deleting && (
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default BannerManagementPanel
