import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Menu, Search, X } from "lucide-react"
import { useLanguage } from "../../context/LanguageContext"
import { useQuoteCart } from "../../context/QuoteCartContext"
import { useCatalog } from "../../context/CatalogContext"
import { displayName, displayPrice, firstImage, matchingVariant, productHref, productSearchText, seriesSkuLabel } from "../../lib/format"
import ProductImage from "../product/ProductImage"
import BrandLogo from "../brand/BrandLogo"

const links = [
  { to: "/products", key: "navProducts" },
  { to: "/categories", key: "navCategories" },
  { to: "/new", key: "navNew" },
  { to: "/about", key: "navAbout" },
  { to: "/contact", key: "navContact" },
]

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const { count, setOpen } = useQuoteCart()
  const { storefrontProducts: products } = useCatalog()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()

  const results = query.trim()
    ? products
        .filter((product) => productSearchText(product).includes(query.trim().toLowerCase()))
        .slice(0, 8)
    : []

  const submitSearch = (value = query) => {
    setSearchOpen(false)
    setMobileOpen(false)
    navigate(`/products?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-6 px-4 sm:px-6">
          <BrandLogo className="h-11 sm:h-[52px]" />

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative text-[13px] tracking-[0.04em] transition-colors duration-200 ${
                    isActive ? "font-semibold text-ink" : "text-muted hover:text-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <span>
                    {t[link.key]}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 h-px w-full bg-brand" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-ink transition-colors duration-200 hover:bg-cream"
              aria-label={t.search}
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="hidden items-center text-[12px] font-medium sm:flex">
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`px-2 py-1 transition-colors duration-200 ${lang === "zh" ? "text-brand" : "text-muted hover:text-ink"}`}
              >
                {t.langZh}
              </button>
              <span className="text-line">/</span>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-2 py-1 transition-colors duration-200 ${lang === "en" ? "text-brand" : "text-muted hover:text-ink"}`}
              >
                {t.langEn}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12px] font-medium text-ink transition-colors duration-200 hover:border-brand sm:inline-flex"
            >
              {t.quoteList}
              {count > 0 ? ` (${count})` : ""}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative rounded-full p-2 text-ink sm:hidden"
              aria-label={t.quoteList}
            >
              <span className="text-[11px] font-semibold">{t.quoteList}</span>
              {count > 0 && (
                <span className="ml-1 text-[11px] font-semibold text-brand">({count})</span>
              )}
            </button>

            <button
              type="button"
              className="rounded-full p-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-[84%] max-w-sm bg-white p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <BrandLogo className="h-10" />
              <button type="button" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-1 py-3 text-base ${isActive ? "font-semibold text-ink" : "text-muted"}`
                  }
                >
                  {t[link.key]}
                </NavLink>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-3 text-sm">
              <button type="button" onClick={() => setLang("zh")} className={lang === "zh" ? "text-brand" : "text-muted"}>
                中文
              </button>
              <span className="text-line">/</span>
              <button type="button" onClick={() => setLang("en")} className={lang === "en" ? "text-brand" : "text-muted"}>
                EN
              </button>
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/25" onClick={() => setSearchOpen(false)}>
          <div
            className="mx-auto mt-20 w-[min(720px,calc(100%-1.5rem))] overflow-hidden rounded-2xl border border-line bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <form
              className="flex items-center gap-3 border-b border-line px-4"
              onSubmit={(event) => {
                event.preventDefault()
                submitSearch()
              }}
            >
              <Search className="h-5 w-5 text-brand" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchPlaceholder}
                className="h-14 w-full bg-transparent text-base outline-none"
              />
              <button type="button" onClick={() => setSearchOpen(false)}>
                <X className="h-5 w-5 text-muted" />
              </button>
            </form>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.map((product) => {
                const variant = matchingVariant(product, query)
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => {
                      setSearchOpen(false)
                      navigate(productHref(product, variant))
                    }}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-cream"
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-image">
                      <ProductImage product={product} src={firstImage(product, variant)} sku={variant?.sku} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{displayName(product, lang)}</p>
                      <p className="sku text-xs text-muted">SKU: {variant?.sku || seriesSkuLabel(product)}</p>
                    </div>
                    <p className="text-sm font-semibold text-brand">{displayPrice(variant || product, lang)}</p>
                  </button>
                )
              })}
              {query.trim() && results.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted">{t.noResults}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
