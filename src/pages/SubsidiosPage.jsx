import { useProfile } from '../hooks/useProfile'
import { useDocumentos } from '../hooks/useDocumentos'
import { SUBSIDIOS } from '../data/subsidiosCatalogo'
import { calcularMatch } from '../utils/calcularMatch'
import SubsidioCard from '../components/SubsidioCard'
import BottomNav from '../components/BottomNav'

export default function SubsidiosPage() {
  const { profile, loading: loadingProfile } = useProfile()
  const { documentos, loading: loadingDocs } = useDocumentos()

  const loading = loadingProfile || loadingDocs

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-emerald-600 font-medium">Calculando matches...</p>
      </div>
    )
  }

  const subsidiosOrdenados = [...SUBSIDIOS]
    .map((s) => {
      const { porcentaje } = calcularMatch(s, profile, documentos)
      return { ...s, porcentaje }
    })
    .sort((a, b) => b.porcentaje - a.porcentaje)

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis subsidios</h1>
          <p className="text-sm text-gray-500 mt-1">
            Según tu perfil, estas son tus mejores opciones
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5">
          <p className="text-sm text-emerald-800">
            💡 Sube más documentos en <span className="font-semibold">Mis papeles</span> para aumentar tu match
          </p>
        </div>

        {subsidiosOrdenados.map((subsidio) => (
          <SubsidioCard
            key={subsidio.id}
            subsidio={subsidio}
            perfil={profile}
            documentos={documentos}
          />
        ))}

      </div>
      <BottomNav />
    </div>
  )
}