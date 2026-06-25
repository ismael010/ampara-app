import { useState } from 'react'
import { useLeads } from '../hooks/useLeads'
import Icon from './ui/Icon'

export default function ModalContacto({ proveedor, onClose }) {
  const { crearLead } = useLeads()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [mensaje, setMensaje] = useState(`Hola, vi tu perfil en Ampara y necesito ayuda con ${proveedor.rubro?.toLowerCase() || 'mi reconstrucción'}.`)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleEnviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await crearLead({
        proveedorId: proveedor.id,
        nombre,
        telefono,
        mensaje,
      })
      setEnviado(true)
    } catch (err) {
      console.error(err)
    } finally {
      setEnviando(false)
    }
  }

  const linkWhatsapp = proveedor.telefono
    ? `https://wa.me/${proveedor.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`
    : null

  return (
    <div className="fixed inset-0 bg-black/50 z-[90] flex items-center justify-center px-4">
      <div className="bg-white rounded-card shadow-lg w-full max-w-sm p-5 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <Icon name="close" size={20} />
        </button>

        {!enviado ? (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-1">Contactar a {proveedor.nombre}</h2>
            <p className="text-sm text-gray-500 mb-4">Te va a responder directamente</p>

            <form onSubmit={handleEnviar} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tu nombre</label>
                <input
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Tu teléfono</label>
                <input
                  type="tel"
                  required
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Mensaje</label>
                <textarea
                  required
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
              >
                {enviando ? 'Enviando...' : 'Enviar contacto'}
              </button>
            </form>

            {linkWhatsapp && (
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                <Icon name="chat" size={18} className="text-success-600" />
                Escribir directo por WhatsApp
              </a>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Icon name="check_circle" size={40} className="text-success-600 mb-3" />
            <p className="text-base font-bold text-gray-800 mb-1">¡Listo!</p>
            <p className="text-sm text-gray-500 mb-4">
              {proveedor.nombre} va a recibir tu mensaje
            </p>
            {linkWhatsapp && (
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-success-600 text-white rounded-xl px-5 py-3 text-sm font-medium"
              >
                <Icon name="chat" size={18} />
                Escribirle ahora por WhatsApp
              </a>
            )}
            <button
              onClick={onClose}
              className="block w-full mt-3 text-sm text-gray-500"
            >
              Cerrar
            </button>
          </div>
        )}

      </div>
    </div>
  )
}