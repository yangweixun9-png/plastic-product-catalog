import { createContext, useContext, useMemo, useState } from "react"
import { translations } from "../data/translations"
import { readStore, writeStore } from "../lib/storage"

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const initial = readStore("lang", "zh") || "zh"
    if (typeof document !== "undefined") {
      document.documentElement.lang = initial === "en" ? "en" : "zh-CN"
    }
    return initial
  })

  const setLang = (next) => {
    setLangState(next)
    writeStore("lang", next)
    document.documentElement.lang = next === "en" ? "en" : "zh-CN"
  }

  const t = translations[lang] || translations.zh

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
