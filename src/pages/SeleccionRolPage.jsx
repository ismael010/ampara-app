import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'
import Icon from '../components/ui/Icon'
import logo from '../assets/logo.png'

const ROLES = [
  {
    id: 'familia',
    titulo: 'Soy una familia',
    descripcion: 'Quiero postular a subsidios y organizar mis documentos',
    icono: 'home',
    detalle: 'Accede a 15 subsidios disponibles, organiza tus documentos y haz seguimiento de tu postulación paso a paso.',
  },
  {
    id: 'proveedor',
    titulo: 'Soy proveedor',
    descripcion: 'Maestro, ferretería o empresa que ofrece materiales o servicios',
    icono: 'construction',
    detalle: 'Publica tu catálogo de servicios y conecta con familias que necesitan lo que ofreces en tu comuna.',
  },
  {
    id: 'ep',
    titulo: 'Soy una EP',
    descripcion: 'Constructora, fundación o municipio que busca familias',
    icono: 'apartment',
    detalle: 'Gestiona y acompaña a las familias que patrocinas, filtrando por región, ingresos y subsidio.',
  },
  {
    id: 'empresa_esg',
    titulo: 'Soy una empresa',
    descripcion: 'Busco transparencia y seguimiento de impacto social',
    icono: 'insights',
    detalle: 'Recibe reportes de quejas, gestiona proyectos sociales y mide tu impacto en comunidades reales.',
  },
]

const STATS = [
  { icono: 'groups',          valor: '+63.000', label: 'familias activas'   },
  { icono: 'storefront',      valor: '+200',    label: 'proveedores'        },
  { icono: 'map',             valor: '16',      label: 'regiones de Chile'  },
  { icono: 'location_city',   valor: '242',     label: 'comunas cubiertas'  },
]

export default function SeleccionRolPage() {
  const { user } = useAuthContext()
  const { setRole } = useUserProfile()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null)
  const [hover, setHover] = useState(null)

  const handleSeleccion = async (roleId) => {
    setLoading(roleId)
    await setRole(user.uid, roleId)
    if (roleId === 'familia') {
      navigate('/onboarding')
    } else {
      navigate('/onboarding-profesional')
    }
  }

  const rolHover = ROLES.find(r => r.id === hover)

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-center px-4 py-8 min-h-screen">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">¿Quién eres?</h1>
            <p className="text-sm text-gray-500 mt-1">
              Así te mostramos lo más adecuado a tu situación
            </p>
          </div>
          <div className="space-y-3">
            {ROLES.map(({ id, titulo, descripcion, icono }) => (
              <button
                key={id}
                onClick={() => handleSeleccion(id)}
                disabled={loading !== null}
                className="w-full bg-white rounded-card shadow-sm p-4 flex items-center gap-4 text-left hover:border-brand-300 border border-gray-100 transition disabled:opacity-50"
              >
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon name={icono} size={24} className="text-brand-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{titulo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{descripcion}</p>
                </div>
                {loading === id ? (
                  <Icon name="progress_activity" size={20} className="text-brand-600 animate-spin" />
                ) : (
                  <Icon name="chevron_right" size={20} className="text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex min-h-screen">

        {/* Panel izquierdo */}
        <div className="w-2/5 bg-brand-600 flex flex-col justify-between px-12 py-12">

          {/* Logo blanco */}
          <img src={logo} alt="Ampara" className="w-32 h-auto" />

          {/* Título */}
          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-4">
              Bienvenido a Ampara
            </h1>
            <p className="text-brand-100 text-base leading-relaxed">
              Ampara nació para cerrar la brecha entre las familias chilenas
              y los beneficios que ya les pertenecen. Selecciona tu perfil
              para comenzar.
            </p>
          </div>

          {/* Bloque inferior: stats por defecto, detalle del rol en hover */}
          <div className="bg-white/10 rounded-card p-5 min-h-[130px] transition-all duration-300">
            {rolHover ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={rolHover.icono} size={18} className="text-brand-100" />
                  <p className="text-white font-semibold text-sm">{rolHover.titulo}</p>
                </div>
                <p className="text-brand-100 text-sm leading-relaxed">
                  {rolHover.detalle}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white font-semibold text-sm mb-4">
                  Ampara en números
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {STATS.map(({ icono, valor, label }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Icon name={icono} size={14} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm leading-none">{valor}</p>
                        <p className="text-brand-200 text-xs">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex-1 flex items-center justify-center px-16 bg-gray-50">
          <div className="w-full max-w-lg">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800">¿Quién eres?</h2>
              <p className="text-gray-500 mt-1">
                Así te mostramos lo más adecuado a tu situación
              </p>
            </div>
            <div className="space-y-4">
              {ROLES.map(({ id, titulo, descripcion, icono }) => (
                <button
                  key={id}
                  onClick={() => handleSeleccion(id)}
                  disabled={loading !== null}
                  onMouseEnter={() => setHover(id)}
                  onMouseLeave={() => setHover(null)}
                  className={`w-full bg-white rounded-card p-5 flex items-center gap-5
                              text-left border transition-all duration-200 disabled:opacity-50
                              ${hover === id
                                ? 'border-brand-400 shadow-md scale-[1.01]'
                                : 'border-gray-100 shadow-sm'
                              }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors
                                  ${hover === id ? 'bg-brand-600' : 'bg-brand-50'}`}>
                    <Icon
                      name={icono}
                      size={26}
                      className={hover === id ? 'text-white' : 'text-brand-600'}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{titulo}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{descripcion}</p>
                  </div>
                  {loading === id ? (
                    <Icon name="progress_activity" size={22} className="text-brand-600 animate-spin" />
                  ) : (
                    <Icon
                      name="chevron_right"
                      size={22}
                      className={hover === id ? 'text-brand-400' : 'text-gray-300'}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}