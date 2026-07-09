import { useAuthContext } from '../../context/AuthContext'
import { useMiEP } from '../../hooks/useMiEP'
import { useFamiliasEP } from '../../hooks/useFamiliasEP'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import BottomNavEP from '../../components/BottomNavEP'
import SelectorRol from '../../components/SelectorRol'
import Icon from '../../components/ui/Icon'

export default function PerfilEP() {
  const { user } = useAuthContext()
  const { miEP } = useMiEP()
  const { familias, loading } = useFamiliasEP()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const totalFamilias    = familias.length
  const conSeguimiento   = familias.filter(f => f.etapaActual !== null).length
  const docsCompletos    = familias.filter(f => f.pctDocs === 100).length
  const promedioDocs     = totalFamilias > 0
    ? Math.round(familias.reduce((acc, f) => acc + f.pctDocs, 0) / totalFamilias)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="bg-brand-600 rounded-card p-6 text-white mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="apartment" size={28} />
            </div>
            <div>
              <h1 className="text-lg font-bold">{miEP?.nombre || 'EP'}</h1>
              <p className="text-sm opacity-80">{user?.email}</p>
              <p className="text-xs opacity-70 mt-0.5">{miEP?.comuna}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Tu organización</p>
          <div className="space-y-2">
            {[
              { label: 'Tipo',               value: miEP?.tipo },
              { label: 'Rubro',              value: miEP?.rubro },
              { label: 'Familias estimadas', value: miEP?.rangoFamilias },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <p className="text-sm text-gray-500 shrink-0">{label}</p>
                <p className="text-sm text-gray-800 text-right">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <SelectorRol rolActual="ep" />

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
              <Icon name="apartment" size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{miEP?.nombre || 'EP'}</h1>
              <p className="text-brand-100 mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {miEP?.tipo && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="apartment" size={12} />
                    {miEP.tipo}
                  </span>
                )}
                {miEP?.comuna && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="location_on" size={12} />
                    {miEP.comuna}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-5 py-2.5 rounded-button transition"
            >
              <Icon name="logout" size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="px-10 grid grid-cols-3 gap-6">

          {/* Columna izquierda */}
          <div className="col-span-2 flex flex-col gap-6">

            {/* Stats de impacto */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { icono: 'groups',      label: 'Familias',        valor: totalFamilias,  color: 'text-brand-600',   bg: 'bg-brand-50' },
                { icono: 'route',       label: 'Con seguimiento', valor: conSeguimiento, color: 'text-success-600', bg: 'bg-success-50' },
                { icono: 'description', label: 'Docs completos',  valor: docsCompletos,  color: 'text-success-600', bg: 'bg-success-50' },
                { icono: 'percent',     label: 'Promedio docs',   valor: `${promedioDocs}%`, color: 'text-brand-600', bg: 'bg-brand-50' },
              ].map(({ icono, label, valor, color, bg }) => (
                <div key={label} className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                  <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center mb-3`}>
                    <Icon name={icono} size={20} className={color} />
                  </div>
                  <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : valor}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Datos de la organización */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-800">Datos de la organización</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Solo lectura
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: 'Tipo de organización', key: 'tipo' },
                  { label: 'Rubro específico',     key: 'rubro' },
                  { label: 'Zona de cobertura',    key: 'comuna' },
                  { label: 'Familias estimadas',   key: 'rangoFamilias' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {miEP?.[key] || '—'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

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
                  <p className="text-sm text-gray-800 font-medium">Entidad Patrocinante (EP)</p>
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

          {/* Columna derecha */}
          <div className="flex flex-col gap-5">

            {/* Selector de rol */}
            <SelectorRol rolActual="ep" />

            {/* Accesos rápidos */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Accesos rápidos</p>
              <div className="flex flex-col gap-1">
                {[
                  { label: 'Ver familias',  icono: 'groups',     ruta: '/familias' },
                  { label: 'Marketplace',   icono: 'storefront', ruta: '/marketplace' },
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

      <BottomNavEP />
    </div>
  )
}