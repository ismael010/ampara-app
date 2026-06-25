import { useNavigate } from 'react-router-dom'
import Icon from './ui/Icon'

export default function ResumenSubsidio({ mejorMatch }) {
  const navigate = useNavigate()

  if (!mejorMatch) return null

  const completo = mejorMatch.porcentaje === 100

  return (
    <button
      onClick={() => navigate('/subsidios')}
      className="w-full bg-white rounded-card shadow-sm p-4 mb-3 flex items-center gap-3 text-left border border-gray-100 hover:border-brand-200 transition"
    >
      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
        <Icon name="account_balance" size={20} className="text-brand-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{mejorMatch.nombre}</p>
        <p className={`text-xs ${completo ? 'text-success-600' : 'text-gray-500'}`}>
          {completo ? 'Listo para postular' : `${mejorMatch.porcentaje}% de match`}
        </p>
      </div>
      <Icon name="chevron_right" size={18} className="text-gray-300" />
    </button>
  )
}