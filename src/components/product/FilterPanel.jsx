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
  const materials = [...new Set(products.map((product) => product.material || "PP"))]

  const set = (patch) => onChange({ ...filters, ...patch })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink">{t.filters}</h3>
        <button type="button" onClick={onClear} className="text-xs text-muted hover:text-ink">
          {t.clearFilters}
        </button>
      </div>

      <section>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t.category}</h4>
        <div className="space-y-1">
          {CATEGORIES.map((category) => {
            const active = filters.category === category.id
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => set({ category: category.id })}
                className={`flex w-full items-center justify-between py-1.5 text-left text-sm transition-colors duration-200 ${
                  active ? "font-medium text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <span>{lang === "en" ? category.nameEn : category.name}</span>
                {active && <span className="h-1 w-1 rounded-full bg-brand" />}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t.color}</h4>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => {
            const checked = filters.colors.includes(color)
            return (
              <button
                key={color}
                type="button"
                title={color}
                onClick={() => {
                  const next = checked
                    ? filters.colors.filter((item) => item !== color)
                    : [...filters.colors, color]
                  set({ colors: next })
                }}
                className={`h-6 w-6 rounded-full border ${checked ? "border-brand" : "border-line"}`}
                style={{ background: colorHex(color) }}
              />
            )
          })}
        </div>
      </section>

      <section>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t.priceRange}</h4>
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
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t.size}</h4>
        <input
          type="text"
          placeholder={t.sizePlaceholder}
          value={filters.size}
          onChange={(event) => set({ size: event.target.value })}
          className="w-full rounded-lg border border-line px-2.5 py-2 text-sm outline-none focus:border-brand"
        />
      </section>

      <section>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t.material}</h4>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => set({ material: "all" })}
            className={`block py-1 text-sm ${filters.material === "all" || !filters.material ? "text-ink" : "text-muted"}`}
          >
            {lang === "en" ? "All" : "全部"}
          </button>
          {materials.map((material) => (
            <button
              key={material}
              type="button"
              onClick={() => set({ material })}
              className={`block py-1 text-sm ${filters.material === material ? "text-ink" : "text-muted"}`}
            >
              {material}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t.availability}</h4>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.availability === "available"}
            onChange={(event) => set({ availability: event.target.checked ? "available" : "all" })}
            className="h-4 w-4 accent-[#A08058]"
          />
          {t.available}
        </label>
      </section>

      <section>
        <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t.isNew}</h4>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.newOnly}
            onChange={(event) => set({ newOnly: event.target.checked })}
            className="h-4 w-4 accent-[#A08058]"
          />
          {t.newOnly}
        </label>
      </section>
    </div>
  )
}
