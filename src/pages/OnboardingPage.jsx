import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'

const REGIONES = [
  'Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Atacama',
  'Coquimbo', 'Valparaíso', 'Metropolitana de Santiago', "O'Higgins",
  'Maule', 'Ñuble', 'Biobío', 'La Araucanía', 'Los Ríos',
  'Los Lagos', 'Aysén', 'Magallanes y Antártica Chilena'
]

const CONVIVENCIA = [
  { id: 'solo', label: 'Solo/a' },
  { id: 'pareja', label: 'Con mi pareja' },
  { id: 'hijos', label: 'Con hijos menores de 18' },
  { id: 'mayores', label: 'Con adultos mayores' },
  { id: 'hermanos', label: 'Con hermano/s' },
  { id: 'roomate', label: 'Con roomate' },
  { id: 'otros', label: 'Otros' },
]

export default function OnboardingPage() {
  const { user } = useAuthContext()
  const { createProfile } = useUserProfile()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    edad: '',
    vivienda: '',
    convivencia: [],
    region: '',
    danio: '',
    educacion: '',
    ingresos: '',
  })

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const toggleConvivencia = (id) => {
    setForm((prev) => ({
      ...prev,
      convivencia: prev.convivencia.includes(id)
        ? prev.convivencia.filter((i) => i !== id)
        : [...prev.convivencia, id],
    }))
  }

  const handleFinish = async () => {
    setLoading(true)
    try {
      await createProfile(user.uid, form)
      navigate('/elegir-mascota')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-card shadow-md p-8">

        {/* Progreso */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step ? 'bg-brand-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* PASO 1 */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Cuéntanos sobre ti</h2>
              <p className="text-sm text-gray-500 mt-1">Paso 1 de 3 — Información básica</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tu nombre</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="Rosa Fuentes"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuántos años tienes?</label>
              <div className="grid grid-cols-1 gap-2">
                {['Menos de 30', '30 – 40 años', '40 – 60 años', '61 – 75 años', 'Más de 75'].map((op) => (
                  <button
                    key={op}
                    onClick={() => update('edad', op)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                      form.edad === op
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">¿Cuál es tu situación de vivienda?</label>
              <div className="grid grid-cols-1 gap-2">
                {['Tengo casa propia con escritura', 'Tengo casa sin papeles', 'Arriendo', 'Vivo con familiares'].map((op) => (
                  <button
                    key={op}
                    onClick={() => update('vivienda', op)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                      form.vivienda === op
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!form.name || !form.edad || !form.vivienda}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        )}

        {/* PASO 2 */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Tu hogar y región</h2>
              <p className="text-sm text-gray-500 mt-1">Paso 2 de 3</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">¿Con quiénes vives?</label>
              <div className="grid grid-cols-1 gap-2">
                {CONVIVENCIA.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => toggleConvivencia(id)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                      form.convivencia.includes(id)
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">¿En qué región vives?</label>
              <select
                value={form.region}
                onChange={(e) => update('region', e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="">Selecciona tu región</option>
                {REGIONES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">¿Tu casa ha tenido daños por emergencias?</label>
              <div className="grid grid-cols-1 gap-2">
                {['Sí, daño grave', 'Sí, daño parcial', 'No, está bien', 'No sé / no revisada'].map((op) => (
                  <button
                    key={op}
                    onClick={() => update('danio', op)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                      form.danio === op
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 text-gray-600 rounded-xl py-3 text-sm hover:bg-gray-50 transition"
              >
                ← Atrás
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!form.region || !form.danio}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Tu situación económica</h2>
              <p className="text-sm text-gray-500 mt-1">Paso 3 de 3 — ¡Última parte!</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de educación</label>
              <div className="grid grid-cols-1 gap-2">
                {['Sin estudios formales', 'Educación básica', 'Educación media', 'Técnico medio', 'Técnico superior', 'Universitaria'].map((op) => (
                  <button
                    key={op}
                    onClick={() => update('educacion', op)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                      form.educacion === op
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">¿Cuánto recibes al mes?</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  'Menos del sueldo mínimo (< $530.000)',
                  'Sueldo mínimo $530.000 – $800.000',
                  'Rango medio-bajo $800.001 – $1.200.000',
                  'Rango medio $1.200.001 – $2.000.000',
                  'Rango medio-alto $2.000.001 – $5.000.000',
                ].map((op) => (
                  <button
                    key={op}
                    onClick={() => update('ingresos', op)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                      form.ingresos === op
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 hover:border-brand-200'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 border border-gray-300 text-gray-600 rounded-xl py-3 text-sm hover:bg-gray-50 transition"
              >
                ← Atrás
              </button>
              <button
                onClick={handleFinish}
                disabled={!form.educacion || !form.ingresos || loading}
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
              >
                {loading ? 'Guardando...' : '¡Ver Ampara! →'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}