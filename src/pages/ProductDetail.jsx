import { useEffect, useMemo, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { useCatalog } from "../context/CatalogContext"
import { useLanguage } from "../context/LanguageContext"
import { useQuoteCart } from "../context/QuoteCartContext"
import ProductImage from "../components/product/ProductImage"
import ProductCard from "../components/product/ProductCard"
import { VariantArrows, VariantChips } from "../components/product/VariantControls"
import { colorHex } from "../lib/colors"
import {
  displayName,
  displayPrice,
  findProduct,
  findVariantIndex,
  firstImage,
  getVariants,
  specValue,
  variantImages,
} from "../lib/format"
import { useSwipe } from "../lib/swipe"

export default function ProductDetail() {
  const { sku } = useParams()
  const [params] = useSearchParams()
  const { storefrontProducts: products, categories } = useCatalog()
  const { t, lang } = useLanguage()
  const { addItem } = useQuoteCart()
  const product = findProduct(products, sku)
  const variants = getVariants(product)
  const requested = params.get("sku") || sku
  const [index, setIndex] = useState(() => findVariantIndex(product, requested))
  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState(product?.colors?.[0] || "")

  useEffect(() => {
    const nextIndex = findVariantIndex(product, requested)
    setIndex(nextIndex)
    setActiveImage(0)
    setColor(product?.colors?.[0] || "")
  }, [product?.id, requested])

  const variant = variants[index] || variants[0]
  const thumbs = useMemo(() => variantImages(variant), [variant])

  const canSwipe = variants.length > 1
  const go = (step) => {
    if (!canSwipe) return
    setIndex((current) => (current + step + variants.length) % variants.length)
    setActiveImage(0)
  }

  const { swiped, handlers } = useSwipe({
    enabled: canSwipe,
    onPrev: () => go(-1),
    onNext: () => go(1),
  })

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-lg font-semibold">{t.noResults}</p>
        <Link to="/products" className="mt-4 inline-block text-sm text-muted hover:text-ink">
          {t.continueBrowsing}
        </Link>
      </div>
    )
  }

  const categoryLabel =
    lang === "en"
      ? categories.find((item) => item.id === product.category)?.nameEn || product.category
      : product.category

  const specs = [
    [t.specDimensions, specValue(variant?.size)],
    [t.specMaterial, specValue(product.material || "PP")],
    [t.specPacking, specValue(variant?.packingQuantity)],
    [t.specCarton, specValue(variant?.cartonSize)],
    [t.specNet, specValue(variant?.netWeight)],
    [t.specGross, specValue(variant?.grossWeight)],
    [t.specHq40, specValue(variant?.hq40)],
    [t.specMoq, specValue(product.moq || variant?.packingQuantity || "—")],
    [t.specId, specValue(variant?.specId)],
    [t.specFold, specValue(variant?.foldSize)],
  ]

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4)
  const currentSrc = thumbs[activeImage] || firstImage(product, variant)

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <nav className="mb-8 flex flex-wrap items-center gap-1 text-sm text-muted">
        <Link to="/" className="hover:text-ink">{t.breadcrumbHome}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/products" className="hover:text-ink">{t.allProducts}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-ink">
          {categoryLabel}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink">{displayName(product, lang)}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[0.55fr_0.45fr]">
        <div>
          <div
            className="group relative overflow-hidden rounded-xl border border-line bg-image select-none"
            {...handlers}
            onClick={() => {
              if (swiped.current || thumbs.length < 2) return
              setActiveImage((current) => (current + 1) % thumbs.length)
            }}
          >
            <div className="aspect-square">
              <ProductImage product={product} src={currentSrc} color={color} sku={variant?.sku} />
            </div>
            <VariantArrows enabled={canSwipe} onPrev={() => go(-1)} onNext={() => go(1)} />
          </div>
          <div className="mt-3 grid grid-cols-5 gap-2">
            {(thumbs.length ? thumbs : [currentSrc]).slice(0, 5).map((src, thumbIndex) => (
              <button
                key={`${src}-${thumbIndex}`}
                type="button"
                onClick={() => setActiveImage(thumbIndex)}
                className={`overflow-hidden rounded-lg border ${
                  activeImage === thumbIndex ? "border-brand" : "border-line"
                }`}
              >
                <div className="aspect-square bg-image">
                  <ProductImage product={product} src={src} color={color} sku={variant?.sku} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">{categoryLabel}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{displayName(product, lang)}</h1>
          <p className="sku mt-2 text-sm text-muted">SKU: {variant?.sku}</p>
          <p className="mt-5 text-3xl font-semibold text-brand">{displayPrice(variant, lang)}</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted">
            {lang === "en" ? product.descriptionEn : product.description}
          </p>

          {variants.length > 1 && (
            <div className="mt-7">
              <p className="mb-3 text-sm font-medium">{t.variant}</p>
              <VariantChips
                variants={variants}
                index={index}
                onChange={(next) => {
                  setIndex(next)
                  setActiveImage(0)
                }}
              />
            </div>
          )}

          {(product.colors || []).length > 0 && (
            <div className="mt-7">
              <p className="mb-3 text-sm font-medium">{t.availableColors}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setColor(item)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                      color === item ? "border-brand bg-cream" : "border-line"
                    }`}
                  >
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ background: colorHex(item) }}
                    />
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 text-sm text-muted">
            {t.specDimensions}: <span className="text-ink">{specValue(variant?.size)}</span>
          </p>

          <button
            type="button"
            onClick={() => addItem(product, { color, variant })}
            className="mt-8 w-full rounded-full bg-brand py-3.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-hover"
          >
            {t.addToQuote}
          </button>

          <div className="mt-8 overflow-hidden rounded-xl border border-line">
            <div className="border-b border-line px-4 py-3 text-sm font-medium">
              {t.specifications}
            </div>
            <table className="w-full text-sm">
              <tbody>
                {specs.map(([label, value]) => (
                  <tr key={label} className="border-b border-line last:border-0">
                    <td className="w-[44%] px-4 py-3 text-muted">{label}</td>
                    <td className="px-4 py-3">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold">{t.related}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
