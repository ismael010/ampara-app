import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCQqour4SDAPG9rxyc9K5Sn67OvdcuS8Cc",
  authDomain: "ampara-app-eb50a.firebaseapp.com",
  projectId: "ampara-app-eb50a",
  storageBucket: "ampara-app-eb50a.firebasestorage.app",
  messagingSenderId: "551523238016",
  appId: "1:551523238016:web:4b27b428f757e842932665"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)