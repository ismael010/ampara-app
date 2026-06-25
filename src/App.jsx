import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import SplashScreen from './pages/SplashScreen'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SeleccionRolPage from './pages/SeleccionRolPage'
import SeleccionMascotaPage from './pages/SeleccionMascotaPage'
import OnboardingPage from './pages/OnboardingPage'
import OnboardingProfesionalPage from './pages/OnboardingProfesionalPage'
import HomePage from './pages/HomePage'
import DocumentosPage from './pages/DocumentosPage'
import SubsidiosPage from './pages/SubsidiosPage'
import AsistentePage from './pages/AsistentePage'
import SeguimientoPage from './pages/SeguimientoPage'
import PerfilPage from './pages/PerfilPage'
import MarketplacePage from './pages/MarketplacePage'
import EditarCatalogoPage from './pages/EditarCatalogoPage'
import LeadsPage from './pages/LeadsPage'
import FamiliasPage from './pages/FamiliasPage'
import QuejasPage from './pages/QuejasPage'
import ProyectosPage from './pages/ProyectosPage'
import JuegoPage from './pages/JuegoPage'
import CrearQuejaPage from './pages/CrearQuejaPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/seleccion-rol" element={<ProtectedRoute><SeleccionRolPage /></ProtectedRoute>} />
      <Route path="/elegir-mascota" element={<ProtectedRoute><SeleccionMascotaPage /></ProtectedRoute>} />
      <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
      <Route path="/onboarding-profesional" element={<ProtectedRoute><OnboardingProfesionalPage /></ProtectedRoute>} />
      <Route path="/home" element={<ProtectedRoute requiresProfile><HomePage /></ProtectedRoute>} />
      <Route path="/documentos" element={<ProtectedRoute requiresProfile><DocumentosPage /></ProtectedRoute>} />
      <Route path="/subsidios" element={<ProtectedRoute requiresProfile><SubsidiosPage /></ProtectedRoute>} />
      <Route path="/asistente" element={<ProtectedRoute requiresProfile><AsistentePage /></ProtectedRoute>} />
      <Route path="/seguimiento" element={<ProtectedRoute requiresProfile><SeguimientoPage /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute requiresProfile><PerfilPage /></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute requiresProfile><MarketplacePage /></ProtectedRoute>} />
      <Route path="/mi-catalogo" element={<ProtectedRoute><EditarCatalogoPage /></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
      <Route path="/familias" element={<ProtectedRoute><FamiliasPage /></ProtectedRoute>} />
      <Route path="/quejas" element={<ProtectedRoute><QuejasPage /></ProtectedRoute>} />
      <Route path="/crear-queja" element={<ProtectedRoute><CrearQuejaPage /></ProtectedRoute>} />
      <Route path="/proyectos" element={<ProtectedRoute><ProyectosPage /></ProtectedRoute>} />
      <Route path="/juego" element={<ProtectedRoute><JuegoPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}