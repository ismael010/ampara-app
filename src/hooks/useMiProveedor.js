import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore'
import { db, auth } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'

export function useMiProveedor() {
  const { user } = useAuthContext()
  const [miProveedor, setMiProveedor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsub = onSnapshot(doc(db, 'proveedores', user.uid), (snap) => {
      setMiProveedor(snap.exists() ? snap.data() : null)
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  const guardarProveedor = async (data) => {
    await setDoc(doc(db, 'proveedores', user.uid), {
      ...data,
      uid: user.uid,
      updatedAt: new Date(),
    }, { merge: true })

    await setDoc(doc(db, 'users', user.uid), {
      name: data.nombre || '',
      email: auth.currentUser?.email || '',
      completedOnboarding: true,
      rolesCompletados: { proveedor: true },
    }, { merge: true })
  }

  return { miProveedor, loading, guardarProveedor }
}