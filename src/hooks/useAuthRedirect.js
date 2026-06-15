import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useAuthRedirect() {
  const navigate = useNavigate()

  const redirectAfterAuth = async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists() && snap.data().completedOnboarding) {
      navigate('/home')
    } else {
      navigate('/onboarding')
    }
  }

  return { redirectAfterAuth }
}