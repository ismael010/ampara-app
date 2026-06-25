import { useMiEmpresaESG } from '../../hooks/useMiEmpresaESG'
import { useQuejasEmpresa } from '../../hooks/useQuejas'
import { useEstadisticasQuejas } from '../../hooks/useEstadisticasQuejas'
import DashboardQuejas from '../../components/DashboardQuejas'
import Icon from '../../components/ui/Icon'
import BottomNavESG from '../../components/BottomNavESG'

export default function HomeESG() {
  const { miEmpresa } = useMiEmpresaESG()
  const { quejas, loading } = useQuejasEmpresa()
  const stats = useEstadisticasQuejas(quejas)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-5">
          <p className="text-sm text-gray-500">Bienvenido,</p>
          <h1 className="text-xl font-bold text-gray-800">{miEmpresa?.nombre || 'Empresa'}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{miEmpresa?.zonas}</p>
        </div>

        <DashboardQuejas stats={stats} />

      </div>
      <BottomNavESG />
    </div>
  )
}