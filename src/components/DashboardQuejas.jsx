import { CATEGORIAS_QUEJA, ESTADOS_QUEJA } from '../data/quejasCatalogo'
import Icon from './ui/Icon'
import DonutCategorias from './DonutCategorias'

export default function DashboardQuejas({ stats }) {
  const { total, porCategoria, porEstado, zonasOrdenadas, pctResueltas } = stats

  if (total === 0) {
    return (
      <div className="bg-white rounded-card shadow-sm p-5 mb-4 text-center">
        <Icon name="bar_chart" size={32} className="text-gray-300 mb-2" />
        <p className="text-sm text-gray-500">Aún no hay quejas para mostrar estadísticas</p>
      </div>
    )
  }

  const maxCategoria = Math.max(1, ...Object.values(porCategoria))
  const maxZona = Math.max(1, ...zonasOrdenadas.map(([, c]) => c))

  return (
    <div className="space-y-3 mb-4">

      {/* Resumen general */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-card shadow-sm p-4 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-gray-800">{total}</p>
          <p className="text-xs text-gray-500">Total reportes</p>
        </div>
        <div className="bg-white rounded-card shadow-sm p-4 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-success-600">{pctResueltas}%</p>
          <p className="text-xs text-gray-500">Resueltas</p>
        </div>
      </div>

      {/* Por estado */}
      <div className="bg-white rounded-card shadow-sm p-4">
        <p className="text-xs font-bold text-gray-600 mb-3">Por estado</p>
        <div className="flex gap-2">
          {Object.entries(ESTADOS_QUEJA).map(([key, info]) => (
            <div key={key} className="flex-1 text-center">
              <div className={`h-2 rounded-full mb-1.5 bg-${info.color}-${key === 'pendiente' ? '600' : key === 'en_revision' ? '600' : '600'}`}
                style={{ opacity: total > 0 ? 0.3 + (porEstado[key] / total) * 0.7 : 0.3 }}
              />
              <p className="text-sm font-bold text-gray-800">{porEstado[key] || 0}</p>
              <p className="text-[10px] text-gray-500">{info.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Por categoría */}
<div className="bg-white rounded-card shadow-sm p-4">
  <p className="text-xs font-bold text-gray-600 mb-3">Por categoría</p>
  <DonutCategorias
    datos={CATEGORIAS_QUEJA
      .map(({ id, label }) => ({ label, cantidad: porCategoria[id] || 0 }))
      .filter((d) => d.cantidad > 0)}
    total={total}
  />
</div>

      {/* Por localidad/zona */}
      <div className="bg-white rounded-card shadow-sm p-4">
        <p className="text-xs font-bold text-gray-600 mb-3">Por localidad</p>
        <div className="space-y-2">
          {zonasOrdenadas.map(([zona, cantidad]) => (
            <div key={zona} className="flex items-center gap-2">
              <Icon name="location_on" size={14} className="text-brand-600 shrink-0" />
              <p className="text-xs text-gray-600 w-24 shrink-0 truncate">{zona}</p>
              <div className="flex-1 bg-gray-100 rounded-full h-2">
                <div
                  className="bg-brand-600 rounded-full h-2"
                  style={{ width: `${(cantidad / maxZona) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-700 w-4 text-right">{cantidad}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}