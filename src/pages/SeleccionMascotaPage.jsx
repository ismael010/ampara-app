import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMascota } from '../hooks/useMascota'
import { MASCOTAS } from '../data/mascotas'
import Icon from '../components/ui/Icon'
import logo from '../assets/logo.png'

export default function SeleccionMascotaPage() {
  const { elegirMascota } = useMascota()
  const navigate = useNavigate()
  const [hover, setHover] = useState(null)

  const handleElegir = async (id) => {
    await elegirMascota(id)
    navigate('/home')
  }

  const mascotaHover = Object.values(MASCOTAS).find(m => m.id === hover)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-center px-4 py-8 min-h-screen">
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

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex min-h-screen">

        {/* Panel izquierdo */}
        <div className="w-2/5 bg-brand-600 flex flex-col justify-between px-12 py-12 sticky top-0 h-screen">
          <img src={logo} alt="Ampara" className="w-32 h-auto" />

          <div>
            <h1 className="text-3xl font-bold text-white leading-tight mb-4">
              Elige a tu compañero
            </h1>
            <p className="text-brand-100 text-base leading-relaxed">
              Tu compañero te guiará durante todo el proceso en Ampara,
              desde organizar tus documentos hasta completar tu postulación.
            </p>
          </div>

          {/* Preview de la mascota en hover */}
          <div className="bg-white/10 rounded-card p-6 min-h-[220px] flex flex-col items-center justify-center transition-all duration-300">
            {mascotaHover ? (
              <>
                <div className="w-28 h-28 rounded-full bg-white/20 overflow-hidden mb-4">
                  <img
                    src={mascotaHover.imagen}
                    alt={mascotaHover.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-white font-bold text-lg">{mascotaHover.nombre}</p>
                <p className="text-brand-200 text-sm mb-3">{mascotaHover.animal}</p>
                <p className="text-brand-100 text-sm text-center leading-relaxed">
                  {mascotaHover.descripcion}
                </p>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                  <Icon name="pets" size={28} className="text-white" />
                </div>
                <p className="text-white font-semibold text-sm mb-1">
                  Conoce a tu compañero
                </p>
                <p className="text-brand-200 text-sm">
                  Pasa el cursor sobre cada opción para ver su personalidad
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex-1 flex items-center justify-center px-16">
          <div className="w-full max-w-lg">

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800">¿Quién te acompaña?</h2>
              <p className="text-gray-500 mt-1">
                Cada compañero tiene su propia personalidad. Elige el que más resuene contigo.
              </p>
            </div>

            <div className="space-y-4">
              {Object.values(MASCOTAS).map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleElegir(m.id)}
                  onMouseEnter={() => setHover(m.id)}
                  onMouseLeave={() => setHover(null)}
                  className={`w-full bg-white rounded-card p-5 flex items-center gap-5
                              text-left border transition-all duration-200
                              ${hover === m.id
                                ? 'border-brand-400 shadow-md scale-[1.01]'
                                : 'border-gray-100 shadow-sm'
                              }`}
                >
                  <div className={`w-16 h-16 rounded-full overflow-hidden shrink-0
                                  ring-2 transition-all duration-200
                                  ${hover === m.id ? 'ring-brand-400' : 'ring-transparent'}`}>
                    <img src={m.imagen} alt={m.nombre} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-base">{m.nombre}</p>
                    <p className="text-xs text-brand-400 font-medium mb-1">{m.animal}</p>
                    <p className="text-sm text-gray-500">{m.descripcion}</p>
                  </div>
                  <Icon
                    name="chevron_right"
                    size={22}
                    className={hover === m.id ? 'text-brand-400' : 'text-gray-300'}
                  />
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}