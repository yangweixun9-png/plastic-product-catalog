import { createContext, useContext, useMemo, useState } from "react"
import { PRODUCTS } from "../data/products"
import { CATEGORIES } from "../data/categories"
import { readStore, writeStore } from "../lib/storage"

const CatalogContext = createContext(null)

function cloneProducts() {
  return PRODUCTS.map((item) => ({ ...item, colors: [...item.colors], images: [...item.images] }))
}

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const stored = readStore("products", null)
    return stored?.length ? stored : cloneProducts()
  })
  const [inquiries, setInquiries] = useState(() => readStore("inquiries", []))
  const [settings, setSettings] = useState(() =>
    readStore("settings", {
      company: "PRODUCT HUB",
      email: "sales@producthub.demo",
      whatsapp: "+86 138 0000 0000",
      country: "China",
    }),
  )

  const persistProducts = (next) => {
    setProducts(next)
    writeStore("products", next)
  }

  const persistInquiries = (next) => {
    setInquiries(next)
    writeStore("inquiries", next)
  }

  const persistSettings = (next) => {
    setSettings(next)
    writeStore("settings", next)
  }

  const saveProduct = (product) => {
    const now = new Date().toISOString().slice(0, 10)
    const exists = products.some((item) => item.id === product.id)
    let next
    if (exists) {
      next = products.map((item) => (item.id === product.id ? { ...product, updatedAt: now } : item))
    } else {
      const nextId = Math.max(0, ...products.map((item) => Number(item.id) || 0)) + 1
      next = [{ ...product, id: nextId, updatedAt: now }, ...products]
    }
    persistProducts(next)
  }

  const deleteProduct = (id) => {
    persistProducts(products.filter((item) => item.id !== id))
  }

  const addInquiry = (inquiry) => {
    const next = [
      {
        id: Date.now(),
        status: "pending",
        createdAt: new Date().toISOString(),
        ...inquiry,
      },
      ...inquiries,
    ]
    persistInquiries(next)
  }

  const updateInquiry = (id, patch) => {
    persistInquiries(inquiries.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const importProducts = (rows) => {
    const now = new Date().toISOString().slice(0, 10)
    let nextId = Math.max(0, ...products.map((item) => Number(item.id) || 0))
    const incoming = rows.map((row) => {
      nextId += 1
      return {
        id: nextId,
        name: row.name || "",
        nameEn: row.nameEn || row.name || "",
        sku: String(row.sku || `NEW-${nextId}`),
        category: row.category || "家居用品",
        colors: Array.isArray(row.colors)
          ? row.colors
          : String(row.colors || "")
              .split(/[\/,，]/)
              .map((item) => item.trim())
              .filter(Boolean),
        dimensions: row.dimensions || "",
        foldSize: row.foldSize || "",
        packingQuantity: row.packingQuantity === "" ? "" : Number(row.packingQuantity) || row.packingQuantity || "",
        cartonSize: row.cartonSize || "",
        netWeight: row.netWeight || "",
        grossWeight: row.grossWeight || "",
        unitNetWeight: row.unitNetWeight || "",
        cartonGrossWeight: row.cartonGrossWeight || "",
        hq40: row.hq40 || "",
        price: Number(row.price) || 0,
        currency: row.currency || "RMB",
        images: row.images?.length ? row.images : [`/products/${row.sku || nextId}.svg`],
        isNew: row.isNew === true || row.isNew === "true" || row.isNew === "1",
        status: row.status || "active",
        updatedAt: now,
        description: row.description || "",
        descriptionEn: row.descriptionEn || "",
      }
    })
    persistProducts([...incoming, ...products])
  }

  const resetDemo = () => {
    persistProducts(cloneProducts())
    persistInquiries([])
  }

  const customers = useMemo(() => {
    const map = new Map()
    inquiries.forEach((item) => {
      const key = (item.email || item.company || item.name || "").toLowerCase()
      if (!key) return
      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: item.name,
          company: item.company,
          country: item.country,
          email: item.email,
          whatsapp: item.whatsapp,
          inquiries: 0,
          lastAt: item.createdAt,
        })
      }
      const current = map.get(key)
      current.inquiries += 1
      if (item.createdAt > current.lastAt) current.lastAt = item.createdAt
    })
    return [...map.values()]
  }, [inquiries])

  const value = useMemo(
    () => ({
      products,
      categories: CATEGORIES,
      inquiries,
      customers,
      settings,
      saveProduct,
      deleteProduct,
      addInquiry,
      updateInquiry,
      importProducts,
      resetDemo,
      persistSettings,
    }),
    [products, inquiries, customers, settings],
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error("useCatalog must be used within CatalogProvider")
  return ctx
}
