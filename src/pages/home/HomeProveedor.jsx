import { useNavigate } from 'react-router-dom'
import { useProfile } from '../../hooks/useProfile'
import { useMiProveedor } from '../../hooks/useMiProveedor'
import Icon from '../../components/ui/Icon'
import BottomNavProveedor from '../../components/BottomNavProveedor'

export default function HomeProveedor() {
  const { profile } = useProfile()
  const { miProveedor } = useMiProveedor()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-6">
          <p className="text-sm text-gray-500">Bienvenido,</p>
          <h1 className="text-xl font-bold text-gray-800">
            {miProveedor?.nombre || profile?.name || 'Proveedor'}
          </h1>
        </div>

        <button
          onClick={() => navigate('/mi-catalogo')}
          className="w-full bg-white rounded-card shadow-sm p-4 mb-3 flex items-center gap-3 text-left border border-gray-100 hover:border-brand-200 transition"
        >
          <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
            <Icon name="storefront" size={22} className="text-brand-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800">Mi catálogo</p>
            <p className="text-xs text-gray-500">
              {miProveedor ? 'Edita tu información pública' : 'Aún no has completado tu perfil'}
            </p>
          </div>
          <Icon name="chevron_right" size={18} className="text-gray-300" />
        </button>

        <div className="bg-brand-600 rounded-card p-5 text-white mb-5">
          <Icon name="construction" size={28} className="mb-2" />
          <p className="text-sm font-semibold">Leads y suscripción en construcción</p>
          <p className="text-xs opacity-80 mt-1">
            Pronto podrás ver leads y gestionar tu plan aquí.
          </p>
        </div>

      </div>
      <BottomNavProveedor />
    </div>
  )
}