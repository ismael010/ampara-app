import { useState, useEffect } from 'react'

const CODIGOS_CLIMA = {
  0: { icono: 'wb_sunny', label: 'Despejado' },
  1: { icono: 'wb_sunny', label: 'Mayormente despejado' },
  2: { icono: 'partly_cloudy_day', label: 'Parcialmente nublado' },
  3: { icono: 'cloud', label: 'Nublado' },
  45: { icono: 'foggy', label: 'Niebla' },
  48: { icono: 'foggy', label: 'Niebla' },
  51: { icono: 'rainy', label: 'Llovizna' },
  53: { icono: 'rainy', label: 'Llovizna' },
  55: { icono: 'rainy', label: 'Llovizna' },
  61: { icono: 'rainy', label: 'Lluvia ligera' },
  63: { icono: 'rainy', label: 'Lluvia' },
  65: { icono: 'rainy', label: 'Lluvia intensa' },
  71: { icono: 'ac_unit', label: 'Nieve ligera' },
  73: { icono: 'ac_unit', label: 'Nieve' },
  75: { icono: 'ac_unit', label: 'Nieve intensa' },
  80: { icono: 'rainy', label: 'Chubascos' },
  81: { icono: 'rainy', label: 'Chubascos' },
  82: { icono: 'rainy', label: 'Chubascos intensos' },
  95: { icono: 'thunderstorm', label: 'Tormenta' },
  96: { icono: 'thunderstorm', label: 'Tormenta con granizo' },
  99: { icono: 'thunderstorm', label: 'Tormenta con granizo' },
}

export function useClima() {
  const [clima, setClima] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('sin_soporte')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,weather_code`
          )
          const data = await res.json()
          const codigo = data.current?.weather_code ?? 0
          const info = CODIGOS_CLIMA[codigo] || { icono: 'cloud', label: 'Variable' }

          setClima({
            temperatura: Math.round(data.current?.temperature_2m),
            ...info,
          })
        } catch (err) {
          setError('error_api')
        } finally {
          setLoading(false)
        }
      },
      () => {
        setError('permiso_denegado')
        setLoading(false)
      }
    )
  }, [])

  return { clima, loading, error }
}