import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMiEP } from '../hooks/useMiEP'
import { TIPOS_EP, RANGOS_FAMILIAS } from '../data/epsCatalogo'
import Icon from '../components/ui/Icon'

export default function OnboardingEPPage() {
  const { guardarEP } = useMiEP()
  const navigate = useNavigate()

  const [tipo, setTipo] = useState('')
  const [nombre, setNombre] = useState('')
  const [rubro, setRubro] = useState('')
  const [comuna, setComuna] = useState('')
  const [rangoFamilias, setRangoFamilias] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await guardarEP({ tipo, nombre, rubro, comuna, rangoFamilias })
      navigate('/home')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-card shadow-md p-8">

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Crea el perfil de tu organización</h1>
          <p className="text-sm text-gray-500 mt-1">Así vas a poder ver y gestionar familias</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de organización
            </label>
            <div className="grid grid-cols-1 gap-2">
              {TIPOS_EP.map(({ id, label, icono }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setTipo(id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition ${
                    tipo === id
                      ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                      : 'border-gray-200 hover:border-brand-200'
                  }`}
                >
                  <Icon name={icono} size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la organización
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Constructora Los Robles"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rubro específico
            </label>
            <input
              type="text"
              required
              value={rubro}
              onChange={(e) => setRubro(e.target.value)}
              placeholder="Ej: Reconstrucción post-emergencia"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comuna o región de cobertura
            </label>
            <input
              type="text"
              required
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              placeholder="Ej: Región del Maule"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Cuántas familias manejan aproximadamente?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {RANGOS_FAMILIAS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRangoFamilias(r)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                    rangoFamilias === r
                      ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                      : 'border-gray-200 hover:border-brand-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!tipo || !rangoFamilias || loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
          >
            {loading ? 'Guardando...' : 'Crear perfil →'}
          </button>
        </form>

      </div>
    </div>
  )
}