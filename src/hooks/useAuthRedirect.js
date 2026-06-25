import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useAuthRedirect() {
  const navigate = useNavigate()

  const redirectAfterAuth = async (uid) => {
    const snap = await getDoc(doc(db, 'users', uid))
    const data = snap.exists() ? snap.data() : null

    if (!data?.role) {
      navigate('/seleccion-rol')
    } else if (data.role === 'familia' && !data.completedOnboarding) {
      navigate('/onboarding')
    } else if (data.role !== 'familia' && !data.completedOnboarding) {
      navigate('/onboarding-profesional')
    } else if (!data.mascotaId) {
      navigate('/elegir-mascota')
    } else {
      navigate('/home')
    }
  }

  return { redirectAfterAuth }
}