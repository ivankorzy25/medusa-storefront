import Medusa from "@medusajs/js-sdk"

// Initialize Medusa client
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
})

// Default region ID for USD (United States)
const DEFAULT_REGION_ID = "reg_01K95YRJHQC630D0FZWYZPST3S"

/**
 * Fetch a product by its handle from Medusa API
 */
export async function getProductByHandle(handle: string, regionId: string = DEFAULT_REGION_ID) {
  try {
    const response = await medusa.store.product.list({
      handle,
      region_id: regionId,
      fields: "*variants,*variants.calculated_price,*images,*metadata",
    })

    if (!response.products || response.products.length === 0) {
      return null
    }

    return response.products[0]
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

/**
 * Convert Medusa price from cents to dollars
 */
export function convertCentsToDollars(cents: number): number {
  return cents / 100
}

/**
 * Get the price for a variant (handles calculated_price structure)
 */
export function getVariantPrice(variant: any) {
  const calculatedPrice = variant.calculated_price

  if (!calculatedPrice) {
    return { priceWithoutTax: 0, priceWithTax: 0, currency: "USD" }
  }

  // Medusa stores prices in cents, convert to dollars
  const priceWithoutTax = convertCentsToDollars(
    calculatedPrice.calculated_amount || 0
  )
  const priceWithTax = convertCentsToDollars(
    calculatedPrice.calculated_amount_with_tax || calculatedPrice.calculated_amount || 0
  )

  return {
    priceWithoutTax,
    priceWithTax,
    currency: calculatedPrice.currency_code?.toUpperCase() || "USD",
  }
}
