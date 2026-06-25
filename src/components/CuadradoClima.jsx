import { useClima } from '../hooks/useClima'
import Icon from './ui/Icon'

export default function CuadradoClima() {
  const { clima, loading, error } = useClima()

  if (loading) {
    return (
      <div className="bg-white rounded-card shadow-sm p-3 flex flex-col items-center justify-center border border-gray-100">
        <Icon name="hourglass_empty" size={16} className="text-gray-300 mb-1" />
        <p className="text-[10px] text-gray-400 text-center">Cargando</p>
      </div>
    )
  }

  if (error || !clima) {
    return (
      <div className="bg-white rounded-card shadow-sm p-3 flex flex-col items-center justify-center border border-gray-100 opacity-60">
        <Icon name="location_off" size={16} className="text-gray-300 mb-1" />
        <p className="text-[10px] text-gray-400 text-center leading-tight">Sin ubicación</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-card shadow-sm p-3 flex flex-col items-center justify-center border border-gray-100">
      <Icon name={clima.icono} size={18} className="text-brand-600 mb-1" />
      <p className="text-xs font-bold text-gray-800">{clima.temperatura}°</p>
      <p className="text-[9px] text-gray-400 text-center leading-tight">{clima.label}</p>
    </div>
  )
}