import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import BrandLogo from "../../components/brand/BrandLogo"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const { t, lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextEmail = String(data.get("email") || "").trim()
    const nextPassword = String(data.get("password") || "")
    setError("")
    setSubmitting(true)
    try {
      await login(nextEmail, nextPassword)
      const from = location.state?.from?.pathname || "/admin"
      navigate(from, { replace: true })
    } catch {
      setError(t.invalidCredentials)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-[400px]">
        <div className="rounded-xl border border-line bg-white px-8 py-10">
          <BrandLogo to="/admin/login" className="mx-auto h-14" />
          <p className="mt-5 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
            {t.adminLoginTitle}
          </p>
          <h1 className="mt-2 text-center text-xl font-semibold tracking-tight">{t.adminLoginHeading}</h1>
          <p className="mt-2 text-center text-sm text-muted">{t.adminLoginSubtitle}</p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">{t.email}</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="username"
                className="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">{t.password}</span>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-brand"
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-brand-hover disabled:opacity-60"
            >
              {t.signIn}
            </button>
          </form>
        </div>
        <div className="mt-4 flex justify-center gap-3 text-xs text-muted">
          <button type="button" onClick={() => setLang("zh")} className={lang === "zh" ? "text-brand" : ""}>
            {t.langZh}
          </button>
          <span>/</span>
          <button type="button" onClick={() => setLang("en")} className={lang === "en" ? "text-brand" : ""}>
            {t.langEn}
          </button>
        </div>
      </div>
    </div>
  )
}
