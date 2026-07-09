import { useAuthContext } from '../../context/AuthContext'
import { useMiEmpresaESG } from '../../hooks/useMiEmpresaESG'
import { useQuejasEmpresa } from '../../hooks/useQuejas'
import { useProyectos } from '../../hooks/useProyectos'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import BottomNavESG from '../../components/BottomNavESG'
import SelectorRol from '../../components/SelectorRol'
import Icon from '../../components/ui/Icon'

export default function PerfilESG() {
  const { user } = useAuthContext()
  const { miEmpresa } = useMiEmpresaESG()
  const { quejas, loading: loadingQuejas } = useQuejasEmpresa()
  const { proyectos, loading: loadingProyectos } = useProyectos()
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const totalQuejas      = quejas.length
  const quejasResueltas  = quejas.filter(q => q.estado === 'resuelta').length
  const pctResueltas     = totalQuejas > 0 ? Math.round((quejasResueltas / totalQuejas) * 100) : 0
  const proyectosActivos = proyectos.filter(p => p.estado !== 'completado').length
  const proyectosTotal   = proyectos.length

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="bg-brand-600 rounded-card p-6 text-white mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="insights" size={28} />
            </div>
            <div>
              <h1 className="text-lg font-bold">{miEmpresa?.nombre || 'Empresa'}</h1>
              <p className="text-sm opacity-80">{user?.email}</p>
              {miEmpresa?.sector && (
                <p className="text-xs opacity-70 mt-0.5">{miEmpresa.sector}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Tu empresa</p>
          <div className="space-y-2">
            {[
              { label: 'Sector',              value: miEmpresa?.sector },
              { label: 'Zonas de influencia', value: miEmpresa?.zonas },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <p className="text-sm text-gray-500 shrink-0">{label}</p>
                <p className="text-sm text-gray-800 text-right">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <SelectorRol rolActual="empresa_esg" />

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
              <Icon name="insights" size={40} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{miEmpresa?.nombre || 'Empresa'}</h1>
              <p className="text-brand-100 mt-1">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {miEmpresa?.sector && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="business" size={12} />
                    {miEmpresa.sector}
                  </span>
                )}
                {miEmpresa?.zonas && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="location_on" size={12} />
                    {miEmpresa.zonas}
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
                { icono: 'feedback',     label: 'Total quejas',        valor: totalQuejas,        color: 'text-brand-600',   bg: 'bg-brand-50' },
                { icono: 'check_circle', label: 'Quejas resueltas',    valor: quejasResueltas,    color: 'text-success-600', bg: 'bg-success-50' },
                { icono: 'percent',      label: '% resueltas',         valor: `${pctResueltas}%`, color: 'text-success-600', bg: 'bg-success-50' },
                { icono: 'construction', label: 'Proyectos activos',   valor: proyectosActivos,   color: 'text-brand-600',   bg: 'bg-brand-50' },
              ].map(({ icono, label, valor, color, bg }) => (
                <div key={label} className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                  <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center mb-3`}>
                    <Icon name={icono} size={20} className={color} />
                  </div>
                  <p className={`text-2xl font-bold ${color}`}>
                    {loadingQuejas || loadingProyectos ? '—' : valor}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Datos de la empresa */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="font-bold text-gray-800">Datos de la empresa</p>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Solo lectura
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {[
                  { label: 'Nombre de la empresa', key: 'nombre' },
                  { label: 'Sector o industria',   key: 'sector' },
                  { label: 'Zonas de influencia',  key: 'zonas' },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
                      {label}
                    </p>
                    <p className="text-sm text-gray-800 font-medium">
                      {miEmpresa?.[key] || '—'}
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
                  <p className="text-sm text-gray-800 font-medium">Empresa ESG</p>
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
            <SelectorRol rolActual="empresa_esg" />

            {/* Resumen de actividad */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-4">Resumen de actividad</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/quejas')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="feedback" size={18} className="text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Quejas recibidas</p>
                    <p className="text-xs text-gray-400">{totalQuejas} en total · {pctResueltas}% resueltas</p>
                  </div>
                  <Icon name="chevron_right" size={16} className="text-gray-300" />
                </button>

                <button
                  onClick={() => navigate('/proyectos')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="construction" size={18} className="text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">Proyectos sociales</p>
                    <p className="text-xs text-gray-400">{proyectosTotal} en total · {proyectosActivos} activos</p>
                  </div>
                  <Icon name="chevron_right" size={16} className="text-gray-300" />
                </button>

                <button
                  onClick={() => navigate('/marketplace')}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="storefront" size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Marketplace</p>
                    <p className="text-xs text-gray-400">Encuentra proveedores</p>
                  </div>
                  <Icon name="chevron_right" size={16} className="text-gray-300 ml-auto" />
                </button>
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

      <BottomNavESG />
    </div>
  )
}