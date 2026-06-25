import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMascota } from '../hooks/useMascota'
import Icon from '../components/ui/Icon'

export default function IntroMascotaPage() {
  const { mascota } = useMascota()
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)

  if (!mascota) {
    navigate('/elegir-mascota')
    return null
  }

  const esUltimo = slide === mascota.slides.length - 1
  const actual = mascota.slides[slide]

  const siguiente = () => {
    if (esUltimo) {
      navigate('/login')
    } else {
      setSlide((s) => s + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-between px-4 py-8">

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm">
        <div className="w-24 h-24 rounded-full bg-brand-50 flex items-center justify-center mb-6">
          <Icon name={mascota.icono} size={48} className="text-brand-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">{actual.titulo}</h1>
        <p className="text-sm text-gray-500">{actual.texto}</p>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-5 justify-center">
          {mascota.slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === slide ? 'w-8 bg-brand-600' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={siguiente}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition"
        >
          {esUltimo ? 'Comenzar →' : 'Siguiente →'}
        </button>
      </div>

    </div>
  )
}