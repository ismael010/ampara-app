import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'

export function useMiEP() {
  const { user } = useAuthContext()
  const [miEP, setMiEP] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsub = onSnapshot(doc(db, 'eps', user.uid), (snap) => {
      setMiEP(snap.exists() ? snap.data() : null)
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  const guardarEP = async (data) => {
    await setDoc(doc(db, 'eps', user.uid), {
      ...data,
      uid: user.uid,
      updatedAt: new Date(),
    }, { merge: true })

    await setDoc(doc(db, 'users', user.uid), {
      name: data.nombre || '',
      email: auth.currentUser?.email || '',
      completedOnboarding: true,
      rolesCompletados: { ep: true },
    }, { merge: true })
  }

  return { miEP, loading, guardarEP }
}