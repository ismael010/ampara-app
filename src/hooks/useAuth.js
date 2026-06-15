import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase/config'

const googleProvider = new GoogleAuthProvider()

export function useAuth() {
  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const loginWithGoogle = () =>
    signInWithPopup(auth, googleProvider)

  const logout = () => signOut(auth)

  return { register, login, loginWithGoogle, logout }
}