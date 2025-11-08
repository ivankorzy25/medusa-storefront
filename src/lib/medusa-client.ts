import Medusa from "@medusajs/js-sdk"

// Initialize Medusa client
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
})

// Default region ID for Europe (EUR) - región existente en Medusa
const DEFAULT_REGION_ID = "reg_01K9FZ96V1AT4PGR95NE8VYZ8N"

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
 * Fallback: If calculated_price is null, fetch price directly from variant
 */
export async function getVariantPrice(variant: any) {
  const calculatedPrice = variant.calculated_price

  // If calculated_price exists, use it
  if (calculatedPrice && calculatedPrice.calculated_amount) {
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

  // Fallback: Try to get price from variant's price data
  // This happens when calculated_price is null
  try {
    // For CS200A, we know the price is $26,411 USD (updated from PDF Lista #1083)
    // In a real scenario, we would fetch this from the database
    // For now, hardcode it as a temporary solution
    if (variant.sku === "GEN-CS200A-STD") {
      return {
        priceWithoutTax: 26411,
        priceWithTax: 26411,
        currency: "USD",
      }
    }

    // Default fallback
    return { priceWithoutTax: 0, priceWithTax: 0, currency: "USD" }
  } catch (error) {
    console.error("Error getting variant price:", error)
    return { priceWithoutTax: 0, priceWithTax: 0, currency: "USD" }
  }
}
