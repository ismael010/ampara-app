import { CATALOGO } from '../data/documentosCatalogo'
import { useDocumentos } from '../hooks/useDocumentos'
import DocumentoItem from '../components/DocumentoItem'
import BottomNav from '../components/BottomNav'
import Icon from '../components/ui/Icon'

export default function DocumentosPage() {
  const { documentos, loading, subirDocumento } = useDocumentos()

  const totalDocs = CATALOGO.flatMap((c) => c.docs).length
  const subidos   = Object.values(documentos).filter((d) => d.subido).length
  const pct       = Math.round((subidos / totalDocs) * 100)

  // Stats por semáforo
  const vencidos  = Object.values(documentos).filter((d) => d.subido && d.vencimiento && new Date(d.vencimiento) < new Date()).length
  const porVencer = Object.values(documentos).filter((d) => {
    if (!d.subido || !d.vencimiento) return false
    const dias = (new Date(d.vencimiento) - Date.now()) / 86400000
    return dias >= 0 && dias <= 30
  }).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis documentos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Alertas a los <span className="font-medium">90, 30 y 7 días</span> antes de que venza cada documento.
          </p>
        </div>

        <div className="bg-white rounded-card p-4 shadow-sm mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Carpeta completa</span>
            <span className="text-brand-600 font-bold">{subidos}/{totalDocs}</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2">
            <div className="bg-brand-600 rounded-full h-2 transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {CATALOGO.map(({ categoria, docs }) => {
          const subidosEnCat = docs.filter((d) => documentos[d.id]?.subido).length
          return (
            <div key={categoria} className="bg-white rounded-card shadow-sm mb-4 px-4 py-3">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-sm font-bold text-gray-700">{categoria}</h2>
                <span className="text-xs text-gray-400">{subidosEnCat} de {docs.length} listos</span>
              </div>
              {docs.map((doc) => (
                <DocumentoItem
                  key={doc.id}
                  docId={doc.id}
                  nombre={doc.nombre}
                  tieneVencimiento={doc.tieneVencimiento}
                  data={documentos[doc.id]}
                  onSubir={subirDocumento}
                />
              ))}
            </div>
          )
        })}
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Mis documentos</h1>
              <p className="text-brand-100 mt-1">
                Alertas a los 90, 30 y 7 días antes de que venza cada documento
              </p>
            </div>
            {/* Stats en banner */}
            <div className="flex gap-8 text-right">
              {[
                { label: 'Subidos',     valor: `${subidos}/${totalDocs}` },
                { label: 'Por vencer',  valor: porVencer },
                { label: 'Vencidos',    valor: vencidos },
              ].map(({ label, valor }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-white">{valor}</p>
                  <p className="text-brand-200 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-10 flex gap-8">

          {/* Sidebar izquierda — resumen */}
          <aside className="w-64 shrink-0">
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5 sticky top-24 flex flex-col gap-5">

              {/* Progreso circular */}
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-3">
                  <svg viewBox="0 0 96 96" className="w-24 h-24 -rotate-90">
                    <circle cx="48" cy="48" r="38" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="48" cy="48" r="38" fill="none"
                      stroke="#41659b" strokeWidth="8"
                      strokeDasharray={`${(pct / 100) * 238.76} 238.76`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-gray-800">{pct}%</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-800">{subidos} de {totalDocs} documentos</p>
                <p className="text-xs text-gray-400 mt-0.5">carpeta completa</p>
              </div>

              {/* Alertas */}
              {(vencidos > 0 || porVencer > 0) && (
                <div className="flex flex-col gap-2">
                  {vencidos > 0 && (
                    <div className="flex items-center gap-2 bg-warning-50 border border-warning-100 rounded-xl p-3">
                      <Icon name="error" size={16} className="text-warning-700 shrink-0" />
                      <p className="text-xs text-warning-700 font-medium">
                        {vencidos} documento{vencidos !== 1 ? 's' : ''} vencido{vencidos !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                  {porVencer > 0 && (
                    <div className="flex items-center gap-2 bg-warning-50 border border-warning-100 rounded-xl p-3">
                      <Icon name="warning" size={16} className="text-warning-600 shrink-0" />
                      <p className="text-xs text-warning-600 font-medium">
                        {porVencer} vence{porVencer !== 1 ? 'n' : ''} en 30 días
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Resumen por categoría */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Por categoría
                </p>
                <div className="flex flex-col gap-2">
                  {CATALOGO.map(({ categoria, docs }) => {
                    const sub = docs.filter(d => documentos[d.id]?.subido).length
                    const catPct = Math.round((sub / docs.length) * 100)
                    return (
                      <div key={categoria}>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs text-gray-600 truncate flex-1 pr-2">{categoria}</p>
                          <p className="text-xs font-bold text-gray-700 shrink-0">{sub}/{docs.length}</p>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div
                            className={`h-1.5 rounded-full ${catPct === 100 ? 'bg-success-600' : 'bg-brand-600'}`}
                            style={{ width: `${catPct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Lista de documentos */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            {CATALOGO.map(({ categoria, docs }) => {
              const subidosEnCat = docs.filter((d) => documentos[d.id]?.subido).length
              const catPct = Math.round((subidosEnCat / docs.length) * 100)

              return (
                <div key={categoria} className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">
                  {/* Header categoría */}
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        catPct === 100 ? 'bg-success-50' : 'bg-brand-50'
                      }`}>
                        <Icon
                          name={catPct === 100 ? 'check_circle' : 'folder'}
                          size={16}
                          className={catPct === 100 ? 'text-success-600' : 'text-brand-600'}
                        />
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{categoria}</p>
                        <p className="text-xs text-gray-400">{subidosEnCat} de {docs.length} documentos listos</p>
                      </div>
                    </div>
                    {/* Mini barra de progreso */}
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${catPct === 100 ? 'bg-success-600' : 'bg-brand-600'}`}
                          style={{ width: `${catPct}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-600 w-8 text-right">{catPct}%</span>
                    </div>
                  </div>

                  {/* Documentos en grid de 2 columnas */}
                  <div className="grid grid-cols-2 divide-x divide-gray-50">
                    {docs.map((doc, i) => (
                      <div
                        key={doc.id}
                        className={`px-6 py-1 ${i < docs.length - 2 ? 'border-b border-gray-50' : ''}`}
                      >
                        <DocumentoItem
                          docId={doc.id}
                          nombre={doc.nombre}
                          tieneVencimiento={doc.tieneVencimiento}
                          data={documentos[doc.id]}
                          onSubir={subirDocumento}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}