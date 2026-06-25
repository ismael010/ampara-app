import { useState, useEffect } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'
import { MASCOTAS } from '../data/mascotas'

export function useMascota() {
  const { user } = useAuthContext()
  const [mascotaId, setMascotaId] = useState(null)
  const [tourPaso, setTourPaso] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      const data = snap.data()
      setMascotaId(data?.mascotaId || null)
      setTourPaso(data?.tourPaso ?? 0)
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  const elegirMascota = async (id) => {
    await setDoc(doc(db, 'users', user.uid), {
      mascotaId: id,
      tourPaso: 1,
    }, { merge: true })
  }

  const avanzarTour = async () => {
    await setDoc(doc(db, 'users', user.uid), {
      tourPaso: tourPaso + 1,
    }, { merge: true })
  }

  const mascota = mascotaId ? MASCOTAS[mascotaId] : null

  return { mascota, mascotaId, tourPaso, loading, elegirMascota, avanzarTour }
}