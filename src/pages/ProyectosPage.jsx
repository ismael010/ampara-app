import { useState } from 'react'
import { useProyectos } from '../hooks/useProyectos'
import { useMiEmpresaESG } from '../hooks/useMiEmpresaESG'
import { ESTADOS_PROYECTO } from '../data/proyectosCatalogo'
import ProyectoCard from '../components/ProyectoCard'
import BottomNavESG from '../components/BottomNavESG'
import Icon from '../components/ui/Icon'

export default function ProyectosPage() {
  const { proyectos, loading, crearProyecto } = useProyectos()
  const { miEmpresa } = useMiEmpresaESG()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [filtroEstado, setFiltroEstado] = useState('')

  const [nombre,      setNombre]      = useState('')
  const [zona,        setZona]        = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [guardando,   setGuardando]   = useState(false)

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

  const proyectosFiltrados = proyectos.filter(p =>
    !filtroEstado || p.estado === filtroEstado
  )

  const porEstado = (key) => proyectos.filter(p => p.estado === key).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  const FormularioNuevo = () => (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
      </div>
      <textarea
        required
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        rows={3}
        placeholder="Descripción breve del proyecto"
        className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
      />
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={guardando}
          className="flex-1 bg-brand-600 text-white text-sm font-medium rounded-button py-2.5 disabled:opacity-40 hover:bg-brand-700 transition"
        >
          {guardando ? 'Guardando...' : 'Crear proyecto'}
        </button>
        <button
          type="button"
          onClick={() => setMostrarForm(false)}
          className="px-4 border border-gray-200 text-gray-500 rounded-button text-sm hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Proyectos</h1>
            <p className="text-sm text-gray-500 mt-1">{proyectos.length} proyectos</p>
          </div>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-brand-600 text-white rounded-full p-2.5"
          >
            <Icon name={mostrarForm ? 'close' : 'add'} size={18} />
          </button>
        </div>
        {mostrarForm && (
          <div className="bg-white rounded-card shadow-sm p-4 mb-4">
            <FormularioNuevo />
          </div>
        )}
        {proyectosFiltrados.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="map" size={48} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Aún no tienes proyectos creados</p>
          </div>
        ) : (
          proyectosFiltrados.map((p) => <ProyectoCard key={p.id} proyecto={p} />)
        )}
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Proyectos sociales</h1>
              <p className="text-brand-100 mt-1">Crea y da seguimiento a tus iniciativas de impacto</p>
            </div>
            <div className="flex gap-8 text-right">
              {Object.entries(ESTADOS_PROYECTO).map(([key, info]) => (
                <div key={key}>
                  <p className="text-3xl font-bold text-white">{porEstado(key)}</p>
                  <p className="text-brand-200 text-xs mt-0.5">{info.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-10 flex gap-8">

          {/* Sidebar izquierda */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5 sticky top-24 flex flex-col gap-5">

              {/* Botón crear */}
              <button
                onClick={() => setMostrarForm(!mostrarForm)}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-button text-sm font-medium transition ${
                  mostrarForm
                    ? 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'bg-brand-600 text-white hover:bg-brand-700'
                }`}
              >
                <Icon name={mostrarForm ? 'close' : 'add'} size={16} />
                {mostrarForm ? 'Cancelar' : 'Nuevo proyecto'}
              </button>

              {/* Filtro por estado */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Filtrar por estado
                </p>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setFiltroEstado('')}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                      !filtroEstado ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>Todos</span>
                    <span className="text-xs font-bold">{proyectos.length}</span>
                  </button>
                  {Object.entries(ESTADOS_PROYECTO).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => setFiltroEstado(key)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition ${
                        filtroEstado === key ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>{info.label}</span>
                      <span className="text-xs font-bold">{porEstado(key)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  {proyectosFiltrados.length} proyecto{proyectosFiltrados.length !== 1 ? 's' : ''} encontrado{proyectosFiltrados.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </aside>

          {/* Contenido principal */}
          <div className="flex-1 min-w-0">

            {/* Formulario nuevo proyecto */}
            {mostrarForm && (
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-6 mb-6">
                <p className="font-bold text-gray-800 mb-4">Nuevo proyecto</p>
                <FormularioNuevo />
              </div>
            )}

            {/* Grid de proyectos */}
            {proyectosFiltrados.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="map" size={48} className="text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  {filtroEstado ? 'No hay proyectos con ese estado' : 'Aún no tienes proyectos creados'}
                </p>
                {!mostrarForm && (
                  <button
                    onClick={() => setMostrarForm(true)}
                    className="mt-4 bg-brand-600 text-white text-sm font-medium px-6 py-2.5 rounded-button hover:bg-brand-700 transition"
                  >
                    Crear primer proyecto
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {proyectosFiltrados.map((p) => (
                  <ProyectoCard key={p.id} proyecto={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNavESG />
    </div>
  )
}