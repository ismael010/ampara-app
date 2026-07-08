import { useMemo } from 'react'
import { useQuejasEmpresa } from '../hooks/useQuejas'
import { CATEGORIAS_QUEJA } from '../data/quejasCatalogo'
import QuejaCard from '../components/QuejaCard'
import DonutCategorias from '../components/DonutCategorias'
import BottomNavESG from '../components/BottomNavESG'
import Icon from '../components/ui/Icon'

export default function QuejasPage() {
  const { quejas, loading } = useQuejasEmpresa()

  const conteoPorCategoria = useMemo(() => {
    const conteo = {}
    quejas.forEach((q) => {
      conteo[q.categoria] = (conteo[q.categoria] || 0) + 1
    })
    return conteo
  }, [quejas])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Quejas recibidas</h1>
          <p className="text-sm text-gray-500 mt-1">{quejas.length} reportes en total</p>
        </div>

        {quejas.length > 0 && (
          <div className="bg-white rounded-card shadow-sm p-4 mb-5">
            <p className="text-xs font-bold text-gray-600 mb-3">Por categoría</p>
            <DonutCategorias
              datos={CATEGORIAS_QUEJA
                .map(({ id, label }) => ({ label, cantidad: conteoPorCategoria[id] || 0 }))
                .filter((d) => d.cantidad > 0)}
              total={quejas.length}
            />
          </div>
        )}

        {quejas.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="feedback" size={48} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Aún no has recibido reportes</p>
          </div>
        ) : (
          quejas.map((q) => <QuejaCard key={q.id} queja={q} />)
        )}

      </div>
      <BottomNavESG />
    </div>
  )
}