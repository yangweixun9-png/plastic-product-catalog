import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function AdminRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-canvas text-sm text-muted">
        MUENHUI
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}

export function ProtectedRoute({ children }) {
  return <AdminRoute>{children}</AdminRoute>
}
