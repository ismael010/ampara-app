import { useAuthContext } from '../../context/AuthContext'
import { usePerfilFamilia } from '../../hooks/usePerfilFamilia'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import SelectorRol from '../../components/SelectorRol'
import Icon from '../../components/ui/Icon'

const CAMPOS_PERFIL = [
  { label: 'Edad',      key: 'edad' },
  { label: 'Vivienda',  key: 'vivienda' },
  { label: 'Región',    key: 'region' },
  { label: 'Ingresos',  key: 'ingresos' },
  { label: 'Educación', key: 'educacion' },
  { label: 'Daño',      key: 'danio' },
]

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
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
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
              { label: 'Edad',     value: profile?.edad },
              { label: 'Vivienda', value: profile?.vivienda },
              { label: 'Región',   value: profile?.region },
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

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-10 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <Icon name="person" size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{profile?.name || 'Usuario'}</h1>
              <p className="text-brand-100 mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <Icon name="home" size={12} />
                  Familia
                </span>
                {profile?.region && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="location_on" size={12} />
                    {profile.region}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-button transition"
            >
              <Icon name="logout" size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="px-10 grid grid-cols-3 gap-6">

          {/* Columna izquierda — datos del perfil */}
          <div className="col-span-2 flex flex-col gap-5">

            {/* Datos personales */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-800">Datos del perfil</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Solo lectura
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {CAMPOS_PERFIL.map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {profile?.[key] || '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Convivencia */}
            {profile?.convivencia?.length > 0 && (
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-6">
                <p className="font-bold text-gray-800 mb-4">¿Con quiénes vives?</p>
                <div className="flex flex-wrap gap-2">
                  {profile.convivencia.map((c) => (
                    <span
                      key={c}
                      className="bg-brand-50 text-brand-700 text-sm px-4 py-1.5 rounded-full border border-brand-100"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cuenta */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-6">
              <p className="font-bold text-gray-800 mb-4">Cuenta</p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Correo electrónico
                  </p>
                  <p className="text-sm text-gray-800 font-medium">{user?.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Tipo de cuenta
                  </p>
                  <p className="text-sm text-gray-800 font-medium">Familia</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    UID
                  </p>
                  <p className="text-xs text-gray-400 font-mono truncate">{user?.uid}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha — acciones */}
          <div className="flex flex-col gap-5">

            {/* Selector de rol */}
            <SelectorRol rolActual="familia" />

            {/* Accesos rápidos */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Accesos rápidos</p>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Mis documentos',  icono: 'folder',          ruta: '/documentos' },
                  { label: 'Mis subsidios',    icono: 'account_balance', ruta: '/subsidios' },
                  { label: 'Seguimiento',      icono: 'route',           ruta: '/seguimiento' },
                  { label: 'Marketplace',      icono: 'storefront',      ruta: '/marketplace' },
                  { label: 'Asistente',        icono: 'smart_toy',       ruta: '/asistente' },
                ].map(({ label, icono, ruta }) => (
                  <button
                    key={ruta}
                    onClick={() => navigate(ruta)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition text-left"
                  >
                    <Icon name={icono} size={16} className="text-brand-400" />
                    <span className="text-sm text-gray-700">{label}</span>
                    <Icon name="chevron_right" size={16} className="text-gray-300 ml-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="w-full border border-warning-200 text-warning-700 hover:bg-warning-50 rounded-card py-3 text-sm font-medium transition flex items-center justify-center gap-1.5"
            >
              <Icon name="logout" size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}