import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export default function RoleRoute({ children, allowedRoles }) {
  const { user, profile } = useAuthContext()

  if (!user) return <Navigate to="/login" replace />
  if (!profile?.role) return <Navigate to="/seleccion-rol" replace />
  if (!allowedRoles.includes(profile.role)) return <Navigate to="/home" replace />

  return children
}