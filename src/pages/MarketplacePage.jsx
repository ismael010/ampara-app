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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Marketplace</h1>
          <p className="text-sm text-gray-500 mt-1">
            Encuentra maestros, ferreterías y empresas para tu reconstrucción
          </p>
        </div>

        <div id="tour-target-marketplace" className="flex items-center gap-2 bg-white border border-gray-200 rounded-button px-4 py-3 mb-4">
          <Icon name="search" size={18} className="text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar maestro, ferretería..."
            className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
          <button
            onClick={() => setCategoriaActiva(null)}
            className={`shrink-0 text-xs rounded-full px-3 py-2 font-medium transition ${
              !categoriaActiva
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600'
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
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              <Icon name={icono} size={14} />
              {label}
            </button>
          ))}
        </div>

        {proveedoresFiltrados.length > 0 ? (
          proveedoresFiltrados.map((p) => (
            <ProveedorCard key={p.id} proveedor={p} />
          ))
        ) : (
          <div className="text-center py-12">
            <Icon name="search_off" size={40} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No encontramos resultados</p>
          </div>
        )}

      </div>

      {renderBottomNav()}
      <TourSpotlight rutaActual="/marketplace" />
    </div>
  )
}