import { useMemo } from 'react'
import { getSemaforo } from '../utils/semaforo'
import { CATALOGO } from '../data/documentosCatalogo'

const NOMBRES_DOC = Object.fromEntries(
  CATALOGO.flatMap((c) => c.docs).map((d) => [d.id, d.nombre])
)

export function useProximoVencimiento(documentos) {
  return useMemo(() => {
    const conVencimiento = Object.entries(documentos)
      .filter(([_, data]) => data.subido && data.vencimiento)
      .map(([docId, data]) => ({
        docId,
        nombre: NOMBRES_DOC[docId] || docId,
        ...getSemaforo(data.vencimiento),
      }))
      .sort((a, b) => a.dias - b.dias)

    return conVencimiento[0] || null
  }, [documentos])
}