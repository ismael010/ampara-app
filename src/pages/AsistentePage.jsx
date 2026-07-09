import { useState, useRef, useEffect } from 'react'
import { useProfile } from '../hooks/useProfile'
import { useMascota } from '../hooks/useMascota'
import BottomNav from '../components/BottomNav'
import Icon from '../components/ui/Icon'
import TourSpotlight from '../components/TourSpotlight'
import { renderConLinks } from '../utils/renderConLinks'

const SYSTEM_PROMPT = `Eres el asistente de Ampara, una app chilena que ayuda a familias a preparar sus documentos para postular a subsidios habitacionales del gobierno de Chile.

Tu rol es responder preguntas sobre:
- Documentos necesarios para subsidios (cédula, escritura, avalúo fiscal, permiso de edificación, tasación, RSH, etc.)
- Subsidios habitacionales chilenos (DS49, DS27, Bono de Reparación, etc.)
- Trámites en Chile (dónde sacar cada documento, qué institución lo emite, cuánto demora)
- El proceso de postulación a subsidios MINVU

Reglas:
- Responde siempre en español simple, sin tecnicismos
- Sé breve y directo — máximo 3 párrafos cortos
- Si no sabes algo con certeza, dilo honestamente
- No inventes números de teléfono, direcciones ni fechas de postulación
- Cuando corresponda, menciona la institución oficial (MINVU, municipio, Registro Civil, SII, etc.)`

const PREGUNTAS_RAPIDAS = [
  '¿Dónde renuevo mi cédula?',
  '¿Qué es el DS49?',
  '¿Cuánto demora la tasación?',
  '¿Qué pasa si perdí mi escritura?',
  '¿Cómo postulo al bono de reparación?',
]

const TEMAS_SUGERIDOS = [
  { icono: 'description',     titulo: 'Documentos', texto: '¿Qué documentos necesito para postular?' },
  { icono: 'account_balance', titulo: 'Subsidios',  texto: '¿Cuáles son los subsidios disponibles?' },
  { icono: 'location_city',   titulo: 'Trámites',   texto: '¿Dónde hago mis trámites en Chile?' },
  { icono: 'home_work',       titulo: 'MINVU',      texto: '¿Cómo es el proceso de postulación MINVU?' },
]

// ── Componentes auxiliares fuera del componente principal ──

function MensajeContenido({ m }) {
  return (
    <>
      {renderConLinks(m.content).map((parte) =>
        parte.tipo === 'link' ? (
          <a
            key={parte.key}
            href={parte.valor}
            target="_blank"
            rel="noreferrer"
            className={`underline ${m.role === 'user' ? 'text-white' : 'text-brand-600'}`}
          >
            {parte.valor}
          </a>
        ) : (
          <span key={parte.key}>{parte.valor}</span>
        )
      )}
    </>
  )
}

function AvatarMascota({ mascota, size = 8 }) {
  return (
    <div
      className={`rounded-full bg-brand-100 flex items-center justify-center shrink-0 overflow-hidden`}
      style={{ width: size * 4, height: size * 4 }}
    >
      {mascota?.imagen ? (
        <img src={mascota.imagen} alt={mascota.nombre} className="w-full h-full object-cover" />
      ) : (
        <Icon name="smart_toy" size={size * 2} className="text-brand-700" />
      )}
    </div>
  )
}

function InputChat({ id, input, setInput, loading, onEnviar, inputRef }) {
  return (
    <div id={id} className="flex gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnviar(input)}
        placeholder="Escribe tu pregunta..."
        className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
        disabled={loading}
      />
      <button
        onClick={() => onEnviar(input)}
        disabled={!input.trim() || loading}
        className="text-brand-600 disabled:opacity-30 transition flex items-center"
      >
        <Icon name="arrow_upward" size={22} />
      </button>
    </div>
  )
}

// ── Componente principal ──

export default function AsistentePage() {
  const { profile } = useProfile()
  const { mascota } = useMascota()

  const [mensajes, setMensajes] = useState([
    {
      role: 'assistant',
      content: `¡Hola${profile?.name ? ` ${profile.name}` : ''}! Soy ${mascota?.nombre || 'tu asistente'}. Pregúntame lo que necesites sobre documentos, subsidios o trámites — respondo en palabras simples, sin burocracia.`,
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef()
  const inputRef = useRef()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviarMensaje = async (texto) => {
    if (!texto.trim() || loading) return

    const nuevosMensajes = [...mensajes, { role: 'user', content: texto }]
    setMensajes(nuevosMensajes)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: nuevosMensajes.filter((m) => m.role !== 'system'),
        }),
      })

      const data = await response.json()
      const respuesta = data.content?.[0]?.text || 'No pude responder. Intenta de nuevo.'
      setMensajes((prev) => [...prev, { role: 'assistant', content: respuesta }])
    } catch (err) {
      setMensajes((prev) => [
        ...prev,
        { role: 'assistant', content: 'Tuve un problema para responder. Intenta de nuevo en un momento.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── MOBILE ── */}
      <div className="md:hidden flex flex-col min-h-screen pb-16">
        <div className="max-w-sm mx-auto w-full flex flex-col flex-1">
          <div className="px-4 pt-8 pb-4">
            <h1 className="text-2xl font-bold text-gray-800">{mascota?.nombre || 'Asistente'}</h1>
            <p className="text-sm text-gray-500">Tu asistente de subsidios y trámites</p>
          </div>
          <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="mr-2">
                    <AvatarMascota mascota={mascota} size={8} />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                }`}>
                  <MensajeContenido m={m} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="mr-2">
                  <AvatarMascota mascota={mascota} size={8} />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <span className="text-gray-400 text-sm">Pensando...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <div className="px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {PREGUNTAS_RAPIDAS.map((p) => (
                <button
                  key={p}
                  onClick={() => enviarMensaje(p)}
                  disabled={loading}
                  className="shrink-0 bg-white border border-gray-200 text-gray-600 text-xs rounded-full px-3 py-2 hover:border-brand-400 hover:text-brand-700 transition disabled:opacity-40"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 pb-4">
            <InputChat
              id="tour-target-chat-mobile"
              input={input}
              setInput={setInput}
              loading={loading}
              onEnviar={enviarMensaje}
              inputRef={inputRef}
            />
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex" style={{ height: 'calc(100vh - 64px)' }}>

        {/* Sidebar izquierda */}
        <aside className="w-72 shrink-0 bg-white border-r border-gray-100 flex flex-col">
          <div className="bg-brand-600 px-6 py-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-brand-500 ring-2 ring-white/30 shrink-0">
              {mascota?.imagen ? (
                <img src={mascota.imagen} alt={mascota?.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon name="smart_toy" size={28} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="text-white font-bold text-base">{mascota?.nombre || 'Asistente'}</p>
              <p className="text-brand-100 text-xs">Asistente de Ampara</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="w-2 h-2 rounded-full bg-success-400" />
                <p className="text-brand-200 text-xs">En línea</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 flex-1 overflow-y-auto">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Temas frecuentes
            </p>
            <div className="flex flex-col gap-2">
              {TEMAS_SUGERIDOS.map(({ icono, titulo, texto }) => (
                <button
                  key={titulo}
                  onClick={() => enviarMensaje(texto)}
                  disabled={loading}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 transition text-left disabled:opacity-40 border border-gray-100 hover:border-brand-200"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name={icono} size={16} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{titulo}</p>
                    <p className="text-xs text-gray-400 leading-snug">{texto}</p>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 mt-5">
              Preguntas rápidas
            </p>
            <div className="flex flex-col gap-1.5">
              {PREGUNTAS_RAPIDAS.map((p) => (
                <button
                  key={p}
                  onClick={() => enviarMensaje(p)}
                  disabled={loading}
                  className="text-left text-xs text-gray-600 px-3 py-2.5 rounded-xl hover:bg-brand-50 hover:text-brand-700 transition disabled:opacity-40 border border-gray-100 hover:border-brand-200"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-400 flex items-start gap-1.5">
              <Icon name="lock" size={12} className="shrink-0 mt-0.5" />
              Tu conversación es privada y no se comparte con terceros.
            </p>
          </div>
        </aside>

        {/* Chat principal */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-brand-100 shrink-0">
              {mascota?.imagen ? (
                <img src={mascota.imagen} alt={mascota?.nombre} className="w-full h-full object-cover" />
              ) : (
                <Icon name="smart_toy" size={20} className="text-brand-700" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{mascota?.nombre || 'Asistente'}</p>
              <p className="text-xs text-gray-400">Especialista en subsidios y trámites</p>
            </div>
            {mensajes.length > 1 && (
              <button
                onClick={() => setMensajes([mensajes[0]])}
                className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition px-3 py-1.5 rounded-xl hover:bg-gray-100"
              >
                <Icon name="refresh" size={14} />
                Nueva conversación
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {mensajes.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="mr-3">
                    <AvatarMascota mascota={mascota} size={8} />
                  </div>
                )}
                <div className={`max-w-[65%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-tl-sm border border-gray-100'
                }`}>
                  <MensajeContenido m={m} />
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="mr-3">
                  <AvatarMascota mascota={mascota} size={8} />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-sm border border-gray-100">
                  <span className="text-gray-400 text-sm">Pensando...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-6 py-4 bg-white border-t border-gray-100">
            <InputChat
              id="tour-target-chat"
              input={input}
              setInput={setInput}
              loading={loading}
              onEnviar={enviarMensaje}
              inputRef={inputRef}
            />
            <p className="text-xs text-gray-400 mt-2 text-center">
              Presiona Enter para enviar · Las respuestas son orientativas, no reemplazan asesoría oficial
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
      <TourSpotlight rutaActual="/asistente" />
    </div>
  )
}