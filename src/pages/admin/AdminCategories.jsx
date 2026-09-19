import { Link } from "react-router-dom"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"

export default function AdminCategories() {
  const { products, categories } = useCatalog()
  const { t, lang } = useLanguage()

  return (
    <div>
      <h1 className="text-2xl font-bold">{t.categories}</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {categories.map((category) => {
          const count =
            category.id === "all"
              ? products.length
              : products.filter((product) => product.category === category.id).length
          return (
            <div key={category.id} className="flex items-center justify-between rounded-[14px] border border-line bg-white p-5">
              <div>
                <p className="font-semibold">{lang === "en" ? category.nameEn : category.name}</p>
                <p className="mt-1 text-sm text-muted">
                  {count} {t.results}
                </p>
              </div>
              <Link
                to="/admin/products"
                className="text-sm font-medium"
              >
                {t.viewProducts}
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
