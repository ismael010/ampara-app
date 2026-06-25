import { useNavigate } from 'react-router-dom'
import Icon from './ui/Icon'

export default function ResumenDocumento({ proximo }) {
  const navigate = useNavigate()

  if (!proximo) {
    return (
      <button
        onClick={() => navigate('/documentos')}
        className="w-full bg-white rounded-card shadow-sm p-4 mb-3 flex items-center gap-3 text-left hover:border-brand-200 border border-gray-100 transition"
      >
        <div className="w-10 h-10 rounded-full bg-success-50 flex items-center justify-center shrink-0">
          <Icon name="check_circle" size={20} className="text-success-600" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800">Tus documentos están al día</p>
          <p className="text-xs text-gray-500">Sin vencimientos próximos</p>
        </div>
        <Icon name="chevron_right" size={18} className="text-gray-300" />
      </button>
    )
  }

  const esUrgente = proximo.color === 'rojo' || proximo.color === 'amarillo'

  return (
    <button
      onClick={() => navigate('/documentos')}
      className={`w-full bg-white rounded-card shadow-sm p-4 mb-3 flex items-center gap-3 text-left border transition ${
        esUrgente ? 'border-warning-200 hover:border-warning-400' : 'border-gray-100 hover:border-brand-200'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
        esUrgente ? 'bg-warning-50' : 'bg-success-50'
      }`}>
        <Icon
          name={proximo.color === 'rojo' ? 'error' : proximo.color === 'amarillo' ? 'warning' : 'check_circle'}
          size={20}
          className={esUrgente ? 'text-warning-600' : 'text-success-600'}
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{proximo.nombre}</p>
        <p className={`text-xs ${esUrgente ? 'text-warning-700' : 'text-gray-500'}`}>
          {proximo.dias < 0 ? 'Vencido' : `Vence en ${proximo.dias} días`}
        </p>
      </div>
      <Icon name="chevron_right" size={18} className="text-gray-300" />
    </button>
  )
}
