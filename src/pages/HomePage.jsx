import { useProfile } from '../hooks/useProfile'
import { useAuth } from '../hooks/useAuth'
import BottomNav from '../components/BottomNav'
import HomeHeader from '../components/HomeHeader'
import MisionDelDia from '../components/MisionDelDia'
import AccionesRapidas from '../components/AccionesRapidas'

export default function HomePage() {
  const { profile, loading } = useProfile()
  const { logout } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <p className="text-emerald-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-sm mx-auto px-4 pt-8">
        <HomeHeader profile={profile} />
        <MisionDelDia docsSubidos={profile?.docsSubidos ?? 0} />
        <AccionesRapidas />

        {/* Temporal — lo quitamos después */}
        <button
          onClick={logout}
          className="mt-8 w-full text-sm text-gray-400 hover:text-red-500 transition"
        >
          Cerrar sesión
        </button>
      </div>
      <BottomNav />
    </div>
  )
}