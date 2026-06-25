import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMascota } from '../hooks/useMascota'
import { TOUR_PASOS, TOTAL_PASOS_TOUR } from '../data/mascotas'

export default function TourSpotlight({ rutaActual }) {
  const { mascota, tourPaso, avanzarTour } = useMascota()
  const [rect, setRect] = useState(null)
  const navigate = useNavigate()
  const observerRef = useRef(null)

  const pasoInfo = TOUR_PASOS[tourPaso]
  const activo = pasoInfo && pasoInfo.ruta === rutaActual && mascota

  useEffect(() => {
    if (!activo) {
      setRect(null)
      return
    }

    let intentos = 0
    let cleanupFn = null

    const intentarObservar = () => {
      const el = document.getElementById(pasoInfo.targetId)

      if (!el) {
        intentos++
        if (intentos < 20) {
          setTimeout(intentarObservar, 100)
        }
        return
      }


      const actualizar = () => setRect(el.getBoundingClientRect())
      setTimeout(actualizar, 50)

      const observer = new ResizeObserver(actualizar)
      observer.observe(el)
      observerRef.current = observer

      window.addEventListener('scroll', actualizar, true)
      window.addEventListener('resize', actualizar)

      cleanupFn = () => {
        observer.disconnect()
        window.removeEventListener('scroll', actualizar, true)
        window.removeEventListener('resize', actualizar)
      }
    }

    intentarObservar()

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
      if (cleanupFn) cleanupFn()
    }
  }, [activo, pasoInfo?.targetId])

  if (!activo || !rect || rect.height === 0) return null

  const handleSiguiente = async () => {
    await avanzarTour()
    if (pasoInfo.siguienteRuta !== rutaActual) {
      navigate(pasoInfo.siguienteRuta)
    }
  }

  const padding = 8
  const top = rect.top - padding
  const left = rect.left - padding
  const width = rect.width + padding * 2
  const height = rect.height + padding * 2

  const ALTURA_DIALOGO = 180
  const MARGEN = 16
  const viewportH = window.innerHeight

  const espacioArriba = top
  const espacioAbajo = viewportH - (top + height)

  let dialogoTop
  if (espacioAbajo >= ALTURA_DIALOGO + MARGEN) {
    dialogoTop = top + height + MARGEN
  } else if (espacioArriba >= ALTURA_DIALOGO + MARGEN) {
    dialogoTop = top - ALTURA_DIALOGO - MARGEN
  } else {
    dialogoTop = Math.max(MARGEN, (viewportH - ALTURA_DIALOGO) / 2)
  }

  const esUltimo = tourPaso === TOTAL_PASOS_TOUR

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute rounded-2xl transition-all duration-200"
        style={{
          top, left, width, height,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-sm"
        style={{ top: dialogoTop }}
      >
        <div className="bg-white rounded-card shadow-lg p-4 flex gap-3 items-start">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-brand-50">
            <img src={mascota.imagen} alt={mascota.nombre} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-bold text-gray-800">{mascota.nombre}</p>
              <p className="text-[10px] text-gray-400">{tourPaso}/{TOTAL_PASOS_TOUR}</p>
            </div>
            <p className="text-sm text-gray-600">{pasoInfo.texto}</p>
            <button
              onClick={handleSiguiente}
              className="mt-3 bg-brand-600 text-white text-xs font-medium rounded-button px-4 py-2"
            >
              {esUltimo ? '¡Listo! →' : 'Entendido →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}