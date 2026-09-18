import { NavLink, Outlet, Link } from "react-router-dom"
import {
  Box,
  FileSpreadsheet,
  Inbox,
  LayoutDashboard,
  Settings,
  Store,
  Users,
} from "lucide-react"
import { useLanguage } from "../../context/LanguageContext"

const nav = [
  { to: "/admin", key: "dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", key: "products", icon: Box },
  { to: "/admin/categories", key: "categories", icon: Inbox },
  { to: "/admin/inquiries", key: "inquiries", icon: FileSpreadsheet },
  { to: "/admin/customers", key: "customers", icon: Users },
  { to: "/admin/import", key: "import", icon: FileSpreadsheet },
  { to: "/admin/settings", key: "settings", icon: Settings },
]

export default function AdminLayout() {
  const { t } = useLanguage()

  return (
    <div className="min-h-dvh bg-[#FAFAFA] lg:flex">
      <aside className="border-b border-line bg-white lg:flex lg:min-h-dvh lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand">
            <span className="flex h-5 w-5 flex-col justify-between">
              <span className="h-[3px] rounded-full bg-ink" />
              <span className="h-[3px] rounded-full bg-ink" />
              <span className="h-[3px] rounded-full bg-ink" />
            </span>
          </span>
          <div>
            <p className="text-xs font-extrabold tracking-[0.14em]">PRODUCT HUB</p>
            <p className="text-[11px] text-muted">{t.admin}</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm ${
                  isActive ? "bg-cream font-semibold text-ink" : "text-muted hover:bg-neutral-50 hover:text-ink"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              {t[item.key]}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="m-3 hidden items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-cream lg:flex">
          <Store className="h-4 w-4" />
          {t.backToStore}
        </Link>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="border-b border-line bg-white px-4 py-3 text-xs text-muted sm:px-6">
          {t.demoNotice}
        </div>
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
