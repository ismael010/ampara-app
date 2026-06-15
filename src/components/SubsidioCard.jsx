import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { calcularMatch } from '../utils/calcularMatch'
import { CATALOGO } from '../data/documentosCatalogo'
import { useSeguimiento } from '../hooks/useSeguimiento'

const NOMBRES_DOC = Object.fromEntries(
  CATALOGO.flatMap((c) => c.docs).map((d) => [d.id, d.nombre])
)

const NOMBRES_PERFIL = {
  vivienda: 'situación de vivienda',
  danio: 'daño en vivienda',
  ingresos: 'rango de ingresos',
  edad: 'rango de edad',
}

export default function SubsidioCard({ subsidio, perfil, documentos }) {
  const [expandido, setExpandido] = useState(false)
  const [iniciando, setIniciando] = useState(false)
  const { porcentaje, faltantes } = calcularMatch(subsidio, perfil, documentos)
  const { seguimientos, iniciarSeguimiento } = useSeguimiento()
  const navigate = useNavigate()

  const colorBarra =
    porcentaje === 100 ? 'bg-emerald-500' :
    porcentaje >= 60 ? 'bg-yellow-400' : 'bg-red-400'

  const tieneSeguimiento = seguimientos.some((s) => s.id === subsidio.id)

  const handleSeguimiento = async () => {
    if (tieneSeguimiento) {
      navigate('/seguimiento')
      return
    }
    setIniciando(true)
    await iniciarSeguimiento(subsidio.id, subsidio.nombre)
    setIniciando(false)
    navigate('/seguimiento')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mb-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-3">
          <h3 className="text-sm font-bold text-gray-800">{subsidio.nombre}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subsidio.descripcion}</p>
        </div>
        <span className={`text-sm font-bold shrink-0 ${
          porcentaje === 100 ? 'text-emerald-600' :
          porcentaje >= 60 ? 'text-yellow-600' : 'text-red-500'
        }`}>
          {porcentaje}%
        </span>
      </div>

      {/* Barra de match */}
      <div className="bg-gray-100 rounded-full h-2 mb-3">
        <div
          className={`${colorBarra} rounded-full h-2 transition-all`}
          style={{ width: `${porcentaje}%` }}
        />
      </div>

      {/* Requisitos de documentos */}
      <div className="flex flex-wrap gap-1 mb-3">
        {subsidio.requisitosDoc.map((docId) => {
          const ok = documentos[docId]?.subido
          return (
            <span
              key={docId}
              className={`text-xs px-2 py-0.5 rounded-full ${
                ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-500'
              }`}
            >
              {ok ? '✓' : '✗'} {NOMBRES_DOC[docId] || docId}
            </span>
          )
        })}
      </div>

      {/* Qué falta */}
      {faltantes.length > 0 && (
        <div
          className="cursor-pointer mb-3"
          onClick={() => setExpandido(!expandido)}
        >
          <p className="text-xs text-emerald-600 font-medium">
            {expandido ? '▲ Ocultar detalles' : '▼ Ver qué falta para el 100%'}
          </p>

          {expandido && (
            <div className="mt-2 bg-amber-50 rounded-xl p-3 space-y-1">
              {faltantes.map((f, i) => (
                <p key={i} className="text-xs text-amber-800">
                  {f.tipo === 'doc'
                    ? `📄 Subir: ${NOMBRES_DOC[f.id] || f.id}`
                    : `👤 Tu ${NOMBRES_PERFIL[f.id] || f.id} no califica`}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {porcentaje === 100 && (
        <p className="text-xs text-emerald-600 font-medium mb-3">
          ✅ Listo para postular
        </p>
      )}

      {/* Botón seguimiento */}
      <button
        onClick={handleSeguimiento}
        disabled={iniciando}
        className={`w-full text-sm rounded-xl py-2.5 font-medium transition disabled:opacity-40 ${
          tieneSeguimiento
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {iniciando ? 'Iniciando...' :
         tieneSeguimiento ? '📍 Ver seguimiento →' : '+ Iniciar seguimiento'}
      </button>
    </div>
  )
}