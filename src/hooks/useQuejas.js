import { useState, useEffect } from 'react'
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'

export function useQuejasEmpresa() {
  const { user } = useAuthContext()
  const [quejas, setQuejas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'quejas'),
      where('empresaId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      setQuejas(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  const cambiarEstado = async (quejaId, nuevoEstado) => {
    await updateDoc(doc(db, 'quejas', quejaId), { estado: nuevoEstado })
  }

  return { quejas, loading, cambiarEstado }
}

export function useCrearQueja() {
  const { user } = useAuthContext()

  const crearQueja = async ({ empresaId, categoria, texto, zona, foto }) => {
    let fotoUrl = null

    if (foto) {
      const storageRef = ref(storage, `quejas/${user.uid}_${Date.now()}`)
      await uploadBytes(storageRef, foto)
      fotoUrl = await getDownloadURL(storageRef)
    }

    await addDoc(collection(db, 'quejas'), {
      empresaId,
      familiaUid: user.uid,
      categoria,
      texto,
      zona,
      fotoUrl,
      estado: 'pendiente',
      createdAt: new Date(),
    })
  }

  return { crearQueja }
}