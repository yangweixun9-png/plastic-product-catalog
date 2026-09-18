import { useState } from "react"
import { Mail, MapPin, MessageCircle } from "lucide-react"
import { useCatalog } from "../context/CatalogContext"
import { useLanguage } from "../context/LanguageContext"

export default function Contact() {
  const { t } = useLanguage()
  const { settings, addInquiry } = useCatalog()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: "",
    company: "",
    country: "",
    email: "",
    whatsapp: "",
    message: "",
  })

  const onSubmit = (event) => {
    event.preventDefault()
    addInquiry({ ...form, items: [], source: "contact" })
    setSent(true)
  }

  return (
    <div className="mx-auto grid max-w-[1280px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">{t.contactTitle}</h1>
        <p className="mt-3 max-w-md text-muted">{t.contactSubtitle}</p>
        <div className="mt-8 space-y-4 text-sm">
          <p className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-brand-hover" />
            {t.contactFactory} · {settings.country}
          </p>
          <p className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-brand-hover" />
            {settings.email}
          </p>
          <p className="flex items-center gap-3">
            <MessageCircle className="h-4 w-4 text-brand-hover" />
            {settings.whatsapp}
          </p>
          <p className="text-muted">{t.contactHours}</p>
        </div>
      </div>

      <div className="rounded-[14px] border border-line p-6">
        {sent ? (
          <p className="py-10 text-center text-lg font-medium">{t.messageSent}</p>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            {[
              ["name", t.name],
              ["company", t.company],
              ["country", t.country],
              ["email", t.email],
              ["whatsapp", t.whatsapp],
            ].map(([key, label]) => (
              <label key={key} className="block text-sm">
                <span className="mb-1.5 block font-medium">{label}</span>
                <input
                  required={key === "name" || key === "email"}
                  type={key === "email" ? "email" : "text"}
                  value={form[key]}
                  onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
                />
              </label>
            ))}
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">{t.message}</span>
              <textarea
                rows="4"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                className="w-full rounded-xl border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>
            <button type="submit" className="w-full rounded-full bg-brand py-3 text-sm font-semibold hover:bg-brand-hover">
              {t.sendMessage}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
