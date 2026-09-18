import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"

export default function AdminCustomers() {
  const { customers } = useCatalog()
  const { t } = useLanguage()

  return (
    <div>
      <h1 className="text-2xl font-bold">{t.customers}</h1>
      <div className="mt-6 overflow-x-auto rounded-[14px] border border-line bg-white">
        <table className="min-w-[640px] w-full text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{t.name}</th>
              <th className="px-4 py-3 font-medium">{t.company}</th>
              <th className="px-4 py-3 font-medium">{t.country}</th>
              <th className="px-4 py-3 font-medium">{t.email}</th>
              <th className="px-4 py-3 font-medium">{t.inquiries}</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-12 text-center text-muted">
                  {t.quoteEmpty}
                </td>
              </tr>
            )}
            {customers.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-medium">{item.name}</td>
                <td className="px-4 py-3">{item.company}</td>
                <td className="px-4 py-3">{item.country}</td>
                <td className="px-4 py-3 text-muted">{item.email}</td>
                <td className="px-4 py-3">{item.inquiries}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
