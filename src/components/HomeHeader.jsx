export default function HomeHeader({ profile, desktop = false }) {
  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className="mb-6">
      <p className={`text-sm ${desktop ? 'text-brand-100' : 'text-gray-500'}`}>
        {saludo},
      </p>
      <h1 className={`text-xl font-bold ${desktop ? 'text-white' : 'text-gray-800'}`}>
        {profile?.name || 'Bienvenida'}
      </h1>
    </div>
  )
}