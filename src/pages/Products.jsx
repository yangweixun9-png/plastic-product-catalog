import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useCatalog } from "../context/CatalogContext"
import { useLanguage } from "../context/LanguageContext"
import FilterPanel from "../components/product/FilterPanel"
import ProductCard from "../components/product/ProductCard"
import { productSearchText } from "../lib/format"

const PAGE_SIZE = 24

const emptyFilters = {
  category: "all",
  colors: [],
  minPrice: "",
  maxPrice: "",
  size: "",
  sku: "",
  newOnly: false,
}

export default function Products({ forcedNew = false, titleKey = "allProducts" }) {
  const { products } = useCatalog()
  const { t } = useLanguage()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get("q") || "")
  const [sort, setSort] = useState(params.get("sort") || "default")
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filters, setFilters] = useState({
    ...emptyFilters,
    category: params.get("category") || "all",
    newOnly: forcedNew || params.get("new") === "1",
    sku: params.get("sku") || "",
  })

  useEffect(() => {
    setQuery(params.get("q") || "")
    setFilters((current) => ({
      ...current,
      category: params.get("category") || (forcedNew ? current.category : "all"),
      newOnly: forcedNew || params.get("new") === "1",
      sku: params.get("sku") || current.sku,
    }))
  }, [params, forcedNew])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = products.filter((product) => {
      if (q && !productSearchText(product).includes(q) && !product.sku.toLowerCase().includes(q)) {
        return false
      }
      if (filters.category && filters.category !== "all" && product.category !== filters.category) {
        return false
      }
      if (filters.colors.length && !filters.colors.some((color) => product.colors.includes(color))) {
        return false
      }
      if (filters.minPrice !== "" && product.price < Number(filters.minPrice)) return false
      if (filters.maxPrice !== "" && product.price > Number(filters.maxPrice)) return false
      if (filters.size && !(product.dimensions || "").toLowerCase().includes(filters.size.toLowerCase())) {
        return false
      }
      if (filters.sku && !product.sku.toLowerCase().includes(filters.sku.trim().toLowerCase())) {
        return false
      }
      if ((forcedNew || filters.newOnly) && !product.isNew) return false
      if (product.status && product.status !== "active") return false
      return true
    })

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price)
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price)
    if (sort === "newest") {
      list = [...list].sort((a, b) => {
        if (a.isNew !== b.isNew) return a.isNew ? -1 : 1
        return String(b.updatedAt).localeCompare(String(a.updatedAt))
      })
    }
    return list
  }, [products, query, filters, sort, forcedNew])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [query, filters, sort, forcedNew])

  const syncQuery = (nextQuery) => {
    const next = new URLSearchParams(params)
    if (nextQuery) next.set("q", nextQuery)
    else next.delete("q")
    setParams(next, { replace: true })
  }

  const onFilterChange = (next) => {
    setFilters(next)
    const search = new URLSearchParams(params)
    if (next.category && next.category !== "all") search.set("category", next.category)
    else search.delete("category")
    if (next.newOnly) search.set("new", "1")
    else search.delete("new")
    setParams(search, { replace: true })
  }

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t[titleKey]}</h1>
        <form
          className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 shadow-[0_8px_30px_rgba(23,23,23,0.04)]"
          onSubmit={(event) => event.preventDefault()}
        >
          <Search className="h-5 w-5 text-muted" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              syncQuery(event.target.value)
            }}
            placeholder={t.searchPlaceholder}
            className="h-14 w-full bg-transparent text-base outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                syncQuery("")
              }}
            >
              <X className="h-4 w-4 text-muted" />
            </button>
          )}
        </form>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 rounded-[14px] border border-line p-5">
            <FilterPanel products={products} filters={filters} onChange={onFilterChange} onClear={() => onFilterChange(emptyFilters)} />
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {t[titleKey]}（{filtered.length}）
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm lg:hidden"
                onClick={() => setDrawerOpen(true)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                {t.filters}
              </button>
              <label className="flex items-center gap-2 text-sm text-muted">
                {t.sort}
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="rounded-full border border-line bg-white px-3 py-2 text-ink outline-none"
                >
                  <option value="default">{t.sortDefault}</option>
                  <option value="price-asc">{t.sortPriceAsc}</option>
                  <option value="price-desc">{t.sortPriceDesc}</option>
                  <option value="newest">{t.sortNewest}</option>
                </select>
              </label>
            </div>
          </div>

          {pageItems.length === 0 ? (
            <div className="rounded-[14px] border border-dashed border-line py-20 text-center">
              <p className="font-medium">{t.noResults}</p>
              <p className="mt-2 text-sm text-muted">{t.noResultsHint}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {pageItems.map((product) => (
                <ProductCard key={product.sku} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  className={`h-9 w-9 rounded-full text-sm ${
                    page === index + 1 ? "bg-brand font-semibold" : "border border-line"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="absolute left-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-white p-5 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">{t.filters}</h3>
                <button type="button" onClick={() => setDrawerOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterPanel
                products={products}
                filters={filters}
                onChange={onFilterChange}
                onClear={() => onFilterChange(emptyFilters)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
