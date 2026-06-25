import { useState, useEffect } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'

export function usePerfilFamilia() {
  const { user } = useAuthContext()
  const [perfilFamilia, setPerfilFamilia] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsub = onSnapshot(doc(db, 'perfilesFamilia', user.uid), (snap) => {
      setPerfilFamilia(snap.exists() ? snap.data() : null)
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  return { perfilFamilia, loading }
}