import { useState } from 'react'
import { useLeads } from '../hooks/useLeads'
import BottomNavProveedor from '../components/BottomNavProveedor'
import Icon from '../components/ui/Icon'

function TiempoAtras({ fecha }) {
  if (!fecha) return null
  const ms    = Date.now() - (fecha?.toDate?.() ?? new Date(fecha)).getTime()
  const mins  = Math.floor(ms / 60000)
  const horas = Math.floor(ms / 3600000)
  const dias  = Math.floor(ms / 86400000)
  if (mins < 60)  return <span className="text-xs text-gray-400">{mins}m atrás</span>
  if (horas < 24) return <span className="text-xs text-gray-400">{horas}h atrás</span>
  return <span className="text-xs text-gray-400">{dias}d atrás</span>
}

export default function LeadsPage() {
  const { leads, loading } = useLeads()
  const [busqueda, setBusqueda] = useState('')

  const leadsHoy = leads.filter(l => {
    const fecha = l.createdAt?.toDate?.() ?? new Date(l.createdAt)
    return Date.now() - fecha.getTime() < 86400000
  }).length

  const leadsFiltrados = leads.filter(l =>
    !busqueda ||
    l.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.mensaje?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-brand-600 font-medium">Cargando...</p>
      </div>
    )
  }

  const SinLeads = () => (
    <div className="text-center py-12">
      <Icon name="group" size={48} className="text-gray-300 mb-3" />
      <p className="text-sm text-gray-500">Aún no tienes contactos</p>
      <p className="text-xs text-gray-400 mt-1">
        Aparecerán aquí cuando alguien te escriba desde el marketplace
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-0">

      {/* ── MOBILE ── */}
      <div className="md:hidden max-w-sm mx-auto px-4 pt-8">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-800">Mis leads</h1>
          <p className="text-sm text-gray-500 mt-1">
            {leads.length} contacto{leads.length !== 1 ? 's' : ''} · {leadsHoy} hoy
          </p>
        </div>

        {/* Buscador */}
        {leads.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-button px-3 py-2.5 mb-4">
            <Icon name="search" size={16} className="text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o mensaje..."
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
            />
          </div>
        )}

        {leadsFiltrados.length === 0 ? (
          <SinLeads />
        ) : (
          leadsFiltrados.map((lead) => (
            <div key={lead.id} className="bg-white rounded-card shadow-sm p-4 mb-3 border border-gray-100">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                    <Icon name="person" size={16} className="text-brand-600" />
                  </div>
                  <p className="text-sm font-bold text-gray-800">{lead.nombre}</p>
                </div>
                <TiempoAtras fecha={lead.createdAt} />
              </div>
              {lead.mensaje && (
                <p className="text-sm text-gray-500 mb-3 ml-10">{lead.mensaje}</p>
              )}
              
              <a
                href={`https://wa.me/${lead.telefono?.replace(/\D/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="ml-10 inline-flex items-center gap-1.5 bg-success-50 text-success-700 text-xs font-medium rounded-button px-3 py-2 hover:bg-success-100 transition"
              >
                <Icon name="chat" size={14} />
                {lead.telefono}
              </a>
            </div>
          ))
        )}
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:block">

        {/* Banner */}
        <div className="bg-brand-600 px-10 py-8 mb-8">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Mis leads</h1>
              <p className="text-brand-100 mt-1">
                Familias que te han contactado desde el marketplace
              </p>
            </div>
            <div className="flex gap-8 text-right">
              {[
                { label: 'Total leads', valor: leads.length },
                { label: 'Hoy',         valor: leadsHoy },
              ].map(({ label, valor }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-white">{valor}</p>
                  <p className="text-brand-200 text-xs mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-10">
          <div className="bg-white rounded-card shadow-sm border border-gray-100 overflow-hidden">

            {/* Buscador */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-button px-3 py-2 flex-1 max-w-sm">
                <Icon name="search" size={16} className="text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por nombre o mensaje..."
                  className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
              </div>
              <p className="text-xs text-gray-400 ml-auto">
                {leadsFiltrados.length} resultado{leadsFiltrados.length !== 1 ? 's' : ''}
              </p>
            </div>

            {leadsFiltrados.length === 0 ? (
              <SinLeads />
            ) : (
              <>
                {/* Header tabla */}
                <div className="grid grid-cols-5 px-6 py-2 bg-gray-50 border-b border-gray-100">
                  {['Nombre', 'Mensaje', 'Teléfono', 'Fecha', 'Hace'].map(h => (
                    <p key={h} className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
                  ))}
                </div>

                {leadsFiltrados.map((lead) => (
                  <div
                    key={lead.id}
                    className="grid grid-cols-5 px-6 py-4 border-b border-gray-50 hover:bg-brand-50 transition items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                        <Icon name="person" size={16} className="text-brand-600" />
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate">{lead.nombre}</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate pr-4">
                      {lead.mensaje || <span className="text-gray-300 italic">Sin mensaje</span>}
                    </p>
                    
                    <a
                      href={`https://wa.me/${lead.telefono?.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 bg-success-50 text-success-700 text-xs font-medium rounded-button px-3 py-2 hover:bg-success-100 transition w-fit"
                    >
                      <Icon name="chat" size={13} />
                      {lead.telefono}
                    </a>
                    <p className="text-sm text-gray-400">
                      {lead.createdAt?.toDate?.().toLocaleDateString('es-CL') || '—'}
                    </p>
                    <TiempoAtras fecha={lead.createdAt} />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      <BottomNavProveedor />
    </div>
  )
}