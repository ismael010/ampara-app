import { useNavigate } from 'react-router-dom'
import Icon from './ui/Icon'

const acciones = [
  { icon: 'description', label: 'Mis papeles', sub: 'Ver documentos', to: '/documentos' },
  { icon: 'account_balance', label: 'Subsidios', sub: 'Ver mis matches', to: '/subsidios' },
  { icon: 'photo_camera', label: 'Escanear', sub: 'Fotografiar papel', to: '/documentos' },
  { icon: 'smart_toy', label: 'Asistente', sub: 'Tengo una duda', to: '/asistente' },
]

export default function AccionesRapidas() {
  const navigate = useNavigate()

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-3">Acciones rápidas</p>
      <div className="grid grid-cols-2 gap-3">
        {acciones.map(({ icon, label, sub, to }) => (
          <button
            key={label}
            onClick={() => navigate(to)}
            className="bg-white border border-gray-100 rounded-card p-4 text-left shadow-sm hover:shadow-md hover:border-brand-200 transition"
          >
            <Icon name={icon} size={26} className="text-brand-600" />
            <p className="text-sm font-semibold text-gray-800 mt-2">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </button>
        ))}
      </div>
    </div>
  )
}