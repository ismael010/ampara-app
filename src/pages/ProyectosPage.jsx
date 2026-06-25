import BottomNavESG from '../components/BottomNavESG'
import Icon from '../components/ui/Icon'

export default function ProyectosPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex items-center justify-center">
      <div className="text-center max-w-sm px-4">
        <Icon name="map" size={48} className="text-brand-400 mb-4" />
        <h1 className="text-lg font-bold text-gray-800 mb-2">
          Proyectos y zonas en construcción
        </h1>
        <p className="text-sm text-gray-500">
          Aquí vas a poder ver tus proyectos activos y las zonas de influencia donde tu empresa tiene presencia.
        </p>
      </div>
      <BottomNavESG />
    </div>
  )
}