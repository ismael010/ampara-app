import { useAuthContext } from '../context/AuthContext'
import PerfilFamilia from './perfil/PerfilFamilia'
import PerfilProveedor from './perfil/PerfilProveedor'
import PerfilEP from './perfil/PerfilEP'
import PerfilESG from './perfil/PerfilESG'

export default function PerfilPage() {
  const { profile } = useAuthContext()

  switch (profile?.role) {
    case 'proveedor':
      return <PerfilProveedor />
    case 'ep':
      return <PerfilEP />
    case 'empresa_esg':
      return <PerfilESG />
    case 'familia':
    default:
      return <PerfilFamilia />
  }
}