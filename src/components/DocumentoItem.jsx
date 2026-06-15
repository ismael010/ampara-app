import { useRef, useState } from 'react'
import { getSemaforo } from '../utils/semaforo'

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
      // Guardamos el archivo y pedimos la fecha antes de subir
      setArchivoTemporal(file)
      setMostrarFecha(true)
    } else {
      // Sin vencimiento, subimos directo
      subirArchivo(file, null)
    }

    // Limpiamos el input para que onChange se dispare la próxima vez
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
            <p className={`text-xs mt-0.5 ${
              semaforo.color === 'rojo' ? 'text-red-500' :
              semaforo.color === 'amarillo' ? 'text-yellow-600' : 'text-emerald-600'
            }`}>
              {semaforo.label}
            </p>
          )}
          {data?.subido && !semaforo && (
            <p className="text-xs text-emerald-600 mt-0.5">Sin venc. ✓</p>
          )}
          {!data?.subido && (
            <p className="text-xs text-gray-400 mt-0.5">No subido</p>
          )}
        </div>

        <button
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
            data?.subido
              ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              : 'bg-emerald-600 text-white hover:bg-emerald-700'
          }`}
        >
          {uploading ? '...' : data?.subido ? 'Renovar' : 'Subir'}
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
        <div className="bg-emerald-50 rounded-xl p-3 flex flex-col gap-2">
          <p className="text-xs text-gray-600 font-medium">
            ¿Cuándo vence este documento?
          </p>
          <input
            type="date"
            value={vencimiento}
            onChange={(e) => setVencimiento(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            onClick={handleConfirmarFecha}
            disabled={!vencimiento || uploading}
            className="bg-emerald-600 text-white text-xs rounded-lg py-2 font-medium disabled:opacity-40"
          >
            {uploading ? 'Subiendo...' : 'Confirmar y subir →'}
          </button>
        </div>
      )}
    </div>
  )
}