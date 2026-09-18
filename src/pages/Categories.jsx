import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useCatalog } from "../context/CatalogContext"
import { useLanguage } from "../context/LanguageContext"
import ProductImage from "../components/product/ProductImage"

export default function Categories() {
  const { products, categories } = useCatalog()
  const { t, lang } = useLanguage()

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold">{t.navCategories}</h1>
      <p className="mt-2 text-muted">{t.featuredCategoriesDesc}</p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
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
                {preview ? <ProductImage product={preview} /> : <div className="h-full bg-cream" />}
              </div>
              <div className="p-4">
                <p className="font-semibold">{lang === "en" ? category.nameEn : category.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {count} {t.results}
                </p>
                <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  {t.viewProducts} <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
