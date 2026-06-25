import { useState, useEffect } from 'react'
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'

export function useProyectos() {
  const { user } = useAuthContext()
  const [proyectos, setProyectos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const q = query(
      collection(db, 'proyectos'),
      where('empresaId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    const unsub = onSnapshot(q, (snap) => {
      setProyectos(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })

    return () => unsub()
  }, [user])

  const crearProyecto = async ({ nombre, zona, descripcion, estado }) => {
    await addDoc(collection(db, 'proyectos'), {
      empresaId: user.uid,
      nombre,
      zona,
      descripcion,
      estado,
      createdAt: new Date(),
    })
  }

  const actualizarEstado = async (proyectoId, nuevoEstado) => {
    await updateDoc(doc(db, 'proyectos', proyectoId), { estado: nuevoEstado })
  }

  const eliminarProyecto = async (proyectoId) => {
    await deleteDoc(doc(db, 'proyectos', proyectoId))
  }

  return { proyectos, loading, crearProyecto, actualizarEstado, eliminarProyecto }
}