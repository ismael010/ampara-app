import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'
import Icon from '../components/ui/Icon'

const ROLES = [
  {
    id: 'familia',
    titulo: 'Soy una familia',
    descripcion: 'Quiero postular a subsidios y organizar mis documentos',
    icono: 'home',
  },
  {
    id: 'proveedor',
    titulo: 'Soy proveedor',
    descripcion: 'Maestro, ferretería o empresa que ofrece materiales o servicios',
    icono: 'construction',
  },
  {
    id: 'ep',
    titulo: 'Soy una EP',
    descripcion: 'Constructora, fundación o municipio que busca familias',
    icono: 'apartment',
  },
  {
    id: 'empresa_esg',
    titulo: 'Soy una empresa',
    descripcion: 'Busco transparencia y seguimiento de impacto social',
    icono: 'insights',
  },
]

export default function SeleccionRolPage() {
  const { user } = useAuthContext()
  const { setRole } = useUserProfile()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)

  const handleSeleccion = async (roleId) => {
    setLoading(roleId)
    await setRole(user.uid, roleId)

    if (roleId === 'familia') {
      navigate('/onboarding')
    } else {
      navigate('/onboarding-profesional')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">¿Quién eres?</h1>
          <p className="text-sm text-gray-500 mt-1">
            Así te mostramos solo lo que te sirve
          </p>
        </div>

        <div className="space-y-3">
          {ROLES.map(({ id, titulo, descripcion, icono }) => (
            <button
              key={id}
              onClick={() => handleSeleccion(id)}
              disabled={loading !== null}
              className="w-full bg-white rounded-card shadow-sm p-4 flex items-center gap-4 text-left hover:border-brand-300 border border-gray-100 transition disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                <Icon name={icono} size={24} className="text-brand-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{descripcion}</p>
              </div>
              {loading === id ? (
                <Icon name="progress_activity" size={20} className="text-brand-600 animate-spin" />
              ) : (
                <Icon name="chevron_right" size={20} className="text-gray-300" />
              )}
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}