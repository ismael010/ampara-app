import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMiEP } from '../hooks/useMiEP'
import { TIPOS_EP, RANGOS_FAMILIAS } from '../data/epsCatalogo'
import Icon from '../components/ui/Icon'
import logo from '../assets/logo.png'

const INFO_TIPOS = {
  constructora: 'Las constructoras ejecutan obras de vivienda y pueden patrocinar familias en proceso de reconstrucción.',
  fundacion:    'Las fundaciones acompañan a familias vulnerables en su proceso de postulación y documentación.',
  municipio:    'Los municipios gestionan subsidios y conectan a familias de su comuna con los programas disponibles.',
  otro:         'Cualquier organización que acompañe a familias en su proceso de acceso a subsidios habitacionales.',
}

export default function OnboardingEPPage() {
  const { guardarEP } = useMiEP()
  const navigate = useNavigate()

  const [tipo,          setTipo]          = useState('')
  const [nombre,        setNombre]        = useState('')
  const [rubro,         setRubro]         = useState('')
  const [comuna,        setComuna]        = useState('')
  const [rangoFamilias, setRangoFamilias] = useState('')
  const [loading,       setLoading]       = useState(false)

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

  const formularioValido = tipo && rangoFamilias && nombre && rubro && comuna

  // ── Formulario compartido ──
  const FormContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de organización
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        disabled={!formularioValido || loading}
        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
      >
        {loading ? 'Guardando...' : 'Crear perfil →'}
      </button>
    </form>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── MOBILE ── */}
      <div className="md:hidden flex items-center justify-center px-4 py-8 min-h-screen">
        <div className="w-full max-w-sm bg-white rounded-card shadow-md p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Crea el perfil de tu organización</h1>
            <p className="text-sm text-gray-500 mt-1">Así vas a poder ver y gestionar familias</p>
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
              Entidad Patrocinante
            </p>
            <h1 className="text-3xl font-bold text-white leading-tight mb-4">
              Crea el perfil de tu organización
            </h1>
            <p className="text-brand-100 text-base leading-relaxed">
              Las EP son el puente entre las familias y los subsidios. Registra tu organización
              para comenzar a gestionar y acompañar familias en su proceso.
            </p>
          </div>

          {/* Info dinámica según tipo seleccionado */}
          <div className="bg-white/10 rounded-card p-5 min-h-[160px] transition-all duration-300">
            {tipo ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Icon
                    name={TIPOS_EP.find(t => t.id === tipo)?.icono || 'apartment'}
                    size={18}
                    className="text-brand-100"
                  />
                  <p className="text-white font-semibold text-sm">
                    {TIPOS_EP.find(t => t.id === tipo)?.label}
                  </p>
                </div>
                <p className="text-brand-100 text-sm leading-relaxed">
                  {INFO_TIPOS[tipo]}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-white font-semibold text-sm mb-4">
                  ¿Qué puede hacer una EP en Ampara?
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icono: 'groups',          texto: 'Ver y filtrar familias por región e ingresos' },
                    { icono: 'route',            texto: 'Revisar el progreso de cada postulación' },
                    { icono: 'description',      texto: 'Ver el estado de documentos de cada familia' },
                    { icono: 'storefront',       texto: 'Acceder al marketplace de proveedores' },
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
              <h2 className="text-2xl font-bold text-gray-800">Datos de tu organización</h2>
              <p className="text-gray-500 mt-1">
                Completa los campos para activar tu cuenta de EP
              </p>
            </div>
            {FormContent}
          </div>
        </div>
      </div>

    </div>
  )
}