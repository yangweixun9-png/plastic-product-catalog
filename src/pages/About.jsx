import BrandLogo from "../components/brand/BrandLogo"
import { useLanguage } from "../context/LanguageContext"

export default function About() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">{t.aboutEyebrow}</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">{t.aboutTitle}</h1>
      <div className="mt-10 max-w-xs">
        <BrandLogo link={false} className="h-24 w-auto" />
      </div>
      <p className="mt-10 text-lg leading-8 text-ink">{t.aboutLead}</p>
      <p className="mt-6 text-base leading-8 text-muted">{t.aboutBody}</p>
    </div>
  )
}
