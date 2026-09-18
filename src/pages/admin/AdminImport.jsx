import { useState } from "react"
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

export default function AdminImport() {
  const { importProducts } = useCatalog()
  const { t } = useLanguage()
  const [message, setMessage] = useState("")

  const onFile = async (file) => {
    const text = await file.text()
    const rows = parseCsv(text)
    if (!rows.length) {
      setMessage("No rows found. Use CSV headers: name,sku,category,price,colors")
      return
    }
    importProducts(rows)
    setMessage(`Imported ${rows.length} products into localStorage.`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">{t.importExcel}</h1>
      <p className="mt-2 text-sm text-muted">
        Demo 支持 CSV / Excel 导出的纯文本导入。表头示例：name,sku,category,price,colors,dimensions
      </p>
      <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-line bg-white px-6 py-16">
        <p className="font-medium">Upload CSV</p>
        <p className="mt-1 text-sm text-muted">name, sku, category, price, colors</p>
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
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  )
}
