import { useLeads } from '../hooks/useLeads'
import BottomNavProveedor from '../components/BottomNavProveedor'
import Icon from '../components/ui/Icon'

export default function LeadsPage() {
  const { leads, loading } = useLeads()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-sm mx-auto px-4 pt-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mis leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            Familias que te han contactado desde el Marketplace
          </p>
        </div>

        {leads.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="group" size={48} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">Aún no tienes contactos</p>
            <p className="text-xs text-gray-400 mt-1">
              Aparecerán aquí cuando alguien te escriba
            </p>
          </div>
        ) : (
          leads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-card shadow-sm p-4 mb-3 border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-bold text-gray-800">{lead.nombre}</p>
                <span className="text-xs text-gray-400">
                  {lead.createdAt?.toDate?.().toLocaleDateString('es-CL') || ''}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{lead.mensaje}</p>

              <a
                href={`https://wa.me/${lead.telefono?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 bg-success-50 text-success-700 text-xs font-medium rounded-button px-3 py-2"
              >
                <Icon name="chat" size={14} />
                {lead.telefono}
              </a>
            </div>
          ))
        )}

      </div>
      <BottomNavProveedor />
    </div>
  )
}