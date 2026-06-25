import { useProfile } from '../hooks/useProfile'
import HomeFamilia from './home/HomeFamilia'
import HomeProveedor from './home/HomeProveedor'
import HomeEP from './home/HomeEP'
import HomeESG from './home/HomeESG'

export default function HomePage() {
  const { profile, loading } = useProfile()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  switch (profile?.role) {
    case 'proveedor':
      return <HomeProveedor />
    case 'ep':
      return <HomeEP />
    case 'empresa_esg':
      return <HomeESG />
    case 'familia':
    default:
      return <HomeFamilia />
  }
}