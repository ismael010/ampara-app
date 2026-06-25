import { useAuthContext } from '../../context/AuthContext'
import { usePerfilFamilia } from '../../hooks/usePerfilFamilia'
import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../../components/BottomNav'
import SelectorRol from '../../components/SelectorRol'
import Icon from '../../components/ui/Icon'

const NIVEL_CONFIG = [
  { nivel: 1, label: 'Vecina nueva', minFichas: 0 },
  { nivel: 2, label: 'Vecina activa', minFichas: 100 },
  { nivel: 3, label: 'Vecina experta', minFichas: 300 },
  { nivel: 4, label: 'Guardiana del barrio', minFichas: 600 },
]

function getNivel(fichas) {
  return [...NIVEL_CONFIG].reverse().find((n) => fichas >= n.minFichas) || NIVEL_CONFIG[0]
}

function getProgresoNivel(fichas) {
  const actual = getNivel(fichas)
  const siguiente = NIVEL_CONFIG[actual.nivel] || null
  if (!siguiente) return 100
  const rango = siguiente.minFichas - actual.minFichas
  const avance = fichas - actual.minFichas
  return Math.round((avance / rango) * 100)
}

export default function PerfilFamilia() {
  const { user } = useAuthContext()
  const { perfilFamilia: profile } = usePerfilFamilia()  
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const fichas = profile?.fichas ?? 0
  const nivel = getNivel(fichas)
  const progreso = getProgresoNivel(fichas)
  const siguiente = NIVEL_CONFIG[nivel.nivel] || null

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="bg-brand-600 rounded-card p-6 text-white mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="person" size={28} />
            </div>
            <div>
              <h1 className="text-lg font-bold">{profile?.name || 'Usuario'}</h1>
              <p className="text-sm opacity-80">{user?.email}</p>
              <p className="text-xs opacity-70 mt-0.5">{profile?.region}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs text-gray-500">Nivel actual</p>
              <p className="text-sm font-bold text-gray-800">
                Nivel {nivel.nivel} — {nivel.label}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Fichas</p>
              <p className="text-xl font-bold text-brand-600 flex items-center gap-1 justify-end">
                <Icon name="monetization_on" size={20} />
                {fichas}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-full h-2 mb-1">
            <div
              className="bg-brand-500 rounded-full h-2 transition-all"
              style={{ width: `${progreso}%` }}
            />
          </div>
          {siguiente && (
            <p className="text-xs text-gray-400 text-right">
              {siguiente.minFichas - fichas} fichas para nivel {siguiente.nivel}
            </p>
          )}
          {!siguiente && (
            <p className="text-xs text-success-600 text-right font-medium flex items-center justify-end gap-1">
              <Icon name="emoji_events" size={14} />
              Nivel máximo alcanzado
            </p>
          )}
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Cómo ganar fichas</p>
          <div className="space-y-2">
            {[
              { accion: 'Subir un documento nuevo', fichas: '+40' },
              { accion: 'Completar una etapa de subsidio', fichas: '+20' },
              { accion: 'Completar el onboarding', fichas: 'Ya ganadas' },
            ].map(({ accion, fichas }) => (
              <div key={accion} className="flex justify-between items-center">
                <p className="text-sm text-gray-600">{accion}</p>
                <p className="text-sm font-semibold text-brand-600">{fichas}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-card shadow-sm p-5 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-3">Tu perfil</p>
          <div className="space-y-2">
            {[
              { label: 'Edad', value: profile?.edad },
              { label: 'Vivienda', value: profile?.vivienda },
              { label: 'Región', value: profile?.region },
              { label: 'Ingresos', value: profile?.ingresos },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4">
                <p className="text-sm text-gray-500 shrink-0">{label}</p>
                <p className="text-sm text-gray-800 text-right">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>

        <SelectorRol rolActual="familia" />

        <button
          onClick={handleLogout}
          className="w-full border border-warning-200 text-warning-700 hover:bg-warning-50 rounded-card py-3 text-sm font-medium transition flex items-center justify-center gap-1.5"
        >
          <Icon name="logout" size={16} />
          Cerrar sesión
        </button>

      </div>
      <BottomNav />
    </div>
  )
}