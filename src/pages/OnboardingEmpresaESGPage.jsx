import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMiEmpresaESG } from '../hooks/useMiEmpresaESG'
import { SECTORES_ESG } from '../data/esgCatalogo'
import Icon from '../components/ui/Icon'

export default function OnboardingEmpresaESGPage() {
  const { guardarEmpresaESG } = useMiEmpresaESG()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [sector, setSector] = useState('')
  const [zonas, setZonas] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await guardarEmpresaESG({ nombre, sector, zonas })
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
          <h1 className="text-xl font-bold text-gray-800">Crea el perfil de tu empresa</h1>
          <p className="text-sm text-gray-500 mt-1">Así vas a poder ver el impacto en tu comunidad</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la empresa
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Minera del Sur S.A."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sector o industria
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SECTORES_ESG.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSector(s)}
                  className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                    sector === s
                      ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                      : 'border-gray-200 hover:border-brand-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zonas de influencia o proyectos
            </label>
            <input
              type="text"
              required
              value={zonas}
              onChange={(e) => setZonas(e.target.value)}
              placeholder="Ej: Talca, Cauquenes, Linares"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <button
            type="submit"
            disabled={!sector || loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
          >
            {loading ? 'Guardando...' : 'Crear perfil →'}
          </button>
        </form>

      </div>
    </div>
  )
}