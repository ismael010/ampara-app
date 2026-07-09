import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMiEmpresaESG } from '../hooks/useMiEmpresaESG'
import { SECTORES_ESG } from '../data/esgCatalogo'
import Icon from '../components/ui/Icon'
import logo from '../assets/logo.png'

const INFO_SECTORES = {
  'Minería':        'Las empresas mineras pueden monitorear su impacto en comunidades cercanas y gestionar compromisos sociales.',
  'Retail':         'Las empresas de retail pueden canalizar su inversión social hacia familias en zonas de influencia.',
  'Energía':        'Las empresas energéticas documentan su impacto comunitario y gestionan quejas de zonas afectadas.',
  'Construcción':   'Las constructoras pueden vincular proyectos sociales con familias que necesitan vivienda.',
  'Financiero':     'Las instituciones financieras pueden medir el impacto de sus programas de inclusión.',
  'Tecnología':     'Las empresas tech documentan iniciativas de inclusión digital en comunidades vulnerables.',
  'Agroindustria':  'Las empresas agroindustriales gestionan su relación con comunidades rurales.',
  'Otro':           'Cualquier empresa puede usar Ampara para documentar y medir su impacto social.',
}

export default function OnboardingEmpresaESGPage() {
  const { guardarEmpresaESG } = useMiEmpresaESG()
  const navigate = useNavigate()

  const [nombre,  setNombre]  = useState('')
  const [sector,  setSector]  = useState('')
  const [zonas,   setZonas]   = useState('')
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

  const FormContent = (
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
        <div className="grid grid-cols-2 gap-2">
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
        disabled={!sector || !nombre || !zonas || loading}
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
            <h1 className="text-xl font-bold text-gray-800">Crea el perfil de tu empresa</h1>
            <p className="text-sm text-gray-500 mt-1">Así vas a poder ver el impacto en tu comunidad</p>
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
              Empresa ESG
            </p>
            <h1 className="text-3xl font-bold text-white leading-tight mb-4">
              Crea el perfil de tu empresa
            </h1>
            <p className="text-brand-100 text-base leading-relaxed">
              Ampara permite a las empresas documentar, medir y gestionar
              su impacto social en comunidades reales de Chile.
            </p>
          </div>

          {/* Info dinámica según sector */}
          <div className="bg-white/10 rounded-card p-5 min-h-[180px] transition-all duration-300">
            {sector ? (
              <div>
                <p className="text-white font-semibold text-sm mb-2">{sector}</p>
                <p className="text-brand-100 text-sm leading-relaxed mb-4">
                  {INFO_SECTORES[sector] || INFO_SECTORES['Otro']}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { icono: 'feedback',    texto: 'Recibe y gestiona quejas de comunidades' },
                    { icono: 'construction',texto: 'Crea y sigue proyectos de impacto social' },
                    { icono: 'bar_chart',   texto: 'Dashboard de métricas ESG en tiempo real' },
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
                  ¿Qué puede hacer tu empresa en Ampara?
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { icono: 'feedback',     texto: 'Gestionar quejas de comunidades afectadas' },
                    { icono: 'construction', texto: 'Crear y dar seguimiento a proyectos sociales' },
                    { icono: 'bar_chart',    texto: 'Dashboard de impacto con datos reales' },
                    { icono: 'verified',     texto: 'Documentar compromisos ESG verificables' },
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
              <h2 className="text-2xl font-bold text-gray-800">Datos de tu empresa</h2>
              <p className="text-gray-500 mt-1">
                Completa los campos para activar tu cuenta ESG
              </p>
            </div>
            {FormContent}
          </div>
        </div>
      </div>
    </div>
  )
}