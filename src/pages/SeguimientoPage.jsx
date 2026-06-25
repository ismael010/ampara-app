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

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        {/* Header */}
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

        {/* Seguimientos activos */}
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
                  <Icon name={expandido === seg.id ? 'expand_less' : 'expand_more'} size={20} className="text-gray-400" />
                </button>

                {expandido === seg.id && (
                  <div className="px-4 pb-4">
                    <EtapaStepper
                      seguimiento={seg}
                      onCompletar={completarEtapa}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Iniciar nuevo seguimiento */}
        {subsidiosSinSeguimiento.length > 0 && (
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">
              Iniciar seguimiento
            </p>
            {subsidiosSinSeguimiento.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-card shadow-sm p-4 mb-3 flex items-center justify-between"
              >
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
            <p className="text-gray-500 text-sm">
              Aún no tienes postulaciones en seguimiento
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Inicia una desde los subsidios de arriba
            </p>
          </div>
        )}

      </div>
      <BottomNav />
    </div>
  )
}