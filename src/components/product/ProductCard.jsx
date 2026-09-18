import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import ProductImage from "./ProductImage"
import { colorHex } from "../../lib/colors"
import { displayName, formatPrice } from "../../lib/format"
import { useLanguage } from "../../context/LanguageContext"
import { useQuoteCart } from "../../context/QuoteCartContext"

export default function ProductCard({ product }) {
  const { lang, t } = useLanguage()
  const { addItem } = useQuoteCart()

  return (
    <article className="group flex h-full flex-col rounded-[14px] border border-line bg-white p-2.5 shadow-[0_1px_2px_rgba(23,23,23,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(23,23,23,0.08)]">
      <Link to={`/products/${encodeURIComponent(product.sku)}`} className="relative block overflow-hidden rounded-[10px]">
        <div className="aspect-square overflow-hidden bg-cream">
          <ProductImage product={product} />
        </div>
        {product.isNew && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold tracking-wide text-ink">
            NEW
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
        <Link to={`/products/${encodeURIComponent(product.sku)}`}>
          <h3 className="line-clamp-1 text-[15px] font-semibold text-ink">{displayName(product, lang)}</h3>
        </Link>
        <p className="sku mt-1 text-xs font-medium text-muted">SKU: {product.sku}</p>

        <div className="mt-2.5 flex items-center gap-1.5">
          {product.colors.map((color) => (
            <span
              key={color}
              title={color}
              className="h-3.5 w-3.5 rounded-full border border-black/10"
              style={{ background: colorHex(color) }}
            />
          ))}
        </div>

        <p className="mt-2 text-xs text-muted">{product.dimensions}</p>
        <p className="mt-2 text-base font-bold text-brand-hover">{formatPrice(product.price, lang)}</p>

        <div className="mt-3 flex items-center gap-2">
          <Link
            to={`/products/${encodeURIComponent(product.sku)}`}
            className="flex-1 whitespace-nowrap rounded-full border border-line px-2 py-1.5 text-center text-xs font-medium text-ink transition hover:border-ink"
          >
            {t.viewDetails}
          </Link>
          <button
            type="button"
            onClick={() => addItem(product)}
            aria-label={t.addToQuote}
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand px-2.5 py-1.5 text-xs font-semibold text-ink transition hover:bg-brand-hover"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">{t.addToQuote}</span>
          </button>
        </div>
      </div>
    </article>
  )
}
