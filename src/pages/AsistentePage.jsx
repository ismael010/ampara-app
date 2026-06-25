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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes])

  const enviarMensaje = async (texto) => {
    if (!texto.trim() || loading) return

    const nuevosMensajes = [
      ...mensajes,
      { role: 'user', content: texto },
    ]

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
    <div className="min-h-screen bg-gray-50 flex flex-col pb-16">
      <div className="max-w-sm mx-auto w-full flex flex-col flex-1">

        <div className="px-4 pt-8 pb-4">
          <h1 className="text-2xl font-bold text-gray-800">{mascota?.nombre || 'Asistente'}</h1>
          <p className="text-sm text-gray-500">Tu asistente de subsidios y trámites</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-4">
          {mensajes.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center mr-2 shrink-0 overflow-hidden">
                  {mascota?.imagen ? (
                    <img src={mascota.imagen} alt={mascota.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <Icon name="smart_toy" size={18} className="text-brand-700" />
                  )}
                </div>
              )}
              <div
  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
    m.role === 'user'
      ? 'bg-brand-600 text-white rounded-tr-sm'
      : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
  }`}
>
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
</div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center mr-2 shrink-0 overflow-hidden">
                {mascota?.imagen ? (
                  <img src={mascota.imagen} alt={mascota.nombre} className="w-full h-full object-cover" />
                ) : (
                  <Icon name="smart_toy" size={18} className="text-brand-700" />
                )}
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <span className="text-gray-400 text-sm">Pensando...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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

        <div id="tour-target-chat" className="px-4 pb-4">
          <div className="flex gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && enviarMensaje(input)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
              disabled={loading}
            />
            <button
              onClick={() => enviarMensaje(input)}
              disabled={!input.trim() || loading}
              className="text-brand-600 disabled:opacity-30 transition flex items-center"
            >
              <Icon name="arrow_upward" size={22} />
            </button>
          </div>
        </div>

      </div>
      <BottomNav />
      <TourSpotlight rutaActual="/asistente" />
    </div>
  )
}