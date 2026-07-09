import { useNavigate } from 'react-router-dom'

const RADIO = 36
const GROSOR = 8
const CIRCUNFERENCIA = 2 * Math.PI * RADIO

export default function DonutSubsidios({ stats, id }) {
  const navigate = useNavigate()
  if (!stats) return null

  const { total, elegibles, inscritos, pctElegibles } = stats
  const pctInscritosDelTotal = (inscritos / total) * 100
  const pctElegiblesSinInscribir = ((elegibles - inscritos) / total) * 100
  const largoInscritos = (pctInscritosDelTotal / 100) * CIRCUNFERENCIA
  const largoElegibles = (pctElegiblesSinInscribir / 100) * CIRCUNFERENCIA

  return (
    <button
      id={id}
      onClick={() => navigate('/subsidios')}
      className="bg-white rounded-card shadow-sm p-4 flex flex-col items-center justify-center border border-gray-100 hover:border-brand-200 transition"
    >
      <div className="relative w-20 h-20 mb-2">
        <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
          <circle cx="40" cy="40" r={RADIO} fill="none" stroke="#e5e7eb" strokeWidth={GROSOR} />
          <circle cx="40" cy="40" r={RADIO} fill="none"
            stroke="#41659b" strokeWidth={GROSOR}
            strokeDasharray={`${largoElegibles} ${CIRCUNFERENCIA - largoElegibles}`}
            strokeDashoffset={-largoInscritos}
            strokeLinecap="round"
          />
          <circle cx="40" cy="40" r={RADIO} fill="none"
            stroke="#41659b" strokeWidth={GROSOR}
            strokeDasharray={`${largoInscritos} ${CIRCUNFERENCIA - largoInscritos}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-800">{pctElegibles}%</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-800 text-center">Eres elegible</p>
      <p className="text-[10px] text-gray-500 text-center">{inscritos} de {elegibles} inscritos</p>
    </button>
  )
}