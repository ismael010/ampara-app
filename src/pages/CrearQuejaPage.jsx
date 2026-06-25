import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePerfilFamilia } from '../hooks/usePerfilFamilia'
import { useEmpresasCercanas } from '../hooks/useEmpresasCercanas'
import { useCrearQueja } from '../hooks/useQuejas'
import { CATEGORIAS_QUEJA } from '../data/quejasCatalogo'
import BottomNav from '../components/BottomNav'
import Icon from '../components/ui/Icon'

export default function CrearQuejaPage() {
  const { perfilFamilia } = usePerfilFamilia()
  const { empresas, loading } = useEmpresasCercanas(perfilFamilia?.region)
  const { crearQueja } = useCrearQueja()
  const navigate = useNavigate()

  const [empresaId, setEmpresaId] = useState('')
  const [categoria, setCategoria] = useState('')
  const [texto, setTexto] = useState('')
  const [foto, setFoto] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnviando(true)
    try {
      await crearQueja({
        empresaId,
        categoria,
        texto,
        zona: perfilFamilia?.region,
        foto,
      })
      setEnviado(true)
    } catch (err) {
      console.error(err)
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <Icon name="check_circle" size={48} className="text-success-600 mb-3" />
          <p className="text-lg font-bold text-gray-800 mb-1">Queja enviada</p>
          <p className="text-sm text-gray-500 mb-5">La empresa va a revisar tu reporte</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-brand-600 text-white text-sm font-medium rounded-button px-5 py-2.5"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Reportar situación</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cuéntale a la empresa qué está pasando en tu zona
          </p>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Buscando empresas cercanas...</p>
        ) : empresas.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="business_center" size={40} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No hay empresas registradas en tu zona todavía</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
              <div className="space-y-2">
                {empresas.map((e) => (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => setEmpresaId(e.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition ${
                      empresaId === e.id
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200'
                    }`}
                  >
                    {e.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIAS_QUEJA.map(({ id, label, icono }) => (
                  <button
                    type="button"
                    key={id}
                    onClick={() => setCategoria(id)}
                    className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs transition ${
                      categoria === id
                        ? 'border-brand-600 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200'
                    }`}
                  >
                    <Icon name={icono} size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cuéntanos qué pasó</label>
              <textarea
                required
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                rows={4}
                placeholder="Describe la situación..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>

            <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Foto (opcional)</label>
  <label className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 flex items-center gap-2 cursor-pointer hover:border-brand-400 transition">
    <Icon name="add_a_photo" size={18} className="text-gray-400" />
    {foto ? foto.name : 'Toca para elegir una foto'}
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setFoto(e.target.files[0])}
      className="hidden"
    />
  </label>
</div>

            <button
              type="submit"
              disabled={!empresaId || !categoria || enviando}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl py-3 text-sm transition disabled:opacity-40"
            >
              {enviando ? 'Enviando...' : 'Enviar reporte'}
            </button>
          </form>
        )}

      </div>
      <BottomNav />
    </div>
  )
}
