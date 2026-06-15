import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'

export default function ProtectedRoute({ children, requiresProfile = false }) {
  const { user, profile } = useAuthContext()

  if (!user) return <Navigate to="/login" replace />

  if (requiresProfile && !profile?.completedOnboarding) {
    return <Navigate to="/onboarding" replace />
  }

  return children
}