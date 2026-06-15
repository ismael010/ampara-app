export function calcularMatch(subsidio, perfil, documentos) {
  const totalPuntos = []
  const faltantes = []

  // --- Documentos ---
  subsidio.requisitosDoc.forEach((docId) => {
    const subido = documentos[docId]?.subido
    totalPuntos.push(subido ? 1 : 0)
    if (!subido) faltantes.push({ tipo: 'doc', id: docId })
  })

  // --- Requisitos de perfil ---
  Object.entries(subsidio.requisitosPerfil).forEach(([campo, valoresValidos]) => {
    const valorUsuario = perfil?.[campo]
    const cumple = valoresValidos.includes(valorUsuario)
    totalPuntos.push(cumple ? 1 : 0)
    if (!cumple) faltantes.push({ tipo: 'perfil', id: campo })
  })

  const porcentaje = totalPuntos.length === 0
    ? 0
    : Math.round((totalPuntos.filter(Boolean).length / totalPuntos.length) * 100)

  return { porcentaje, faltantes }
}
