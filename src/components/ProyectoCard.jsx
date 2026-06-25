import { useState } from 'react'
import { ESTADOS_PROYECTO } from '../data/proyectosCatalogo'
import { useProyectos } from '../hooks/useProyectos'
import Icon from './ui/Icon'

export default function ProyectoCard({ proyecto }) {
  const { actualizarEstado, eliminarProyecto } = useProyectos()
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false)

  const estado = ESTADOS_PROYECTO[proyecto.estado] || ESTADOS_PROYECTO.planificacion

  const handleEliminar = () => {
    if (confirmandoEliminar) {
      eliminarProyecto(proyecto.id)
    } else {
      setConfirmandoEliminar(true)
    }
  }

  return (
    <div className="bg-white rounded-card shadow-sm p-4 mb-3 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-bold text-gray-800">{proyecto.nombre}</p>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
            <Icon name="location_on" size={12} />
            {proyecto.zona}
          </p>
        </div>
        <button
          onClick={handleEliminar}
          className={`text-xs px-2 py-1 rounded-full transition ${
            confirmandoEliminar ? 'bg-warning-100 text-warning-700' : 'text-gray-300 hover:text-warning-600'
          }`}
        >
          <Icon name={confirmandoEliminar ? 'warning' : 'delete'} size={14} />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-3">{proyecto.descripcion}</p>

      <div className="flex gap-2">
        {Object.entries(ESTADOS_PROYECTO).map(([key, info]) => (
          <button
            key={key}
            onClick={() => actualizarEstado(proyecto.id, key)}
            className={`flex-1 text-xs font-medium rounded-button py-2 transition ${
              proyecto.estado === key
                ? `bg-${info.color}-600 text-white`
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
            }`}
          >
            {info.label}
          </button>
        ))}
      </div>
    </div>
  )
}