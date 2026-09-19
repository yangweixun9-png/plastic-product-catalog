import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus, Search } from "lucide-react"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"
import ProductImage from "../../components/product/ProductImage"
import { colorHex } from "../../lib/colors"
import { displayPrice, productSearchText, seriesSkuLabel } from "../../lib/format"

function statusLabel(status, t) {
  if (status === "archived") return t.archived
  if (status === "draft") return t.draft
  return t.active
}

export default function AdminProducts() {
  const { products, deleteProduct, archiveProduct, duplicateProduct } = useCatalog()
  const { t } = useLanguage()
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter((product) => productSearchText(product).includes(q))
  }, [products, query])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.products}</h1>
          <p className="mt-1 text-sm text-muted">{t.manageCatalog}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/admin/import" className="rounded-lg border border-line bg-white px-4 py-2 text-sm font-medium">
            {t.importExcel}
          </Link>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover"
          >
            <Plus className="h-4 w-4" />
            {t.addProduct}
          </Link>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-lg border border-line bg-white px-3">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.searchNameOrSku}
          className="h-11 w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-line bg-white">
        <table className="min-w-[980px] w-full text-left text-sm">
          <thead className="border-b border-line bg-canvas text-xs uppercase tracking-wide text-muted">
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
              <tr
                key={product.id}
                className="cursor-pointer border-b border-line last:border-0 hover:bg-canvas"
                onClick={() => navigate(`/admin/products/${encodeURIComponent(product.id)}/edit`)}
              >
                <td className="px-4 py-3">
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-image">
                    <ProductImage product={product} />
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="sku px-4 py-3 text-muted">{seriesSkuLabel(product)}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {(product.colors || []).slice(0, 5).map((color) => (
                      <span
                        key={color}
                        title={color}
                        className="h-3.5 w-3.5 rounded-full border border-line"
                        style={{ background: colorHex(color) }}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-semibold text-brand">{displayPrice(product)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    product.status === "active" || !product.status ? "bg-cream text-ink" : "bg-neutral-100 text-muted"
                  }`}>
                    {statusLabel(product.status, t)}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">{product.updatedAt}</td>
                <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Link to={`/admin/products/${encodeURIComponent(product.id)}/edit`} className="text-ink hover:text-brand">
                      {t.edit}
                    </Link>
                    <button type="button" onClick={() => duplicateProduct(product.id)} className="text-muted hover:text-ink">
                      {t.duplicate}
                    </button>
                    <button
                      type="button"
                      onClick={() => archiveProduct(product.id)}
                      className="text-muted hover:text-ink"
                    >
                      {t.archive}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`${t.delete} ${product.name}?`)) deleteProduct(product.id)
                      }}
                      className="text-muted hover:text-red-600"
                    >
                      {t.delete}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="9" className="px-4 py-16 text-center text-muted">
                  {t.noResults}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
