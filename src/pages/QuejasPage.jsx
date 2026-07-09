import { useState, useMemo } from 'react'
import { useQuejasEmpresa } from '../hooks/useQuejas'
import { CATEGORIAS_QUEJA, ESTADOS_QUEJA } from '../data/quejasCatalogo'
import QuejaCard from '../components/QuejaCard'
import DonutCategorias from '../components/DonutCategorias'
import BottomNavESG from '../components/BottomNavESG'
import Icon from '../components/ui/Icon'

export default function QuejasPage() {
  const { quejas, loading } = useQuejasEmpresa()
  const [filtroEstado,    setFiltroEstado]    = useState('')
  const [filtroCategoria, setFiltroCategoria] = useState('')

  const conteoPorCategoria = useMemo(() => {
    const conteo = {}
    quejas.forEach((q) => {
      conteo[q.categoria] = (conteo[q.categoria] || 0) + 1
    })
    return conteo
  }, [quejas])

  const quejasFiltradas = quejas.filter(q => {
    const okEstado    = !filtroEstado    || q.estado    === filtroEstado
    const okCategoria = !filtroCategoria || q.categoria === filtroCategoria
    return okEstado && okCategoria
  })

  const hayFiltros = filtroEstado || filtroCategoria
  const limpiar = () => { setFiltroEstado(''); setFiltroCategoria('') }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  const SinQuejas = () => (
    <div className="text-center py-12">
      <Icon name="feedback" size={48} className="text-gray-300 mb-3" />
      <p className="text-sm text-gray-500">
        {hayFiltros ? 'No hay quejas con esos filtros' : 'Aún no has recibido reportes'}
      </p>
      {hayFiltros && (
        <button onClick={limpiar} className="mt-3 text-xs text-brand-600 font-medium hover:underline">
          Limpiar filtros
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Quejas recibidas</h1>
          <p className="text-sm text-gray-500 mt-1">{quejas.length} reportes en total</p>
        </div>
        {quejas.length > 0 && (
          <div className="bg-white rounded-card shadow-sm p-4 mb-5">
            <p className="text-xs font-bold text-gray-600 mb-3">Por categoría</p>
            <DonutCategorias
              datos={CATEGORIAS_QUEJA
                .map(({ id, label }) => ({ label, cantidad: conteoPorCategoria[id] || 0 }))
                .filter(d => d.cantidad > 0)}
              total={quejas.length}
            />
          </div>
        )}
        {quejasFiltradas.length === 0
          ? <SinQuejas />
          : quejasFiltradas.map((q) => <QuejaCard key={q.id} queja={q} />)
        }
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Quejas recibidas</h1>
              <p className="text-brand-100 mt-1">Gestiona y responde los reportes de tu comunidad</p>
            </div>
            <div className="flex gap-8 text-right">
              {Object.entries(ESTADOS_QUEJA).map(([key, info]) => (
                <div key={key}>
                  <p className="text-3xl font-bold text-white">
                    {quejas.filter(q => q.estado === key).length}
                  </p>
                  <p className="text-brand-200 text-xs mt-0.5">{info.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-10 flex gap-8">

          {/* Sidebar izquierda — filtros y donut */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5 sticky top-24 flex flex-col gap-5">

              {/* Donut */}
              {quejas.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Por categoría
                  </p>
                  <DonutCategorias
                    datos={CATEGORIAS_QUEJA
                      .map(({ id, label }) => ({ label, cantidad: conteoPorCategoria[id] || 0 }))
                      .filter(d => d.cantidad > 0)}
                    total={quejas.length}
                  />
                </div>
              )}

              {/* Filtro estado */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Filtrar
                  </p>
                  {hayFiltros && (
                    <button onClick={limpiar} className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1">
                      <Icon name="close" size={12} />
                      Limpiar
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setFiltroEstado('')}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                      !filtroEstado ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Todos los estados</span>
                    <span className="text-xs font-bold">{quejas.length}</span>
                  </button>
                  {Object.entries(ESTADOS_QUEJA).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => setFiltroEstado(key)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                        filtroEstado === key ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{info.label}</span>
                      <span className="text-xs font-bold">
                        {quejas.filter(q => q.estado === key).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro categoría */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Categoría
                </p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setFiltroCategoria('')}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                      !filtroCategoria ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Todas</span>
                  </button>
                  {CATEGORIAS_QUEJA.filter(c => conteoPorCategoria[c.id]).map(({ id, label, icono }) => (
                    <button
                      key={id}
                      onClick={() => setFiltroCategoria(id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition ${
                        filtroCategoria === id ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon name={icono} size={14} className={filtroCategoria === id ? 'text-white' : 'text-brand-400'} />
                      <span className="flex-1 text-left">{label}</span>
                      <span className="text-xs font-bold">{conteoPorCategoria[id] || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  {quejasFiltradas.length} queja{quejasFiltradas.length !== 1 ? 's' : ''} encontrada{quejasFiltradas.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </aside>

          {/* Lista de quejas */}
          <div className="flex-1 min-w-0">
            {quejasFiltradas.length === 0
              ? <SinQuejas />
              : quejasFiltradas.map((q) => <QuejaCard key={q.id} queja={q} />)
            }
          </div>
        </div>
      </div>

      <BottomNavESG />
    </div>
  )
}