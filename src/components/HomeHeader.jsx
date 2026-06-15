import { useNavigate } from 'react-router-dom'

export default function HomeHeader({ profile }) {
  const navigate = useNavigate()
  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <p className="text-sm text-gray-500">{saludo},</p>
        <h1 className="text-xl font-bold text-gray-800">
          {profile?.name || 'Bienvenida'}
        </h1>
      </div>
      <button
        onClick={() => navigate('/perfil')}
        className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5"
      >
        <span className="text-base">🪙</span>
        <span className="text-sm font-bold text-emerald-700">
          {profile?.fichas ?? 0}
        </span>
      </button>
    </div>
  )
}