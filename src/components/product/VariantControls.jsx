import { ChevronLeft, ChevronRight } from "lucide-react"

export function VariantChips({ variants, index, onChange, className = "" }) {
  if (!variants?.length) return null
  return (
    <div className={`flex flex-wrap content-start gap-1 ${className}`}>
      {variants.map((variant, i) => (
        <button
          key={variant.specId || `${variant.sku}-${i}`}
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onChange(i)
          }}
          className={`rounded-full px-2 py-1 text-[11px] font-medium leading-tight transition ${
            i === index ? "bg-brand text-white" : "border border-line text-muted hover:border-brand hover:text-ink"
          }`}
        >
          {variant.label}
        </button>
      ))}
    </div>
  )
}

export function VariantDots({ count, index, onChange }) {
  if (count < 2) return <div className="h-4" />
  return (
    <div className="flex h-4 items-center justify-center gap-1">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`variant ${i + 1}`}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onChange(i)
          }}
          className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-brand" : "w-1.5 bg-neutral-300"}`}
        />
      ))}
    </div>
  )
}

export function VariantArrows({ enabled, onPrev, onNext }) {
  if (!enabled) return null
  return (
    <>
      <button
        type="button"
        aria-label="previous variant"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onPrev()
        }}
        className="absolute left-1.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm opacity-0 transition group-hover:opacity-100"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="next variant"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          onNext()
        }}
        className="absolute right-1.5 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-sm opacity-0 transition group-hover:opacity-100"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </>
  )
}
