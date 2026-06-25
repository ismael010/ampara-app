import { useMiEmpresaESG } from '../../hooks/useMiEmpresaESG'
import Icon from '../../components/ui/Icon'
import BottomNavESG from '../../components/BottomNavESG'

export default function HomeESG() {
  const { miEmpresa } = useMiEmpresaESG()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-6">
          <p className="text-sm text-gray-500">Bienvenido,</p>
          <h1 className="text-xl font-bold text-gray-800">{miEmpresa?.nombre || 'Empresa'}</h1>
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Tu empresa</p>
          <div className="space-y-2">
            {[
              { label: 'Sector', value: miEmpresa?.sector },
              { label: 'Zonas de influencia', value: miEmpresa?.zonas },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <p className="text-sm text-gray-500 shrink-0">{label}</p>
                <p className="text-sm text-gray-800 text-right">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-600 rounded-card p-5 text-white mb-5">
          <Icon name="insights" size={28} className="mb-2" />
          <p className="text-sm font-semibold">Dashboard de transparencia en construcción</p>
          <p className="text-xs opacity-80 mt-1">
            Pronto vas a poder ver quejas y proyectos de tu comunidad aquí.
          </p>
        </div>

      </div>
      <BottomNavESG />
    </div>
  )
}