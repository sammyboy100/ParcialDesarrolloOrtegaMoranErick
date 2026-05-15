import { useState, useEffect } from 'react'

const TIPOS = ['bache', 'alumbrado', 'basura', 'seguridad', 'emergencia']
const ESTADOS = ['pendiente', 'en proceso', 'resuelto']
const API = 'http://localhost:5000/api'

const COLORES_ESTADO = {
  'pendiente': '#c0392b',
  'en proceso': '#e67e22',
  'resuelto': '#27ae60'
}

const COLORES_TIPO = {
  'bache': '#7f8c8d',
  'alumbrado': '#f39c12',
  'basura': '#27ae60',
  'seguridad': '#2980b9',
  'emergencia': '#c0392b'
}

function Login({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
    onLogin(data.usuario)
  }

  const handleRegistro = async () => {
    setError('')
    const res = await fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setModo('login')
    setError('Registro exitoso, inicia sesion')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#1a3a5c', color: 'white', padding: '0 40px', display: 'flex', alignItems: 'center', height: '64px' }}>
        <div style={{ width: '40px', height: '40px', background: '#c0392b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', marginRight: '16px' }}>G</div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Sistema de Gestion de Incidencias</div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>Municipalidad - Via Publica</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '8px', padding: '40px', width: '380px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <h2 style={{ color: '#1a3a5c', marginBottom: '24px', textAlign: 'center', borderBottom: '2px solid #1a3a5c', paddingBottom: '12px' }}>
            {modo === 'login' ? 'Iniciar Sesion' : 'Registro de Ciudadano'}
          </h2>

          {error && <div style={{ background: error.includes('exitoso') ? '#d5f5e3' : '#fde8e8', color: error.includes('exitoso') ? '#27ae60' : '#c0392b', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {modo === 'registro' && (
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Nombre completo</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)}
                  placeholder="Su nombre completo"
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Correo electronico</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com" type="email"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Contrasena</label>
              <input value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Su contrasena" type="password"
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <button onClick={modo === 'login' ? handleLogin : handleRegistro}
              style={{ padding: '12px', background: '#1a3a5c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
              {modo === 'login' ? 'Ingresar' : 'Registrarse'}
            </button>
            <button onClick={() => { setModo(modo === 'login' ? 'registro' : 'login'); setError('') }}
              style={{ padding: '10px', background: 'transparent', color: '#1a3a5c', border: '1px solid #1a3a5c', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>
              {modo === 'login' ? 'Crear cuenta de ciudadano' : 'Ya tengo cuenta'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PanelCiudadano({ usuario, onLogout }) {
  const [incidencias, setIncidencias] = useState([])
  const [tipo, setTipo] = useState('bache')
  const [descripcion, setDescripcion] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [archivo, setArchivo] = useState(null)
  const [vista, setVista] = useState('mis-incidencias')
  const token = localStorage.getItem('token')

  useEffect(() => { fetchIncidencias() }, [])

  const fetchIncidencias = async () => {
    const res = await fetch(`${API}/incidencias`, { headers: { Authorization: `Bearer ${token}` } })
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
    await fetch(`${API}/incidencias`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
    setDescripcion('')
    setUbicacion('')
    setArchivo(null)
    fetchIncidencias()
    setVista('mis-incidencias')
  }

  const renderArchivo = (i) => {
    if (!i.archivo) return <span style={{ color: '#999' }}>Sin evidencia</span>
    const url = `http://localhost:5000/uploads/${i.archivo}`
    if (i.tipoArchivo === 'image') return <img src={url} alt="evidencia" style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
    if (i.tipoArchivo === 'video') return <video src={url} style={{ width: '70px', height: '50px' }} controls />
    if (i.tipoArchivo === 'audio') return <audio src={url} controls style={{ width: '120px' }} />
    return <a href={url} target="_blank" rel="noreferrer">Ver archivo</a>
  }

  return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: '#1a3a5c', color: 'white', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: '#c0392b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>G</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Sistema de Gestion de Incidencias</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>Municipalidad - Via Publica</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px' }}>Bienvenido, {usuario.nombre}</span>
          <button onClick={onLogout} style={{ padding: '6px 14px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Cerrar Sesion</button>
        </div>
      </div>

      <div style={{ background: '#22527a', display: 'flex', padding: '0 40px' }}>
        {['mis-incidencias', 'reportar'].map(v => (
          <button key={v} onClick={() => setVista(v)} style={{
            background: vista === v ? '#1a3a5c' : 'transparent',
            color: 'white', border: 'none', padding: '12px 24px',
            cursor: 'pointer', fontSize: '14px', borderBottom: vista === v ? '3px solid #c0392b' : '3px solid transparent'
          }}>
            {v === 'mis-incidencias' ? 'Mis Incidencias' : 'Reportar Incidencia'}
          </button>
        ))}
      </div>

      <div style={{ padding: '30px 40px' }}>
        {vista === 'mis-incidencias' && (
          <div>
            <h2 style={{ color: '#1a3a5c', marginBottom: '24px', borderBottom: '2px solid #1a3a5c', paddingBottom: '8px' }}>Mis Incidencias Reportadas</h2>
            {incidencias.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#666' }}>
                No tiene incidencias registradas. Haga clic en Reportar Incidencia para crear una.
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                <table width="100%" style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#1a3a5c', color: 'white' }}>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Tipo</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Descripcion</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Ubicacion</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Evidencia</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                      <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incidencias.map((i, idx) => (
                      <tr key={i._id} style={{ background: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={{ padding: '10px' }}>
                          <span style={{ background: COLORES_TIPO[i.tipo], color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{i.tipo}</span>
                        </td>
                        <td style={{ padding: '10px' }}>{i.descripcion}</td>
                        <td style={{ padding: '10px' }}>{i.ubicacion}</td>
                        <td style={{ padding: '10px' }}>{renderArchivo(i)}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{ background: COLORES_ESTADO[i.estado], color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{i.estado}</span>
                        </td>
                        <td style={{ padding: '10px' }}>{new Date(i.fecha).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {vista === 'reportar' && (
          <div style={{ maxWidth: '600px' }}>
            <h2 style={{ color: '#1a3a5c', marginBottom: '24px', borderBottom: '2px solid #1a3a5c', paddingBottom: '8px' }}>Reportar Nueva Incidencia</h2>
            <div style={{ background: 'white', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Tipo de Incidencia</label>
                  <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}>
                    {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Descripcion</label>
                  <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3}
                    placeholder="Describa detalladamente el problema encontrado"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Ubicacion</label>
                  <input value={ubicacion} onChange={e => setUbicacion(e.target.value)}
                    placeholder="Calle, avenida, barrio o referencia"
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '14px' }}>Evidencia (imagen, video o audio)</label>
                  <input type="file" accept="image/*,video/*,audio/*" onChange={e => setArchivo(e.target.files[0])}
                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                  {archivo && <small style={{ color: '#27ae60' }}>Archivo seleccionado: {archivo.name}</small>}
                </div>
                <button onClick={agregar} style={{ padding: '12px', background: '#1a3a5c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold' }}>
                  Enviar Reporte
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PanelAdmin({ usuario, onLogout }) {
  const [incidencias, setIncidencias] = useState([])
  const [resumen, setResumen] = useState({ pendientes: 0, enProceso: 0, resueltos: 0, total: 0 })
  const [vista, setVista] = useState('dashboard')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const token = localStorage.getItem('token')

  useEffect(() => { fetchIncidencias() }, [])

  useEffect(() => {
    const pendientes = incidencias.filter(i => i.estado === 'pendiente').length
    const enProceso = incidencias.filter(i => i.estado === 'en proceso').length
    const resueltos = incidencias.filter(i => i.estado === 'resuelto').length
    setResumen({ pendientes, enProceso, resueltos, total: incidencias.length })
  }, [incidencias])

  const fetchIncidencias = async () => {
    const res = await fetch(`${API}/incidencias`, { headers: { Authorization: `Bearer ${token}` } })
    const data = await res.json()
    setIncidencias(data)
  }

  const cambiarEstado = async (id, estado) => {
    await fetch(`${API}/incidencias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ estado })
    })
    fetchIncidencias()
  }

  const eliminar = async (id) => {
    await fetch(`${API}/incidencias/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    fetchIncidencias()
  }

  const renderArchivo = (i) => {
    if (!i.archivo) return <span style={{ color: '#999' }}>Sin evidencia</span>
    const url = `http://localhost:5000/uploads/${i.archivo}`
    if (i.tipoArchivo === 'image') return <img src={url} alt="evidencia" style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
    if (i.tipoArchivo === 'video') return <video src={url} style={{ width: '70px', height: '50px' }} controls />
    if (i.tipoArchivo === 'audio') return <audio src={url} controls style={{ width: '120px' }} />
    return <a href={url} target="_blank" rel="noreferrer">Ver archivo</a>
  }

  const incidenciasFiltradas = filtroEstado === 'todos' ? incidencias : incidencias.filter(i => i.estado === filtroEstado)

  return (
    <div style={{ fontFamily: 'Arial', minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ background: '#1a3a5c', color: 'white', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', background: '#c0392b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' }}>G</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Sistema de Gestion de Incidencias</div>
            <div style={{ fontSize: '11px', opacity: 0.8 }}>Panel de Administrador</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '14px' }}>Admin: {usuario.nombre}</span>
          <button onClick={onLogout} style={{ padding: '6px 14px', background: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}>Cerrar Sesion</button>
        </div>
      </div>

      <div style={{ background: '#22527a', display: 'flex', padding: '0 40px' }}>
        {['dashboard', 'incidencias'].map(v => (
          <button key={v} onClick={() => setVista(v)} style={{
            background: vista === v ? '#1a3a5c' : 'transparent',
            color: 'white', border: 'none', padding: '12px 24px',
            cursor: 'pointer', fontSize: '14px', borderBottom: vista === v ? '3px solid #c0392b' : '3px solid transparent'
          }}>
            {v === 'dashboard' ? 'Panel Principal' : 'Gestion de Incidencias'}
          </button>
        ))}
      </div>

      <div style={{ padding: '30px 40px' }}>
        {vista === 'dashboard' && (
          <div>
            <h2 style={{ color: '#1a3a5c', marginBottom: '24px', borderBottom: '2px solid #1a3a5c', paddingBottom: '8px' }}>Panel Principal</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '30px' }}>
              {[
                { label: 'Total Incidencias', valor: resumen.total, color: '#1a3a5c' },
                { label: 'Pendientes', valor: resumen.pendientes, color: '#c0392b' },
                { label: 'En Proceso', valor: resumen.enProceso, color: '#e67e22' },
                { label: 'Resueltos', valor: resumen.resueltos, color: '#27ae60' },
              ].map(t => (
                <div key={t.label} style={{ background: 'white', borderRadius: '8px', padding: '20px', borderLeft: `5px solid ${t.color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: t.color }}>{t.valor}</div>
                  <div style={{ color: '#666', fontSize: '14px', marginTop: '4px' }}>{t.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h3 style={{ color: '#1a3a5c', marginBottom: '16px' }}>Ultimas Incidencias</h3>
              <table width="100%" style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#1a3a5c', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Tipo</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Descripcion</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Ubicacion</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {incidencias.slice(0, 5).map((i, idx) => (
                    <tr key={i._id} style={{ background: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={{ padding: '10px' }}><span style={{ background: COLORES_TIPO[i.tipo], color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{i.tipo}</span></td>
                      <td style={{ padding: '10px' }}>{i.descripcion}</td>
                      <td style={{ padding: '10px' }}>{i.ubicacion}</td>
                      <td style={{ padding: '10px' }}><span style={{ background: COLORES_ESTADO[i.estado], color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{i.estado}</span></td>
                      <td style={{ padding: '10px' }}>{new Date(i.fecha).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {vista === 'incidencias' && (
          <div>
            <h2 style={{ color: '#1a3a5c', marginBottom: '24px', borderBottom: '2px solid #1a3a5c', paddingBottom: '8px' }}>Gestion de Incidencias</h2>
            <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
              {['todos', 'pendiente', 'en proceso', 'resuelto'].map(f => (
                <button key={f} onClick={() => setFiltroEstado(f)} style={{
                  padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
                  background: filtroEstado === f ? '#1a3a5c' : '#ddd',
                  color: filtroEstado === f ? 'white' : '#333'
                }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <table width="100%" style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#1a3a5c', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Tipo</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Descripcion</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Ubicacion</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Evidencia</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Estado</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Fecha</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {incidenciasFiltradas.map((i, idx) => (
                    <tr key={i._id} style={{ background: idx % 2 === 0 ? '#f9f9f9' : 'white' }}>
                      <td style={{ padding: '10px' }}><span style={{ background: COLORES_TIPO[i.tipo], color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{i.tipo}</span></td>
                      <td style={{ padding: '10px' }}>{i.descripcion}</td>
                      <td style={{ padding: '10px' }}>{i.ubicacion}</td>
                      <td style={{ padding: '10px' }}>{renderArchivo(i)}</td>
                      <td style={{ padding: '10px' }}>
                        <select value={i.estado} onChange={e => cambiarEstado(i._id, e.target.value)}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: `2px solid ${COLORES_ESTADO[i.estado]}`, color: COLORES_ESTADO[i.estado], fontWeight: 'bold', fontSize: '12px' }}>
                          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '10px' }}>{new Date(i.fecha).toLocaleDateString()}</td>
                      <td style={{ padding: '10px' }}>
                        <button onClick={() => eliminar(i._id)} style={{ background: '#c0392b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem('usuario')
    return u ? JSON.parse(u) : null
  })

  const handleLogin = (u) => setUsuario(u)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setUsuario(null)
  }

  if (!usuario) return <Login onLogin={handleLogin} />
  if (usuario.rol === 'admin') return <PanelAdmin usuario={usuario} onLogout={handleLogout} />
  return <PanelCiudadano usuario={usuario} onLogout={handleLogout} />
}

export default App