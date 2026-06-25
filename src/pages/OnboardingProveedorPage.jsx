import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'
import { useMiProveedor } from '../hooks/useMiProveedor'
import { CATEGORIAS_PROVEEDOR } from '../data/proveedoresCatalogo'
import Icon from '../components/ui/Icon'

export default function OnboardingProveedorPage() {
  const { user } = useAuthContext()
  const { createProfile } = useUserProfile()
  const { guardarProveedor } = useMiProveedor()
  const navigate = useNavigate()

  const [categoria, setCategoria] = useState('')
  const [nombre, setNombre] = useState('')
  const [rubro, setRubro] = useState('')
  const [comuna, setComuna] = useState('')
  const [loading, setLoading] = useState(false)
  const [telefono, setTelefono] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await guardarProveedor({
        nombre,
        categoria,
        rubro,
        comuna,
        telefono,
        verificado: false,
        createdAt: new Date(),
      })
      await createProfile(user.uid, {})
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
          <h1 className="text-xl font-bold text-gray-800">Crea tu perfil de proveedor</h1>
          <p className="text-sm text-gray-500 mt-1">Así las familias podrán encontrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué tipo de proveedor eres?
            </label>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIAS_PROVEEDOR.map(({ id, label, icono }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setCategoria(id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition ${
                    categoria === id
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
              Nombre o razón social
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez — Maestro albañil"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rubro o especialidad
            </label>
            <input
              type="text"
              required
              value={rubro}
              onChange={(e) => setRubro(e.target.value)}
              placeholder="Ej: Albañilería y reparaciones"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comuna
            </label>
            <input
              type="text"
              required
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              placeholder="Ej: Talca"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             WhatsApp / Teléfono
           </label>
           <input
             type="tel"
             required
             value={telefono}
             onChange={(e) => setTelefono(e.target.value)}
             placeholder="+56 9 1234 5678"
             className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
           />
          </div>

          <button
            type="submit"
            disabled={!categoria || loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
          >
            {loading ? 'Guardando...' : 'Publicar mi perfil →'}
          </button>
        </form>

      </div>
    </div>
  )
}