import { useState } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useDocumentos } from '../hooks/useDocumentos'
import { SUBSIDIOS, CATEGORIAS_SUBSIDIO } from '../data/subsidiosCatalogo'
import { calcularMatch } from '../utils/calcularMatch'
import SubsidioCard from '../components/SubsidioCard'
import BottomNav from '../components/BottomNav'
import Icon from '../components/ui/Icon'
import TourSpotlight from '../components/TourSpotlight'

const FILTROS_MATCH = [
  { id: 'todos', label: 'Todos' },
  { id: 'listos', label: 'Listos (100%)' },
  { id: 'parciales', label: 'Parciales' },
]

export default function SubsidiosPage() {
  const { profile, loading: loadingProfile } = useProfile()
  const { documentos, loading: loadingDocs } = useDocumentos()
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [filtroMatch, setFiltroMatch] = useState('todos')

  const loading = loadingProfile || loadingDocs

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Calculando matches...</p>
      </div>
    )
  }

  const subsidiosOrdenados = [...SUBSIDIOS]
    .map((s) => {
      const { porcentaje } = calcularMatch(s, profile, documentos)
      return { ...s, porcentaje }
    })
    .filter((s) => !categoriaActiva || s.categoria === categoriaActiva)
    .filter((s) => {
      if (filtroMatch === 'listos') return s.porcentaje === 100
      if (filtroMatch === 'parciales') return s.porcentaje < 100
      return true
    })
    .sort((a, b) => b.porcentaje - a.porcentaje)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Mis subsidios</h1>
          <p className="text-sm text-gray-500 mt-1">
            {subsidiosOrdenados.length} de {SUBSIDIOS.length} subsidios
          </p>
        </div>

        {/* Filtro por categoría */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-2">
          <button
            onClick={() => setCategoriaActiva(null)}
            className={`shrink-0 text-xs rounded-full px-3 py-2 font-medium transition ${
              !categoriaActiva
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600'
            }`}
          >
            Todas
          </button>
          {CATEGORIAS_SUBSIDIO.map(({ id, label, icono }) => (
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

        {/* Filtro por match */}
        <div className="flex gap-2 mb-4">
          {FILTROS_MATCH.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFiltroMatch(id)}
              className={`flex-1 text-xs rounded-full px-3 py-2 font-medium transition ${
                filtroMatch === id
                  ? 'bg-gray-800 text-white'
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div id="tour-target-lista-subsidios">
          {subsidiosOrdenados.length > 0 ? (
            subsidiosOrdenados.map((subsidio) => (
              <SubsidioCard
                key={subsidio.id}
                subsidio={subsidio}
                perfil={profile}
                documentos={documentos}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Icon name="search_off" size={40} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No hay subsidios con esos filtros</p>
            </div>
          )}
        </div>

      </div>
      <BottomNav />
      <TourSpotlight rutaActual="/subsidios" />
    </div>
  )
}