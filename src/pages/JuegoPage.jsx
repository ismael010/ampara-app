import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentos } from '../hooks/useDocumentos'
import { NIVELES_BREAKOUT, getNivelDesbloqueado } from '../data/breakoutNiveles'
import BreakoutGame from '../components/BreakoutGame'
import BottomNav from '../components/BottomNav'
import Icon from '../components/ui/Icon'

export default function JuegoPage() {
  const { documentos, loading } = useDocumentos()
  const navigate = useNavigate()
  const [nivelSeleccionado, setNivelSeleccionado] = useState(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  const docsSubidos = Object.values(documentos).filter((d) => d.subido).length
  const nivelMaximoDesbloqueado = getNivelDesbloqueado(docsSubidos)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reconstrucción</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sube documentos para desbloquear niveles
            </p>
          </div>
          {nivelSeleccionado && (
            <button
              onClick={() => setNivelSeleccionado(null)}
              className="text-brand-600 text-sm font-medium"
            >
              ← Niveles
            </button>
          )}
        </div>

        {!nivelSeleccionado ? (
          <div className="space-y-3">
            {NIVELES_BREAKOUT.map((n) => {
              const desbloqueado = docsSubidos >= n.docsRequeridos
              return (
                <button
                  key={n.nivel}
                  onClick={() => desbloqueado && setNivelSeleccionado(n)}
                  disabled={!desbloqueado}
                  className={`w-full rounded-card p-4 flex items-center gap-3 text-left border transition ${
                    desbloqueado
                      ? 'bg-white border-gray-100 hover:border-brand-200'
                      : 'bg-gray-100 border-gray-100 opacity-60'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    desbloqueado ? 'bg-brand-50' : 'bg-gray-200'
                  }`}>
                    <Icon
                      name={desbloqueado ? 'sports_esports' : 'lock'}
                      size={20}
                      className={desbloqueado ? 'text-brand-600' : 'text-gray-400'}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">
                      Nivel {n.nivel} — {n.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {desbloqueado
                        ? '¡Disponible!'
                        : `Sube ${n.docsRequeridos} documentos para desbloquear`}
                    </p>
                  </div>
                  {desbloqueado && <Icon name="chevron_right" size={18} className="text-gray-300" />}
                </button>
              )
            })}
          </div>
        ) : (
          <BreakoutGame config={nivelSeleccionado} />
        )}

      </div>
      <BottomNav />
    </div>
  )
}