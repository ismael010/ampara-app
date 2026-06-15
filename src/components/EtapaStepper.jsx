import { useRef, useState } from 'react'
import { ETAPAS } from '../data/etapasCatalogo'

export default function EtapaStepper({ seguimiento, onCompletar }) {
  const [uploadingEtapa, setUploadingEtapa] = useState(null)
  const inputRefs = useRef({})

  const handleCompletar = async (n, file = null) => {
    setUploadingEtapa(n)
    await onCompletar(seguimiento.id, n, file)
    setUploadingEtapa(null)
  }

  const handleFileChange = (e, n) => {
    const file = e.target.files[0]
    if (file) handleCompletar(n, file)
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      {ETAPAS.map(({ n, titulo, descripcion, icono }) => {
        const etapa = seguimiento.etapas?.[n]
        const completada = etapa?.completada
        const esActual = seguimiento.etapaActual === n
        const esFutura = n > seguimiento.etapaActual
        const uploading = uploadingEtapa === n

        return (
          <div
            key={n}
            className={`rounded-2xl p-4 border transition ${
              completada ? 'bg-emerald-50 border-emerald-200' :
              esActual ? 'bg-white border-emerald-400 shadow-sm' :
              'bg-gray-50 border-gray-100 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Indicador */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 font-bold ${
                completada ? 'bg-emerald-500 text-white' :
                esActual ? 'bg-emerald-600 text-white' :
                'bg-gray-200 text-gray-400'
              }`}>
                {completada ? '✓' : n}
              </div>

              <div className="flex-1">
                <p className={`text-sm font-semibold ${
                  esFutura ? 'text-gray-400' : 'text-gray-800'
                }`}>
                  {icono} {titulo}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{descripcion}</p>

                {/* Comprobante subido */}
                {completada && etapa?.comprobante && (
                  <a
                    href={etapa.comprobante}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-emerald-600 underline mt-1 block"
                  >
                    Ver comprobante →
                  </a>
                )}

                {/* Acciones etapa actual */}
                {esActual && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => inputRefs.current[n]?.click()}
                      disabled={uploading}
                      className="text-xs bg-emerald-600 text-white rounded-lg px-3 py-1.5 font-medium hover:bg-emerald-700 transition disabled:opacity-40"
                    >
                      {uploading ? 'Subiendo...' : '📎 Subir comprobante'}
                    </button>
                    <button
                      onClick={() => handleCompletar(n)}
                      disabled={uploading}
                      className="text-xs border border-gray-300 text-gray-600 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition disabled:opacity-40"
                    >
                      Omitir
                    </button>
                    <input
                      ref={(el) => (inputRefs.current[n] = el)}
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, n)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}