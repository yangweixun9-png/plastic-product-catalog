import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import ProductImage from "./ProductImage"
import { VariantArrows, VariantChips, VariantDots } from "./VariantControls"
import { colorHex } from "../../lib/colors"
import { displayName, displayPrice, firstImage, getVariants, productHref } from "../../lib/format"
import { useSwipe } from "../../lib/swipe"
import { useLanguage } from "../../context/LanguageContext"
import { useQuoteCart } from "../../context/QuoteCartContext"

export default function ProductCard({ product, initialVariantIndex = 0 }) {
  const { lang, t } = useLanguage()
  const { addItem } = useQuoteCart()
  const navigate = useNavigate()
  const variants = getVariants(product)
  const [index, setIndex] = useState(Math.min(initialVariantIndex, Math.max(0, variants.length - 1)))

  useEffect(() => {
    setIndex(Math.min(initialVariantIndex, Math.max(0, variants.length - 1)))
  }, [initialVariantIndex, product.id, variants.length])
  const variant = variants[index] || variants[0]
  const href = productHref(product, variant)
  const canSwipe = variants.length > 1

  const go = (next) => {
    if (!canSwipe) return
    setIndex((current) => (current + next + variants.length) % variants.length)
  }

  const { swiped, handlers } = useSwipe({
    enabled: canSwipe,
    onPrev: () => go(-1),
    onNext: () => go(1),
  })

  return (
    <article className="group flex h-full flex-col rounded-[14px] border border-line bg-white p-2.5 shadow-[0_1px_2px_rgba(23,23,23,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(23,23,23,0.08)]">
      <div
        className="relative cursor-pointer overflow-hidden rounded-[10px]"
        {...handlers}
        onClick={() => {
          if (swiped.current) return
          navigate(href)
        }}
      >
        <div className="aspect-square overflow-hidden bg-cream select-none">
          <ProductImage product={product} src={firstImage(product, variant)} sku={variant?.sku} />
        </div>
        <VariantArrows enabled={canSwipe} onPrev={() => go(-1)} onNext={() => go(1)} />
        {product.isNew && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold tracking-wide text-ink">
            NEW
          </span>
        )}
      </div>

      <VariantDots count={variants.length} index={index} onChange={setIndex} />

      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-1">
        <Link to={href}>
          <h3 className="line-clamp-1 text-[15px] font-semibold text-ink">{displayName(product, lang)}</h3>
        </Link>
        <p className="sku mt-1 text-xs font-medium text-muted">SKU: {variant?.sku || "—"}</p>

        <div className="mt-2.5 flex min-h-[14px] flex-wrap items-center gap-1.5">
          {(product.colors || []).map((color) => (
            <span
              key={color}
              title={color}
              className="h-3.5 w-3.5 rounded-full border border-black/10"
              style={{ background: colorHex(color) }}
            />
          ))}
        </div>

        <p className="mt-2 min-h-[32px] line-clamp-2 text-xs text-muted">{variant?.size || "—"}</p>
        <p className="mt-2 text-base font-bold text-brand-hover">{displayPrice(variant, lang)}</p>

        <VariantChips variants={variants} index={index} onChange={setIndex} className="mt-2" />

        <div className="mt-auto flex items-center gap-2 pt-3">
          <Link
            to={href}
            className="flex-1 whitespace-nowrap rounded-full border border-line px-2 py-1.5 text-center text-xs font-medium text-ink transition hover:border-ink"
          >
            {t.viewDetails}
          </Link>
          <button
            type="button"
            onClick={() => addItem(product, { variant })}
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
