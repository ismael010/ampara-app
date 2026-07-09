import { useNavigate } from 'react-router-dom'
import { useMiEmpresaESG } from '../../hooks/useMiEmpresaESG'
import { useQuejasEmpresa } from '../../hooks/useQuejas'
import { useEstadisticasQuejas } from '../../hooks/useEstadisticasQuejas'
import { useProyectos } from '../../hooks/useProyectos'
import DashboardQuejas from '../../components/DashboardQuejas'
import DonutCategorias from '../../components/DonutCategorias'
import { CATEGORIAS_QUEJA, ESTADOS_QUEJA } from '../../data/quejasCatalogo'
import Icon from '../../components/ui/Icon'
import BottomNavESG from '../../components/BottomNavESG'
import { useMemo } from 'react'

export default function HomeESG() {
  const { miEmpresa } = useMiEmpresaESG()
  const { quejas, loading: loadingQuejas } = useQuejasEmpresa()
  const { proyectos, loading: loadingProyectos } = useProyectos()
  const stats = useEstadisticasQuejas(quejas)
  const navigate = useNavigate()

  const loading = loadingQuejas || loadingProyectos

  const conteoPorCategoria = useMemo(() => {
    const conteo = {}
    quejas.forEach((q) => {
      conteo[q.categoria] = (conteo[q.categoria] || 0) + 1
    })
    return conteo
  }, [quejas])

  const quejasRecientes  = quejas.slice(0, 3)
  const proyectosActivos = proyectos.filter(p => p.estado !== 'completado').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-5">
          <p className="text-sm text-gray-500">Bienvenido,</p>
          <h1 className="text-xl font-bold text-gray-800">{miEmpresa?.nombre || 'Empresa'}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{miEmpresa?.zonas}</p>
        </div>
        <DashboardQuejas stats={stats} />
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-10 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-brand-200 text-sm mb-1">Panel ESG</p>
              <h1 className="text-3xl font-bold text-white">{miEmpresa?.nombre || 'Empresa'}</h1>
              <div className="flex items-center gap-2 mt-3">
                {miEmpresa?.sector && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
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
            <div className="flex gap-8 text-right">
              {[
                { label: 'Total quejas',     valor: stats.total },
                { label: '% resueltas',      valor: `${stats.pctResueltas}%` },
                { label: 'Proyectos activos',valor: proyectosActivos },
              ].map(({ label, valor }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-white">{valor}</p>
                  <p className="text-brand-200 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-10 grid grid-cols-3 gap-6">

          {/* Columna izquierda */}
          <div className="col-span-2 flex flex-col gap-6">

            {/* Stats por estado */}
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(ESTADOS_QUEJA).map(([key, info]) => (
                <div key={key} className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                    <Icon
                      name={key === 'pendiente' ? 'pending' : key === 'en_revision' ? 'manage_search' : 'check_circle'}
                      size={20}
                      className={key === 'resuelta' ? 'text-success-600' : key === 'en_revision' ? 'text-brand-600' : 'text-warning-600'}
                    />
                  </div>
                  <p className="text-2xl font-bold text-gray-800">{stats.porEstado?.[key] || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">{info.label}</p>
                </div>
              ))}
            </div>

            {/* Quejas recientes */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="font-bold text-gray-800">Quejas recientes</p>
                <button
                  onClick={() => navigate('/quejas')}
                  className="text-xs text-brand-600 font-medium hover:underline"
                >
                  Ver todas →
                </button>
              </div>
              {quejas.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <Icon name="feedback" size={36} className="text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">Sin quejas aún</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 px-6 py-2 bg-gray-50 border-b border-gray-100">
                    {['Categoría', 'Zona', 'Texto', 'Estado'].map(h => (
                      <p key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
                    ))}
                  </div>
                  {quejasRecientes.map((q) => {
                    const cat    = CATEGORIAS_QUEJA.find(c => c.id === q.categoria)
                    const estado = ESTADOS_QUEJA[q.estado] || ESTADOS_QUEJA.pendiente
                    return (
                      <div key={q.id} className="grid grid-cols-4 px-6 py-3.5 border-b border-gray-50 hover:bg-brand-50 transition items-center cursor-pointer"
                        onClick={() => navigate('/quejas')}>
                        <div className="flex items-center gap-2">
                          <Icon name={cat?.icono || 'feedback'} size={16} className="text-brand-600" />
                          <p className="text-sm text-gray-700">{cat?.label || '—'}</p>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{q.zona || '—'}</p>
                        <p className="text-sm text-gray-500 truncate pr-4">{q.texto}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit
                          ${q.estado === 'resuelta' ? 'bg-success-50 text-success-700' :
                            q.estado === 'en_revision' ? 'bg-brand-50 text-brand-700' :
                            'bg-warning-50 text-warning-700'}`}>
                          {estado.label}
                        </span>
                      </div>
                    )
                  })}
                </>
              )}
            </div>

            {/* Proyectos */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="font-bold text-gray-800">Proyectos sociales</p>
                <button
                  onClick={() => navigate('/proyectos')}
                  className="text-xs text-brand-600 font-medium hover:underline"
                >
                  Ver todos →
                </button>
              </div>
              {proyectos.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <Icon name="map" size={36} className="text-gray-300 mb-2" />
                  <p className="text-sm text-gray-400">Sin proyectos aún</p>
                </div>
              ) : (
                proyectos.slice(0, 3).map((p) => (
                  <div key={p.id} className="px-6 py-3.5 border-b border-gray-50 flex items-center gap-4 hover:bg-brand-50 transition cursor-pointer"
                    onClick={() => navigate('/proyectos')}>
                    <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                      <Icon name="construction" size={16} className="text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.nombre}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Icon name="location_on" size={11} />
                        {p.zona}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0
                      ${p.estado === 'completado' ? 'bg-success-50 text-success-700' :
                        p.estado === 'ejecucion' ? 'bg-brand-50 text-brand-700' :
                        'bg-warning-50 text-warning-700'}`}>
                      {p.estado}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-5">

            {/* Donut categorías */}
            {quejas.length > 0 && (
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                <p className="text-sm font-bold text-gray-700 mb-4">Por categoría</p>
                <DonutCategorias
                  datos={CATEGORIAS_QUEJA
                    .map(({ id, label }) => ({ label, cantidad: conteoPorCategoria[id] || 0 }))
                    .filter(d => d.cantidad > 0)}
                  total={quejas.length}
                />
              </div>
            )}

            {/* Barras por localidad */}
            {stats.zonasOrdenadas?.length > 0 && (
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                <p className="text-sm font-bold text-gray-700 mb-4">Por localidad</p>
                <div className="space-y-3">
                  {stats.zonasOrdenadas.slice(0, 5).map(([zona, cantidad]) => {
                    const max = stats.zonasOrdenadas[0][1]
                    return (
                      <div key={zona}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-gray-600 truncate flex-1 pr-2">{zona}</p>
                          <p className="text-xs font-bold text-gray-700 shrink-0">{cantidad}</p>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div
                            className="h-1.5 bg-brand-600 rounded-full"
                            style={{ width: `${(cantidad / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Datos empresa */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-4">Tu empresa</p>
              <div className="space-y-3">
                {[
                  { label: 'Sector', icono: 'business',    value: miEmpresa?.sector },
                  { label: 'Zonas',  icono: 'location_on', value: miEmpresa?.zonas },
                ].map(({ label, icono, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name={icono} size={14} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavESG />
    </div>
  )
}