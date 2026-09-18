import { useEffect, useState } from "react"
import { colorHex } from "../../lib/colors"
import { firstImage } from "../../lib/format"

function RackArt({ accent }) {
  return (
    <svg viewBox="0 0 200 240" className="h-[68%] w-[68%]" aria-hidden>
      <rect x="46" y="28" width="8" height="184" rx="2" fill="#171717" />
      <rect x="146" y="28" width="8" height="184" rx="2" fill="#171717" />
      {[42, 88, 134, 180].map((y) => (
        <rect key={y} x="36" y={y} width="128" height="10" rx="2" fill={accent} />
      ))}
    </svg>
  )
}

function BoxArt({ accent }) {
  return (
    <svg viewBox="0 0 200 240" className="h-[62%] w-[62%]" aria-hidden>
      <path d="M28 86 L100 52 L172 86 L100 120 Z" fill={accent} />
      <path d="M28 86 L28 156 L100 190 L100 120 Z" fill="#171717" opacity="0.16" />
      <path d="M172 86 L172 156 L100 190 L100 120 Z" fill="#171717" opacity="0.28" />
      <path d="M28 86 L100 120 L172 86" fill="none" stroke="#171717" strokeWidth="2" />
    </svg>
  )
}

function HamperArt({ accent }) {
  return (
    <svg viewBox="0 0 200 240" className="h-[66%] w-[66%]" aria-hidden>
      <rect x="48" y="46" width="104" height="148" rx="22" fill={accent} />
      <rect x="62" y="62" width="76" height="116" rx="16" fill="#fff" opacity="0.35" />
      {[78, 108, 138].map((y) => (
        <circle key={y} cx="100" cy={y} r="7" fill="#171717" opacity="0.18" />
      ))}
    </svg>
  )
}

function BasketArt({ accent }) {
  return (
    <svg viewBox="0 0 200 240" className="h-[66%] w-[66%]" aria-hidden>
      <rect x="30" y="70" width="140" height="100" rx="18" fill={accent} />
      <path d="M46 70 C46 46, 154 46, 154 70" fill="none" stroke="#171717" strokeWidth="8" />
      <rect x="44" y="88" width="112" height="64" rx="10" fill="#fff" opacity="0.28" />
    </svg>
  )
}

function artFor(product) {
  if (product?.category === "收纳架") return RackArt
  if (product?.category === "收纳箱") return BoxArt
  if (product?.sku === "A02" || product?.sku === "B02" || product?.name?.includes("脏衣")) return HamperArt
  return BasketArt
}

export default function ProductImage({
  product,
  src,
  alt,
  className = "",
  color,
  sku,
}) {
  const [failed, setFailed] = useState(false)
  const url = src || firstImage(product)
  const code = sku || product?.sku || "—"
  const accent = colorHex(color || product?.colors?.[0] || "黄色")
  const Art = artFor(product)

  useEffect(() => {
    setFailed(false)
  }, [url])

  const placeholder = (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden bg-cream ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#fff,transparent_58%)]" />
      <div className="relative flex flex-1 items-center justify-center">
        <Art accent={accent} />
      </div>
      <div className="relative border-t border-line/80 bg-white/80 px-3 py-2 text-center backdrop-blur-sm">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-muted">PRODUCT IMAGE</p>
        <p className="sku mt-0.5 text-xs font-semibold text-ink">SKU: {code}</p>
      </div>
    </div>
  )

  if (!url || failed) return placeholder

  return (
    <div className={`relative h-full w-full overflow-hidden bg-cream ${className}`}>
      <img
        src={url}
        alt={alt || product?.name || code}
        draggable={false}
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
