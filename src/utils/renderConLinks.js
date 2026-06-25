// Detecta: [texto](url), **negrita**, URLs con http(s)://, y URLs sueltas que empiezan con www.
const REGEX_COMBINADO = /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(\*\*([^*]+)\*\*)|(https?:\/\/[^\s]+)|(\bwww\.[^\s,)]+)/g

export function renderConLinks(texto) {
  const partes = []
  let ultimoIndice = 0
  let match

  while ((match = REGEX_COMBINADO.exec(texto)) !== null) {
    if (match.index > ultimoIndice) {
      partes.push({ tipo: 'texto', valor: texto.slice(ultimoIndice, match.index) })
    }

    if (match[1]) {
      // [texto](url) — link markdown
      partes.push({ tipo: 'link', label: match[2], url: match[3] })
    } else if (match[4]) {
      // **negrita**
      partes.push({ tipo: 'negrita', valor: match[5] })
    } else if (match[6]) {
      // URL con protocolo
      partes.push({ tipo: 'link', label: match[6], url: match[6] })
    } else if (match[7]) {
      // URL suelta tipo www.algo.cl, sin protocolo
      partes.push({ tipo: 'link', label: match[7], url: `https://${match[7]}` })
    }

    ultimoIndice = match.index + match[0].length
  }

  if (ultimoIndice < texto.length) {
    partes.push({ tipo: 'texto', valor: texto.slice(ultimoIndice) })
  }

  return partes.map((p, i) => ({ ...p, key: i }))
}