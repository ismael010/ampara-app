import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSeguimiento } from '../hooks/useSeguimiento'
import { SUBSIDIOS } from '../data/subsidiosCatalogo'
import EtapaStepper from '../components/EtapaStepper'
import BottomNav from '../components/BottomNav'
import Icon from '../components/ui/Icon'

export default function SeguimientoPage() {
  const { seguimientos, loading, iniciarSeguimiento, completarEtapa } = useSeguimiento()
  const [expandido, setExpandido] = useState(null)
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  const subsidiosSinSeguimiento = SUBSIDIOS.filter(
    (s) => !seguimientos.find((seg) => seg.id === s.id)
  )

  const segActivo = expandido
    ? seguimientos.find(s => s.id === expandido)
    : seguimientos[0] ?? null

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-brand-600 font-medium mb-3 flex items-center gap-1 hover:opacity-70 transition"
          >
            <Icon name="arrow_back" size={16} />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Seguimiento</h1>
          <p className="text-sm text-gray-500 mt-1">
            Registra tu proceso de postulación paso a paso
          </p>
        </div>

        {seguimientos.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-700 mb-3">Tus postulaciones</p>
            {seguimientos.map((seg) => (
              <div key={seg.id} className="bg-white rounded-card shadow-sm mb-3 overflow-hidden">
                <button
                  onClick={() => setExpandido(expandido === seg.id ? null : seg.id)}
                  className="w-full px-4 py-4 flex items-center justify-between"
                >
                  <div className="text-left">
                    <p className="text-sm font-bold text-gray-800">{seg.subsidioNombre}</p>
                    <p className="text-xs text-brand-600 mt-0.5">
                      Etapa {Math.min(seg.etapaActual, 5)} de 5
                    </p>
                  </div>
                  <Icon
                    name={expandido === seg.id ? 'expand_less' : 'expand_more'}
                    size={20}
                    className="text-gray-400"
                  />
                </button>
                {expandido === seg.id && (
                  <div className="px-4 pb-4">
                    <EtapaStepper seguimiento={seg} onCompletar={completarEtapa} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {subsidiosSinSeguimiento.length > 0 && (
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">Iniciar seguimiento</p>
            {subsidiosSinSeguimiento.map((s) => (
              <div key={s.id} className="bg-white rounded-card shadow-sm p-4 mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.nombre}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.descripcion}</p>
                </div>
                <button
                  onClick={() => iniciarSeguimiento(s.id, s.nombre)}
                  className="shrink-0 ml-3 bg-brand-600 text-white text-xs rounded-button px-3 py-2 font-medium hover:bg-brand-700 transition flex items-center gap-1"
                >
                  <Icon name="add" size={14} />
                  Iniciar
                </button>
              </div>
            ))}
          </div>
        )}

        {seguimientos.length === 0 && (
          <div className="text-center py-12">
            <Icon name="folder_open" size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">Aún no tienes postulaciones en seguimiento</p>
            <p className="text-gray-400 text-xs mt-1">Inicia una desde los subsidios de arriba</p>
          </div>
        )}
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Seguimiento</h1>
          <p className="text-brand-100 mt-1">
            Registra tu proceso de postulación paso a paso
          </p>
        </div>

        <div className="px-10 flex gap-8">

          {/* Sidebar izquierda — lista de postulaciones */}
          <aside className="w-72 shrink-0">
            <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden sticky top-24">

              {/* Postulaciones activas */}
              {seguimientos.length > 0 && (
                <div>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Tus postulaciones
                    </p>
                  </div>
                  {seguimientos.map((seg) => {
                    const esExpandido = expandido === seg.id ||
                      (!expandido && seguimientos[0]?.id === seg.id)
                    return (
                      <button
                        key={seg.id}
                        onClick={() => setExpandido(seg.id)}
                        className={`w-full px-4 py-4 flex items-center gap-3 text-left border-b border-gray-50 transition ${
                          esExpandido ? 'bg-brand-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          esExpandido ? 'bg-brand-600' : 'bg-brand-50'
                        }`}>
                          <Icon
                            name="route"
                            size={18}
                            className={esExpandido ? 'text-white' : 'text-brand-600'}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${
                            esExpandido ? 'text-brand-700' : 'text-gray-800'
                          }`}>
                            {seg.subsidioNombre}
                          </p>
                          <p className="text-xs text-brand-400 mt-0.5">
                            Etapa {Math.min(seg.etapaActual, 5)} de 5
                          </p>
                        </div>
                        {/* Barra de progreso mini */}
                        <div className="w-8 h-8 relative shrink-0">
                          <svg viewBox="0 0 32 32" className="w-8 h-8 -rotate-90">
                            <circle cx="16" cy="16" r="12" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                            <circle
                              cx="16" cy="16" r="12" fill="none"
                              stroke={esExpandido ? '#41659b' : '#6f93c0'}
                              strokeWidth="3"
                              strokeDasharray={`${(Math.min(seg.etapaActual, 5) / 5) * 75.4} 75.4`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-gray-600">
                            {Math.min(seg.etapaActual, 5)}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Iniciar nuevo */}
              {subsidiosSinSeguimiento.length > 0 && (
                <div>
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                      Disponibles para iniciar
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {subsidiosSinSeguimiento.map((s) => (
                      <div
                        key={s.id}
                        className="px-4 py-3 flex items-center justify-between border-b border-gray-50"
                      >
                        <p className="text-sm text-gray-700 flex-1 truncate pr-2">{s.nombre}</p>
                        <button
                          onClick={() => iniciarSeguimiento(s.id, s.nombre)}
                          className="shrink-0 bg-brand-600 text-white text-xs rounded-button px-3 py-1.5 font-medium hover:bg-brand-700 transition flex items-center gap-1"
                        >
                          <Icon name="add" size={12} />
                          Iniciar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {seguimientos.length === 0 && subsidiosSinSeguimiento.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <Icon name="folder_open" size={32} className="text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400">Sin postulaciones</p>
                </div>
              )}
            </div>
          </aside>

          {/* Panel principal — stepper del seleccionado */}
          <div className="flex-1 min-w-0">
            {segActivo ? (
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{segActivo.subsidioNombre}</h2>
                    <p className="text-sm text-brand-600 mt-0.5">
                      Etapa {Math.min(segActivo.etapaActual, 5)} de 5
                    </p>
                  </div>
                  {/* Barra de progreso */}
                  <div className="flex items-center gap-3">
                    <div className="w-40 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-brand-600 h-2 rounded-full transition-all"
                        style={{ width: `${(Math.min(segActivo.etapaActual, 5) / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-brand-600">
                      {Math.round((Math.min(segActivo.etapaActual, 5) / 5) * 100)}%
                    </span>
                  </div>
                </div>
                <EtapaStepper seguimiento={segActivo} onCompletar={completarEtapa} />
              </div>
            ) : (
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-12 text-center">
                <Icon name="folder_open" size={48} className="text-gray-300 mb-3" />
                <p className="text-gray-500">Aún no tienes postulaciones en seguimiento</p>
                <p className="text-gray-400 text-sm mt-1">
                  Inicia una desde el panel de la izquierda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}