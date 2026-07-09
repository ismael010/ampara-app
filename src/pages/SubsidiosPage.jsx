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
  { id: 'todos',     label: 'Todos' },
  { id: 'listos',    label: 'Listos (100%)' },
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

  const subsidiosConMatch = [...SUBSIDIOS].map((s) => {
    const { porcentaje } = calcularMatch(s, profile, documentos)
    return { ...s, porcentaje }
  })

  const subsidiosOrdenados = subsidiosConMatch
    .filter((s) => !categoriaActiva || s.categoria === categoriaActiva)
    .filter((s) => {
      if (filtroMatch === 'listos')    return s.porcentaje === 100
      if (filtroMatch === 'parciales') return s.porcentaje < 100
      return true
    })
    .sort((a, b) => b.porcentaje - a.porcentaje)

  const totalListos    = subsidiosConMatch.filter(s => s.porcentaje === 100).length
  const totalParciales = subsidiosConMatch.filter(s => s.porcentaje > 0 && s.porcentaje < 100).length

  const FiltrosCategorias = ({ vertical = false }) => (
    <div className={vertical
      ? 'flex flex-col gap-1'
      : 'flex gap-2 overflow-x-auto pb-1'
    }>
      <button
        onClick={() => setCategoriaActiva(null)}
        className={vertical
          ? `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
              !categoriaActiva ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-brand-50'
            }`
          : `shrink-0 text-xs rounded-full px-3 py-2 font-medium transition ${
              !categoriaActiva ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
            }`
        }
      >
        {vertical && <Icon name="grid_view" size={16} className={!categoriaActiva ? 'text-white' : 'text-brand-400'} />}
        Todas
      </button>
      {CATEGORIAS_SUBSIDIO.map(({ id, label, icono }) => (
        <button
          key={id}
          onClick={() => setCategoriaActiva(id)}
          className={vertical
            ? `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                categoriaActiva === id ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-brand-50'
              }`
            : `shrink-0 text-xs rounded-full px-3 py-2 font-medium flex items-center gap-1 transition ${
                categoriaActiva === id ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`
          }
        >
          <Icon
            name={icono}
            size={vertical ? 16 : 14}
            className={categoriaActiva === id ? 'text-white' : 'text-brand-400'}
          />
          {label}
        </button>
      ))}
    </div>
  )

  const FiltrosMatch = ({ vertical = false }) => (
    <div className={vertical ? 'flex flex-col gap-1' : 'flex gap-2'}>
      {FILTROS_MATCH.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setFiltroMatch(id)}
          className={vertical
            ? `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition text-left ${
                filtroMatch === id ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`
            : `flex-1 text-xs rounded-full px-3 py-2 font-medium transition ${
                filtroMatch === id ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`
          }
        >
          {label}
        </button>
      ))}
    </div>
  )

  const SinResultados = () => (
    <div className="text-center py-12">
      <Icon name="search_off" size={40} className="text-gray-300 mb-2" />
      <p className="text-sm text-gray-500">No hay subsidios con esos filtros</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Mis subsidios</h1>
          <p className="text-sm text-gray-500 mt-1">
            {subsidiosOrdenados.length} de {SUBSIDIOS.length} subsidios
          </p>
        </div>
        <div className="mb-2">
          <FiltrosCategorias />
        </div>
        <div className="mb-4">
          <FiltrosMatch />
        </div>
        <div id="tour-target-lista-subsidios-mobile">
          {subsidiosOrdenados.length > 0
            ? subsidiosOrdenados.map((subsidio) => (
                <SubsidioCard
                  key={subsidio.id}
                  subsidio={subsidio}
                  perfil={profile}
                  documentos={documentos}
                />
              ))
            : <SinResultados />
          }
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Mis subsidios</h1>
          <p className="text-brand-100 mt-1">
            Revisa tu nivel de match y postula a los que te corresponden
          </p>
        </div>

        <div className="px-10 flex gap-8">

          {/* Sidebar izquierdo */}
          <aside className="w-56 shrink-0">
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4 sticky top-24 flex flex-col gap-5">

              {/* Resumen match */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Tu resumen
                </p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2.5 bg-success-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Icon name="check_circle" size={16} className="text-success-600" />
                      <span className="text-xs text-success-700 font-medium">Listos</span>
                    </div>
                    <span className="text-sm font-bold text-success-700">{totalListos}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-warning-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Icon name="pending" size={16} className="text-warning-600" />
                      <span className="text-xs text-warning-700 font-medium">Parciales</span>
                    </div>
                    <span className="text-sm font-bold text-warning-700">{totalParciales}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Icon name="list" size={16} className="text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">Total</span>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{SUBSIDIOS.length}</span>
                  </div>
                </div>
              </div>

              {/* Filtro match */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Filtrar por match
                </p>
                <FiltrosMatch vertical />
              </div>

              {/* Filtro categoría */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Categoría
                </p>
                <FiltrosCategorias vertical />
              </div>

              {/* Contador resultados */}
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  {subsidiosOrdenados.length} subsidio
                  {subsidiosOrdenados.length !== 1 ? 's' : ''} encontrado
                  {subsidiosOrdenados.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </aside>

          {/* Lista de subsidios */}
          <div className="flex-1 min-w-0">
            <div id="tour-target-lista-subsidios">
              {subsidiosOrdenados.length > 0
                ? subsidiosOrdenados.map((subsidio) => (
                    <SubsidioCard
                      key={subsidio.id}
                      subsidio={subsidio}
                      perfil={profile}
                      documentos={documentos}
                    />
                  ))
                : <SinResultados />
              }
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
      <TourSpotlight rutaActual="/subsidios" />
    </div>
  )
}