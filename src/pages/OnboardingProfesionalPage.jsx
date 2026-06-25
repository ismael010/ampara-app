import { useAuthContext } from '../context/AuthContext'
import OnboardingProveedorPage from './OnboardingProveedorPage'
import OnboardingEPPage from './OnboardingEPPage'
import OnboardingEmpresaESGPage from './OnboardingEmpresaESGPage'

export default function OnboardingProfesionalPage() {
  const { profile } = useAuthContext()

  if (profile?.role === 'proveedor') {
    return <OnboardingProveedorPage />
  }

  if (profile?.role === 'ep') {
    return <OnboardingEPPage />
  }

  if (profile?.role === 'empresa_esg') {
    return <OnboardingEmpresaESGPage />
  }

  return null
}