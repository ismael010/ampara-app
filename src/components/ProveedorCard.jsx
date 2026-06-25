import { useState } from 'react'
import Icon from './ui/Icon'
import ModalContacto from './ModalContacto'

const ICONOS_CATEGORIA = {
  maestro: 'construction',
  ferreteria: 'hardware',
  empresa: 'business',
}

export default function ProveedorCard({ proveedor }) {
  const [mostrarModal, setMostrarModal] = useState(false)

  return (
    <>
      <div className="bg-white rounded-card shadow-sm p-4 mb-3 border border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
            <Icon name={ICONOS_CATEGORIA[proveedor.categoria] || 'storefront'} size={22} className="text-brand-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-1">
              <p className="text-sm font-semibold text-gray-800">{proveedor.nombre}</p>
              {proveedor.verificado && (
                <Icon name="verified" size={14} className="text-brand-600" />
              )}
            </div>
            <p className="text-xs text-gray-500">{proveedor.rubro}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                <Icon name="location_on" size={12} />
                {proveedor.comuna}
              </span>
              {proveedor.rating && (
                <span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <Icon name="star" size={12} className="text-warning-600" />
                  {proveedor.rating}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setMostrarModal(true)}
          className="w-full mt-3 bg-brand-50 text-brand-700 text-xs font-medium rounded-button py-2.5 flex items-center justify-center gap-1.5 hover:bg-brand-100 transition"
        >
          <Icon name="chat_bubble" size={14} />
          Contactar
        </button>
      </div>

      {mostrarModal && (
        <ModalContacto proveedor={proveedor} onClose={() => setMostrarModal(false)} />
      )}
    </>
  )
}