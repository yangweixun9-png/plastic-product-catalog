export function formatPrice(price, lang = "zh") {
  if (price === null || price === undefined || price === "") {
    return lang === "en" ? "Price TBC" : "价格待确认"
  }
  const value = Number(price)
  if (Number.isNaN(value)) return lang === "en" ? "Price TBC" : "价格待确认"
  const amount = value.toLocaleString(lang === "en" ? "en-US" : "zh-CN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return `¥${amount}`
}

export function getVariants(product) {
  if (!product) return []
  if (product.variants?.length) return product.variants
  return [product]
}

export function getVariant(product, index = 0) {
  const variants = getVariants(product)
  return variants[index] || variants[0] || null
}

export function variantImages(variant) {
  if (!variant) return []
  if (variant.images?.length) return variant.images
  if (variant.image) return [variant.image]
  return []
}

export function firstImage(product, variant) {
  const current = variant || getVariant(product, 0)
  return variantImages(current)[0] || ""
}

export function displayPrice(item, lang = "zh") {
  if (!item) return lang === "en" ? "Price TBC" : "价格待确认"
  const source = item.pricePending != null || item.price != null || item.sku
    ? item
    : getVariant(item, 0)
  if (!source || source.pricePending || source.price === null || source.price === "") {
    return lang === "en" ? "Price TBC" : "价格待确认"
  }
  return formatPrice(source.price, lang)
}

export function lowestPricedVariant(product) {
  const priced = getVariants(product).filter((item) => !item.pricePending && item.price != null)
  if (!priced.length) return getVariant(product, 0)
  return [...priced].sort((a, b) => a.price - b.price)[0]
}

export function productHref(product, variant) {
  const id = product?.id || product?.sku || ""
  const sku = variant?.sku || variant?.specId
  if (sku && sku !== id) return `/products/${encodeURIComponent(id)}?sku=${encodeURIComponent(variant.specId || variant.sku)}`
  return `/products/${encodeURIComponent(id)}`
}

export function findProduct(products, code) {
  const value = decodeURIComponent(code || "").toLowerCase()
  if (!value) return null
  return (
    products.find((item) => String(item.id).toLowerCase() === value) ||
    products.find((item) =>
      getVariants(item).some(
        (variant) =>
          String(variant.sku).toLowerCase() === value ||
          String(variant.specId || "").toLowerCase() === value,
      ),
    ) ||
    null
  )
}

export function findVariantIndex(product, code) {
  if (!code) return 0
  const value = decodeURIComponent(code).toLowerCase()
  const index = getVariants(product).findIndex(
    (variant) =>
      String(variant.sku).toLowerCase() === value ||
      String(variant.specId || "").toLowerCase() === value,
  )
  return index >= 0 ? index : 0
}

export function displayName(product, lang) {
  if (!product) return ""
  return lang === "en" ? product.nameEn || product.name : product.name
}

export function displayCategory(category, lang, categories) {
  const found = categories.find((item) => item.id === category || item.name === category)
  if (!found) return category
  return lang === "en" ? found.nameEn : found.name
}

export function specValue(value, fallback = "—") {
  if (value === 0) return "0"
  if (value === null || value === undefined || value === "") return fallback
  return value
}

export function productSearchText(product) {
  const variants = getVariants(product)
  return [
    product.name,
    product.nameEn,
    product.id,
    product.category,
    product.description,
    ...(product.colors || []),
    ...variants.flatMap((variant) => [
      variant.sku,
      variant.specId,
      variant.label,
      variant.size,
      variant.foldSize,
    ]),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

export function seriesSkuLabel(product) {
  const skus = [...new Set(getVariants(product).map((variant) => variant.sku).filter(Boolean))]
  return skus.join(" / ")
}

export function matchingVariant(product, query) {
  const q = String(query || "").trim().toLowerCase()
  const variants = getVariants(product)
  if (!q) return variants[0] || null
  return (
    variants.find(
      (variant) =>
        String(variant.sku).toLowerCase().includes(q) ||
        String(variant.specId || "").toLowerCase().includes(q) ||
        String(variant.label || "").toLowerCase().includes(q),
    ) || variants[0] || null
  )
}

export function matchingVariantIndex(product, query) {
  const variants = getVariants(product)
  const match = matchingVariant(product, query)
  const index = variants.findIndex((variant) => variant === match || variant.specId === match?.specId)
  return index >= 0 ? index : 0
}

export function hasProductImage(product) {
  return getVariants(product).some((variant) => variantImages(variant).length > 0)
}

export function sortPriceValue(product) {
  const variant = lowestPricedVariant(product)
  if (!variant || variant.pricePending || variant.price == null || variant.price === "") return Number.POSITIVE_INFINITY
  return Number(variant.price)
}

export function variantMatchesSku(product, query) {
  const q = query.trim().toLowerCase()
  if (!q) return false
  return getVariants(product).some(
    (variant) =>
      String(variant.sku).toLowerCase().includes(q) ||
      String(variant.specId || "").toLowerCase().includes(q),
  )
}

export function variantMatchesSize(product, query) {
  const q = query.trim().toLowerCase()
  if (!q) return false
  return getVariants(product).some((variant) => (variant.size || "").toLowerCase().includes(q))
}

export function variantPriceInRange(product, minPrice, maxPrice) {
  return getVariants(product).some((variant) => {
    if (variant.pricePending || variant.price == null || variant.price === "") return false
    if (minPrice !== "" && variant.price < Number(minPrice)) return false
    if (maxPrice !== "" && variant.price > Number(maxPrice)) return false
    return true
  })
}
