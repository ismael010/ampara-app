import { useNavigate } from 'react-router-dom'
import { ETAPAS } from '../data/etapasCatalogo'
import Icon from './ui/Icon'

export default function ResumenSeguimiento({ seguimientos, id }) {
  const navigate = useNavigate()
  if (!seguimientos || seguimientos.length === 0) return null

  const activa = [...seguimientos].sort((a, b) => b.etapaActual - a.etapaActual)[0]
  const etapaInfo = ETAPAS.find((e) => e.n === Math.min(activa.etapaActual, 5))

  return (
    <button
      id={id}
      onClick={() => navigate('/seguimiento')}
      className="w-full bg-white rounded-card shadow-sm p-4 mb-3 flex items-center gap-3 text-left border border-gray-100 hover:border-brand-200 transition"
    >
      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
        <Icon name={etapaInfo?.icono || 'location_on'} size={20} className="text-brand-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{activa.subsidioNombre}</p>
        <p className="text-xs text-gray-500">
          Etapa {Math.min(activa.etapaActual, 5)} de 5 — {etapaInfo?.titulo}
        </p>
      </div>
      <Icon name="chevron_right" size={18} className="text-gray-300" />
    </button>
  )
}