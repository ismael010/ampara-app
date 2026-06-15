import { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import { useAuthContext } from '../context/AuthContext'
import { sumarFichas } from '../utils/fichas'

export function useSeguimiento() {
  const { user } = useAuthContext()
  const [seguimientos, setSeguimientos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsub = onSnapshot(
      collection(db, 'users', user.uid, 'seguimientos'),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setSeguimientos(data)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [user])

  const iniciarSeguimiento = async (subsidioId, subsidioNombre) => {
    await setDoc(doc(db, 'users', user.uid, 'seguimientos', subsidioId), {
      subsidioNombre,
      etapaActual: 1,
      etapas: {},
      iniciadoEn: new Date(),
    })
  }

  const completarEtapa = async (subsidioId, numeroEtapa, file = null) => {
    let comprobanteUrl = null

    if (file) {
      const storageRef = ref(storage, `users/${user.uid}/seguimientos/${subsidioId}/etapa_${numeroEtapa}`)
      await uploadBytes(storageRef, file)
      comprobanteUrl = await getDownloadURL(storageRef)
    }

    await updateDoc(doc(db, 'users', user.uid, 'seguimientos', subsidioId), {
      [`etapas.${numeroEtapa}`]: { completada: true, comprobante: comprobanteUrl },
      etapaActual: numeroEtapa + 1,
    })

    // 20 fichas por etapa completada
    await sumarFichas(user.uid, 20)
  }

  return { seguimientos, loading, iniciarSeguimiento, completarEtapa }
}