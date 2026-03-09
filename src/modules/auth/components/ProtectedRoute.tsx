import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/modules/auth/store/auth.store"
import type { ReactNode } from "react"
import { useLocation } from "react-router-dom"

type Props = {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { user, loading } = useAuthStore()
  const location = useLocation()

  if (loading) return <p>Cargando sesión...</p>

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
