import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, Factory, Package, Sparkles, Truck } from "lucide-react"
import { useCatalog } from "../context/CatalogContext"
import { useLanguage } from "../context/LanguageContext"
import ProductImage from "../components/product/ProductImage"
import ProductCard from "../components/product/ProductCard"
import { displayName, hasProductImage, productHref, seriesSkuLabel } from "../lib/format"

export default function Home() {
  const { t, lang } = useLanguage()
  const { products, categories } = useCatalog()
  const featured = []
  const seen = new Set()
  products.forEach((product) => {
    if (featured.length >= 4) return
    if (seen.has(product.category)) return
    if (!hasProductImage(product)) return
    seen.add(product.category)
    featured.push(product)
  })

  const stats = [
    { value: String(products.length), label: t.statProducts, icon: Package },
    { value: String(Math.max(0, categories.length - 1)), label: t.statCategories, icon: Sparkles },
    { value: t.statOem, label: "Custom", icon: Factory },
    { value: t.statDirect, label: "Supply", icon: Truck },
  ]

  return (
    <div>
      <section className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <motion.div initial={{ opacity: 1, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">{t.heroEyebrow}</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{t.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-ink transition hover:bg-brand-hover"
            >
              {t.ctaBrowse}
            </Link>
            <Link
              to="/categories"
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition hover:border-ink"
            >
              {t.ctaCategories}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative mx-auto grid w-full max-w-lg grid-cols-2 gap-3"
        >
          {featured.map((product, index) => (
            <Link
              key={product.id}
              to={productHref(product)}
              className={`group overflow-hidden rounded-[14px] border border-line bg-cream shadow-[0_8px_30px_rgba(23,23,23,0.06)] ${
                index === 1 ? "mt-8" : ""
              } ${index === 2 ? "-mt-4" : ""}`}
            >
              <div className="aspect-square">
                <ProductImage product={product} />
              </div>
              <div className="bg-white px-3 py-2.5">
                <p className="truncate text-sm font-medium">{displayName(product, lang)}</p>
                <p className="sku text-[11px] text-muted">{seriesSkuLabel(product)}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-px bg-line md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-white px-6 py-8">
              <stat.icon className="h-5 w-5 text-brand-hover" />
              <p className="mt-3 text-2xl font-bold text-ink">{stat.value}</p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto max-w-[1280px] px-4 py-3 text-center text-[11px] text-muted sm:px-6">
          {t.heroStatsNote}
        </p>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{t.featuredCategories}</h2>
            <p className="mt-2 text-sm text-muted">{t.featuredCategoriesDesc}</p>
          </div>
          <Link to="/categories" className="hidden items-center gap-1 text-sm font-medium sm:flex">
            {t.viewProducts} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const count =
              category.id === "all"
                ? products.length
                : products.filter((product) => product.category === category.id).length
            const preview = products.find((product) =>
              category.id === "all" ? true : product.category === category.id,
            )
            return (
              <Link
                key={category.id}
                to={category.id === "all" ? "/products" : `/products?category=${encodeURIComponent(category.id)}`}
                className="group overflow-hidden rounded-[14px] border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(23,23,23,0.06)]"
              >
                <div className="aspect-[5/3] bg-cream">
                  {preview ? (
                    <ProductImage product={preview} />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted">
                      {lang === "en" ? category.nameEn : category.name}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold">{lang === "en" ? category.nameEn : category.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {count} {t.results}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-ink">
                    {t.viewProducts} <ArrowRight className="h-3.5 w-3.5" />
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pb-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold sm:text-3xl">{t.allProducts}</h2>
          <Link to="/products" className="inline-flex items-center gap-1 text-sm font-medium">
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
