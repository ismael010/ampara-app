export const CATEGORIAS_QUEJA = [
  { id: 'ruido', label: 'Ruido', icono: 'volume_up' },
  { id: 'contaminacion', label: 'Contaminación', icono: 'cloud' },
  { id: 'transito', label: 'Tránsito', icono: 'directions_car' },
  { id: 'infraestructura', label: 'Infraestructura', icono: 'construction' },
  { id: 'otro', label: 'Otro', icono: 'more_horiz' },
]

export const ESTADOS_QUEJA = {
  pendiente: { label: 'Pendiente', color: 'warning' },
  en_revision: { label: 'En revisión', color: 'brand' },
  resuelta: { label: 'Resuelta', color: 'success' },
}