import { useState } from 'react'
import { useFamiliasEP } from '../hooks/useFamiliasEP'
import { SUBSIDIOS } from '../data/subsidiosCatalogo'
import FamiliaCard from '../components/FamiliaCard'
import BottomNavEP from '../components/BottomNavEP'
import Icon from '../components/ui/Icon'

const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
  'Coquimbo', 'Valparaíso', 'Metropolitana de Santiago', "O'Higgins",
  'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos',
  'Los Lagos', 'Aysén', 'Magallanes y Antártica Chilena'
]

const RANGOS_INGRESOS = [
  'Menos del sueldo mínimo (< $530.000)',
  'Sueldo mínimo $530.000 – $800.000',
  'Rango medio-bajo $800.001 – $1.200.000',
  'Rango medio $1.200.001 – $2.000.000',
  'Rango medio-alto $2.000.001 – $5.000.000',
]

const selectClass = 'border border-gray-200 rounded-button px-3 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-400'

export default function FamiliasPage() {
  const { familias, loading } = useFamiliasEP()
  const [filtroRegion,   setFiltroRegion]   = useState('')
  const [filtroIngresos, setFiltroIngresos] = useState('')
  const [filtroSubsidio, setFiltroSubsidio] = useState('')
  const [busqueda,       setBusqueda]       = useState('')

  const filtradas = familias.filter((f) => {
    const okRegion   = !filtroRegion   || f.region    === filtroRegion
    const okIngresos = !filtroIngresos || f.ingresos  === filtroIngresos
    const okSubsidio = !filtroSubsidio || f.subsidioId === filtroSubsidio
    const okBusqueda = !busqueda       || f.name?.toLowerCase().includes(busqueda.toLowerCase())
    return okRegion && okIngresos && okSubsidio && okBusqueda
  })

  const hayFiltros = filtroRegion || filtroIngresos || filtroSubsidio || busqueda
  const limpiar = () => {
    setFiltroRegion('')
    setFiltroIngresos('')
    setFiltroSubsidio('')
    setBusqueda('')
  }

  // Stats rápidas
  const conDocs     = familias.filter(f => f.pctDocs === 100).length
  const conSeg      = familias.filter(f => f.etapaActual !== null).length
  const sinDocs     = familias.filter(f => f.pctDocs === 0).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando familias...</p>
      </div>
    )
  }

  // ── Filtros como fila horizontal ──
  const FilaFiltros = ({ vertical = false }) => (
    <div className={vertical ? 'flex flex-col gap-3' : 'flex gap-2 flex-wrap'}>
      <select
        value={filtroRegion}
        onChange={(e) => setFiltroRegion(e.target.value)}
        className={`${selectClass} ${vertical ? 'w-full' : 'flex-1 min-w-[140px]'}`}
      >
        <option value="">Todas las regiones</option>
        {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>

      <select
        value={filtroIngresos}
        onChange={(e) => setFiltroIngresos(e.target.value)}
        className={`${selectClass} ${vertical ? 'w-full' : 'flex-1 min-w-[140px]'}`}
      >
        <option value="">Todos los ingresos</option>
        {RANGOS_INGRESOS.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>

      <select
        value={filtroSubsidio}
        onChange={(e) => setFiltroSubsidio(e.target.value)}
        className={`${selectClass} ${vertical ? 'w-full' : 'flex-1 min-w-[140px]'}`}
      >
        <option value="">Todos los subsidios</option>
        {SUBSIDIOS.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
      </select>

      {hayFiltros && (
        <button
          onClick={limpiar}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 px-3 py-2.5 border border-gray-200 rounded-button bg-white transition"
        >
          <Icon name="close" size={14} />
          Limpiar
        </button>
      )}
    </div>
  )

  const SinResultados = () => (
    <div className="text-center py-12">
      <Icon name="groups" size={40} className="text-gray-300 mb-2" />
      <p className="text-sm text-gray-500">No hay familias con esos filtros</p>
      <button onClick={limpiar} className="mt-3 text-xs text-brand-600 font-medium hover:underline">
        Limpiar filtros
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Familias</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtradas.length} de {familias.length} familias
          </p>
        </div>

        {/* Buscador */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-button px-3 py-2.5 mb-3">
          <Icon name="search" size={16} className="text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre..."
            className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Filtros en fila */}
        <div className="mb-4">
          <FilaFiltros />
        </div>

        {filtradas.length > 0
          ? filtradas.map((f) => <FamiliaCard key={f.uid} familia={f} />)
          : <SinResultados />
        }
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Familias</h1>
              <p className="text-brand-100 mt-1">
                Gestiona y acompaña a las familias de tu zona
              </p>
            </div>
            <div className="flex gap-6 text-right">
              {[
                { label: 'Total',            valor: familias.length },
                { label: 'Con seguimiento',  valor: conSeg },
                { label: 'Docs completos',   valor: conDocs },
                { label: 'Sin documentos',   valor: sinDocs },
              ].map(({ label, valor }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-white">{valor}</p>
                  <p className="text-brand-200 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-10 flex gap-8">

          {/* Sidebar izquierda — filtros */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Filtros
                </p>
                {hayFiltros && (
                  <button
                    onClick={limpiar}
                    className="text-xs text-brand-600 font-medium hover:underline flex items-center gap-1"
                  >
                    <Icon name="close" size={12} />
                    Limpiar
                  </button>
                )}
              </div>

              {/* Buscador */}
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-button px-3 py-2 mb-4">
                <Icon name="search" size={14} className="text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Región</p>
                  <select
                    value={filtroRegion}
                    onChange={(e) => setFiltroRegion(e.target.value)}
                    className={`${selectClass} w-full`}
                  >
                    <option value="">Todas las regiones</option>
                    {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Ingresos</p>
                  <select
                    value={filtroIngresos}
                    onChange={(e) => setFiltroIngresos(e.target.value)}
                    className={`${selectClass} w-full`}
                  >
                    <option value="">Todos los ingresos</option>
                    {RANGOS_INGRESOS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Subsidio</p>
                  <select
                    value={filtroSubsidio}
                    onChange={(e) => setFiltroSubsidio(e.target.value)}
                    className={`${selectClass} w-full`}
                  >
                    <option value="">Todos los subsidios</option>
                    {SUBSIDIOS.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>
              </div>

              {/* Contador */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  {filtradas.length} familia{filtradas.length !== 1 ? 's' : ''} encontrada{filtradas.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </aside>

          {/* Grid de familias */}
          <div className="flex-1 min-w-0">
            {filtradas.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                {filtradas.map((f) => <FamiliaCard key={f.uid} familia={f} />)}
              </div>
            ) : (
              <SinResultados />
            )}
          </div>
        </div>
      </div>

      <BottomNavEP />
    </div>
  )
}