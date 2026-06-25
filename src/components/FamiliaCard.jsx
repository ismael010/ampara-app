import Icon from './ui/Icon'

export default function FamiliaCard({ familia }) {
  const { name, region, ingresos, docsSubidos, totalDocs, pctDocs, subsidioNombre, etapaActual } = familia

  const colorBarra = pctDocs === 100 ? 'bg-success-600' : pctDocs >= 50 ? 'bg-brand-600' : 'bg-warning-600'

  return (
    <div className="bg-white rounded-card shadow-sm p-4 mb-3 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm font-bold text-gray-800">{name}</p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Icon name="location_on" size={12} />
            {region}
          </p>
        </div>
        <span className="text-sm font-bold text-gray-700">{pctDocs}%</span>
      </div>

      <div className="bg-gray-100 rounded-full h-2 mb-3">
        <div className={`${colorBarra} rounded-full h-2 transition-all`} style={{ width: `${pctDocs}%` }} />
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="bg-gray-50 text-gray-600 rounded-full px-2 py-1">
          {docsSubidos}/{totalDocs} documentos
        </span>
        <span className="bg-gray-50 text-gray-600 rounded-full px-2 py-1">
          {ingresos}
        </span>
      </div>

      {subsidioNombre && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-brand-700 bg-brand-50 rounded-full px-2 py-1 w-fit">
          <Icon name="account_balance" size={12} />
          {subsidioNombre} — Etapa {Math.min(etapaActual, 5)}/5
        </div>
      )}
    </div>
  )
}