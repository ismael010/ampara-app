import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMiProveedor } from '../hooks/useMiProveedor'
import { CATEGORIAS_PROVEEDOR } from '../data/proveedoresCatalogo'
import BottomNavProveedor from '../components/BottomNavProveedor'
import Icon from '../components/ui/Icon'

const ICONOS_CATEGORIA = {
  maestro:    'construction',
  ferreteria: 'hardware',
  empresa:    'business',
}

export default function EditarCatalogoPage() {
  const { miProveedor, loading, guardarProveedor } = useMiProveedor()
  const navigate = useNavigate()

  const [categoria, setCategoria] = useState('')
  const [nombre,    setNombre]    = useState('')
  const [rubro,     setRubro]     = useState('')
  const [comuna,    setComuna]    = useState('')
  const [telefono,  setTelefono]  = useState('')
  const [guardando, setGuardando] = useState(false)
  const [guardado,  setGuardado]  = useState(false)

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
      setGuardado(true)
      setTimeout(() => setGuardado(false), 2500)
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

  // Vista previa del perfil público
  const Preview = () => (
    <div className="bg-white rounded-card border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Así te ven las familias
      </p>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
          <Icon name={ICONOS_CATEGORIA[categoria] || 'storefront'} size={22} className="text-brand-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold text-gray-800">{nombre || 'Tu nombre'}</p>
            {miProveedor?.verificado && (
              <Icon name="verified" size={14} className="text-brand-600" />
            )}
          </div>
          <p className="text-xs text-gray-500">{rubro || 'Tu rubro'}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-gray-400 flex items-center gap-0.5">
              <Icon name="location_on" size={12} />
              {comuna || 'Tu comuna'}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 w-full bg-brand-50 text-brand-700 text-xs font-medium rounded-button py-2 flex items-center justify-center gap-1.5">
        <Icon name="chat_bubble" size={14} />
        Contactar
      </div>
    </div>
  )

  const FormularioCampos = () => (
    <>
      {/* Categoría como fila de pills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de proveedor</label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIAS_PROVEEDOR.map(({ id, label, icono }) => (
            <button
              type="button"
              key={id}
              onClick={() => setCategoria(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm transition ${
                categoria === id
                  ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                  : 'border-gray-200 hover:border-brand-200 text-gray-600'
              }`}
            >
              <Icon name={icono} size={15} />
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rubro</label>
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
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Mi catálogo</h1>
        <p className="text-sm text-gray-500 mb-5">Edita cómo te ven las familias</p>

        {/* Preview compacta arriba */}
        <div className="mb-4">
          <Preview />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-card shadow-sm p-5">
          <FormularioCampos />
          <button
            type="submit"
            disabled={!categoria || guardando}
            className={`w-full font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40 flex items-center justify-center gap-2 ${
              guardado
                ? 'bg-success-600 text-white'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            {guardado ? (
              <><Icon name="check" size={16} />Guardado</>
            ) : guardando ? (
              'Guardando...'
            ) : (
              'Guardar cambios'
            )}
          </button>
        </form>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <h1 className="text-3xl font-bold text-white">Mi catálogo</h1>
          <p className="text-brand-100 mt-1">
            Edita tu información pública del marketplace
          </p>
        </div>

        <div className="px-10 grid grid-cols-3 gap-8">

          {/* Formulario — 2 columnas */}
          <div className="col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-card shadow-sm border border-gray-100 p-8 space-y-6">
              <FormularioCampos />

              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={!categoria || guardando}
                  className={`px-8 py-3 font-semibold rounded-xl text-sm transition disabled:opacity-40 flex items-center gap-2 ${
                    guardado
                      ? 'bg-success-600 text-white'
                      : 'bg-brand-600 hover:bg-brand-700 text-white'
                  }`}
                >
                  {guardado ? (
                    <><Icon name="check" size={16} />Guardado</>
                  ) : guardando ? (
                    'Guardando...'
                  ) : (
                    'Guardar cambios'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          {/* Panel derecho — preview en vivo */}
          <div className="flex flex-col gap-4">
            <Preview />

            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-3">Consejos</p>
              <div className="flex flex-col gap-3">
                {[
                  { icono: 'edit',         texto: 'Usa un nombre que la gente ya conozca en tu zona' },
                  { icono: 'location_on',  texto: 'Especifica bien tu comuna — es lo primero que filtran' },
                  { icono: 'phone',        texto: 'Revisa que tu WhatsApp esté activo en ese número' },
                  { icono: 'verified',     texto: 'Solicita verificación para subir en los resultados' },
                ].map(({ icono, texto }) => (
                  <div key={texto} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name={icono} size={13} className="text-brand-600" />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavProveedor />
    </div>
  )
}