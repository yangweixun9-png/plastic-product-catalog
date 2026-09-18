import { Link } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand">
              <span className="flex h-5 w-5 flex-col justify-between">
                <span className="h-[3px] rounded-full bg-ink" />
                <span className="h-[3px] rounded-full bg-ink" />
                <span className="h-[3px] rounded-full bg-ink" />
              </span>
            </span>
            <span className="text-sm font-extrabold tracking-[0.14em]">PRODUCT HUB</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-muted">{t.footerNote}</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold">{t.navProducts}</p>
          <div className="space-y-2 text-muted">
            <Link to="/products" className="block hover:text-ink">{t.allProducts}</Link>
            <Link to="/categories" className="block hover:text-ink">{t.navCategories}</Link>
            <Link to="/new" className="block hover:text-ink">{t.navNew}</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-semibold">{t.navContact}</p>
          <div className="space-y-2 text-muted">
            <Link to="/contact" className="block hover:text-ink">{t.contactUs}</Link>
            <Link to="/quote" className="block hover:text-ink">{t.quoteCart}</Link>
            <Link to="/admin" className="block hover:text-ink">{t.admin}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
