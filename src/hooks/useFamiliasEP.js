import { useState, useEffect } from 'react'
import { collection, collectionGroup, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { CATALOGO } from '../data/documentosCatalogo'

const TOTAL_DOCS = CATALOGO.flatMap((c) => c.docs).length

export function useFamiliasEP() {
  const [perfiles, setPerfiles] = useState({})
  const [usuarios, setUsuarios] = useState({})
  const [seguimientosPorUid, setSeguimientosPorUid] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubPerfiles = onSnapshot(collection(db, 'perfilesFamilia'), (snap) => {
      const data = {}
      snap.forEach((d) => { data[d.id] = d.data() })
      setPerfiles(data)
      setLoading(false)
    })

    const unsubUsuarios = onSnapshot(collection(db, 'users'), (snap) => {
      const data = {}
      snap.forEach((d) => { data[d.id] = d.data() })
      setUsuarios(data)
    })

    const unsubSeguimientos = onSnapshot(collectionGroup(db, 'seguimientos'), (snap) => {
      const data = {}
      snap.forEach((d) => {
        const uid = d.ref.parent.parent.id
        const seg = d.data()
        // Guarda la postulación con la etapa más avanzada por familia
        if (!data[uid] || seg.etapaActual > data[uid].etapaActual) {
          data[uid] = { id: d.id, ...seg }
        }
      })
      setSeguimientosPorUid(data)
    })

    return () => {
      unsubPerfiles()
      unsubUsuarios()
      unsubSeguimientos()
    }
  }, [])

  console.log('perfiles:', perfiles)
  console.log('usuarios:', usuarios)
  console.log('seguimientos:', seguimientosPorUid)

  const familias = Object.entries(perfiles)
    .filter(([uid]) => usuarios[uid]?.role === 'familia')
    .map(([uid, perfil]) => {
      const usuario = usuarios[uid] || {}
      const docsSubidos = usuario.docsSubidos ?? 0
      const seguimiento = seguimientosPorUid[uid] || null

      return {
        uid,
        name: perfil.name || usuario.name || 'Sin nombre',
        region: perfil.region || '—',
        ingresos: perfil.ingresos || '—',
        docsSubidos,
        totalDocs: TOTAL_DOCS,
        pctDocs: Math.round((docsSubidos / TOTAL_DOCS) * 100),
        subsidioId: seguimiento?.id || null,
        subsidioNombre: seguimiento?.subsidioNombre || null,
        etapaActual: seguimiento?.etapaActual || null,
      }
    })

  return { familias, loading }
}