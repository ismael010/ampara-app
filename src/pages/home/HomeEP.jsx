import { useNavigate } from 'react-router-dom'
import { useMiEP } from '../../hooks/useMiEP'
import { useFamiliasEP } from '../../hooks/useFamiliasEP'
import Icon from '../../components/ui/Icon'
import BottomNavEP from '../../components/BottomNavEP'

// ── Gráfico donut SVG ──
function DonutChart({ valor, total, color = '#41659b', size = 80, grosor = 8 }) {
  const radio = (size - grosor) / 2
  const circunferencia = 2 * Math.PI * radio
  const pct = total > 0 ? valor / total : 0
  const largo = pct * circunferencia

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ width: size, height: size }}>
        <circle cx={size/2} cy={size/2} r={radio} fill="none" stroke="#e5e7eb" strokeWidth={grosor} />
        <circle cx={size/2} cy={size/2} r={radio} fill="none" stroke={color}
          strokeWidth={grosor}
          strokeDasharray={`${largo} ${circunferencia - largo}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-gray-800">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  )
}

// ── Barra de progreso horizontal ──
function BarraProgreso({ valor, max, color = 'bg-brand-600', label, sublabel }) {
  const pct = max > 0 ? (valor / max) * 100 : 0
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-semibold text-gray-800">{valor}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      {sublabel && <p className="text-[10px] text-gray-400 mt-0.5">{sublabel}</p>}
    </div>
  )
}

export default function HomeEP() {
  const { miEP } = useMiEP()
  const { familias, loading } = useFamiliasEP()
  const navigate = useNavigate()

  // ── Estadísticas calculadas ──
  const total              = familias.length
  const conSeguimiento     = familias.filter(f => f.etapaActual !== null).length
  const sinSeguimiento     = total - conSeguimiento
  const docsCompletos      = familias.filter(f => f.pctDocs === 100).length
  const docsParciales      = familias.filter(f => f.pctDocs > 0 && f.pctDocs < 100).length
  const sinDocs            = familias.filter(f => f.pctDocs === 0).length
  const promedioDocs       = total > 0
    ? Math.round(familias.reduce((acc, f) => acc + f.pctDocs, 0) / total)
    : 0

  // Distribución por etapa
  const porEtapa = [1,2,3,4,5].map(n => ({
    n,
    count: familias.filter(f => f.etapaActual === n).length
  }))
  const maxEtapa = Math.max(...porEtapa.map(e => e.count), 1)

  // Top regiones
  const regionCount = {}
  familias.forEach(f => {
    if (f.region && f.region !== '—') {
      regionCount[f.region] = (regionCount[f.region] || 0) + 1
    }
  })
  const topRegiones = Object.entries(regionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  // Distribución por ingresos
  const ingresosCount = {}
  familias.forEach(f => {
    if (f.ingresos && f.ingresos !== '—') {
      const key = f.ingresos.split(' ')[0] + '...'
      ingresosCount[key] = (ingresosCount[key] || 0) + 1
    }
  })

  // línea ~65
const ETAPAS_LABELS = ['Post.', 'Sel.', 'Firma', 'Obra', 'Entrega']
  const COLORES_ETAPA = ['#41659b', '#6f93c0', '#c5daf3', '#059669', '#047857']

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-5">
          <p className="text-sm text-gray-500">Bienvenido,</p>
          <h1 className="text-xl font-bold text-gray-800">{miEP?.nombre || 'EP'}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{miEP?.comuna}</p>
        </div>

        {/* Stats 2x2 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { icono: 'groups',       label: 'Familias',        valor: total,          color: 'text-brand-600',   bg: 'bg-brand-50' },
            { icono: 'route',        label: 'Con seguimiento', valor: conSeguimiento, color: 'text-success-600', bg: 'bg-success-50' },
            { icono: 'description',  label: 'Docs al 100%',   valor: docsCompletos,  color: 'text-success-600', bg: 'bg-success-50' },
            { icono: 'warning',      label: 'Sin docs',        valor: sinDocs,        color: 'text-warning-600', bg: 'bg-warning-50' },
          ].map(({ icono, label, valor, color, bg }) => (
            <div key={label} className="bg-white rounded-card shadow-sm p-4 border border-gray-100">
              <div className={`w-8 h-8 ${bg} rounded-full flex items-center justify-center mb-2`}>
                <Icon name={icono} size={16} className={color} />
              </div>
              <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : valor}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Progreso documentos */}
        <div className="bg-white rounded-card shadow-sm p-5 border border-gray-100 mb-4">
          <p className="text-sm font-bold text-gray-700 mb-4">Progreso documentación</p>
          <div className="flex items-center gap-4 mb-4">
            <DonutChart valor={promedioDocs} total={100} size={72} grosor={7} />
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-success-600 font-medium">Completos</span>
                <span className="text-gray-700 font-bold">{docsCompletos}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-warning-600 font-medium">Parciales</span>
                <span className="text-gray-700 font-bold">{docsParciales}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400 font-medium">Sin iniciar</span>
                <span className="text-gray-700 font-bold">{sinDocs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla familias recientes */}
        <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
            <p className="text-sm font-bold text-gray-700">Familias recientes</p>
            <button onClick={() => navigate('/familias')} className="text-xs text-brand-600 font-medium">
              Ver todas →
            </button>
          </div>
          {familias.slice(0, 4).map((f) => (
            <div key={f.uid} className="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                <Icon name="person" size={16} className="text-brand-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                <p className="text-xs text-gray-400 truncate">{f.region}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-brand-600">{f.pctDocs}%</p>
                <p className="text-[10px] text-gray-400">docs</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-10 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-brand-200 text-sm mb-1">Panel de gestión</p>
              <h1 className="text-3xl font-bold text-white">{miEP?.nombre || 'EP'}</h1>
              <div className="flex items-center gap-3 mt-3">
                {miEP?.tipo && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="apartment" size={12} />
                    {miEP.tipo}
                  </span>
                )}
                {miEP?.comuna && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="location_on" size={12} />
                    {miEP.comuna}
                  </span>
                )}
                {miEP?.rubro && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                    <Icon name="work" size={12} />
                    {miEP.rubro}
                  </span>
                )}
              </div>
            </div>
            {/* Stats rápidos en el banner */}
            <div className="flex gap-6 text-right">
              {[
  { label: 'Familias',        valor: total          },
  { label: 'Con seguimiento', valor: conSeguimiento },
  { label: 'Docs al 100%',    valor: docsCompletos  },
  { label: 'Sin documentos',  valor: sinDocs        },
].map(({ label, valor }) => (
  <div key={label}>
    <p className="text-3xl font-bold text-white">{loading ? '—' : valor}</p>
    <p className="text-brand-200 text-xs mt-0.5">{label}</p>
  </div>
))}
            </div>
          </div>
        </div>

        <div className="px-10 grid grid-cols-3 gap-6">

          {/* Columna izquierda — gráficos y tabla */}
          <div className="col-span-2 flex flex-col gap-6">

            {/* Fila de gráficos */}
            <div className="grid grid-cols-3 gap-4">

              {/* Donut documentación */}
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Documentación
                </p>
                <div className="flex flex-col items-center gap-3">
                  <DonutChart valor={promedioDocs} total={100} size={90} grosor={9} />
                  <p className="text-xs text-gray-500 text-center">Promedio de avance</p>
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-success-600 inline-block" />
                      Completos
                    </span>
                    <span className="font-bold text-gray-700">{docsCompletos}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-warning-600 inline-block" />
                      Parciales
                    </span>
                    <span className="font-bold text-gray-700">{docsParciales}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                      Sin iniciar
                    </span>
                    <span className="font-bold text-gray-700">{sinDocs}</span>
                  </div>
                </div>
              </div>

              {/* Donut seguimiento */}
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Seguimiento
                </p>
                <div className="flex flex-col items-center gap-3">
                  <DonutChart valor={conSeguimiento} total={total || 1} size={90} grosor={9} color="#059669" />
                  <p className="text-xs text-gray-500 text-center">Con postulación activa</p>
                </div>
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-success-600 inline-block" />
                      Con seguimiento
                    </span>
                    <span className="font-bold text-gray-700">{conSeguimiento}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />
                      Sin iniciar
                    </span>
                    <span className="font-bold text-gray-700">{sinSeguimiento}</span>
                  </div>
                </div>
              </div>

              {/* Barras por etapa */}
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Familias por etapa
                </p>
                <div className="flex items-end justify-between gap-1 h-20 mb-2">
                  {porEtapa.map(({ n, count }, i) => (
                    <div key={n} className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-[10px] font-bold text-gray-600">{count}</span>
                      <div
                        className="w-full rounded-t-sm transition-all"
                        style={{
                          height: `${maxEtapa > 0 ? (count / maxEtapa) * 56 : 4}px`,
                          minHeight: 4,
                          backgroundColor: COLORES_ETAPA[i],
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
  {ETAPAS_LABELS.map((l, i) => (
    <span key={i} className="text-[9px] text-gray-400 flex-1 text-center leading-tight">
      {l}
    </span>
  ))}
</div>
              </div>
            </div>

            {/* Tabla de familias */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-800">Todas las familias</p>
                  <p className="text-xs text-gray-400 mt-0.5">{total} familias registradas</p>
                </div>
                <button
                  onClick={() => navigate('/familias')}
                  className="text-xs bg-brand-600 text-white px-4 py-2 rounded-button font-medium hover:bg-brand-700 transition flex items-center gap-1.5"
                >
                  <Icon name="tune" size={14} />
                  Filtrar familias
                </button>
              </div>

              {loading ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-brand-600 text-sm">Cargando familias...</p>
                </div>
              ) : familias.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Icon name="groups" size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">Aún no hay familias registradas</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-5 px-6 py-2 bg-gray-50 border-b border-gray-100">
                    {['Nombre', 'Región', 'Ingresos', 'Documentos', 'Seguimiento'].map(h => (
                      <p key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
                    ))}
                  </div>
                  {familias.slice(0, 8).map((f) => (
                    <div
                      key={f.uid}
                      className="grid grid-cols-5 px-6 py-3.5 border-b border-gray-50 hover:bg-brand-50 transition cursor-pointer items-center"
                      onClick={() => navigate('/familias')}
                    >
                      <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                      <p className="text-sm text-gray-500 truncate">{f.region}</p>
                      <p className="text-xs text-gray-500 truncate pr-2">{f.ingresos?.split(' ')[0] || '—'}</p>
                      <div className="flex items-center gap-2 pr-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${f.pctDocs === 100 ? 'bg-success-600' : f.pctDocs > 0 ? 'bg-brand-600' : 'bg-gray-300'}`}
                            style={{ width: `${f.pctDocs}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 shrink-0">{f.pctDocs}%</span>
                      </div>
                      <div>
                        {f.etapaActual ? (
                          <span className="text-xs bg-success-50 text-success-700 px-2 py-1 rounded-full font-medium">
                            Etapa {Math.min(f.etapaActual, 5)}/5
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                            Sin iniciar
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {familias.length > 8 && (
                    <div className="px-6 py-3 text-center">
                      <button
                        onClick={() => navigate('/familias')}
                        className="text-xs text-brand-600 font-medium hover:underline"
                      >
                        Ver {familias.length - 8} familias más →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="flex flex-col gap-5">

            {/* Top regiones */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                Familias por región
              </p>
              {topRegiones.length > 0 ? (
                <div className="space-y-3">
                  {topRegiones.map(([region, count]) => (
                    <BarraProgreso
                      key={region}
                      label={region.replace('Región ', '').replace(' de Chile', '')}
                      valor={count}
                      max={total}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Sin datos de región</p>
              )}
            </div>

            {/* Alerta familias sin docs */}
            {sinDocs > 0 && (
              <div className="bg-warning-50 border border-warning-100 rounded-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="warning" size={18} className="text-warning-600" />
                  <p className="text-sm font-bold text-warning-700">Atención requerida</p>
                </div>
                <p className="text-xs text-warning-600 leading-relaxed mb-3">
                  <strong>{sinDocs} familia{sinDocs !== 1 ? 's' : ''}</strong> aún no
                  {sinDocs !== 1 ? ' han' : ' ha'} subido ningún documento.
                  {sinDocs !== 1 ? ' Necesitan' : ' Necesita'} acompañamiento para comenzar.
                </p>
                <button
                  onClick={() => navigate('/familias')}
                  className="w-full bg-warning-600 hover:bg-warning-700 text-white text-xs font-medium rounded-button py-2 transition"
                >
                  Ver familias sin documentos
                </button>
              </div>
            )}

            {/* Subsidios más seguidos */}
            {conSeguimiento > 0 && (
              <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">
                  Subsidios en seguimiento
                </p>
                <div className="space-y-2">
                  {(() => {
                    const subsidioCount = {}
                    familias.forEach(f => {
                      if (f.subsidioNombre) {
                        subsidioCount[f.subsidioNombre] = (subsidioCount[f.subsidioNombre] || 0) + 1
                      }
                    })
                    return Object.entries(subsidioCount)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 4)
                      .map(([nombre, count]) => (
                        <div key={nombre} className="flex items-center justify-between gap-2">
                          <p className="text-xs text-gray-600 truncate flex-1">{nombre}</p>
                          <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full shrink-0">
                            {count}
                          </span>
                        </div>
                      ))
                  })()}
                </div>
              </div>
            )}

            {/* Datos organización */}
            <div className="bg-white rounded-card shadow-sm border border-gray-100 p-5">
              <p className="text-sm font-bold text-gray-700 mb-4">Tu organización</p>
              <div className="space-y-3">
                {[
                  { label: 'Rubro',              icono: 'work',       value: miEP?.rubro },
                  { label: 'Cobertura',          icono: 'location_on',value: miEP?.comuna },
                  { label: 'Familias estimadas', icono: 'groups',     value: miEP?.rangoFamilias },
                ].map(({ label, icono, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon name={icono} size={14} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{label}</p>
                      <p className="text-sm text-gray-800 font-medium">{value || '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavEP />
    </div>
  )
}