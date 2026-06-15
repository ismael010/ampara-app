export function getSemaforo(vencimiento) {
  if (!vencimiento) return null

  const hoy = new Date()
  const vence = vencimiento.toDate ? vencimiento.toDate() : new Date(vencimiento)
  const dias = Math.ceil((vence - hoy) / (1000 * 60 * 60 * 24))

  if (dias < 0) return { color: 'rojo', label: 'VENCIDA 🔴', dias }
  if (dias <= 30) return { color: 'amarillo', label: `${dias} días 🟡`, dias }
  return { color: 'verde', label: `${dias} días ✅`, dias }
}