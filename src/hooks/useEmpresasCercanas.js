import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

function hayMatch(regionFamilia, zonasEmpresa) {
  if (!regionFamilia || !zonasEmpresa) return false
  const region = regionFamilia.toLowerCase()
  const zonas = zonasEmpresa.toLowerCase()
  return zonas.includes(region) || region.includes(zonas)
}

export function useEmpresasCercanas(regionFamilia) {
  const [empresas, setEmpresas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'empresasESG'), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setEmpresas(data)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const cercanas = empresas.filter((e) => hayMatch(regionFamilia, e.zonas))

  return { empresas: cercanas, loading }
}