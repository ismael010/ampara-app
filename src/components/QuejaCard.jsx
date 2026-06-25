import { useState } from 'react'
import { CATEGORIAS_QUEJA, ESTADOS_QUEJA } from '../data/quejasCatalogo'
import { useQuejasEmpresa } from '../hooks/useQuejas'
import Icon from './ui/Icon'

export default function QuejaCard({ queja }) {
  const { cambiarEstado } = useQuejasEmpresa()
  const [expandido, setExpandido] = useState(false)

  const cat = CATEGORIAS_QUEJA.find((c) => c.id === queja.categoria)
  const estado = ESTADOS_QUEJA[queja.estado] || ESTADOS_QUEJA.pendiente

  return (
    <div className="bg-white rounded-card shadow-sm p-4 mb-3 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Icon name={cat?.icono || 'feedback'} size={18} className="text-brand-600" />
          <p className="text-sm font-bold text-gray-800">{cat?.label || 'Otro'}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${estado.color}-50 text-${estado.color}-700`}>
          {estado.label}
        </span>
      </div>

      <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
        <Icon name="location_on" size={12} />
        {queja.zona} · {queja.createdAt?.toDate?.().toLocaleDateString('es-CL')}
      </p>

      <p className="text-sm text-gray-600 mb-3">{queja.texto}</p>

      {queja.fotoUrl && (
        <img src={queja.fotoUrl} alt="Foto de la queja" className="w-full rounded-xl mb-3 max-h-48 object-cover" />
      )}

      <div className="flex gap-2">
        {Object.entries(ESTADOS_QUEJA).map(([key, info]) => (
          <button
            key={key}
            onClick={() => cambiarEstado(queja.id, key)}
            className={`flex-1 text-xs font-medium rounded-button py-2 transition ${
              queja.estado === key
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