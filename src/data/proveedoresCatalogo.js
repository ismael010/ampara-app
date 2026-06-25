export const CATEGORIAS_PROVEEDOR = [
  { id: 'maestro', label: 'Maestros', icono: 'construction' },
  { id: 'ferreteria', label: 'Ferreterías', icono: 'hardware' },
  { id: 'empresa', label: 'Empresas', icono: 'business' },
]

// Datos de ejemplo — en producción esto vendría de Firestore (colección "proveedores")
export const PROVEEDORES_EJEMPLO = [
  {
    id: 'p1',
    nombre: 'Juan Pérez — Maestro albañil',
    categoria: 'maestro',
    rubro: 'Albañilería y reparaciones',
    comuna: 'Maule',
    rating: 4.8,
    verificado: true,
  },
  {
    id: 'p2',
    nombre: 'Ferretería El Constructor',
    categoria: 'ferreteria',
    rubro: 'Materiales de construcción',
    comuna: 'Talca',
    rating: 4.5,
    verificado: true,
  },
  {
    id: 'p3',
    nombre: 'Constructora Los Robles',
    categoria: 'empresa',
    rubro: 'Reconstrucción post-emergencia',
    comuna: 'Maule',
    rating: 4.2,
    verificado: false,
  },
  {
    id: 'p4',
    nombre: 'María González — Maestra eléctrica',
    categoria: 'maestro',
    rubro: 'Instalaciones eléctricas',
    comuna: 'Cauquenes',
    rating: 4.9,
    verificado: true,
  },
]