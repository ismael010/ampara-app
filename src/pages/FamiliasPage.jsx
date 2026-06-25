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

export default function FamiliasPage() {
  const { familias, loading } = useFamiliasEP()
  const [filtroRegion, setFiltroRegion] = useState('')
  const [filtroIngresos, setFiltroIngresos] = useState('')
  const [filtroSubsidio, setFiltroSubsidio] = useState('')

  const filtradas = familias.filter((f) => {
    const okRegion = !filtroRegion || f.region === filtroRegion
    const okIngresos = !filtroIngresos || f.ingresos === filtroIngresos
    const okSubsidio = !filtroSubsidio || f.subsidioId === filtroSubsidio
    return okRegion && okIngresos && okSubsidio
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando familias...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Familias</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtradas.length} de {familias.length} familias
          </p>
        </div>

        <div className="space-y-2 mb-4">
          <select
            value={filtroRegion}
            onChange={(e) => setFiltroRegion(e.target.value)}
            className="w-full border border-gray-200 rounded-button px-3 py-2.5 text-sm bg-white text-gray-700"
          >
            <option value="">Todas las regiones</option>
            {REGIONES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            value={filtroIngresos}
            onChange={(e) => setFiltroIngresos(e.target.value)}
            className="w-full border border-gray-200 rounded-button px-3 py-2.5 text-sm bg-white text-gray-700"
          >
            <option value="">Todos los ingresos</option>
            {RANGOS_INGRESOS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          <select
            value={filtroSubsidio}
            onChange={(e) => setFiltroSubsidio(e.target.value)}
            className="w-full border border-gray-200 rounded-button px-3 py-2.5 text-sm bg-white text-gray-700"
          >
            <option value="">Todos los subsidios</option>
            {SUBSIDIOS.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
          </select>
        </div>

        {filtradas.length > 0 ? (
          filtradas.map((f) => <FamiliaCard key={f.uid} familia={f} />)
        ) : (
          <div className="text-center py-12">
            <Icon name="groups" size={40} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No hay familias con esos filtros</p>
          </div>
        )}

      </div>
      <BottomNavEP />
    </div>
  )
}