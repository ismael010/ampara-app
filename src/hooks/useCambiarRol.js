import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useNavigate } from 'react-router-dom'

export function useCambiarRol() {
  const navigate = useNavigate()

  const cambiarRol = async (uid, nuevoRole) => {
    const userSnap = await getDoc(doc(db, 'users', uid))
    const data = userSnap.exists() ? userSnap.data() : {}
    const yaCompletado = data.rolesCompletados?.[nuevoRole]

    await setDoc(doc(db, 'users', uid), {
      role: nuevoRole,
      completedOnboarding: !!yaCompletado,
    }, { merge: true })

    if (yaCompletado) {
      navigate('/home')
    } else if (nuevoRole === 'familia') {
      navigate('/onboarding')
    } else {
      navigate('/onboarding-profesional')
    }
  }

  return { cambiarRol }
}