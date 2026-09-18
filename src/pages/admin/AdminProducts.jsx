import { useMemo, useState } from "react"
import { Pencil, Plus, Search, Trash2 } from "lucide-react"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"
import ProductImage from "../../components/product/ProductImage"
import { displayPrice, productSearchText, seriesSkuLabel } from "../../lib/format"
import ProductModal from "./ProductModal"

export default function AdminProducts() {
  const { products, deleteProduct } = useCatalog()
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const [editing, setEditing] = useState(null)

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((product) => productSearchText(product).includes(q))
  }, [products, query])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.products}</h1>
        <div className="flex flex-wrap gap-2">
          <a
            href="/admin/import"
            className="rounded-full border border-line px-4 py-2 text-sm font-medium"
          >
            {t.importExcel}
          </a>
          <button
            type="button"
            onClick={() => setEditing({})}
            className="inline-flex items-center gap-1 rounded-full bg-brand px-4 py-2 text-sm font-semibold hover:bg-brand-hover"
          >
            <Plus className="h-4 w-4" />
            {t.addProduct}
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-line bg-white px-3">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.searchPlaceholder}
          className="h-11 w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="min-w-[860px] w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{t.image}</th>
              <th className="px-4 py-3 font-medium">{t.products}</th>
              <th className="px-4 py-3 font-medium">{t.sku}</th>
              <th className="px-4 py-3 font-medium">{t.category}</th>
              <th className="px-4 py-3 font-medium">{t.color}</th>
              <th className="px-4 py-3 font-medium">{t.price}</th>
              <th className="px-4 py-3 font-medium">{t.status}</th>
              <th className="px-4 py-3 font-medium">{t.updated}</th>
              <th className="px-4 py-3 font-medium">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {list.map((product) => (
              <tr key={product.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-cream">
                    <ProductImage product={product} />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="sku px-4 py-3 text-muted">{seriesSkuLabel(product)}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3 text-muted">{(product.colors || []).join(" / ")}</td>
                <td className="px-4 py-3 font-semibold text-brand-hover">{displayPrice(product)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${product.status === "active" ? "bg-cream" : "bg-neutral-100"}`}>
                    {product.status === "active" ? t.active : t.draft}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{product.updatedAt}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditing(product)} className="rounded-full p-1.5 hover:bg-cream">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`${t.delete} ${product.name}?`)) deleteProduct(product.id)
                      }}
                      className="rounded-full p-1.5 hover:bg-cream"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <ProductModal product={editing.id ? editing : null} onClose={() => setEditing(null)} />}
    </div>
  )
}
