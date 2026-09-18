import { useState } from "react"
import { X } from "lucide-react"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"
import { CATEGORIES } from "../../data/categories"

const emptyVariant = {
  label: "",
  sku: "",
  specId: "",
  price: "",
  pricePending: false,
  priceType: "",
  size: "",
  foldSize: "",
  packingQuantity: "",
  cartonSize: "",
  netWeight: "",
  grossWeight: "",
  hq40: "",
  images: "",
}

const emptyProduct = {
  name: "",
  nameEn: "",
  category: "夹缝柜",
  colors: [],
  isNew: false,
  status: "active",
  description: "",
  descriptionEn: "",
  variants: [{ ...emptyVariant }],
}

function normalizeVariants(product) {
  if (product?.variants?.length) {
    return product.variants.map((variant) => ({
      ...emptyVariant,
      ...variant,
      price: variant.price ?? "",
      images: Array.isArray(variant.images) ? variant.images.join("\n") : variant.images || "",
    }))
  }
  return [{ ...emptyVariant }]
}

export default function ProductModal({ product, onClose }) {
  const { saveProduct } = useCatalog()
  const { t } = useLanguage()
  const [form, setForm] = useState({
    ...emptyProduct,
    ...product,
    colors: product?.colors?.join(" / ") || "",
    variants: normalizeVariants(product),
  })

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const setVariant = (index, key, value) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, i) => (i === index ? { ...variant, [key]: value } : variant)),
    }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    saveProduct({
      ...emptyProduct,
      ...product,
      ...form,
      colors: String(form.colors)
        .split(/[\/,，]/)
        .map((item) => item.trim())
        .filter(Boolean),
      variants: form.variants.map((variant, index) => {
        const price = variant.price === "" ? null : Number(variant.price)
        return {
          ...variant,
          label: variant.label || `规格 ${index + 1}`,
          sku: variant.sku || form.name || `SKU-${index + 1}`,
          specId: variant.specId || variant.sku || `SPEC-${index + 1}`,
          price,
          pricePending: !!variant.pricePending || price == null,
          packingQuantity: variant.packingQuantity === "" ? "" : Number(variant.packingQuantity) || variant.packingQuantity,
          images: String(variant.images || "")
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        }
      }),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4">
      <form onSubmit={onSubmit} className="my-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{product ? t.edit : t.addProduct}</h2>
          <button type="button" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1.5 block text-muted">产品名称</span>
            <input
              required
              value={form.name}
              onChange={(event) => set("name", event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-muted">Name (EN)</span>
            <input
              value={form.nameEn}
              onChange={(event) => set("nameEn", event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-muted">{t.category}</span>
            <select
              value={form.category}
              onChange={(event) => set("category", event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 outline-none"
            >
              {CATEGORIES.filter((item) => item.id !== "all").map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="mb-1.5 block text-muted">{t.status}</span>
            <select
              value={form.status}
              onChange={(event) => set("status", event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 outline-none"
            >
              <option value="active">{t.active}</option>
              <option value="draft">{t.draft}</option>
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block text-muted">{t.color}（用 / 分隔）</span>
            <input
              value={form.colors}
              onChange={(event) => set("colors", event.target.value)}
              className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
            />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={!!form.isNew}
              onChange={(event) => set("isNew", event.target.checked)}
            />
            NEW
          </label>
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{t.variant}</h3>
            <button
              type="button"
              onClick={() => set("variants", [...form.variants, { ...emptyVariant }])}
              className="text-xs font-medium text-muted hover:text-ink"
            >
              + {t.addProduct}
            </button>
          </div>
          <div className="space-y-4">
            {form.variants.map((variant, index) => (
              <div key={index} className="rounded-xl border border-line p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted">
                    {t.variant} {index + 1}
                  </p>
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => set("variants", form.variants.filter((_, i) => i !== index))}
                      className="text-xs text-muted hover:text-ink"
                    >
                      {t.delete}
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["label", t.variant],
                    ["sku", t.sku],
                    ["specId", t.specId],
                    ["price", t.price],
                    ["size", t.specDimensions],
                    ["packingQuantity", t.specPacking],
                    ["hq40", t.specHq40],
                    ["netWeight", t.specNet],
                    ["grossWeight", t.specGross],
                    ["cartonSize", t.specCarton],
                  ].map(([key, label]) => (
                    <label key={key} className="text-sm">
                      <span className="mb-1.5 block text-muted">{label}</span>
                      <input
                        value={variant[key] ?? ""}
                        onChange={(event) => setVariant(index, key, event.target.value)}
                        className="w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-brand"
                      />
                    </label>
                  ))}
                  <label className="text-sm sm:col-span-2">
                    <span className="mb-1.5 block text-muted">Images（每行一个路径）</span>
                    <textarea
                      rows="2"
                      value={variant.images}
                      onChange={(event) => setVariant(index, "images", event.target.value)}
                      className="w-full rounded-xl border border-line px-3 py-2 outline-none focus:border-brand"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={!!variant.pricePending || variant.price === ""}
                      onChange={(event) => setVariant(index, "pricePending", event.target.checked)}
                    />
                    {t.pricePending}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border border-line px-4 py-2 text-sm">
            {t.cancel}
          </button>
          <button type="submit" className="rounded-full bg-brand px-5 py-2 text-sm font-semibold hover:bg-brand-hover">
            {t.save}
          </button>
        </div>
      </form>
    </div>
  )
}
