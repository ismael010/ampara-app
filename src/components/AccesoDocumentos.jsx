import { useNavigate } from 'react-router-dom'
import Icon from './ui/Icon'

export default function AccesoDocumentos({ subidos, total }) {
  const navigate = useNavigate()

  return (
    <button
      id="tour-target-documentos"
      onClick={() => navigate('/documentos')}
      className="bg-white rounded-card shadow-sm p-4 flex flex-col items-center justify-center border border-gray-100 hover:border-brand-200 transition"
    >
      <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-2">
        <Icon name="description" size={24} className="text-brand-600" />
      </div>
      <p className="text-xs font-semibold text-gray-800 text-center">Mis documentos</p>
      <p className="text-[10px] text-gray-500 text-center">{subidos} de {total} listos</p>
    </button>
  )
}