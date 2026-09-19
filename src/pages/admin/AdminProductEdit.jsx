import { Link, useNavigate, useParams } from "react-router-dom"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"
import ProductForm from "./ProductForm"

export default function AdminProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products } = useCatalog()
  const { t } = useLanguage()
  const product = id ? products.find((item) => String(item.id) === String(id)) : null

  if (id && !product) {
    return (
      <div className="rounded-xl border border-line bg-white px-6 py-16 text-center">
        <p className="text-muted">{t.noResults}</p>
        <Link to="/admin/products" className="mt-4 inline-block text-sm text-brand">
          {t.products}
        </Link>
      </div>
    )
  }

  return (
    <ProductForm
      product={product}
      onSave={() => navigate("/admin/products")}
      onCancel={() => navigate("/admin/products")}
    />
  )
}
