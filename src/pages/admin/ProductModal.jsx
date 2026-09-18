import { useState } from "react"
import { X } from "lucide-react"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"
import { CATEGORIES } from "../../data/categories"

const emptyProduct = {
  name: "",
  nameEn: "",
  sku: "",
  category: "收纳用品",
  colors: [],
  dimensions: "",
  foldSize: "",
  packingQuantity: "",
  cartonSize: "",
  netWeight: "",
  grossWeight: "",
  unitNetWeight: "",
  cartonGrossWeight: "",
  hq40: "",
  price: "",
  currency: "RMB",
  images: [],
  isNew: false,
  status: "active",
  description: "",
  descriptionEn: "",
}

export default function ProductModal({ product, onClose }) {
  const { saveProduct } = useCatalog()
  const { t } = useLanguage()
  const [form, setForm] = useState({
    ...emptyProduct,
    ...product,
    colors: product?.colors?.join(" / ") || "",
    images: product?.images?.join("\n") || "",
  })

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const onSubmit = (event) => {
    event.preventDefault()
    saveProduct({
      ...emptyProduct,
      ...product,
      ...form,
      price: Number(form.price) || 0,
      packingQuantity: form.packingQuantity === "" ? "" : Number(form.packingQuantity) || form.packingQuantity,
      colors: String(form.colors)
        .split(/[\/,，]/)
        .map((item) => item.trim())
        .filter(Boolean),
      images: String(form.images)
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    })
    onClose()
  }

  const fields = [
    ["name", "产品名称"],
    ["nameEn", "Name (EN)"],
    ["sku", "SKU"],
    ["dimensions", t.specDimensions],
    ["foldSize", t.specFold],
    ["packingQuantity", t.specPacking],
    ["cartonSize", t.specCarton],
    ["netWeight", t.specNet],
    ["grossWeight", t.specGross],
    ["unitNetWeight", t.specUnitNet],
    ["cartonGrossWeight", t.specCartonGross],
    ["hq40", t.specHq40],
    ["price", t.price],
  ]

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
          {fields.map(([key, label]) => (
            <label key={key} className="text-sm">
              <span className="mb-1.5 block text-muted">{label}</span>
              <input
                required={["name", "sku"].includes(key)}
                value={form[key] ?? ""}
                onChange={(event) => set(key, event.target.value)}
                className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>
          ))}
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
          <label className="text-sm sm:col-span-2">
            <span className="mb-1.5 block text-muted">Images（每行一个路径）</span>
            <textarea
              rows="3"
              value={form.images}
              onChange={(event) => set("images", event.target.value)}
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
