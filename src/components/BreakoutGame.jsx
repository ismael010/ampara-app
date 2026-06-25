import { useRef, useEffect, useState, useCallback } from 'react'

const COLORES_BLOQUES = ['#41659b', '#6f93c0', '#059669', '#d97706']

export default function BreakoutGame({ config, onGanar, onPerder }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const [estado, setEstado] = useState('jugando')
  const [intentoId, setIntentoId] = useState(0)

  const stateRef = useRef(null)

  const inicializar = useCallback((canvas) => {
    const ANCHO = canvas.width
    const ALTO = canvas.height
    const ANCHO_BLOQUE = ANCHO / 6 - 4
    const ALTO_BLOQUE = 16
    const filas = config.filas
    const columnas = 6

    const bloques = []
    for (let f = 0; f < filas; f++) {
      for (let c = 0; c < columnas; c++) {
        bloques.push({
          x: c * (ANCHO_BLOQUE + 4) + 4,
          y: f * (ALTO_BLOQUE + 4) + 30,
          ancho: ANCHO_BLOQUE,
          alto: ALTO_BLOQUE,
          color: COLORES_BLOQUES[f % COLORES_BLOQUES.length],
          vivo: true,
        })
      }
    }

    stateRef.current = {
      bloques,
      paleta: { x: ANCHO / 2 - 35, ancho: 70, alto: 10, y: ALTO - 20 },
      pelota: {
        x: ANCHO / 2,
        y: ALTO - 35,
        radio: 6,
        dx: config.velocidadPelota * (Math.random() > 0.5 ? 1 : -1),
        dy: -config.velocidadPelota,
      },
      ancho: ANCHO,
      alto: ALTO,
    }
  }, [config])

  useEffect(() => {
    const canvas = canvasRef.current
    canvas.width = 320
    canvas.height = 420
    inicializar(canvas)
    setEstado('jugando')

    const ctx = canvas.getContext('2d')
    let activo = true

    const moverPaleta = (clientX) => {
      const rect = canvas.getBoundingClientRect()
      const x = (clientX - rect.left) * (canvas.width / rect.width)
      const s = stateRef.current
      s.paleta.x = Math.max(0, Math.min(canvas.width - s.paleta.ancho, x - s.paleta.ancho / 2))
    }

    const handleMouseMove = (e) => moverPaleta(e.clientX)
    const handleTouchMove = (e) => {
      e.preventDefault()
      moverPaleta(e.touches[0].clientX)
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

    const loop = () => {
      if (!activo) return
      const s = stateRef.current
      if (!s) return

      ctx.clearRect(0, 0, s.ancho, s.alto)

      s.pelota.x += s.pelota.dx
      s.pelota.y += s.pelota.dy

      if (s.pelota.x <= s.pelota.radio || s.pelota.x >= s.ancho - s.pelota.radio) {
        s.pelota.dx *= -1
      }
      if (s.pelota.y <= s.pelota.radio) {
        s.pelota.dy *= -1
      }

      if (
        s.pelota.y + s.pelota.radio >= s.paleta.y &&
        s.pelota.y - s.pelota.radio <= s.paleta.y + s.paleta.alto &&
        s.pelota.x >= s.paleta.x &&
        s.pelota.x <= s.paleta.x + s.paleta.ancho
      ) {
        s.pelota.dy = -Math.abs(s.pelota.dy)
        const impacto = (s.pelota.x - (s.paleta.x + s.paleta.ancho / 2)) / (s.paleta.ancho / 2)
        s.pelota.dx = impacto * config.velocidadPelota
      }

      s.bloques.forEach((b) => {
        if (!b.vivo) return
        if (
          s.pelota.x + s.pelota.radio > b.x &&
          s.pelota.x - s.pelota.radio < b.x + b.ancho &&
          s.pelota.y + s.pelota.radio > b.y &&
          s.pelota.y - s.pelota.radio < b.y + b.alto
        ) {
          b.vivo = false
          s.pelota.dy *= -1
        }
      })

      if (s.pelota.y > s.alto) {
        activo = false
        setEstado('perdido')
        return
      }

      if (s.bloques.every((b) => !b.vivo)) {
        activo = false
        setEstado('ganado')
        return
      }

      s.bloques.forEach((b) => {
        if (!b.vivo) return
        ctx.fillStyle = b.color
        ctx.beginPath()
        ctx.roundRect(b.x, b.y, b.ancho, b.alto, 3)
        ctx.fill()
      })

      ctx.fillStyle = '#41659b'
      ctx.beginPath()
      ctx.roundRect(s.paleta.x, s.paleta.y, s.paleta.ancho, s.paleta.alto, 5)
      ctx.fill()

      ctx.fillStyle = '#1f2937'
      ctx.beginPath()
      ctx.arc(s.pelota.x, s.pelota.y, s.pelota.radio, 0, Math.PI * 2)
      ctx.fill()

      animationRef.current = requestAnimationFrame(loop)
    }

    animationRef.current = requestAnimationFrame(loop)

    return () => {
      activo = false
      cancelAnimationFrame(animationRef.current)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [config, inicializar, intentoId])

  useEffect(() => {
    if (estado === 'ganado') onGanar?.()
    if (estado === 'perdido') onPerder?.()
  }, [estado])

  const reiniciar = () => {
    setIntentoId((id) => id + 1)
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="bg-gray-100 rounded-card mx-auto block touch-none"
      />
      {estado !== 'jugando' && (
        <div className="absolute inset-0 bg-black/60 rounded-card flex flex-col items-center justify-center">
          <p className="text-white text-lg font-bold mb-1">
            {estado === 'ganado' ? '¡Nivel completado! 🎉' : 'Se cayó la pelota 😅'}
          </p>
          <button
            onClick={reiniciar}
            className="mt-3 bg-white text-brand-700 text-sm font-medium rounded-button px-4 py-2"
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  )
}