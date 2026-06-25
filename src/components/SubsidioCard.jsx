import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { calcularMatch } from '../utils/calcularMatch'
import { CATALOGO } from '../data/documentosCatalogo'
import { useSeguimiento } from '../hooks/useSeguimiento'
import Icon from './ui/Icon'

const NOMBRES_DOC = Object.fromEntries(
  CATALOGO.flatMap((c) => c.docs).map((d) => [d.id, d.nombre])
)

export default function SubsidioCard({ subsidio, perfil, documentos }) {
  const [expandido, setExpandido] = useState(false)
  const [iniciando, setIniciando] = useState(false)
  const { porcentaje, faltantes } = calcularMatch(subsidio, perfil, documentos)
  const { seguimientos, iniciarSeguimiento } = useSeguimiento()
  const navigate = useNavigate()

  const completo = porcentaje === 100
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
    <div className="bg-white rounded-card shadow-sm p-4 mb-3">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-3">
          <h3 className="text-sm font-bold text-gray-800">{subsidio.nombre}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subsidio.descripcion}</p>
        </div>
        <span className={`text-sm font-bold shrink-0 ${
          completo ? 'text-success-600' : 'text-warning-600'
        }`}>
          {porcentaje}%
        </span>
      </div>

      {/* Barra de match */}
      <div className="bg-gray-100 rounded-full h-2 mb-3">
        <div
          className={`rounded-full h-2 transition-all ${
            completo ? 'bg-success-600' : 'bg-warning-600'
          }`}
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
              className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${
                ok ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
              }`}
            >
              <Icon name={ok ? 'check' : 'close'} size={12} />
              {NOMBRES_DOC[docId] || docId}
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
          <p className="text-xs text-warning-700 font-medium flex items-center gap-1">
            <Icon name={expandido ? 'expand_less' : 'expand_more'} size={16} />
            Falta{faltantes.length > 1 ? 'n' : ''} {faltantes.length} para completar
          </p>

          {expandido && (
            <div className="mt-2 bg-warning-50 rounded-card p-3 flex flex-wrap gap-1">
              {faltantes.map((f, i) => (
                <span key={i} className="text-xs text-warning-700 bg-warning-100 rounded-full px-2 py-0.5">
                  {f.tipo === 'doc' ? NOMBRES_DOC[f.id] || f.id : 'Perfil'}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {completo && (
        <p className="text-xs text-success-600 font-medium mb-3 flex items-center gap-1">
          <Icon name="check_circle" size={14} />
          Listo para postular
        </p>
      )}

      {/* Botón seguimiento */}
      <button
        onClick={handleSeguimiento}
        disabled={iniciando}
        className={`w-full text-sm rounded-button py-2.5 font-medium transition disabled:opacity-40 flex items-center justify-center gap-1.5 ${
          tieneSeguimiento
            ? 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
            : 'bg-brand-600 text-white hover:bg-brand-700'
        }`}
      >
        {iniciando ? (
          'Iniciando...'
        ) : tieneSeguimiento ? (
          <>
            <Icon name="location_on" size={16} />
            Ver seguimiento
          </>
        ) : (
          <>
            <Icon name="add" size={16} />
            Iniciar seguimiento
          </>
        )}
      </button>
    </div>
  )
}