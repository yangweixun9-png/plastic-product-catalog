import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useCatalog } from "../context/CatalogContext"
import { useLanguage } from "../context/LanguageContext"
import ProductImage from "../components/product/ProductImage"

export default function Categories() {
  const { storefrontProducts: products, categories } = useCatalog()
  const { t, lang } = useLanguage()
  const catalogCategories = categories.filter((item) => item.id !== "all")

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">{t.featuredCategories}</h1>
      <p className="mt-2 text-muted">{t.featuredCategoriesDesc}</p>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
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
    </div>
  )
}
