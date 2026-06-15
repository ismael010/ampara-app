import { useNavigate } from 'react-router-dom'

const acciones = [
  { icon: '📄', label: 'Mis papeles', sub: 'Ver documentos', to: '/documentos' },
  { icon: '🏛️', label: 'Subsidios', sub: 'Ver mis matches', to: '/subsidios' },
  { icon: '📷', label: 'Escanear', sub: 'Fotografiar papel', to: '/documentos' },
  { icon: '🤖', label: 'Asistente', sub: 'Tengo una duda', to: '/asistente' },
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
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-emerald-200 transition"
          >
            <span className="text-2xl">{icon}</span>
            <p className="text-sm font-semibold text-gray-800 mt-2">{label}</p>
            <p className="text-xs text-gray-400">{sub}</p>
          </button>
        ))}
      </div>
    </div>
  )
}