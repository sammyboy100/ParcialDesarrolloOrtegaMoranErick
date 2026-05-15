import { useState, useEffect } from 'react'

const TIPOS = ['bache', 'alumbrado', 'basura', 'seguridad', 'emergencia']
const ESTADOS = ['pendiente', 'en proceso', 'resuelto']
const API = 'http://localhost:5000/api/incidencias'

function App() {
  const [incidencias, setIncidencias] = useState([])
  const [tipo, setTipo] = useState('bache')
  const [descripcion, setDescripcion] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [archivo, setArchivo] = useState(null)

  useEffect(() => { fetchIncidencias() }, [])

  const fetchIncidencias = async () => {
    const res = await fetch(API)
    const data = await res.json()
    setIncidencias(data)
  }

  const agregar = async () => {
    if (!descripcion || !ubicacion) return
    const formData = new FormData()
    formData.append('tipo', tipo)
    formData.append('descripcion', descripcion)
    formData.append('ubicacion', ubicacion)
    if (archivo) formData.append('archivo', archivo)

    await fetch(API, { method: 'POST', body: formData })
    setDescripcion('')
    setUbicacion('')
    setArchivo(null)
    fetchIncidencias()
  }

  const cambiarEstado = async (id, estado) => {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    })
    fetchIncidencias()
  }

  const eliminar = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    fetchIncidencias()
  }

  const renderArchivo = (i) => {
    if (!i.archivo) return 'Sin archivo'
    const url = `http://localhost:5000/uploads/${i.archivo}`
    if (i.tipoArchivo === 'image') return <img src={url} alt="evidencia" style={{ width: '80px', height: '60px', objectFit: 'cover' }} />
    if (i.tipoArchivo === 'video') return <video src={url} style={{ width: '80px', height: '60px' }} controls />
    if (i.tipoArchivo === 'audio') return <audio src={url} controls style={{ width: '120px' }} />
    return <a href={url} target="_blank" rel="noreferrer">Ver archivo</a>
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'Arial', padding: '0 20px' }}>
      <h1>Sistema de Incidencias Ciudadanas</h1>

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
        <h2>Reportar Incidencia</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ padding: '8px' }}>
            {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
          <input
            placeholder="Descripcion del problema"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            style={{ padding: '8px' }}
          />
          <input
            placeholder="Ubicacion (calle, barrio, referencia)"
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
            style={{ padding: '8px' }}
          />
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={e => setArchivo(e.target.files[0])}
            style={{ padding: '8px' }}
          />
          {archivo && <small>Archivo seleccionado: {archivo.name}</small>}
          <button onClick={agregar} style={{ padding: '10px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Reportar Incidencia
          </button>
        </div>
      </div>

      <h2>Incidencias Registradas ({incidencias.length})</h2>
      <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead style={{ background: '#333', color: 'white' }}>
          <tr>
            <th>Tipo</th>
            <th>Descripcion</th>
            <th>Ubicacion</th>
            <th>Evidencia</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {incidencias.map(i => (
            <tr key={i._id}>
              <td>{i.tipo}</td>
              <td>{i.descripcion}</td>
              <td>{i.ubicacion}</td>
              <td>{renderArchivo(i)}</td>
              <td>
                <select value={i.estado} onChange={e => cambiarEstado(i._id, e.target.value)} style={{ padding: '4px' }}>
                  {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </td>
              <td>{new Date(i.fecha).toLocaleDateString()}</td>
              <td>
                <button onClick={() => eliminar(i._id)} style={{ background: '#c0392b', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App