import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/home', icon: '🏠', label: 'Inicio' },
  { to: '/documentos', icon: '📄', label: 'Documentos' },
  { to: '/subsidios', icon: '🏛️', label: 'Subsidios' },
  { to: '/asistente', icon: '🤖', label: 'Asistente' },
  { to: '/perfil', icon: '👤', label: 'Perfil' },
]

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
      <nav className="w-full max-w-sm bg-white border-t border-gray-200 flex justify-around items-center h-16 px-2">
        {tabs.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-xs transition ${
                isActive ? 'text-emerald-600 font-semibold' : 'text-gray-400'
              }`
            }
          >
            <span className="text-xl">{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}