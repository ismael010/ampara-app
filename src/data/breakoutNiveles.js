export const NIVELES_BREAKOUT = [
  { nivel: 1, docsRequeridos: 0, filas: 2, velocidadPelota: 3.2, label: 'Cimientos' },
  { nivel: 2, docsRequeridos: 3, filas: 3, velocidadPelota: 3.8, label: 'Paredes' },
  { nivel: 3, docsRequeridos: 6, filas: 4, velocidadPelota: 4.4, label: 'Techo' },
  { nivel: 4, docsRequeridos: 9, filas: 5, velocidadPelota: 5.0, label: 'Terminaciones' },
]

export function getNivelDesbloqueado(docsSubidos) {
  return [...NIVELES_BREAKOUT].reverse().find((n) => docsSubidos >= n.docsRequeridos) || NIVELES_BREAKOUT[0]
}