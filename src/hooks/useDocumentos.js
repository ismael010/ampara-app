import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'

export function useDocumentos() {
  const { user } = useAuthContext()
  const [documentos, setDocumentos] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsub = onSnapshot(
      collection(db, 'users', user.uid, 'documentos'),
      (snap) => {
        const data = {}
        snap.forEach((d) => { data[d.id] = d.data() })
        setDocumentos(data)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [user])

  const subirDocumento = async (docId, file, vencimiento = null) => {
    const storageRef = ref(storage, `users/${user.uid}/documentos/${docId}`)
    await uploadBytes(storageRef, file)
    const fileUrl = await getDownloadURL(storageRef)

    await setDoc(doc(db, 'users', user.uid, 'documentos', docId), {
      subido: true,
      fileUrl,
      vencimiento: vencimiento ? new Date(vencimiento) : null,
      actualizadoEn: new Date(),
    })

    const total = Object.values({ ...documentos, [docId]: { subido: true } })
      .filter((d) => d.subido).length
    await updateDoc(doc(db, 'users', user.uid), { docsSubidos: total })
  }

  return { documentos, loading, subirDocumento }
}