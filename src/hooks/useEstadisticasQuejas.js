import { useMemo } from 'react'
import { CATEGORIAS_QUEJA, ESTADOS_QUEJA } from '../data/quejasCatalogo'

export function useEstadisticasQuejas(quejas) {
  return useMemo(() => {
    const total = quejas.length

    const porCategoria = {}
    const porZona = {}
    const porEstado = { pendiente: 0, en_revision: 0, resuelta: 0 }

    quejas.forEach((q) => {
      porCategoria[q.categoria] = (porCategoria[q.categoria] || 0) + 1
      const zona = q.zona || 'Sin especificar'
      porZona[zona] = (porZona[zona] || 0) + 1
      porEstado[q.estado] = (porEstado[q.estado] || 0) + 1
    })

    const zonasOrdenadas = Object.entries(porZona)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    const pctResueltas = total > 0 ? Math.round((porEstado.resuelta / total) * 100) : 0

    return { total, porCategoria, porEstado, zonasOrdenadas, pctResueltas }
  }, [quejas])
}