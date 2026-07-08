import { useAuthContext } from '../../context/AuthContext'
import { usePerfilFamilia } from '../../hooks/usePerfilFamilia'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import SelectorRol from '../../components/SelectorRol'
import Icon from '../../components/ui/Icon'

export default function PerfilFamilia() {
  const { user } = useAuthContext()
  const { perfilFamilia: profile } = usePerfilFamilia()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="bg-brand-600 rounded-card p-6 text-white mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="person" size={28} />
            </div>
            <div>
              <h1 className="text-lg font-bold">{profile?.name || 'Usuario'}</h1>
              <p className="text-sm opacity-80">{user?.email}</p>
              <p className="text-xs opacity-70 mt-0.5">{profile?.region}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Tu perfil</p>
          <div className="space-y-2">
            {[
              { label: 'Edad', value: profile?.edad },
              { label: 'Vivienda', value: profile?.vivienda },
              { label: 'Región', value: profile?.region },
              { label: 'Ingresos', value: profile?.ingresos },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <p className="text-sm text-gray-500 shrink-0">{label}</p>
                <p className="text-sm text-gray-800 text-right">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <SelectorRol rolActual="familia" />

        <button
          onClick={handleLogout}
          className="w-full border border-warning-200 text-warning-700 hover:bg-warning-50 rounded-card py-3 text-sm font-medium transition flex items-center justify-center gap-1.5"
        >
          <Icon name="logout" size={16} />
          Cerrar sesión
        </button>

      </div>
      <BottomNav />
    </div>
  )
}