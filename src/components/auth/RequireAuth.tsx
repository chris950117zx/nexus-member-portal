import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useMemberStore } from '../../store/useMemberStore'

export function RequireAuth() {
  const isAuthenticated = useMemberStore((state) => state.isAuthenticated)
  const location = useLocation()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from:location.pathname }} />
}
