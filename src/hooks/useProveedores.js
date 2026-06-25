import { useState, useEffect } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useProveedores() {
  const [proveedores, setProveedores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'proveedores'), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setProveedores(data)
      setLoading(false)
    })

    return () => unsub()
  }, [])

  return { proveedores, loading }
}