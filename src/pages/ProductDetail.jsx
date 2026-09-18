import { useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { useCatalog } from "../context/CatalogContext"
import { useLanguage } from "../context/LanguageContext"
import { useQuoteCart } from "../context/QuoteCartContext"
import ProductImage from "../components/product/ProductImage"
import ProductCard from "../components/product/ProductCard"
import { colorHex } from "../lib/colors"
import { displayName, formatPrice, specValue } from "../lib/format"

export default function ProductDetail() {
  const { sku } = useParams()
  const { products, categories } = useCatalog()
  const { t, lang } = useLanguage()
  const { addItem } = useQuoteCart()
  const product = products.find((item) => item.sku.toLowerCase() === decodeURIComponent(sku || "").toLowerCase())
  const [activeImage, setActiveImage] = useState(0)
  const [color, setColor] = useState(product?.colors?.[0] || "")

  useEffect(() => {
    setActiveImage(0)
    setColor(product?.colors?.[0] || "")
  }, [product?.sku])

  const thumbs = useMemo(() => {
    if (!product) return []
    const images = product.images?.length ? product.images : [null]
    const extras = product.colors.slice(0, 3).map((item) => ({ type: "color", color: item }))
    return [
      { type: "image", src: images[0], color: product.colors[0] },
      ...extras,
    ].slice(0, 4)
  }, [product])

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
    [t.specDimensions, specValue(product.dimensions)],
    [t.specFold, specValue(product.foldSize)],
    [t.specPacking, specValue(product.packingQuantity)],
    [t.specCarton, specValue(product.cartonSize)],
    [t.specNet, specValue(product.netWeight)],
    [t.specGross, specValue(product.grossWeight)],
    [t.specUnitNet, specValue(product.unitNetWeight)],
    [t.specCartonGross, specValue(product.cartonGrossWeight)],
    [t.specHq40, specValue(product.hq40)],
  ]

  const related = products
    .filter((item) => item.category === product.category && item.sku !== product.sku)
    .slice(0, 4)

  const currentThumb = thumbs[activeImage] || thumbs[0]

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-muted">
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

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="overflow-hidden rounded-[14px] border border-line bg-cream">
            <div className="aspect-square">
              <ProductImage
                product={product}
                src={currentThumb?.src}
                color={currentThumb?.color || color}
                sku={product.sku}
              />
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {thumbs.map((thumb, index) => (
              <button
                key={`${thumb.type}-${index}`}
                type="button"
                onClick={() => {
                  setActiveImage(index)
                  if (thumb.color) setColor(thumb.color)
                }}
                className={`overflow-hidden rounded-xl border ${
                  activeImage === index ? "border-brand" : "border-line"
                }`}
              >
                <div className="aspect-square">
                  <ProductImage product={product} src={thumb.src} color={thumb.color} sku={product.sku} />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm text-muted">{categoryLabel}</p>
          <h1 className="mt-2 text-3xl font-bold">{displayName(product, lang)}</h1>
          <p className="sku mt-2 text-sm font-medium text-muted">SKU: {product.sku}</p>
          <p className="mt-4 text-3xl font-bold text-brand-hover">{formatPrice(product.price, lang)}</p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-muted">
            {lang === "en" ? product.descriptionEn : product.description}
          </p>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">
              {t.color}
              {color ? ` · ${color}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setColor(item)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                    color === item ? "border-ink bg-cream" : "border-line"
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ background: colorHex(item) }}
                  />
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-[14px] border border-line">
            <div className="border-b border-line bg-cream/70 px-4 py-3 text-sm font-semibold">
              {t.specifications}
            </div>
            <table className="w-full text-sm">
              <tbody>
                {specs.map(([label, value]) => (
                  <tr key={label} className="border-b border-line last:border-0">
                    <td className="w-[42%] px-4 py-3 text-muted">{label}</td>
                    <td className="px-4 py-3 font-medium">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addItem(product, { color })}
              className="flex-1 rounded-full bg-brand py-3 text-sm font-semibold hover:bg-brand-hover"
            >
              {t.addToQuote}
            </button>
            <Link
              to="/contact"
              className="flex-1 rounded-full border border-line py-3 text-center text-sm font-semibold hover:border-ink"
            >
              {t.contactUs}
            </Link>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">{t.related}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.sku} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
