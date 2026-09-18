import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"

export default function AdminInquiries() {
  const { inquiries, updateInquiry } = useCatalog()
  const { t } = useLanguage()

  return (
    <div>
      <h1 className="text-2xl font-bold">{t.inquiries}</h1>
      <div className="mt-6 space-y-3">
        {inquiries.length === 0 && (
          <div className="rounded-[14px] border border-dashed border-line py-16 text-center text-muted">
            {t.quoteEmpty}
          </div>
        )}
        {inquiries.map((item) => (
          <article key={item.id} className="rounded-[14px] border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{item.name} · {item.company}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.email} {item.whatsapp ? `· ${item.whatsapp}` : ""} · {item.country}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateInquiry(item.id, { status: item.status === "pending" ? "processed" : "pending" })
                }
                className="rounded-full bg-cream px-3 py-1 text-xs font-medium"
              >
                {item.status === "pending" ? t.pending : t.processed}
              </button>
            </div>
            {item.message && <p className="mt-3 text-sm text-muted">{item.message}</p>}
            {item.items?.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                {item.items.map((row) => (
                  <li key={`${row.sku}-${row.color}`}>
                    {row.name} · {row.sku} · {row.color} × {row.quantity}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-xs text-muted">{item.createdAt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
