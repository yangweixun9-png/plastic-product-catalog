import { Link } from "react-router-dom"
import { Box, Inbox, Users, FileSpreadsheet } from "lucide-react"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"
import { displayPrice, seriesSkuLabel } from "../../lib/format"

export default function Dashboard() {
  const { products, categories, inquiries, customers } = useCatalog()
  const { t } = useLanguage()
  const newest = [...products].sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt))).slice(0, 6)

  const cards = [
    { label: t.products, value: products.length, icon: Box },
    { label: t.categories, value: categories.length - 1, icon: Inbox },
    { label: t.inquiries, value: inquiries.length, icon: FileSpreadsheet },
    { label: t.customers, value: customers.length, icon: Users },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-[14px] border border-line bg-white p-5">
            <card.icon className="h-5 w-5 text-brand-hover" />
            <p className="mt-4 text-3xl font-bold">{card.value}</p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[14px] border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-semibold">{t.products}</h2>
          <Link to="/admin/products" className="text-sm text-muted hover:text-ink">
            {t.viewProducts}
          </Link>
        </div>
        <div className="divide-y divide-line">
          {newest.map((product) => (
            <div key={product.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="sku text-xs text-muted">{seriesSkuLabel(product)}</p>
              </div>
              <p className="font-semibold text-brand-hover">{displayPrice(product)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
