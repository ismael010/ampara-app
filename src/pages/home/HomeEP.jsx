import { useMiEP } from '../../hooks/useMiEP'
import Icon from '../../components/ui/Icon'
import BottomNavEP from '../../components/BottomNavEP'

export default function HomeEP() {
  const { miEP } = useMiEP()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-6">
          <p className="text-sm text-gray-500">Bienvenido,</p>
          <h1 className="text-xl font-bold text-gray-800">{miEP?.nombre || 'EP'}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{miEP?.comuna}</p>
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Tu organización</p>
          <div className="space-y-2">
            {[
              { label: 'Tipo', value: miEP?.tipo },
              { label: 'Rubro', value: miEP?.rubro },
              { label: 'Familias estimadas', value: miEP?.rangoFamilias },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <p className="text-sm text-gray-500 shrink-0">{label}</p>
                <p className="text-sm text-gray-800 text-right">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-brand-600 rounded-card p-5 text-white mb-5">
          <Icon name="groups" size={28} className="mb-2" />
          <p className="text-sm font-semibold">Lista de familias en construcción</p>
          <p className="text-xs opacity-80 mt-1">
            Pronto vas a poder ver familias activas y su % de avance aquí.
          </p>
        </div>

      </div>
      <BottomNavEP />
    </div>
  )
}