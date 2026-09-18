export function formatPrice(price, lang = "zh") {
  const value = Number(price)
  if (Number.isNaN(value)) return "—"
  const amount = value.toLocaleString(lang === "en" ? "en-US" : "zh-CN", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  return `¥${amount}`
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
  return [
    product.name,
    product.nameEn,
    product.sku,
    product.category,
    product.dimensions,
    product.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}
