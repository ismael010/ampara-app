import { doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../firebase/config'

export async function sumarFichas(uid, cantidad) {
  await updateDoc(doc(db, 'users', uid), {
    fichas: increment(cantidad),
  })
}