import { AnimatePresence, motion } from "framer-motion"
import { Minus, Plus, Trash2, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useQuoteCart } from "../../context/QuoteCartContext"
import { useLanguage } from "../../context/LanguageContext"
import { displayName, formatPrice } from "../../lib/format"
import ProductImage from "../product/ProductImage"
import { useCatalog } from "../../context/CatalogContext"

export default function QuoteDrawer() {
  const { items, open, setOpen, updateQuantity, removeItem } = useQuoteCart()
  const { t, lang } = useLanguage()
  const { products } = useCatalog()
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="text-lg font-semibold">{t.quoteTitle}</h2>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-medium">{t.quoteEmpty}</p>
                  <p className="mt-2 text-sm text-muted">{t.quoteEmptyHint}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const product = products.find((entry) => entry.sku === item.sku)
                    return (
                      <div key={item.key} className="flex gap-3 rounded-[14px] border border-line p-3">
                        <div className="h-20 w-20 overflow-hidden rounded-xl bg-cream">
                          <ProductImage product={product} sku={item.sku} src={item.image} color={item.color} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{displayName(item, lang)}</p>
                          <p className="sku text-xs text-muted">SKU: {item.sku}</p>
                          <p className="mt-1 text-xs text-muted">
                            {t.color}: {item.color}
                          </p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-full border border-line">
                              <button type="button" className="p-1.5" onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-8 text-center text-sm">{item.quantity}</span>
                              <button type="button" className="p-1.5" onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <button type="button" onClick={() => removeItem(item.key)} className="text-muted hover:text-ink">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-line p-5">
              <button
                type="button"
                disabled={items.length === 0}
                onClick={() => {
                  setOpen(false)
                  navigate("/quote")
                }}
                className="w-full rounded-full bg-brand py-3 text-sm font-semibold text-ink transition hover:bg-brand-hover disabled:opacity-40"
              >
                {t.submitQuote}
              </button>
              <Link
                to="/products"
                onClick={() => setOpen(false)}
                className="mt-3 block text-center text-sm text-muted hover:text-ink"
              >
                {t.continueBrowsing}
              </Link>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
