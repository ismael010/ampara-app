const COLORES = ['#41659b', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2']

export default function DonutCategorias({ datos, total }) {
  const RADIO = 50
  const GROSOR = 14
  const CIRCUNFERENCIA = 2 * Math.PI * RADIO

  let acumulado = 0

  const segmentos = datos.map((item, i) => {
    const largo = total > 0 ? (item.cantidad / total) * CIRCUNFERENCIA : 0
    const offset = -acumulado
    acumulado += largo
    return { ...item, largo, offset, color: COLORES[i % COLORES.length] }
  })

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-28 h-28 shrink-0">
        <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
          <circle cx="60" cy="60" r={RADIO} fill="none" stroke="#e5e7eb" strokeWidth={GROSOR} />
          {segmentos.map((s, i) => (
            <circle
              key={i}
              cx="60" cy="60" r={RADIO} fill="none"
              stroke={s.color}
              strokeWidth={GROSOR}
              strokeDasharray={`${s.largo} ${CIRCUNFERENCIA - s.largo}`}
              strokeDashoffset={s.offset}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{total}</span>
          <span className="text-[10px] text-gray-400">total</span>
        </div>
      </div>

      <div className="flex-1 space-y-1.5">
        {datos.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: COLORES[i % COLORES.length] }}
            />
            <span className="text-xs text-gray-600 flex-1 truncate">{item.label}</span>
            <span className="text-xs font-bold text-gray-700">{item.cantidad}</span>
          </div>
        ))}
      </div>
    </div>
  )
}