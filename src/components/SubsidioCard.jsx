import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { calcularMatch } from '../utils/calcularMatch'
import { CATALOGO } from '../data/documentosCatalogo'
import { useSeguimiento } from '../hooks/useSeguimiento'
import Icon from './ui/Icon'

const NOMBRES_DOC = Object.fromEntries(
  CATALOGO.flatMap((c) => c.docs).map((d) => [d.id, d.nombre])
)

const NOMBRES_CAMPO = {
  vivienda:    'Situación de vivienda',
  danio:       'Daño en vivienda',
  ingresos:    'Nivel de ingresos',
  edad:        'Rango de edad',
  convivencia: 'Convivencia',
  educacion:   'Nivel de educación',
  region:      'Región',
}

export default function SubsidioCard({ subsidio, perfil, documentos }) {
  const [abierto, setAbierto] = useState(false)
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
    <div className="bg-white rounded-card shadow-sm mb-2 overflow-hidden">

      {/* Header siempre visible */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full p-3 flex items-center justify-between text-left"
      >
        <div className="flex-1 pr-3">
          <p className="text-sm font-semibold text-gray-800">{subsidio.nombre}</p>
          <div className="bg-gray-100 rounded-full h-1.5 mt-1.5 w-full max-w-[160px]">
            <div
              className={`rounded-full h-1.5 transition-all ${
                completo ? 'bg-success-600' : 'bg-warning-600'
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-sm font-bold ${
            completo ? 'text-success-600' : 'text-warning-600'
          }`}>
            {porcentaje}%
          </span>
          <Icon name={abierto ? 'expand_less' : 'expand_more'} size={18} className="text-gray-400" />
        </div>
      </button>

      {/* Contenido expandible */}
      {abierto && (
        <div className="px-3 pb-3 border-t border-gray-100 pt-3">

          <p className="text-xs text-gray-500 mb-3">{subsidio.descripcion}</p>

          {/* Documentos requeridos */}
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
            <div className="bg-warning-50 rounded-card p-3 mb-3">
              <p className="text-xs text-warning-700 font-medium mb-1.5">
                Falta{faltantes.length > 1 ? 'n' : ''} {faltantes.length} para completar
              </p>
              <div className="flex flex-wrap gap-1">
                {faltantes.map((f, i) => (
                  <span
                    key={i}
                    className="text-xs text-warning-700 bg-warning-100 rounded-full px-2 py-0.5 flex items-center gap-1"
                  >
                    <Icon
                      name={f.tipo === 'doc' ? 'description' : 'person'}
                      size={10}
                    />
                    {f.tipo === 'doc'
                      ? NOMBRES_DOC[f.id] || f.id
                      : NOMBRES_CAMPO[f.id] || f.id
                    }
                  </span>
                ))}
              </div>
            </div>
          )}

          {completo && (
            <p className="text-xs text-success-600 font-medium mb-3 flex items-center gap-1">
              <Icon name="check_circle" size={14} />
              Listo para postular
            </p>
          )}

          {subsidio.dondePostular && (
            <div className="bg-brand-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-brand-700 flex items-start gap-1.5">
                <Icon name="info" size={14} className="shrink-0 mt-0.5" />
                <span>
                  {subsidio.dondePostular}
                  {subsidio.url && (
                    <>
                      {' — '}
                      <a
                        href={subsidio.url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="underline font-medium"
                      >
                        Ir al sitio
                      </a>
                    </>
                  )}
                </span>
              </p>
            </div>
          )}

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
      )}
    </div>
  )
}