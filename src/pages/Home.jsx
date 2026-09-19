import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Search } from "lucide-react"
import { useCatalog } from "../context/CatalogContext"
import { useLanguage } from "../context/LanguageContext"
import ProductImage from "../components/product/ProductImage"
import ProductCard from "../components/product/ProductCard"
import { firstImage, hasProductImage, productHref, seriesSkuLabel } from "../lib/format"

const fade = { initial: { opacity: 1, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } }

export default function Home() {
  const { t, lang } = useLanguage()
  const { storefrontProducts: products, categories } = useCatalog()
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const catalogCategories = categories.filter((item) => item.id !== "all")
  const featured = []
  const seen = new Set()
  products.forEach((product) => {
    if (featured.length >= 3) return
    if (seen.has(product.category)) return
    if (!hasProductImage(product)) return
    seen.add(product.category)
    featured.push(product)
  })

  const popular = catalogCategories.slice(0, 5)

  return (
    <div>
      <section className="mx-auto grid max-w-[1280px] items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <motion.div {...fade}>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">{t.heroEyebrow}</p>
          <h1 className="mt-5 whitespace-pre-line text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
            {t.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted">{t.heroSubtitle}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-hover"
            >
              {t.ctaBrowse}
            </Link>
            <Link
              to="/categories"
              className="rounded-full border border-line bg-white px-6 py-3 text-sm font-medium text-ink transition-colors duration-200 hover:border-brand"
            >
              {t.ctaCategories}
            </Link>
          </div>
        </motion.div>

        <motion.div {...fade} className="grid grid-cols-2 gap-3">
          {featured.slice(0, 1).map((product) => (
            <Link
              key={product.id}
              to={productHref(product)}
              className="group col-span-2 overflow-hidden rounded-xl border border-line bg-image"
            >
              <div className="aspect-[16/9] bg-image">
                <ProductImage product={product} src={firstImage(product)} />
              </div>
            </Link>
          ))}
          {featured.slice(1, 3).map((product) => (
            <Link
              key={product.id}
              to={productHref(product)}
              className="group overflow-hidden rounded-xl border border-line bg-image"
            >
              <div className="aspect-square bg-image">
                <ProductImage product={product} src={firstImage(product)} />
              </div>
              <div className="bg-white px-3 py-2.5">
                <p className="truncate text-sm text-ink">{product.name}</p>
                <p className="sku mt-0.5 text-[11px] text-muted">{seriesSkuLabel(product)}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </section>

      <section className="border-y border-line bg-canvas">
        <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">{t.findProduct}</p>
          <form
            className="mt-5 flex items-stretch overflow-hidden rounded-full border border-line bg-white"
            onSubmit={(event) => {
              event.preventDefault()
              navigate(`/products?q=${encodeURIComponent(query.trim())}`)
            }}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 px-5">
              <Search className="h-5 w-5 shrink-0 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.searchHeroPlaceholder}
                className="h-14 w-full bg-transparent text-base outline-none"
              />
            </div>
            <button type="submit" className="bg-brand px-7 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-hover">
              {t.search}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">{t.popular}:</span>
            {popular.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.id)}`}
                className="rounded-full border border-line px-3 py-1 text-ink transition-colors duration-200 hover:border-brand hover:text-brand"
              >
                {lang === "en" ? category.nameEn : category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.featuredCategories}</h2>
            <p className="mt-2 text-sm text-muted">{t.featuredCategoriesDesc}</p>
          </div>
          <Link to="/categories" className="hidden items-center gap-1 text-sm text-ink sm:flex">
            {t.viewProducts} <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {catalogCategories.map((category) => {
            const count = products.filter((product) => product.category === category.id).length
            const preview = products.find((product) => product.category === category.id)
            return (
              <Link
                key={category.id}
                to={`/products?category=${encodeURIComponent(category.id)}`}
                className="group overflow-hidden rounded-xl border border-line bg-white transition-all duration-200 hover:border-brand"
              >
                <div className="aspect-[5/3] overflow-hidden bg-image">
                  {preview ? (
                    <div className="h-full transition-transform duration-200 group-hover:scale-[1.03]">
                      <ProductImage product={preview} />
                    </div>
                  ) : (
                    <div className="h-full bg-image" />
                  )}
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{lang === "en" ? category.nameEn : category.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {count} {t.results}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.allProducts}</h2>
          <Link to="/products" className="inline-flex items-center gap-1 text-sm">
            {t.viewProducts} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
