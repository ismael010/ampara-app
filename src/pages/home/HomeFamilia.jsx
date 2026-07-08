import { useNavigate } from 'react-router-dom'
import { CATALOGO } from '../../data/documentosCatalogo'
import { usePerfilFamilia } from '../../hooks/usePerfilFamilia'
import { useDocumentos } from '../../hooks/useDocumentos'
import { useSeguimiento } from '../../hooks/useSeguimiento'
import { useEstadisticasSubsidios } from '../../hooks/useEstadisticasSubsidios'
import { useProximoVencimiento } from '../../hooks/useProximoVencimiento'
import BottomNav from '../../components/BottomNav'
import HomeHeader from '../../components/HomeHeader'
import MisionDelDia from '../../components/MisionDelDia'
import AccesoDocumentos from '../../components/AccesoDocumentos'
import DonutSubsidios from '../../components/DonutSubsidios'
import AccesoSeguimiento from '../../components/AccesoSeguimiento'
import ResumenSeguimiento from '../../components/ResumenSeguimiento'
import CuadradoClima from '../../components/CuadradoClima'
import TourSpotlight from '../../components/TourSpotlight'
import Icon from '../../components/ui/Icon'

export default function HomeFamilia() {
  const navigate = useNavigate()
  const { perfilFamilia: profile, loading: loadingProfile } = usePerfilFamilia()
  const { documentos, loading: loadingDocs } = useDocumentos()
  const { seguimientos, loading: loadingSeg } = useSeguimiento()

  const stats = useEstadisticasSubsidios(profile, documentos, seguimientos)
  const proximo = useProximoVencimiento(documentos)

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
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      {/* ── MOBILE: columna única ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <HomeHeader profile={profile} />
        <MisionDelDia docsSubidos={subidos} docsTotales={totalDocs} />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <AccesoDocumentos subidos={subidos} total={totalDocs} />
          <DonutSubsidios stats={stats} />
        </div>
        {seguimientos.length > 0
          ? <ResumenSeguimiento seguimientos={seguimientos} />
          : <AccesoSeguimiento />
        }
        <div className="grid grid-cols-3 gap-3 mb-3">
          <button
            onClick={() => navigate('/juego')}
            className="bg-white rounded-card shadow-sm p-3 flex flex-col items-center justify-center border border-gray-100 hover:border-brand-200 transition"
          >
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center mb-1">
              <Icon name="sports_esports" size={16} className="text-brand-600" />
            </div>
            <p className="text-[10px] font-medium text-gray-700 text-center leading-tight">Juego</p>
          </button>
          <CuadradoClima />
          <button
            onClick={() => navigate('/crear-queja')}
            className="bg-white rounded-card shadow-sm p-3 flex flex-col items-center justify-center border border-gray-100 hover:border-brand-200 transition"
          >
            <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center mb-1">
              <Icon name="feedback" size={16} className="text-brand-600" />
            </div>
            <p className="text-[10px] font-medium text-gray-700 text-center leading-tight">Reportar</p>
          </button>
        </div>
      </div>

      {/* ── DESKTOP: dos columnas ── */}
      <div className="hidden md:block px-0 pt-0">

        {/* Banner de bienvenida */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <HomeHeader profile={profile} desktop />
        </div>

        <div className="px-10 grid grid-cols-3 gap-6">

          {/* Columna izquierda — acciones principales */}
          <div className="col-span-2 flex flex-col gap-6">

            {/* Misión del día */}
            <MisionDelDia docsSubidos={subidos} docsTotales={totalDocs} />

            {/* Documentos y subsidios en fila */}
            <div className="grid grid-cols-2 gap-4">
              <AccesoDocumentos subidos={subidos} total={totalDocs} />
              <DonutSubsidios stats={stats} />
            </div>

            {/* Seguimiento */}
            {seguimientos.length > 0
              ? <ResumenSeguimiento seguimientos={seguimientos} />
              : <AccesoSeguimiento />
            }
          </div>

          {/* Columna derecha — accesos rápidos */}
          <div className="flex flex-col gap-4">

            {/* Clima */}
            <CuadradoClima />

            {/* Accesos rápidos */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                Accesos rápidos
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => navigate('/subsidios')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="account_balance" size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Subsidios</p>
                    <p className="text-xs text-gray-400">Ver los que te corresponden</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/marketplace')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="storefront" size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Marketplace</p>
                    <p className="text-xs text-gray-400">Encontrar proveedores</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/asistente')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="smart_toy" size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Asistente</p>
                    <p className="text-xs text-gray-400">Consultar con IA</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/juego')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="sports_esports" size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Juego</p>
                    <p className="text-xs text-gray-400">Ganar fichas con trivia</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/crear-queja')}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="feedback" size={18} className="text-brand-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Reportar</p>
                    <p className="text-xs text-gray-400">Enviar una queja</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Próximo vencimiento */}
            {proximo && (
              <div className="bg-warning-50 border border-warning-100 rounded-card p-4">
                <p className="text-xs font-semibold text-warning-600 uppercase tracking-wide mb-1">
                  Próximo vencimiento
                </p>
                <p className="text-sm font-medium text-gray-800">{proximo.nombre}</p>
                <p className="text-xs text-warning-600 mt-1">{proximo.vencimiento}</p>
                <button
                  onClick={() => navigate('/documentos')}
                  className="mt-3 text-xs text-brand-600 font-medium hover:underline"
                >
                  Ver documentos →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BottomNav />
      <TourSpotlight rutaActual="/home" />
    </div>
  )
}