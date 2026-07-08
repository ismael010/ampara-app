import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import AppShell from './components/AppShell'
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

      {/* ── Sin AppShell: pantallas full-screen ── */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/seleccion-rol" element={
        <ProtectedRoute><SeleccionRolPage /></ProtectedRoute>
      } />
      <Route path="/elegir-mascota" element={
        <ProtectedRoute><SeleccionMascotaPage /></ProtectedRoute>
      } />
      <Route path="/onboarding" element={
        <ProtectedRoute><OnboardingPage /></ProtectedRoute>
      } />
      <Route path="/onboarding-profesional" element={
        <ProtectedRoute><OnboardingProfesionalPage /></ProtectedRoute>
      } />

      {/* ── Con AppShell: tienen navbar ── */}
      <Route path="/home" element={
        <ProtectedRoute requiresProfile>
          <AppShell><HomePage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/documentos" element={
        <ProtectedRoute requiresProfile>
          <AppShell><DocumentosPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/subsidios" element={
        <ProtectedRoute requiresProfile>
          <AppShell><SubsidiosPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/asistente" element={
        <ProtectedRoute requiresProfile>
          <AppShell><AsistentePage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/seguimiento" element={
        <ProtectedRoute requiresProfile>
          <AppShell><SeguimientoPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/perfil" element={
        <ProtectedRoute requiresProfile>
          <AppShell><PerfilPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/marketplace" element={
        <ProtectedRoute requiresProfile>
          <AppShell><MarketplacePage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/mi-catalogo" element={
        <ProtectedRoute>
          <AppShell><EditarCatalogoPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/leads" element={
        <ProtectedRoute>
          <AppShell><LeadsPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/familias" element={
        <ProtectedRoute>
          <AppShell><FamiliasPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/quejas" element={
        <ProtectedRoute>
          <AppShell><QuejasPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/crear-queja" element={
        <ProtectedRoute>
          <AppShell><CrearQuejaPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/proyectos" element={
        <ProtectedRoute>
          <AppShell><ProyectosPage /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/juego" element={
        <ProtectedRoute>
          <AppShell><JuegoPage /></AppShell>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}