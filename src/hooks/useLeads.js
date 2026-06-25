import { useState, useEffect } from 'react'
import { collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'

export function useLeads() {
  const { user } = useAuthContext()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'leads'),
      where('proveedorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  const crearLead = async ({ proveedorId, nombre, telefono, mensaje }) => {
    await addDoc(collection(db, 'leads'), {
      proveedorId,
      familiaUid: user?.uid || null,
      nombre,
      telefono,
      mensaje,
      createdAt: new Date(),
    })
  }

  return { leads, loading, crearLead }
}