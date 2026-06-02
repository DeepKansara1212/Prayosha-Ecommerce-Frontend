import { apiClient } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroBanner {
  _id: string
  imageUrl: string
  imagePublicId: string
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BannerFormData {
  image?: File
  title?: string
  subtitle?: string
  ctaText?: string
  ctaLink?: string
  order?: number
  isActive?: boolean
}

// ─── Public ───────────────────────────────────────────────────────────────────

export async function getActiveBanners(): Promise<HeroBanner[]> {
  const res = await apiClient.get<{ data: { banners: HeroBanner[] } }>('/hero-banners')
  return res.data.data.banners
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export async function getAllBannersAdmin(): Promise<HeroBanner[]> {
  const res = await apiClient.get<{ data: { banners: HeroBanner[] } }>('/admin/hero-banners')
  return res.data.data.banners
}

export async function createBanner(data: BannerFormData): Promise<HeroBanner> {
  const form = new FormData()
  if (data.image) form.append('image', data.image)
  if (data.title) form.append('title', data.title)
  if (data.subtitle) form.append('subtitle', data.subtitle)
  if (data.ctaText) form.append('ctaText', data.ctaText)
  if (data.ctaLink) form.append('ctaLink', data.ctaLink)
  if (data.order !== undefined) form.append('order', String(data.order))
  if (data.isActive !== undefined) form.append('isActive', String(data.isActive))

  const res = await apiClient.post<{ data: { banner: HeroBanner } }>('/admin/hero-banners', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data.banner
}

export async function updateBanner(id: string, data: BannerFormData): Promise<HeroBanner> {
  const form = new FormData()
  if (data.image) form.append('image', data.image)
  if (data.title !== undefined) form.append('title', data.title)
  if (data.subtitle !== undefined) form.append('subtitle', data.subtitle)
  if (data.ctaText !== undefined) form.append('ctaText', data.ctaText)
  if (data.ctaLink !== undefined) form.append('ctaLink', data.ctaLink)
  if (data.order !== undefined) form.append('order', String(data.order))
  if (data.isActive !== undefined) form.append('isActive', String(data.isActive))

  const res = await apiClient.patch<{ data: { banner: HeroBanner } }>(`/admin/hero-banners/${id}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.data.banner
}

export async function toggleBanner(id: string): Promise<HeroBanner> {
  const res = await apiClient.patch<{ data: { banner: HeroBanner } }>(`/admin/hero-banners/${id}/toggle`)
  return res.data.data.banner
}

export async function reorderBanners(items: Array<{ id: string; order: number }>): Promise<HeroBanner[]> {
  const res = await apiClient.patch<{ data: { banners: HeroBanner[] } }>('/admin/hero-banners/reorder', { items })
  return res.data.data.banners
}

export async function deleteBanner(id: string): Promise<void> {
  await apiClient.delete(`/admin/hero-banners/${id}`)
}
