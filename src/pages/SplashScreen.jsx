import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/lp 8.svg'

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
      <img src={logo} alt="Ampara" className="w-32 h-32 object-contain" />
    </div>
  )
}