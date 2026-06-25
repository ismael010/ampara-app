import { useNavigate } from 'react-router-dom'
import Icon from './ui/Icon'

export default function CuadradoAlerta({ proximo }) {
  const navigate = useNavigate()

  if (!proximo) {
    return (
      <button
        onClick={() => navigate('/documentos')}
        className="bg-white rounded-card shadow-sm p-3 flex flex-col items-center justify-center border border-gray-100 hover:border-brand-200 transition"
      >
        <Icon name="check_circle" size={18} className="text-success-600 mb-1" />
        <p className="text-[10px] font-medium text-gray-700 text-center leading-tight">Al día</p>
      </button>
    )
  }

  const esUrgente = proximo.color === 'rojo' || proximo.color === 'amarillo'

  return (
    <button
      onClick={() => navigate('/documentos')}
      className={`rounded-card shadow-sm p-3 flex flex-col items-center justify-center border transition ${
        esUrgente
          ? 'bg-warning-50 border-warning-200 hover:border-warning-400'
          : 'bg-white border-gray-100 hover:border-brand-200'
      }`}
    >
      <Icon
        name={proximo.color === 'rojo' ? 'error' : 'warning'}
        size={18}
        className={esUrgente ? 'text-warning-600' : 'text-gray-400'}
      />
      <p className={`text-xs font-bold ${esUrgente ? 'text-warning-700' : 'text-gray-700'}`}>
        {proximo.dias < 0 ? 'Vencido' : `${proximo.dias}d`}
      </p>
      <p className="text-[9px] text-gray-400 text-center leading-tight truncate w-full">
        {proximo.nombre}
      </p>
    </button>
  )
}