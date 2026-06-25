export default function MisionDelDia({ docsSubidos = 0, docsTotales = 10 }) {
  const porcentaje = Math.round((docsSubidos / docsTotales) * 100)

  return (
    <div className="bg-brand-600 rounded-card p-5 text-white mb-5">
      <p className="text-xs font-medium opacity-80 mb-1">Tu misión de hoy</p>
      <p className="text-base font-semibold mb-3">
        Completa tu carpeta antes de la emergencia
      </p>
      <div className="bg-white/20 rounded-full h-2 mb-2">
        <div
          className="bg-white rounded-full h-2 transition-all"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
      <p className="text-xs opacity-80 text-right">
        {docsSubidos}/{docsTotales} documentos
      </p>
    </div>
  )
}