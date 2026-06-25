import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'

export function useMiEmpresaESG() {
  const { user } = useAuthContext()
  const [miEmpresa, setMiEmpresa] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsub = onSnapshot(doc(db, 'empresasESG', user.uid), (snap) => {
      setMiEmpresa(snap.exists() ? snap.data() : null)
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  const guardarEmpresaESG = async (data) => {
    await setDoc(doc(db, 'empresasESG', user.uid), {
      ...data,
      uid: user.uid,
      updatedAt: new Date(),
    }, { merge: true })

    await setDoc(doc(db, 'users', user.uid), {
      name: data.nombre || '',
      email: auth.currentUser?.email || '',
      completedOnboarding: true,
      rolesCompletados: { empresa_esg: true },
    }, { merge: true })
  }

  return { miEmpresa, loading, guardarEmpresaESG }
}