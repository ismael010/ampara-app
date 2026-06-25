import { CATALOGO } from '../../data/documentosCatalogo'
import { usePerfilFamilia } from '../../hooks/usePerfilFamilia'
import { useDocumentos } from '../../hooks/useDocumentos'
import { useSeguimiento } from '../../hooks/useSeguimiento'
import { useEstadisticasSubsidios } from '../../hooks/useEstadisticasSubsidios'
import BottomNav from '../../components/BottomNav'
import HomeHeader from '../../components/HomeHeader'
import MisionDelDia from '../../components/MisionDelDia'
import AccesoDocumentos from '../../components/AccesoDocumentos'
import DonutSubsidios from '../../components/DonutSubsidios'
import AccesoSeguimiento from '../../components/AccesoSeguimiento'
import ResumenSeguimiento from '../../components/ResumenSeguimiento'
import TourSpotlight from '../../components/TourSpotlight'

export default function HomeFamilia() {
  const { perfilFamilia: profile, loading: loadingProfile } = usePerfilFamilia()
  const { documentos, loading: loadingDocs } = useDocumentos()
  const { seguimientos, loading: loadingSeg } = useSeguimiento()

  const stats = useEstadisticasSubsidios(profile, documentos, seguimientos)

  const totalDocs = CATALOGO.flatMap((c) => c.docs).length
  const subidos = Object.values(documentos).filter((d) => d.subido).length

  const loading = loadingProfile || loadingDocs || loadingSeg

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-sm mx-auto px-4 pt-8">
        <HomeHeader profile={profile} />

        <MisionDelDia docsSubidos={subidos} docsTotales={totalDocs} />

        <div className="grid grid-cols-2 gap-3 mb-3">
          <AccesoDocumentos subidos={subidos} total={totalDocs} />
          <DonutSubsidios stats={stats} />
        </div>

        {seguimientos.length > 0 ? (
          <ResumenSeguimiento seguimientos={seguimientos} />
        ) : (
          <AccesoSeguimiento />
        )}

      </div>
      <BottomNav />
      <TourSpotlight rutaActual="/home" />
    </div>
  )
}