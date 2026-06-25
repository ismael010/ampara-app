import { NavLink } from 'react-router-dom'
import Icon from './ui/Icon'

const tabs = [
  { to: '/home', icon: 'home', label: 'Inicio' },
  { to: '/quejas', icon: 'feedback', label: 'Quejas' },
  { to: '/proyectos', icon: 'map', label: 'Proyectos' },
  { to: '/perfil', icon: 'person', label: 'Perfil' },
]

export default function BottomNavESG() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
      <nav className="w-full max-w-sm bg-brand-600 flex justify-around items-center h-16 px-2">
        {tabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs transition ${
                isActive ? 'text-white font-semibold' : 'text-white/60'
              }`
            }
          >
            <Icon name={icon} size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}