import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useUserProfile() {
  const createProfile = async (uid, profileData) => {
    await setDoc(doc(db, 'users', uid), {
      ...profileData,
      fichas: 0,
      racha: 0,
      avatar: 'cobi',
      completedOnboarding: true,
      createdAt: new Date()
    })
  }

  const getProfile = async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid))
    return snap.exists() ? snap.data() : null
  }

  return { createProfile, getProfile }
}