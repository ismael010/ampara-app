import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { CATEGORIAS_PROVEEDOR, PROVEEDORES_EJEMPLO } from '../data/proveedoresCatalogo'
import { useProveedores } from '../hooks/useProveedores'
import ProveedorCard from '../components/ProveedorCard'
import BottomNav from '../components/BottomNav'
import BottomNavEP from '../components/BottomNavEP'
import BottomNavESG from '../components/BottomNavESG'
import Icon from '../components/ui/Icon'
import TourSpotlight from '../components/TourSpotlight'

export default function MarketplacePage() {
  const { profile } = useAuthContext()
  const { proveedores, loading } = useProveedores()
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [busqueda, setBusqueda] = useState('')

  const todos = [...PROVEEDORES_EJEMPLO, ...proveedores]

  const proveedoresFiltrados = todos.filter((p) => {
    const coincideCategoria = !categoriaActiva || p.categoria === categoriaActiva
    const coincideBusqueda =
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.rubro?.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  const renderBottomNav = () => {
    if (profile?.role === 'ep') return <BottomNavEP />
    if (profile?.role === 'empresa_esg') return <BottomNavESG />
    return <BottomNav />
  }

  const Buscador = ({ id }) => (
    <div
      id={id}
      className="flex items-center gap-2 bg-white border border-gray-200 rounded-button px-4 py-3"
    >
      <Icon name="search" size={18} className="text-gray-400" />
      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar maestro, ferretería..."
        className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
      />
      {busqueda && (
        <button onClick={() => setBusqueda('')}>
          <Icon name="close" size={16} className="text-gray-400 hover:text-gray-600" />
        </button>
      )}
    </div>
  )

  const FiltrosCategorias = () => (
    <div className="flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => setCategoriaActiva(null)}
        className={`shrink-0 text-xs rounded-full px-3 py-2 font-medium transition ${
          !categoriaActiva
            ? 'bg-brand-600 text-white'
            : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
        }`}
      >
        Todos
      </button>
      {CATEGORIAS_PROVEEDOR.map(({ id, label, icono }) => (
        <button
          key={id}
          onClick={() => setCategoriaActiva(id)}
          className={`shrink-0 text-xs rounded-full px-3 py-2 font-medium flex items-center gap-1 transition ${
            categoriaActiva === id
              ? 'bg-brand-600 text-white'
              : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-300'
          }`}
        >
          <Icon name={icono} size={14} />
          {label}
        </button>
      ))}
    </div>
  )

  const SinResultados = () => (
    <div className="text-center py-12">
      <Icon name="search_off" size={40} className="text-gray-300 mb-2" />
      <p className="text-sm text-gray-500">No encontramos resultados</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">
            Encuentra maestros, ferreterías y empresas para tu reconstrucción
          </p>
        </div>
        <div className="mb-4">
          <Buscador id="tour-target-marketplace-mobile" />
        </div>
        <div className="mb-4">
          <FiltrosCategorias />
        </div>
        {proveedoresFiltrados.length > 0
          ? proveedoresFiltrados.map((p) => <ProveedorCard key={p.id} proveedor={p} />)
          : <SinResultados />
        }
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Marketplace</h1>
          <p className="text-brand-100 mt-1">
            Encuentra maestros, ferreterías y empresas para tu reconstrucción
          </p>
        </div>

        <div className="px-10 flex gap-8">

          {/* Sidebar izquierdo — filtros fijos */}
          <aside className="w-56 shrink-0">
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4 sticky top-24">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Categorías
              </p>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setCategoriaActiva(null)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                    !categoriaActiva
                      ? 'bg-brand-600 text-white'
                      : 'text-gray-600 hover:bg-brand-50'
                  }`}
                >
                  <Icon
                    name="storefront"
                    size={16}
                    className={!categoriaActiva ? 'text-white' : 'text-brand-400'}
                  />
                  Todos
                </button>
                {CATEGORIAS_PROVEEDOR.map(({ id, label, icono }) => (
                  <button
                    key={id}
                    onClick={() => setCategoriaActiva(id)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                      categoriaActiva === id
                        ? 'bg-brand-600 text-white'
                        : 'text-gray-600 hover:bg-brand-50'
                    }`}
                  >
                    <Icon
                      name={icono}
                      size={16}
                      className={categoriaActiva === id ? 'text-white' : 'text-brand-400'}
                    />
                    {label}
                  </button>
                ))}
              </div>

              {/* Resumen de resultados */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  {proveedoresFiltrados.length} proveedor
                  {proveedoresFiltrados.length !== 1 ? 'es' : ''} encontrado
                  {proveedoresFiltrados.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">

            {/* Buscador */}
            <div className="mb-5">
              <Buscador id="tour-target-marketplace" />
            </div>

            {/* Grid de cards */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-brand-600 font-medium">Cargando proveedores...</p>
              </div>
            ) : proveedoresFiltrados.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {proveedoresFiltrados.map((p) => (
                  <ProveedorCard key={p.id} proveedor={p} />
                ))}
              </div>
            ) : (
              <SinResultados />
            )}
          </div>
        </div>
      </div>

      {renderBottomNav()}
      <TourSpotlight rutaActual="/marketplace" />
    </div>
  )
}