import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMiProveedor } from '../hooks/useMiProveedor'
import { CATEGORIAS_PROVEEDOR } from '../data/proveedoresCatalogo'
import BottomNavProveedor from '../components/BottomNavProveedor'
import Icon from '../components/ui/Icon'

export default function EditarCatalogoPage() {
  const { miProveedor, loading, guardarProveedor } = useMiProveedor()
  const navigate = useNavigate()

  const [categoria, setCategoria] = useState('')
  const [nombre, setNombre] = useState('')
  const [rubro, setRubro] = useState('')
  const [comuna, setComuna] = useState('')
  const [telefono, setTelefono] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (miProveedor) {
      setCategoria(miProveedor.categoria || '')
      setNombre(miProveedor.nombre || '')
      setRubro(miProveedor.rubro || '')
      setComuna(miProveedor.comuna || '')
      setTelefono(miProveedor.telefono || '')
    }
  }, [miProveedor])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    try {
      await guardarProveedor({ categoria, nombre, rubro, comuna, telefono })
      navigate('/home')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <h1 className="text-2xl font-bold text-gray-800 mb-1">Mi catálogo</h1>
        <p className="text-sm text-gray-500 mb-6">Así te ven las familias en el Marketplace</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-card shadow-sm p-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de proveedor</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre o razón social</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rubro o especialidad</label>
            <input
              type="text"
              required
              value={rubro}
              onChange={(e) => setRubro(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
            <input
              type="text"
              required
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Teléfono</label>
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
            disabled={!categoria || guardando}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
          >
            {guardando ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>

      </div>
      <BottomNavProveedor />
    </div>
  )
}