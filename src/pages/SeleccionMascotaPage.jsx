import { useNavigate } from 'react-router-dom'
import { useMascota } from '../hooks/useMascota'
import { MASCOTAS } from '../data/mascotas'
import Icon from '../components/ui/Icon'

export default function SeleccionMascotaPage() {
  const { elegirMascota } = useMascota()
  const navigate = useNavigate()

  const handleElegir = async (id) => {
    await elegirMascota(id)
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Elige a tu compañero</h1>
          <p className="text-sm text-gray-500 mt-1">
            Te va a acompañar durante todo el proceso
          </p>
        </div>

        <div className="space-y-4">
          {Object.values(MASCOTAS).map((m) => (
            <button
              key={m.id}
              onClick={() => handleElegir(m.id)}
              className="w-full bg-white rounded-card shadow-sm p-5 flex items-center gap-4 text-left border border-gray-100 hover:border-brand-300 transition"
            >
              <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-800">{m.nombre}</p>
                <p className="text-xs text-gray-400 mb-1">{m.animal}</p>
                <p className="text-sm text-gray-500">{m.descripcion}</p>
              </div>
              <Icon name="chevron_right" size={20} className="text-gray-300" />
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}