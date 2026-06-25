import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'
import { useCambiarRol } from '../hooks/useCambiarRol'
import Icon from './ui/Icon'

const ROLES = [
  { id: 'familia', label: 'Familia', icono: 'home' },
  { id: 'proveedor', label: 'Proveedor', icono: 'construction' },
  { id: 'ep', label: 'EP', icono: 'apartment' },
  { id: 'empresa_esg', label: 'Empresa', icono: 'insights' },
]

export default function SelectorRol({ rolActual }) {
  const { user } = useAuthContext()
  const { cambiarRol } = useCambiarRol()
  const [confirmando, setConfirmando] = useState(null)

  const handleCambio = async (roleId) => {
    if (roleId === rolActual) return
    if (confirmando !== roleId) {
      setConfirmando(roleId)
      return
    }
    await cambiarRol(user.uid, roleId)
  }

  return (
    <div className="bg-white rounded-card shadow-sm p-5 mb-4">
      <p className="text-sm font-bold text-gray-700 mb-1">Cambiar tipo de cuenta</p>
      <p className="text-xs text-gray-500 mb-3">
        Tendrás que completar el registro del nuevo perfil
      </p>
      <div className="grid grid-cols-2 gap-2">
        {ROLES.map(({ id, label, icono }) => {
          const esActual = id === rolActual
          const pidiendoConfirmacion = confirmando === id

          return (
            <button
              key={id}
              onClick={() => handleCambio(id)}
              disabled={esActual}
              className={`flex flex-col items-center gap-1 rounded-button p-3 text-xs font-medium border transition ${
                esActual
                  ? 'bg-brand-50 border-brand-300 text-brand-700'
                  : pidiendoConfirmacion
                  ? 'bg-warning-50 border-warning-400 text-warning-700'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-brand-200'
              }`}
            >
              <Icon name={pidiendoConfirmacion ? 'warning' : icono} size={20} />
              {esActual ? `${label} (actual)` : pidiendoConfirmacion ? '¿Confirmar?' : label}
            </button>
          )
        })}
      </div>
    </div>
  )
}