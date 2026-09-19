import { useState } from "react"
import { Check, FileSpreadsheet, Upload } from "lucide-react"
import { useCatalog } from "../../context/CatalogContext"
import { useLanguage } from "../../context/LanguageContext"

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (!lines.length) return []
  const headers = lines[0].split(",").map((item) => item.trim())
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((item) => item.trim())
    const row = {}
    headers.forEach((header, index) => {
      row[header] = cols[index]
    })
    return row
  })
}

const STEPS = ["uploadExcel", "readingProducts", "preview", "checkSku", "importNow"]

export default function AdminImport() {
  const { importProducts } = useCatalog()
  const { t } = useLanguage()
  const [step, setStep] = useState(0)
  const [rows, setRows] = useState([])
  const [message, setMessage] = useState("")
  const [fileName, setFileName] = useState("")

  const onFile = async (file) => {
    setFileName(file.name)
    setStep(1)
    setMessage("")
    const text = await file.text()
    const parsed = parseCsv(text)
    setTimeout(() => {
      setRows(parsed)
      setStep(parsed.length ? 2 : 0)
      if (!parsed.length) setMessage("No rows found. Use CSV headers: name,sku,category,price,colors")
    }, 400)
  }

  const skus = rows.map((row, index) => ({
    sku: String(row.sku || `NEW-${index + 1}`),
    name: row.name || "—",
    category: row.category || "—",
    price: row.price || "",
  }))

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">{t.importProducts}</h1>
      <p className="mt-2 text-sm text-muted">{t.importHint}</p>

      <ol className="mt-8 grid grid-cols-5 gap-2 text-center text-[11px] uppercase tracking-[0.08em]">
        {STEPS.map((key, index) => (
          <li key={key} className={index <= step ? "text-brand" : "text-muted"}>
            <span className={`mx-auto mb-2 flex h-7 w-7 items-center justify-center rounded-full border ${
              index <= step ? "border-brand bg-cream" : "border-line"
            }`}>
              {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
            </span>
            {t[key]}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-white px-6 py-16 transition-colors duration-200 hover:border-brand">
          <Upload className="h-6 w-6 text-brand" />
          <p className="mt-4 font-medium">{t.uploadExcel}</p>
          <p className="mt-1 text-sm text-muted">CSV · name, sku, category, price, colors</p>
          <input
            type="file"
            accept=".csv,.txt,.xlsx,.xls"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) onFile(file)
            }}
          />
        </label>
      )}

      {step === 1 && (
        <div className="mt-10 rounded-xl border border-line bg-white px-6 py-16 text-center">
          <FileSpreadsheet className="mx-auto h-6 w-6 text-brand" />
          <p className="mt-4 font-medium">{t.readingProducts}</p>
          <p className="mt-1 text-sm text-muted">{fileName}</p>
        </div>
      )}

      {step >= 2 && rows.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-line bg-white">
          <div className="border-b border-line px-4 py-3 text-sm font-medium">
            {t.preview} · {t.checkSku} ({skus.length})
          </div>
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-2">{t.sku}</th>
                  <th className="px-4 py-2">{t.products}</th>
                  <th className="px-4 py-2">{t.category}</th>
                  <th className="px-4 py-2">{t.price}</th>
                </tr>
              </thead>
              <tbody>
                {skus.map((row) => (
                  <tr key={row.sku} className="border-b border-line last:border-0">
                    <td className="sku px-4 py-2">{row.sku}</td>
                    <td className="px-4 py-2">{row.name}</td>
                    <td className="px-4 py-2 text-muted">{row.category}</td>
                    <td className="px-4 py-2">{row.price || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-2 border-t border-line p-4">
            <button type="button" onClick={() => { setStep(0); setRows([]) }} className="rounded-full border border-line px-4 py-2 text-sm">
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={() => {
                importProducts(rows)
                setStep(4)
                setMessage(`Imported ${rows.length} products.`)
              }}
              className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white hover:bg-brand-hover"
            >
              {t.importNow}
            </button>
          </div>
        </div>
      )}

      {message && <p className="mt-4 text-sm text-muted">{message}</p>}
    </div>
  )
}
