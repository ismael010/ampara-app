import { useMemo } from 'react'
import { SUBSIDIOS } from '../data/subsidiosCatalogo'
import { calcularMatch } from '../utils/calcularMatch'

export function useMejorMatch(perfil, documentos) {
  return useMemo(() => {
    if (!perfil) return null

    const conMatch = SUBSIDIOS.map((s) => ({
      ...s,
      ...calcularMatch(s, perfil, documentos),
    })).sort((a, b) => b.porcentaje - a.porcentaje)

    return conMatch[0] || null
  }, [perfil, documentos])
}