import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { auth } from '../firebase/config'

export function useUserProfile() {
  const createProfile = async (uid, profileData) => {
    await setDoc(doc(db, 'perfilesFamilia', uid), {
      ...profileData,
      updatedAt: new Date(),
    }, { merge: true })

    const userSnap = await getDoc(doc(db, 'users', uid))
    const yaExiste = userSnap.exists() && userSnap.data().fichas !== undefined

    await setDoc(doc(db, 'users', uid), {
      name: profileData.name || '',
      email: auth.currentUser?.email || '',
      completedOnboarding: true,
      rolesCompletados: { familia: true },
      ...(!yaExiste && { fichas: 0, racha: 0, avatar: 'cobi' }),
    }, { merge: true })
  }

  const setRole = async (uid, role) => {
    await setDoc(doc(db, 'users', uid), { role }, { merge: true })
  }

  const getProfile = async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : null
  }

  return { createProfile, setRole, getProfile }
}