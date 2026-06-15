import { CATALOGO } from '../data/documentosCatalogo'
import { useDocumentos } from '../hooks/useDocumentos'
import DocumentoItem from '../components/DocumentoItem'
import BottomNav from '../components/BottomNav'

export default function DocumentosPage() {
  const { documentos, loading, subirDocumento } = useDocumentos()

  const totalDocs = CATALOGO.flatMap((c) => c.docs).length
  const subidos = Object.values(documentos).filter((d) => d.subido).length

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-emerald-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis documentos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Alertas a los <span className="font-medium">90, 30 y 7 días</span> antes de que venza cada documento.
          </p>
        </div>

        {/* Progreso general */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Carpeta completa</span>
            <span className="text-emerald-600 font-bold">{subidos}/{totalDocs}</span>
          </div>
          <div className="bg-gray-100 rounded-full h-2">
            <div
              className="bg-emerald-500 rounded-full h-2 transition-all"
              style={{ width: `${(subidos / totalDocs) * 100}%` }}
            />
          </div>
        </div>

        {/* Categorías */}
        {CATALOGO.map(({ categoria, docs }) => {
          const subidosEnCat = docs.filter((d) => documentos[d.id]?.subido).length

          return (
            <div key={categoria} className="bg-white rounded-2xl shadow-sm mb-4 px-4 py-3">
              <div className="flex justify-between items-center mb-1">
                <h2 className="text-sm font-bold text-gray-700">{categoria}</h2>
                <span className="text-xs text-gray-400">
                  {subidosEnCat} de {docs.length} listos
                </span>
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
      <BottomNav />
    </div>
  )
}