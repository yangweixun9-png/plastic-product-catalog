import { useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  Box,
  FileSpreadsheet,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Upload,
  Users,
  X,
} from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { useLanguage } from "../../context/LanguageContext"
import BrandLogo from "../../components/brand/BrandLogo"

const nav = [
  { to: "/admin", key: "dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/products", key: "products", icon: Box },
  { to: "/admin/categories", key: "categories", icon: Inbox },
  { to: "/admin/inquiries", key: "inquiries", icon: FileSpreadsheet },
  { to: "/admin/customers", key: "customers", icon: Users },
  { to: "/admin/import", key: "import", icon: Upload },
  { to: "/admin/settings", key: "settings", icon: Settings },
]

export default function AdminLayout() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const onLogout = async () => {
    await logout()
    navigate("/admin/login", { replace: true })
  }

  const sidebar = (
    <>
      <div className="border-b border-line px-5 py-5">
        <BrandLogo to="/admin" className="h-11" />
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          {t.adminLoginTitle}
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200 ${
                isActive ? "bg-cream font-medium text-ink" : "text-muted hover:bg-canvas hover:text-ink"
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {t[item.key]}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-line px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{t.adminAccount}</p>
        <p className="mt-1 truncate text-sm text-ink">{user?.email || t.adminAccount}</p>
        <button
          type="button"
          onClick={onLogout}
          className="mt-3 inline-flex items-center gap-2 text-sm text-muted transition-colors duration-200 hover:text-ink"
        >
          <LogOut className="h-4 w-4" />
          {t.logout}
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white px-4 lg:hidden">
        <BrandLogo to="/admin" className="h-9" />
        <button type="button" onClick={() => setOpen(true)} aria-label="Menu" className="rounded-lg p-2 text-ink">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/25" />
          <aside
            className="absolute inset-y-0 left-0 flex w-[240px] flex-col bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="absolute right-3 top-4 p-1 text-muted" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-[240px] flex-col border-r border-line bg-white lg:flex">
        {sidebar}
      </aside>

      <div className="lg:pl-[240px]">
        <div className="p-4 sm:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
