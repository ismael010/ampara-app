import { useMemo } from 'react'
import { SUBSIDIOS } from '../data/subsidiosCatalogo'
import { calcularMatch } from '../utils/calcularMatch'

export function useEstadisticasSubsidios(perfil, documentos, seguimientos) {
  return useMemo(() => {
    if (!perfil) return null

    const total = SUBSIDIOS.length
    let elegibles = 0
    let inscritos = 0

    SUBSIDIOS.forEach((s) => {
      const { porcentaje } = calcularMatch(s, perfil, documentos)
      const esElegible = porcentaje === 100
      if (esElegible) {
        elegibles++
        if (seguimientos.some((seg) => seg.id === s.id)) {
          inscritos++
        }
      }
    })

    return {
      total,
      elegibles,
      inscritos,
      pctElegibles: Math.round((elegibles / total) * 100),
      pctInscritos: Math.round((inscritos / total) * 100),
    }
  }, [perfil, documentos, seguimientos])
}