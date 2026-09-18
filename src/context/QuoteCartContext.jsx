import { createContext, useContext, useMemo, useState } from "react"
import { readStore, writeStore } from "../lib/storage"
import { firstImage, getVariant } from "../lib/format"

const QuoteCartContext = createContext(null)

export function QuoteCartProvider({ children }) {
  const [items, setItems] = useState(() => readStore("quote", []))
  const [open, setOpen] = useState(false)

  const persist = (next) => {
    setItems(next)
    writeStore("quote", next)
  }

  const addItem = (product, { color, quantity = 1, variant } = {}) => {
    const selected = variant || getVariant(product, 0)
    const selectedColor = color || product.colors?.[0] || ""
    const key = `${product.id}__${selected?.specId || selected?.sku}__${selectedColor}`
    const exists = items.find((item) => item.key === key)
    const next = exists
      ? items.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item,
        )
      : [
          ...items,
          {
            key,
            id: product.id,
            sku: selected?.sku,
            specId: selected?.specId || selected?.sku,
            label: selected?.label || "",
            name: product.name,
            nameEn: product.nameEn,
            image: firstImage(product, selected),
            color: selectedColor,
            quantity,
            price: selected?.price,
            pricePending: selected?.pricePending,
          },
        ]
    persist(next)
    setOpen(true)
  }

  const updateQuantity = (key, quantity) => {
    const nextQty = Math.max(1, Number(quantity) || 1)
    persist(items.map((item) => (item.key === key ? { ...item, quantity: nextQty } : item)))
  }

  const removeItem = (key) => persist(items.filter((item) => item.key !== key))
  const clear = () => persist([])

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  const value = useMemo(
    () => ({
      items,
      count,
      open,
      setOpen,
      addItem,
      updateQuantity,
      removeItem,
      clear,
    }),
    [items, count, open],
  )

  return <QuoteCartContext.Provider value={value}>{children}</QuoteCartContext.Provider>
}

export function useQuoteCart() {
  const ctx = useContext(QuoteCartContext)
  if (!ctx) throw new Error("useQuoteCart must be used within QuoteCartProvider")
  return ctx
}
