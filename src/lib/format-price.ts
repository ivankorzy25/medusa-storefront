/**
 * Formats a price in USD with proper formatting
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Formats a price with IVA (21% tax)
 */
export function formatPriceWithIVA(priceWithoutIVA: number, currency: string = "USD"): {
  priceWithoutIVA: string
  priceWithIVA: string
  iva: string
} {
  const ivaAmount = priceWithoutIVA * 0.21
  const priceWithIVA = priceWithoutIVA + ivaAmount

  return {
    priceWithoutIVA: formatPrice(priceWithoutIVA, currency),
    priceWithIVA: formatPrice(priceWithIVA, currency),
    iva: formatPrice(ivaAmount, currency),
  }
}
