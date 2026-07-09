import { useAuthContext } from '../../context/AuthContext'
import { useMiProveedor } from '../../hooks/useMiProveedor'
import { useLeads } from '../../hooks/useLeads'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import BottomNavProveedor from '../../components/BottomNavProveedor'
import SelectorRol from '../../components/SelectorRol'
import Icon from '../../components/ui/Icon'

const ICONOS_CATEGORIA = {
  maestro:    'construction',
  ferreteria: 'hardware',
  empresa:    'business',
}

export default function PerfilProveedor() {
  const { user } = useAuthContext()
  const { miProveedor } = useMiProveedor()
  const { leads, loading: loadingLeads } = useLeads()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const totalLeads = leads.length
  const leadsHoy   = leads.filter(l => {
    const fecha = l.createdAt?.toDate?.() ?? new Date(l.createdAt)
    return Date.now() - fecha.getTime() < 86400000
  }).length
  const leadsEstaSemana = leads.filter(l => {
    const fecha = l.createdAt?.toDate?.() ?? new Date(l.createdAt)
    return Date.now() - fecha.getTime() < 604800000
  }).length

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="bg-brand-600 rounded-card p-6 text-white mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name={ICONOS_CATEGORIA[miProveedor?.categoria] || 'construction'} size={28} />
            </div>
            <div>
              <h1 className="text-lg font-bold">{miProveedor?.nombre || 'Proveedor'}</h1>
              <p className="text-sm opacity-80">{user?.email}</p>
              <p className="text-xs opacity-70 mt-0.5">{miProveedor?.comuna}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Tu catálogo</p>
          <div className="space-y-2">
            {[
              { label: 'Categoría',  value: miProveedor?.categoria },
              { label: 'Rubro',      value: miProveedor?.rubro },
              { label: 'Verificado', value: miProveedor?.verificado ? 'Sí ✓' : 'No' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <p className="text-sm text-gray-500 shrink-0">{label}</p>
                <p className="text-sm text-gray-800 text-right">{value || '—'}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/mi-catalogo')}
            className="w-full mt-4 border border-brand-200 text-brand-700 hover:bg-brand-50 rounded-button py-2 text-xs font-medium transition flex items-center justify-center gap-1.5"
          >
            <Icon name="edit" size={14} />
            Editar catálogo
          </button>
        </div>

        <SelectorRol rolActual="proveedor" />

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
              <Icon
                name={ICONOS_CATEGORIA[miProveedor?.categoria] || 'construction'}
                size={40}
                className="text-white"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{miProveedor?.nombre || 'Proveedor'}</h1>
              <p className="text-brand-100 mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {miProveedor?.rubro && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                    {miProveedor.rubro}
                  </span>
                )}
                {miProveedor?.comuna && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="location_on" size={12} />
                    {miProveedor.comuna}
                  </span>
                )}
                {miProveedor?.verificado && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="verified" size={12} />
                    Verificado
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

            {/* Stats de leads */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icono: 'contacts', label: 'Total leads',       valor: totalLeads,       color: 'text-brand-600',   bg: 'bg-brand-50' },
                { icono: 'today',    label: 'Leads esta semana', valor: leadsEstaSemana,  color: 'text-success-600', bg: 'bg-success-50' },
                { icono: 'schedule', label: 'Leads hoy',         valor: leadsHoy,         color: 'text-success-600', bg: 'bg-success-50' },
              ].map(({ icono, label, valor, color, bg }) => (
                <div key={label} className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                  <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center mb-3`}>
                    <Icon name={icono} size={20} className={color} />
                  </div>
                  <p className={`text-2xl font-bold ${color}`}>{loadingLeads ? '—' : valor}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Datos del catálogo */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-800">Tu catálogo público</p>
                <button
                  onClick={() => navigate('/mi-catalogo')}
                  className="flex items-center gap-1.5 text-xs text-brand-600 font-medium border border-brand-200 px-3 py-1.5 rounded-button hover:bg-brand-50 transition"
                >
                  <Icon name="edit" size={14} />
                  Editar
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: 'Categoría',   key: 'categoria' },
                  { label: 'Rubro',       key: 'rubro' },
                  { label: 'Comuna',      key: 'comuna' },
                  { label: 'Teléfono',    key: 'telefono' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {miProveedor?.[key] || '—'}
                    </p>
                  </div>
                ))}
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                    Estado
                  </p>
                  <p className={`text-sm font-medium flex items-center gap-1 ${
                    miProveedor?.verificado ? 'text-success-600' : 'text-warning-600'
                  }`}>
                    <Icon
                      name={miProveedor?.verificado ? 'verified' : 'pending'}
                      size={14}
                    />
                    {miProveedor?.verificado ? 'Verificado' : 'Sin verificar'}
                  </p>
                </div>
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
                  <p className="text-sm text-gray-800 font-medium">Proveedor</p>
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
            <SelectorRol rolActual="proveedor" />

            {/* Preview perfil público */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-4">Vista previa</p>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon
                    name={ICONOS_CATEGORIA[miProveedor?.categoria] || 'storefront'}
                    size={22}
                    className="text-brand-600"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-semibold text-gray-800">{miProveedor?.nombre || '—'}</p>
                    {miProveedor?.verificado && (
                      <Icon name="verified" size={14} className="text-brand-600" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{miProveedor?.rubro || '—'}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                    <Icon name="location_on" size={11} />
                    {miProveedor?.comuna || '—'}
                  </p>
                </div>
              </div>
              <div className="w-full bg-brand-50 text-brand-700 text-xs font-medium rounded-button py-2 flex items-center justify-center gap-1.5">
                <Icon name="chat_bubble" size={13} />
                Contactar
              </div>
            </div>

            {/* Leads recientes */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                <p className="text-sm font-bold text-gray-700">Últimos leads</p>
                <button
                  onClick={() => navigate('/leads')}
                  className="text-xs text-brand-600 font-medium hover:underline"
                >
                  Ver todos →
                </button>
              </div>
              {leads.slice(0, 3).length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-gray-400">Sin leads aún</p>
                </div>
              ) : (
                leads.slice(0, 3).map((l) => (
                  <div key={l.id} className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <Icon name="person" size={14} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{l.nombre}</p>
                      <p className="text-xs text-gray-400 truncate">{l.mensaje || l.telefono}</p>
                    </div>
                  </div>
                ))
              )}
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

      <BottomNavProveedor />
    </div>
  )
}