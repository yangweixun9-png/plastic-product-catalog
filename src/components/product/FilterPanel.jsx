import { colorHex } from "../../lib/colors"
import { useLanguage } from "../../context/LanguageContext"
import { CATEGORIES } from "../../data/categories"

export default function FilterPanel({
  products,
  filters,
  onChange,
  onClear,
}) {
  const { lang, t } = useLanguage()
  const availableColors = [...new Set(products.flatMap((product) => product.colors || []))]

  const set = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{t.filters}</h3>
        <button type="button" onClick={onClear} className="text-xs text-muted hover:text-ink">
          {t.clearFilters}
        </button>
      </div>

      <section>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{t.category}</h4>
        <div className="space-y-1.5">
          {CATEGORIES.map((category) => {
            const active = filters.category === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => set({ category: category.id })}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition ${
                  active ? "bg-cream font-medium text-ink" : "text-muted hover:bg-neutral-50 hover:text-ink"
                }`}
              >
                <span>{lang === "en" ? category.nameEn : category.name}</span>
                {active && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{t.color}</h4>
        <div className="space-y-2">
          {availableColors.map((color) => {
            const checked = filters.colors.includes(color)
            return (
              <label key={color} className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => {
                    const next = checked
                      ? filters.colors.filter((item) => item !== color)
                      : [...filters.colors, color]
                    set({ colors: next })
                  }}
                />
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                    checked ? "border-ink" : "border-line"
                  }`}
                >
                  <span
                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                    style={{ background: colorHex(color) }}
                  />
                </span>
                {color}
              </label>
            )
          })}
        </div>
      </section>

      <section>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{t.priceRange}</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder={t.min}
            value={filters.minPrice}
            onChange={(event) => set({ minPrice: event.target.value })}
            className="w-full rounded-lg border border-line px-2.5 py-2 text-sm outline-none focus:border-brand"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min="0"
            placeholder={t.max}
            value={filters.maxPrice}
            onChange={(event) => set({ maxPrice: event.target.value })}
            className="w-full rounded-lg border border-line px-2.5 py-2 text-sm outline-none focus:border-brand"
          />
        </div>
      </section>

      <section>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{t.size}</h4>
        <input
          type="text"
          placeholder={t.sizePlaceholder}
          value={filters.size}
          onChange={(event) => set({ size: event.target.value })}
          className="w-full rounded-lg border border-line px-2.5 py-2 text-sm outline-none focus:border-brand"
        />
      </section>

      <section>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{t.skuFilter}</h4>
        <input
          type="text"
          placeholder={t.skuPlaceholder}
          value={filters.sku}
          onChange={(event) => set({ sku: event.target.value })}
          className="w-full rounded-lg border border-line px-2.5 py-2 text-sm outline-none focus:border-brand"
        />
      </section>

      <section>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">{t.isNew}</h4>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.newOnly}
            onChange={(event) => set({ newOnly: event.target.checked })}
            className="h-4 w-4 accent-[#FFC928]"
          />
          {t.newOnly}
        </label>
      </section>
    </div>
  )
}
