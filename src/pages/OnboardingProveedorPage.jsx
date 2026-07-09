import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useUserProfile } from '../hooks/useUserProfile'
import { useMiProveedor } from '../hooks/useMiProveedor'
import { CATEGORIAS_PROVEEDOR } from '../data/proveedoresCatalogo'
import Icon from '../components/ui/Icon'
import logo from '../assets/logo.png'

const INFO_CATEGORIAS = {
  maestro:    'Los maestros independientes pueden ofrecer sus servicios de construcción y reparación directamente a familias que los necesitan.',
  ferreteria: 'Las ferreterías y tiendas de materiales conectan con familias que necesitan insumos para sus proyectos de reconstrucción.',
  empresa:    'Las empresas constructoras pueden acceder a leads de familias que buscan contratistas para obras mayores.',
}

export default function OnboardingProveedorPage() {
  const { user } = useAuthContext()
  const { createProfile } = useUserProfile()
  const { guardarProveedor } = useMiProveedor()
  const navigate = useNavigate()

  const [categoria, setCategoria] = useState('')
  const [nombre,    setNombre]    = useState('')
  const [rubro,     setRubro]     = useState('')
  const [comuna,    setComuna]    = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [loading,   setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await guardarProveedor({
        nombre, categoria, rubro, comuna, telefono,
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

  const formularioValido = categoria && nombre && rubro && comuna && telefono

  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ¿Qué tipo de proveedor eres?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        disabled={!formularioValido || loading}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
      >
        {loading ? 'Guardando...' : 'Publicar mi perfil →'}
      </button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-center px-4 py-8 min-h-screen">
        <div className="w-full max-w-sm bg-white rounded-card shadow-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Crea tu perfil de proveedor</h1>
            <p className="text-sm text-gray-500 mt-1">Así las familias podrán encontrarte</p>
          </div>
          {FormContent}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex min-h-screen">

        {/* Panel izquierdo */}
        <div className="w-2/5 bg-brand-600 flex flex-col justify-between px-12 py-12 sticky top-0 h-screen">
          <img src={logo} alt="Ampara" className="w-32 h-auto" />

          <div>
            <p className="text-brand-200 text-sm font-medium uppercase tracking-widest mb-3">
              Proveedor
            </p>
            <h1 className="text-3xl font-bold text-white leading-tight mb-4">
              Crea tu perfil de proveedor
            </h1>
            <p className="text-brand-100 text-base leading-relaxed">
              Miles de familias en Chile buscan maestros, ferreterías y empresas
              para sus proyectos de construcción y reparación. Publica tu perfil
              y empieza a recibir contactos.
            </p>
          </div>

          {/* Info dinámica según categoría */}
          <div className="bg-white/10 rounded-card p-5 min-h-[200px] transition-all duration-300">
            {categoria ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    name={CATEGORIAS_PROVEEDOR.find(c => c.id === categoria)?.icono || 'storefront'}
                    size={18}
                    className="text-brand-100"
                  />
                  <p className="text-white font-semibold text-sm">
                    {CATEGORIAS_PROVEEDOR.find(c => c.id === categoria)?.label}
                  </p>
                </div>
                <p className="text-brand-100 text-sm leading-relaxed mb-4">
                  {INFO_CATEGORIAS[categoria]}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { icono: 'contacts',    texto: 'Recibe leads de familias interesadas' },
                    { icono: 'whatsapp',    texto: 'Contacto directo por WhatsApp' },
                    { icono: 'storefront',  texto: 'Visible en el marketplace de Ampara' },
                  ].map(({ icono, texto }) => (
                    <div key={texto} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Icon name={icono} size={12} className="text-white" />
                      </div>
                      <p className="text-brand-100 text-xs">{texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-white font-semibold text-sm mb-4">
                  ¿Por qué publicar en Ampara?
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icono: 'groups',        texto: '+63.000 familias buscando proveedores' },
                    { icono: 'location_city', texto: '242 comunas cubiertas en Chile' },
                    { icono: 'contacts',      texto: 'Recibe leads directo a tu WhatsApp' },
                    { icono: 'verified',      texto: 'Perfil verificado aumenta la confianza' },
                  ].map(({ icono, texto }) => (
                    <div key={texto} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <Icon name={icono} size={14} className="text-white" />
                      </div>
                      <p className="text-brand-100 text-sm">{texto}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel derecho */}
        <div className="flex-1 flex items-center justify-center px-16 py-12 overflow-y-auto">
          <div className="w-full max-w-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Datos de tu negocio</h2>
              <p className="text-gray-500 mt-1">
                Esta información aparecerá en tu perfil público del marketplace
              </p>
            </div>
            {FormContent}
          </div>
        </div>
      </div>

    </div>
  )
}