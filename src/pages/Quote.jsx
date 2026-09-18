import { useState } from "react"
import { Link } from "react-router-dom"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useQuoteCart } from "../context/QuoteCartContext"
import { useLanguage } from "../context/LanguageContext"
import { useCatalog } from "../context/CatalogContext"
import ProductImage from "../components/product/ProductImage"
import { displayName, findProduct } from "../lib/format"

export default function QuotePage() {
  const { items, updateQuantity, removeItem, clear } = useQuoteCart()
  const { t, lang } = useLanguage()
  const { products, addInquiry } = useCatalog()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: "",
    company: "",
    country: "",
    email: "",
    whatsapp: "",
    message: "",
  })

  const onSubmit = (event) => {
    event.preventDefault()
    addInquiry({
      ...form,
      source: "quote",
      items: items.map((item) => ({
        sku: item.sku,
        specId: item.specId,
        label: item.label,
        name: item.name,
        color: item.color,
        quantity: item.quantity,
      })),
    })
    clear()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-2xl font-bold">{t.quoteSuccess}</p>
        <Link to="/products" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold">
          {t.continueBrowsing}
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-[1100px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.9fr]">
      <section>
        <h1 className="text-3xl font-bold">{t.quoteTitle}</h1>
        {items.length === 0 ? (
          <div className="mt-8 rounded-[14px] border border-dashed border-line py-16 text-center">
            <p className="font-medium">{t.quoteEmpty}</p>
            <p className="mt-2 text-sm text-muted">{t.quoteEmptyHint}</p>
            <Link to="/products" className="mt-5 inline-block text-sm font-medium">
              {t.continueBrowsing}
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => {
              const product = findProduct(products, item.id) || findProduct(products, item.sku)
              return (
                <div key={item.key} className="flex gap-4 rounded-[14px] border border-line p-4">
                  <div className="h-24 w-24 overflow-hidden rounded-xl bg-cream">
                    <ProductImage product={product} sku={item.sku} src={item.image} color={item.color} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{displayName(item, lang)}</p>
                    <p className="sku text-xs text-muted">SKU: {item.sku}{item.label ? ` · ${item.label}` : ""}</p>
                    <p className="mt-1 text-sm text-muted">
                      {t.color}: {item.color}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-line">
                        <button type="button" className="p-2" onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button type="button" className="p-2" onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                          <Plus className="h-4 w-4" />
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
      </section>

      <section className="rounded-[14px] border border-line p-6">
        <h2 className="text-xl font-semibold">{t.submitQuote}</h2>
        <form className="mt-5 space-y-4" onSubmit={onSubmit}>
          {[
            ["name", t.name, true],
            ["company", t.company, true],
            ["country", t.country, true],
            ["email", t.email, true],
            ["whatsapp", t.whatsapp, false],
          ].map(([key, label, required]) => (
            <label key={key} className="block text-sm">
              <span className="mb-1.5 block font-medium">{label}</span>
              <input
                required={required}
                type={key === "email" ? "email" : "text"}
                value={form[key]}
                onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>
          ))}
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">{t.message}</span>
            <textarea
              rows="4"
              value={form.message}
              onChange={(event) => setForm({ ...form, message: event.target.value })}
              className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
            />
          </label>
          <button
            type="submit"
            disabled={items.length === 0}
            className="w-full rounded-full bg-brand py-3 text-sm font-semibold hover:bg-brand-hover disabled:opacity-40"
          >
            {t.sendQuote}
          </button>
        </form>
      </section>
    </div>
  )
}
