import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login')
    }, 2800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-brand-600 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Ampara</h1>
        <p className="text-sm text-white/70">Te acompañamos en tu reconstrucción</p>
      </div>
    </div>
  )
}