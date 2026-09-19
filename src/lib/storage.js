const KEYS = {
  products: "product-hub.products",
  quote: "product-hub.quote",
  inquiries: "product-hub.inquiries",
  customers: "product-hub.customers",
  settings: "product-hub.settings",
  lang: "product-hub.lang",
  adminSession: "product-hub.adminSession",
}

export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(KEYS[key] || key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  localStorage.setItem(KEYS[key] || key, JSON.stringify(value))
}

export { KEYS }
