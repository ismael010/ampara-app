import { useNavigate } from 'react-router-dom'
import { useProfile } from '../../hooks/useProfile'
import { useMiProveedor } from '../../hooks/useMiProveedor'
import { useLeads } from '../../hooks/useLeads'
import Icon from '../../components/ui/Icon'
import BottomNavProveedor from '../../components/BottomNavProveedor'

const ICONOS_CATEGORIA = {
  maestro:    'construction',
  ferreteria: 'hardware',
  empresa:    'business',
}

function TiempoAtras({ fecha }) {
  if (!fecha) return null
  const ms = Date.now() - (fecha?.toDate?.() ?? new Date(fecha)).getTime()
  const mins  = Math.floor(ms / 60000)
  const horas = Math.floor(ms / 3600000)
  const dias  = Math.floor(ms / 86400000)
  if (mins < 60)  return <span className="text-xs text-gray-400">{mins}m atrás</span>
  if (horas < 24) return <span className="text-xs text-gray-400">{horas}h atrás</span>
  return <span className="text-xs text-gray-400">{dias}d atrás</span>
}

export default function HomeProveedor() {
  const { profile } = useProfile()
  const { miProveedor } = useMiProveedor()
  const { leads, loading: loadingLeads } = useLeads()
  const navigate = useNavigate()

  const leadsRecientes  = leads.slice(0, 5)
  const leadsHoy        = leads.filter(l => {
    const fecha = l.createdAt?.toDate?.() ?? new Date(l.createdAt)
    return Date.now() - fecha.getTime() < 86400000
  }).length
  const totalLeads      = leads.length
  const perfilCompleto  = !!(miProveedor?.nombre && miProveedor?.rubro && miProveedor?.telefono)

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-5">
          <p className="text-sm text-gray-500">Bienvenido,</p>
          <h1 className="text-xl font-bold text-gray-800">
            {miProveedor?.nombre || profile?.name || 'Proveedor'}
          </h1>
          {miProveedor?.comuna && (
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <Icon name="location_on" size={12} />
              {miProveedor.comuna}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { icono: 'contacts',  label: 'Total leads',   valor: totalLeads, color: 'text-brand-600',   bg: 'bg-brand-50' },
            { icono: 'today',     label: 'Hoy',           valor: leadsHoy,   color: 'text-success-600', bg: 'bg-success-50' },
            { icono: 'verified',  label: 'Verificado',    valor: miProveedor?.verificado ? 'Sí' : 'No', color: miProveedor?.verificado ? 'text-success-600' : 'text-warning-600', bg: miProveedor?.verificado ? 'bg-success-50' : 'bg-warning-50' },
          ].map(({ icono, label, valor, color, bg }) => (
            <div key={label} className="bg-white rounded-card shadow-sm p-3 border border-gray-100">
              <div className={`w-7 h-7 ${bg} rounded-full flex items-center justify-center mb-1.5`}>
                <Icon name={icono} size={14} className={color} />
              </div>
              <p className={`text-lg font-bold ${color}`}>{loadingLeads ? '—' : valor}</p>
              <p className="text-[10px] text-gray-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Perfil incompleto */}
        {!perfilCompleto && (
          <div className="bg-warning-50 border border-warning-100 rounded-card p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="warning" size={16} className="text-warning-600" />
              <p className="text-sm font-semibold text-warning-700">Perfil incompleto</p>
            </div>
            <p className="text-xs text-warning-600 mb-3">
              Completa tu perfil para que las familias puedan encontrarte en el marketplace.
            </p>
            <button
              onClick={() => navigate('/mi-catalogo')}
              className="text-xs bg-warning-600 text-white font-medium rounded-button px-4 py-2 hover:bg-warning-700 transition"
            >
              Completar perfil →
            </button>
          </div>
        )}

        {/* Leads recientes */}
        <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <p className="text-sm font-bold text-gray-700">Leads recientes</p>
            <button onClick={() => navigate('/leads')} className="text-xs text-brand-600 font-medium">
              Ver todos →
            </button>
          </div>
          {loadingLeads ? (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-gray-400">Cargando...</p>
            </div>
          ) : leadsRecientes.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Icon name="contacts" size={32} className="text-gray-300 mb-2" />
              <p className="text-xs text-gray-400">Aún no tienes leads</p>
            </div>
          ) : (
            leadsRecientes.map((l) => (
              <div key={l.id} className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon name="person" size={16} className="text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{l.nombre}</p>
                  <p className="text-xs text-gray-400 truncate">{l.mensaje}</p>
                </div>
                <TiempoAtras fecha={l.createdAt} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-10 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Icon
                    name={ICONOS_CATEGORIA[miProveedor?.categoria] || 'storefront'}
                    size={28}
                    className="text-white"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {miProveedor?.nombre || profile?.name || 'Proveedor'}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
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
              </div>
            </div>
            {/* Stats en banner */}
            <div className="flex gap-8 text-right">
              {[
                { label: 'Total leads', valor: totalLeads },
                { label: 'Leads hoy',   valor: leadsHoy },
              ].map(({ label, valor }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-white">{loadingLeads ? '—' : valor}</p>
                  <p className="text-brand-200 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-10 grid grid-cols-3 gap-6">

          {/* Columna izquierda */}
          <div className="col-span-2 flex flex-col gap-6">

            {/* Alerta perfil incompleto */}
            {!perfilCompleto && (
              <div className="bg-warning-50 border border-warning-100 rounded-card p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center shrink-0">
                  <Icon name="warning" size={20} className="text-warning-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-warning-700 mb-1">Tu perfil está incompleto</p>
                  <p className="text-sm text-warning-600">
                    Completa tu nombre, rubro y teléfono para aparecer en el marketplace y recibir leads.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/mi-catalogo')}
                  className="shrink-0 bg-warning-600 hover:bg-warning-700 text-white text-sm font-medium px-4 py-2 rounded-button transition"
                >
                  Completar →
                </button>
              </div>
            )}

            {/* Tabla de leads */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Leads recibidos</p>
                  <p className="text-xs text-gray-400 mt-0.5">{totalLeads} en total · {leadsHoy} hoy</p>
                </div>
                <button
                  onClick={() => navigate('/leads')}
                  className="text-xs bg-brand-600 text-white px-4 py-2 rounded-button font-medium hover:bg-brand-700 transition flex items-center gap-1.5"
                >
                  <Icon name="contacts" size={14} />
                  Ver todos los leads
                </button>
              </div>

              {loadingLeads ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-brand-600 text-sm">Cargando leads...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Icon name="contacts" size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">Aún no tienes leads</p>
                  <p className="text-gray-400 text-xs mt-1">
                    Cuando una familia te contacte desde el marketplace, aparecerá aquí
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 px-6 py-2 bg-gray-50 border-b border-gray-100">
                    {['Nombre', 'Teléfono', 'Mensaje', 'Hace'].map(h => (
                      <p key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
                    ))}
                  </div>
                  {leads.slice(0, 8).map((l) => (
                    <div key={l.id} className="grid grid-cols-4 px-6 py-3.5 border-b border-gray-50 hover:bg-brand-50 transition items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                          <Icon name="person" size={14} className="text-brand-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-800 truncate">{l.nombre}</p>
                      </div>
                      <a
                        href={`https://wa.me/${l.telefono?.replace(/\D/g,'')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-brand-600 hover:underline flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                      >
                        <Icon name="phone" size={14} />
                        {l.telefono}
                      </a>
                      <p className="text-sm text-gray-500 truncate pr-4">{l.mensaje || '—'}</p>
                      <TiempoAtras fecha={l.createdAt} />
                    </div>
                  ))}
                  {leads.length > 8 && (
                    <div className="px-6 py-3 text-center">
                      <button
                        onClick={() => navigate('/leads')}
                        className="text-xs text-brand-600 font-medium hover:underline"
                      >
                        Ver {leads.length - 8} leads más →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-5">

            {/* Vista previa del perfil */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-4">Tu perfil público</p>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon
                    name={ICONOS_CATEGORIA[miProveedor?.categoria] || 'storefront'}
                    size={22}
                    className="text-brand-600"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{miProveedor?.nombre || '—'}</p>
                  <p className="text-xs text-gray-500">{miProveedor?.rubro || '—'}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                    <Icon name="location_on" size={11} />
                    {miProveedor?.comuna || '—'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Categoría',  value: miProveedor?.categoria },
                  { label: 'Teléfono',   value: miProveedor?.telefono },
                  { label: 'Estado',     value: miProveedor?.verificado ? 'Verificado ✓' : 'Sin verificar' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-xs font-medium text-gray-700">{value || '—'}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/mi-catalogo')}
                className="w-full mt-4 border border-brand-200 text-brand-700 hover:bg-brand-50 rounded-button py-2 text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <Icon name="edit" size={14} />
                Editar perfil
              </button>
            </div>

            {/* Tips para conseguir más leads */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">
                Consejos para más leads
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icono: 'photo_camera',  texto: 'Agrega fotos de tus trabajos al catálogo' },
                  { icono: 'verified',      texto: 'Solicita verificación para más confianza' },
                  { icono: 'star',          texto: 'Pide a tus clientes que te recomienden' },
                  { icono: 'location_on',   texto: 'Especifica bien tu comuna de cobertura' },
                ].map(({ icono, texto }) => (
                  <div key={texto} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name={icono} size={14} className="text-brand-600" />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavProveedor />
    </div>
  )
}