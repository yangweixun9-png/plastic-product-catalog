import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import ProductImage from "./ProductImage"
import { VariantArrows, VariantChips, VariantDots } from "./VariantControls"
import { colorHex } from "../../lib/colors"
import { displayName, displayPrice, firstImage, getVariants, productHref } from "../../lib/format"
import { useSwipe } from "../../lib/swipe"
import { useLanguage } from "../../context/LanguageContext"

export default function ProductCard({ product, initialVariantIndex = 0 }) {
  const { lang, t } = useLanguage()
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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white transition-all duration-200 hover:-translate-y-[3px] hover:border-brand">
      <div
        className="relative cursor-pointer overflow-hidden"
        {...handlers}
        onClick={() => {
          if (swiped.current) return
          navigate(href)
        }}
      >
        <div className="aspect-square overflow-hidden bg-image select-none">
          <ProductImage product={product} src={firstImage(product, variant)} sku={variant?.sku} />
        </div>
        <VariantArrows enabled={canSwipe} onPrev={() => go(-1)} onNext={() => go(1)} />
        {product.isNew && (
          <span className="absolute left-3 top-3 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            NEW
          </span>
        )}
      </div>

      <VariantDots count={variants.length} index={index} onChange={setIndex} />

      <div className="flex flex-1 flex-col px-3 pb-4 pt-1">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted">{product.category}</p>
        <Link to={href}>
          <h3 className="mt-1 line-clamp-1 text-[15px] font-medium text-ink">{displayName(product, lang)}</h3>
        </Link>
        <p className="sku mt-1 text-xs text-muted">SKU: {variant?.sku || "—"}</p>

        <div className="mt-2.5 flex min-h-[14px] flex-wrap items-center gap-1.5">
          {(product.colors || []).map((color) => (
            <span
              key={color}
              title={color}
              className="h-3 w-3 rounded-full border border-black/10"
              style={{ background: colorHex(color) }}
            />
          ))}
        </div>

        {variants.length > 1 && (
          <VariantChips variants={variants} index={index} onChange={setIndex} className="mt-2 min-h-0" />
        )}

        <p className="mt-3 text-base font-semibold text-brand">{displayPrice(variant, lang)}</p>
        <Link
          to={href}
          className="mt-auto inline-flex items-center gap-1 pt-3 text-sm text-ink transition-colors duration-200 hover:text-brand"
        >
          {t.viewProduct} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  )
}
