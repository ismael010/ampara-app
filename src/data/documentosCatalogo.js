export const CATALOGO = [
  {
    categoria: 'Identificación personal',
    docs: [
      { id: 'cedula', nombre: 'Cédula de identidad', tieneVencimiento: true },
      { id: 'nacimiento', nombre: 'Certificado de nacimiento', tieneVencimiento: false },
    ],
  },
  {
    categoria: 'Vivienda',
    docs: [
      { id: 'escritura', nombre: 'Escritura de propiedad', tieneVencimiento: false },
      { id: 'avaluo', nombre: 'Certificado de avalúo fiscal', tieneVencimiento: true },
      { id: 'edificacion', nombre: 'Permiso de edificación', tieneVencimiento: false },
      { id: 'tasacion', nombre: 'Tasación comercial', tieneVencimiento: false },
    ],
  },
  {
    categoria: 'Grupo familiar',
    docs: [
      { id: 'matrimonio', nombre: 'Acta de matrimonio / convivencia', tieneVencimiento: false },
      { id: 'hijos', nombre: 'Cert. nacimiento hijos', tieneVencimiento: false },
      { id: 'rsh', nombre: 'Registro Social de Hogares', tieneVencimiento: true },
    ],
  },
]