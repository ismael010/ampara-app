import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import Icon from './ui/Icon'
import logo from '../assets/logo1.png'

const itemsPorRol = {
  familia: [
    { label: 'Inicio',      icon: 'home',            ruta: '/home' },
    { label: 'Documentos',  icon: 'folder',           ruta: '/documentos' },
    { label: 'Subsidios',   icon: 'account_balance',  ruta: '/subsidios' },
    { label: 'Seguimiento', icon: 'route',            ruta: '/seguimiento' },
    { label: 'Marketplace', icon: 'storefront',       ruta: '/marketplace' },
    { label: 'Asistente',   icon: 'smart_toy',        ruta: '/asistente' },
  ],
  proveedor: [
    { label: 'Inicio',   icon: 'home',        ruta: '/home' },
    { label: 'Catálogo', icon: 'inventory_2', ruta: '/mi-catalogo' },
    { label: 'Leads',    icon: 'group',       ruta: '/leads' },
  ],
  ep: [
    { label: 'Inicio',      icon: 'home',       ruta: '/home' },
    { label: 'Familias',    icon: 'groups',     ruta: '/familias' },
    { label: 'Marketplace', icon: 'storefront', ruta: '/marketplace' },
  ],
  empresa_esg: [
    { label: 'Inicio',      icon: 'home',        ruta: '/home' },
    { label: 'Quejas',      icon: 'feedback',    ruta: '/quejas' },
    { label: 'Proyectos',   icon: 'map',         ruta: '/proyectos' },
    { label: 'Marketplace', icon: 'storefront',  ruta: '/marketplace' },
  ],
}

export default function TopNav() {
  const { profile } = useAuthContext()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const items = itemsPorRol[profile?.role] ?? []

  return (
    <header className="hidden md:flex items-center justify-between
                       px-8 h-16 bg-brand-600 shadow-md sticky top-0 z-50">
      {/* Logo */}
      <img
        src={logo}
        alt="Ampara"
        className="h-9 w-auto cursor-pointer"
        onClick={() => navigate('/home')}
      />

      {/* Items de navegación */}
      <nav className="flex items-center gap-1">
        {items.map(({ label, icon, ruta }) => {
          const activo = pathname === ruta
          return (
            <button
              key={ruta}
              onClick={() => navigate(ruta)}
              className={`flex items-center gap-2 px-4 py-2 rounded-button
                          text-sm font-medium transition-all
                          ${activo
                            ? 'bg-white/20 text-white'
                            : 'text-brand-100 hover:bg-white/10 hover:text-white'
                          }`}
            >
              <Icon name={icon} size={18} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Perfil */}
      <button
        onClick={() => navigate('/perfil')}
        className={`flex items-center gap-2 px-4 py-2 rounded-button
                    text-sm font-medium transition-all
                    ${pathname === '/perfil'
                      ? 'bg-white/20 text-white'
                      : 'text-brand-100 hover:bg-white/10 hover:text-white'
                    }`}
      >
        <Icon name="account_circle" size={22} />
        {profile?.name?.split(' ')[0] ?? 'Perfil'}
      </button>
    </header>
  )
}