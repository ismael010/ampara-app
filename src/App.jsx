import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import OnboardingPage from './pages/OnboardingPage'
import HomePage from './pages/HomePage'
import DocumentosPage from './pages/DocumentosPage'
import SubsidiosPage from './pages/SubsidiosPage'
import AsistentePage from './pages/AsistentePage'
import SeguimientoPage from './pages/SeguimientoPage'
import PerfilPage from './pages/PerfilPage'



export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute requiresProfile><HomePage /></ProtectedRoute>} />
      <Route path="/documentos" element={<ProtectedRoute requiresProfile><DocumentosPage /></ProtectedRoute>} />
      <Route path="/subsidios" element={<ProtectedRoute requiresProfile><SubsidiosPage /></ProtectedRoute>} />
      <Route path="/asistente" element={<ProtectedRoute requiresProfile><AsistentePage /></ProtectedRoute>} />
      <Route path="/seguimiento" element={<ProtectedRoute requiresProfile><SeguimientoPage /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute requiresProfile><PerfilPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}