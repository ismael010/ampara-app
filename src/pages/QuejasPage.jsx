import BottomNavESG from '../components/BottomNavESG'
import Icon from '../components/ui/Icon'

export default function QuejasPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex items-center justify-center">
      <div className="text-center max-w-sm px-4">
        <Icon name="feedback" size={48} className="text-brand-400 mb-4" />
        <h1 className="text-lg font-bold text-gray-800 mb-2">
          Visualización de quejas en construcción
        </h1>
        <p className="text-sm text-gray-500">
          Aquí vas a poder ver gráficos por tema y zona, además del detalle de cada queja con su historial y plazos de respuesta.
        </p>
      </div>
      <BottomNavESG />
    </div>
  )
}