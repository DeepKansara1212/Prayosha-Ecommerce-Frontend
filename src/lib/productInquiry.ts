export function getProductInquiryUrl(
  product: { name: string; sku?: string; id: string },
  whatsappNumber?: string,
): string {
  const productUrl = new URL(`/product/${encodeURIComponent(product.id)}`, window.location.origin).toString()
  const productLabel = product.sku ? `${product.name} (SKU: ${product.sku})` : product.name
  const message = `Hi! I'd like to enquire about ${productLabel}.\n${productUrl}`
  const phone = whatsappNumber?.replace(/\D/g, '')

  if (phone) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  const params = new URLSearchParams({ product: product.name, productUrl })
  return `/contact?${params.toString()}`
}

export function hasWhatsAppNumber(value?: string): boolean {
  return Boolean(value?.replace(/\D/g, ''))
}
