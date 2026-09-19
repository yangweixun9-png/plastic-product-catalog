import { useState } from "react"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"

export default function AdminSettings() {
  const { settings, persistSettings, resetDemo } = useCatalog()
  const { t } = useLanguage()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">{t.settings}</h1>
      <form
        className="mt-6 space-y-4 rounded-[14px] border border-line bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault()
          persistSettings(form)
          setSaved(true)
        }}
      >
        {[
          ["company", t.companyName],
          ["email", t.email],
          ["whatsapp", t.whatsapp],
          ["country", t.country],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="mb-1.5 block text-muted">{label}</span>
            <input
              value={form[key] || ""}
              onChange={(event) => setForm({ ...form, [key]: event.target.value })}
              className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
            />
          </label>
        ))}
        <button type="submit" className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-hover">
          {t.save}
        </button>
        {saved && <span className="ml-3 text-sm text-muted">Saved</span>}
      </form>
      <button
        type="button"
        onClick={() => {
          if (confirm(t.resetData + "?")) resetDemo()
        }}
        className="mt-6 text-sm text-muted hover:text-ink"
      >
        {t.resetData}
      </button>
    </div>
  )
}
