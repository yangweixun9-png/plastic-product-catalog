import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Menu, Search, ShoppingBag, X } from "lucide-react"
import { useLanguage } from "../../context/LanguageContext"
import { useQuoteCart } from "../../context/QuoteCartContext"
import { useCatalog } from "../../context/CatalogContext"
import { displayName, displayPrice, firstImage, matchingVariant, productHref, productSearchText, seriesSkuLabel } from "../../lib/format"
import ProductImage from "../product/ProductImage"

const links = [
  { to: "/", key: "navHome" },
  { to: "/products", key: "navProducts" },
  { to: "/categories", key: "navCategories" },
  { to: "/new", key: "navNew" },
  { to: "/contact", key: "navContact" },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand">
        <span className="flex h-5 w-5 flex-col justify-between">
          <span className="h-[3px] rounded-full bg-ink" />
          <span className="h-[3px] rounded-full bg-ink" />
          <span className="h-[3px] rounded-full bg-ink" />
        </span>
      </span>
      <span className="text-sm font-extrabold tracking-[0.14em] text-ink">PRODUCT HUB</span>
    </Link>
  )
}

export default function Navbar() {
  const { lang, setLang, t } = useLanguage()
  const { count, setOpen } = useQuoteCart()
  const { products } = useCatalog()
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
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />

          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  `text-sm transition ${isActive ? "font-semibold text-ink" : "text-muted hover:text-ink"}`
                }
              >
                {({ isActive }) => (
                  <span className="relative">
                    {t[link.key]}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 h-0.5 w-full rounded-full bg-brand" />
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-ink hover:bg-cream"
              aria-label={t.search}
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="hidden items-center rounded-full border border-line p-0.5 text-xs font-medium sm:flex">
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`rounded-full px-2.5 py-1 ${lang === "zh" ? "bg-brand text-ink" : "text-muted"}`}
              >
                {t.langZh}
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`rounded-full px-2.5 py-1 ${lang === "en" ? "bg-brand text-ink" : "text-muted"}`}
              >
                {t.langEn}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative rounded-full p-2 text-ink hover:bg-cream"
              aria-label={t.quoteCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-ink">
                  {count}
                </span>
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
        <div className="fixed inset-0 z-50 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-[82%] max-w-sm bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button type="button" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-3 text-base ${isActive ? "bg-cream font-semibold" : "text-ink"}`
                  }
                >
                  {t[link.key]}
                </NavLink>
              ))}
            </div>
            <div className="mt-6 flex items-center rounded-full border border-line p-1 text-sm">
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`flex-1 rounded-full py-2 ${lang === "zh" ? "bg-brand" : ""}`}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`flex-1 rounded-full py-2 ${lang === "en" ? "bg-brand" : ""}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/35" onClick={() => setSearchOpen(false)}>
          <div
            className="mx-auto mt-16 w-[min(720px,calc(100%-1.5rem))] overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <form
              className="flex items-center gap-3 border-b border-line px-4"
              onSubmit={(event) => {
                event.preventDefault()
                submitSearch()
              }}
            >
              <Search className="h-5 w-5 text-muted" />
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
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-cream">
                    <ProductImage product={product} src={firstImage(product, variant)} sku={variant?.sku} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{displayName(product, lang)}</p>
                    <p className="sku text-xs text-muted">SKU: {variant?.sku || seriesSkuLabel(product)}</p>
                  </div>
                  <p className="text-sm font-semibold text-brand-hover">{displayPrice(variant || product, lang)}</p>
                </button>
              )})}
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
