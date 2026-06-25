import { useState } from 'react'
import { useProyectos } from '../hooks/useProyectos'
import { useMiEmpresaESG } from '../hooks/useMiEmpresaESG'
import ProyectoCard from '../components/ProyectoCard'
import BottomNavESG from '../components/BottomNavESG'
import Icon from '../components/ui/Icon'

export default function ProyectosPage() {
  const { proyectos, loading, crearProyecto } = useProyectos()
  const { miEmpresa } = useMiEmpresaESG()
  const [mostrarForm, setMostrarForm] = useState(false)

  const [nombre, setNombre] = useState('')
  const [zona, setZona] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [guardando, setGuardando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      await crearProyecto({ nombre, zona, descripcion, estado: 'planificacion' })
      setNombre('')
      setZona('')
      setDescripcion('')
      setMostrarForm(false)
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Proyectos</h1>
            <p className="text-sm text-gray-500 mt-1">{proyectos.length} proyectos activos</p>
          </div>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-brand-600 text-white rounded-full p-2.5"
          >
            <Icon name={mostrarForm ? 'close' : 'add'} size={18} />
          </button>
        </div>

        {mostrarForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-sm p-4 mb-4 space-y-3">
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del proyecto"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <input
              type="text"
              required
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder={`Zona (ej: ${miEmpresa?.zonas || 'Talca'})`}
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
            <textarea
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              placeholder="Descripción breve"
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
            />
            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-brand-600 text-white text-sm font-medium rounded-button py-2.5 disabled:opacity-40"
            >
              {guardando ? 'Guardando...' : 'Crear proyecto'}
            </button>
          </form>
        )}

        {proyectos.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="map" size={48} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Aún no tienes proyectos creados</p>
          </div>
        ) : (
          proyectos.map((p) => <ProyectoCard key={p.id} proyecto={p} />)
        )}

      </div>
      <BottomNavESG />
    </div>
  )
}