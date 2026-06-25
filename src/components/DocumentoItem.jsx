import { useRef, useState } from 'react'
import { getSemaforo } from '../utils/semaforo'
import Icon from './ui/Icon'

export default function DocumentoItem({ docId, nombre, tieneVencimiento, data, onSubir }) {
  const inputRef = useRef()
  const [vencimiento, setVencimiento] = useState('')
  const [mostrarFecha, setMostrarFecha] = useState(false)
  const [archivoTemporal, setArchivoTemporal] = useState(null)
  const [uploading, setUploading] = useState(false)

  const semaforo = data?.vencimiento ? getSemaforo(data.vencimiento) : null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (tieneVencimiento) {
      setArchivoTemporal(file)
      setMostrarFecha(true)
    } else {
      subirArchivo(file, null)
    }

    e.target.value = ''
  }

  const handleConfirmarFecha = async () => {
    if (!vencimiento || !archivoTemporal) return
    await subirArchivo(archivoTemporal, vencimiento)
    setMostrarFecha(false)
    setArchivoTemporal(null)
    setVencimiento('')
  }

  const subirArchivo = async (file, fecha) => {
    setUploading(true)
    await onSubir(docId, file, fecha)
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-800">{nombre}</p>

          {data?.subido && semaforo && (
            <p className={`text-xs mt-0.5 flex items-center gap-1 ${
              semaforo.color === 'rojo' ? 'text-warning-700' :
              semaforo.color === 'amarillo' ? 'text-warning-600' : 'text-success-600'
            }`}>
              <Icon
                name={
                  semaforo.color === 'rojo' ? 'error' :
                  semaforo.color === 'amarillo' ? 'warning' : 'check_circle'
                }
                size={14}
              />
              {semaforo.label.replace('🔴', '').replace('🟡', '').replace('✅', '').trim()}
            </p>
          )}

          {data?.subido && !semaforo && (
            <p className="text-xs text-success-600 mt-0.5 flex items-center gap-1">
              <Icon name="check_circle" size={14} />
              Sin vencimiento
            </p>
          )}

          {!data?.subido && (
            <p className="text-xs text-gray-400 mt-0.5">No subido</p>
          )}
        </div>

        <button
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className={`text-xs px-3 py-1.5 rounded-button font-medium transition flex items-center gap-1 ${
            data?.subido
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              : 'bg-brand-600 text-white hover:bg-brand-700'
          }`}
        >
          {uploading ? (
            '...'
          ) : data?.subido ? (
            <>
              <Icon name="autorenew" size={14} />
              Renovar
            </>
          ) : (
            <>
              <Icon name="upload" size={14} />
              Subir
            </>
          )}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {mostrarFecha && (
        <div className="bg-brand-50 rounded-card p-3 flex flex-col gap-2">
          <p className="text-xs text-gray-600 font-medium">
            ¿Cuándo vence este documento?
          </p>
          <input
            type="date"
            value={vencimiento}
            onChange={(e) => setVencimiento(e.target.value)}
            className="border border-gray-300 rounded-button px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          <button
            onClick={handleConfirmarFecha}
            disabled={!vencimiento || uploading}
            className="bg-brand-600 text-white text-xs rounded-button py-2 font-medium disabled:opacity-40 flex items-center justify-center gap-1"
          >
            {uploading ? 'Subiendo...' : (
              <>
                <Icon name="check" size={14} />
                Confirmar y subir
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}