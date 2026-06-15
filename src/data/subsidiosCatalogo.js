export const SUBSIDIOS = [
  {
    id: 'ds49',
    nombre: 'Subsidio DS49 — MINVU',
    descripcion: 'Para familias vulnerables con vivienda dañada o sin casa',
    requisitosDoc: ['cedula', 'escritura', 'tasacion'],
    requisitosPerfil: {
      vivienda: ['Tengo casa propia con escritura', 'Tengo casa sin papeles'],
      danio: ['Sí, daño grave', 'Sí, daño parcial'],
      ingresos: [
        'Menos del sueldo mínimo (< $530.000)',
        'Sueldo mínimo $530.000 – $800.000',
        'Rango medio-bajo $800.001 – $1.200.000',
      ],
    },
  },
  {
    id: 'bono_reparacion',
    nombre: 'Bono reparación de emergencia',
    descripcion: 'Reparaciones menores post-inundación, tramitable en municipio',
    requisitosDoc: ['cedula', 'edificacion', 'avaluo'],
    requisitosPerfil: {
      danio: ['Sí, daño grave', 'Sí, daño parcial'],
    },
  },
  {
    id: 'ds27',
    nombre: 'Subsidio DS27 — Clase Media',
    descripcion: 'Para familias de clase media sin vivienda propia',
    requisitosDoc: ['cedula', 'nacimiento', 'rsh'],
    requisitosPerfil: {
      vivienda: ['Arriendo', 'Vivo con familiares'],
      ingresos: [
        'Rango medio-bajo $800.001 – $1.200.000',
        'Rango medio $1.200.001 – $2.000.000',
        'Rango medio-alto $2.000.001 – $5.000.000',
      ],
    },
  },
]