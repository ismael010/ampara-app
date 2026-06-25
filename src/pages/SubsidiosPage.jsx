import { useProfile } from '../hooks/useProfile'
import { useDocumentos } from '../hooks/useDocumentos'
import { SUBSIDIOS } from '../data/subsidiosCatalogo'
import { calcularMatch } from '../utils/calcularMatch'
import SubsidioCard from '../components/SubsidioCard'
import BottomNav from '../components/BottomNav'
import Icon from '../components/ui/Icon'
import TourSpotlight from '../components/TourSpotlight'


export default function SubsidiosPage() {
  const { profile, loading: loadingProfile } = useProfile()
  const { documentos, loading: loadingDocs } = useDocumentos()

  const loading = loadingProfile || loadingDocs

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Calculando matches...</p>
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

        <div className="bg-brand-50 border border-brand-200 rounded-card p-4 mb-5 flex items-start gap-2">
          <Icon name="lightbulb" size={18} className="text-brand-600 shrink-0 mt-0.5" />
          <p className="text-sm text-brand-700">
            Sube más documentos en <span className="font-semibold">Mis papeles</span> para aumentar tu match
          </p>
        </div>
        
      <div id="tour-target-lista-subsidios">
        {subsidiosOrdenados.map((subsidio) => (
          <SubsidioCard
            key={subsidio.id}
            subsidio={subsidio}
            perfil={profile}
            documentos={documentos}
          />
        ))}
        </div>

      </div>
      <BottomNav />
      <TourSpotlight rutaActual="/subsidios" />
    </div>
  )
}