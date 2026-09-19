import { Link } from "react-router-dom"
import { useLanguage } from "../../context/LanguageContext"
import BrandLogo from "../brand/BrandLogo"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <BrandLogo className="h-14" />
          <p className="mt-5 max-w-md text-sm leading-7 text-muted">{t.footerNote}</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{t.navProducts}</p>
          <div className="space-y-2.5 text-muted">
            <Link to="/products" className="block hover:text-ink">{t.allProducts}</Link>
            <Link to="/categories" className="block hover:text-ink">{t.navCategories}</Link>
            <Link to="/new" className="block hover:text-ink">{t.navNew}</Link>
          </div>
        </div>
        <div className="text-sm">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{t.navContact}</p>
          <div className="space-y-2.5 text-muted">
            <Link to="/about" className="block hover:text-ink">{t.navAbout}</Link>
            <Link to="/contact" className="block hover:text-ink">{t.contactUs}</Link>
            <Link to="/quote" className="block hover:text-ink">{t.quoteList}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
