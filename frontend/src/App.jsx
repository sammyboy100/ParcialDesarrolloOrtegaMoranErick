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
  const [activo, setActivo] = useState(0)

  const tarjetas = [
    { titulo: 'Reporta', desc: 'Registra incidencias en tu zona con foto, video o audio como evidencia.' },
    { titulo: 'Seguimiento', desc: 'Consulta el estado de tus reportes en tiempo real desde tu cuenta.' },
    { titulo: 'Gestion', desc: 'Las autoridades atienden y actualizan cada caso reportado.' },
  ]

  useEffect(() => {
    const t = setInterval(() => setActivo(a => (a + 1) % tarjetas.length), 3000)
    return () => clearInterval(t)
  }, [])

  const handleLogin = async () => {
    setError('')
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
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
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    })
    const data = await res.json()
    if (!res.ok) return setError(data.error)
    setModo('login')
    setError('Registro exitoso, inicia sesion')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: 'Inter, Arial, sans-serif' }}>
      {/* Topbar */}
      <div style={{ background: '#2c3e6b', color: 'white', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '44px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500' }}>Erick Daniel Ortega Moran — Parcial de Desarrollo de Software</span>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>Cod. 20210209H</span>
      </div>

      {/* Navbar */}
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#2c3e6b', borderRadius: '8px' }}></div>
          <span style={{ fontWeight: '700', fontSize: '16px', color: '#1e293b' }}>IncidenciasVP</span>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['Inicio', 'Como funciona', 'Contacto'].map(item => (
            <span key={item} style={{ fontSize: '14px', color: '#64748b', cursor: 'pointer', fontWeight: '500' }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Hero + Login */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 100px)' }}>

        {/* Lado izquierdo */}
        <div style={{ flex: 1, background: 'linear-gradient(135deg, #2c3e6b 0%, #1a2a4a 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 56px', color: 'white' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', padding: '6px 16px', fontSize: '12px', fontWeight: '500', marginBottom: '24px', width: 'fit-content' }}>
            Via Publica Ciudadana
          </div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', lineHeight: '1.2', marginBottom: '16px', color: 'white' }}>
            Reporta incidencias<br />en tu ciudad
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '40px', maxWidth: '400px' }}>
            Plataforma ciudadana para reportar problemas en la via publica. Tu reporte llega directo a las autoridades.
          </p>

          {/* Tarjetas rotativas */}
          <div style={{ position: 'relative', height: '100px' }}>
            {tarjetas.map((t, idx) => (
              <div key={idx} style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px',
                border: '1px solid rgba(255,255,255,0.15)',
                opacity: activo === idx ? 1 : 0,
                transform: activo === idx ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.5s ease'
              }}>
                <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '6px' }}>{t.titulo}</div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)' }}>{t.desc}</div>
              </div>
            ))}
          </div>

          {/* Indicadores */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
            {tarjetas.map((_, idx) => (
              <div key={idx} onClick={() => setActivo(idx)} style={{ width: activo === idx ? '24px' : '8px', height: '8px', borderRadius: '4px', background: activo === idx ? 'white' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.3s' }}></div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '48px' }}>
            {[['5', 'Tipos de incidencia'], ['3', 'Estados de seguimiento'], ['100%', 'En la nube']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{val}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Lado derecho - formulario */}
        <div style={{ width: '460px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>
              {modo === 'login' ? 'Bienvenido' : 'Crear cuenta'}
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '28px' }}>
              {modo === 'login' ? 'Ingresa con tu cuenta para continuar' : 'Registrate como ciudadano'}
            </p>

            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '3px', marginBottom: '24px' }}>
              {['login', 'registro'].map(m => (
                <button key={m} onClick={() => { setModo(m); setError('') }} style={{
                  flex: 1, padding: '9px', border: 'none', borderRadius: '8px', fontSize: '13px',
                  fontWeight: '500', cursor: 'pointer',
                  background: modo === m ? 'white' : 'transparent',
                  color: modo === m ? '#2c3e6b' : '#94a3b8',
                  boxShadow: modo === m ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}>
                  {m === 'login' ? 'Iniciar Sesion' : 'Registrarse'}
                </button>
              ))}
            </div>

            {error && (
              <div style={{ background: error.includes('exitoso') ? '#f0fdf4' : '#fff1f2', color: error.includes('exitoso') ? '#15803d' : '#be123c', border: `1px solid ${error.includes('exitoso') ? '#bbf7d0' : '#fecdd3'}`, padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {modo === 'registro' && (
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '13px' }}>Nombre completo</label>
                  <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre completo"
                    style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', color: '#1e293b', background: '#fafafa' }} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '13px' }}>Correo electronico</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" type="email"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', color: '#1e293b', background: '#fafafa' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '13px' }}>Contrasena</label>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Tu contrasena" type="password"
                  style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', color: '#1e293b', background: '#fafafa' }} />
              </div>
              <button onClick={modo === 'login' ? handleLogin : handleRegistro}
                style={{ padding: '12px', background: '#2c3e6b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginTop: '6px', transition: 'opacity 0.2s' }}>
                {modo === 'login' ? 'Ingresar al sistema' : 'Crear mi cuenta'}
              </button>
            </div>

            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '12px', color: '#cbd5e1', textAlign: 'center' }}>
                Sistema de Gestion de Incidencias — Desarrollo de Software 2026
              </p>
            </div>
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
    if (!i.archivo) return <span style={{ color: '#94a3b8', fontSize: '12px' }}>Sin evidencia</span>
    const url = `http://localhost:5000/uploads/${i.archivo}`
    if (i.tipoArchivo === 'image') return <img src={url} alt="evidencia" style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
    if (i.tipoArchivo === 'video') return <video src={url} style={{ width: '70px', height: '50px' }} controls />
    if (i.tipoArchivo === 'audio') return <audio src={url} controls style={{ width: '120px' }} />
    return <a href={url} target="_blank" rel="noreferrer">Ver archivo</a>
  }

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', minHeight: '100vh', background: '#eef2f7' }}>
      <div style={{ background: '#2c3e6b', color: 'white', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '44px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500' }}>Erick Daniel Ortega Moran — Parcial de Desarrollo de Software</span>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>Cod. 20210209H</span>
      </div>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#2c3e6b', borderRadius: '8px' }}></div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '15px', color: '#1e293b' }}>IncidenciasVP</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Panel Ciudadano</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{usuario.nombre}</span>
          <button onClick={onLogout} style={{ padding: '6px 14px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Salir</button>
        </div>
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', padding: '0 32px' }}>
        {['mis-incidencias', 'reportar'].map(v => (
          <button key={v} onClick={() => setVista(v)} style={{
            background: 'transparent', color: vista === v ? '#2c3e6b' : '#94a3b8',
            border: 'none', padding: '14px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
            borderBottom: vista === v ? '2px solid #2c3e6b' : '2px solid transparent'
          }}>
            {v === 'mis-incidencias' ? 'Mis Incidencias' : 'Reportar Incidencia'}
          </button>
        ))}
      </div>

      <div style={{ padding: '28px 32px' }}>
        {vista === 'mis-incidencias' && (
          <div>
            <h2 style={{ color: '#1e293b', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Mis Incidencias Reportadas</h2>
            {incidencias.length === 0 ? (
              <div style={{ background: 'white', borderRadius: '10px', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                No tienes incidencias registradas.
              </div>
            ) : (
              <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table width="100%" style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      {['Tipo', 'Descripcion', 'Ubicacion', 'Evidencia', 'Estado', 'Fecha'].map(h => (
                        <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {incidencias.map((i) => (
                      <tr key={i._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}><span style={{ background: COLORES_TIPO[i.tipo] + '22', color: COLORES_TIPO[i.tipo], padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{i.tipo}</span></td>
                        <td style={{ padding: '12px', color: '#334155' }}>{i.descripcion}</td>
                        <td style={{ padding: '12px', color: '#64748b' }}>{i.ubicacion}</td>
                        <td style={{ padding: '12px' }}>{renderArchivo(i)}</td>
                        <td style={{ padding: '12px' }}><span style={{ background: COLORES_ESTADO[i.estado] + '22', color: COLORES_ESTADO[i.estado], padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{i.estado}</span></td>
                        <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>{new Date(i.fecha).toLocaleDateString('es-PE')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {vista === 'reportar' && (
          <div style={{ maxWidth: '560px' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Reportar Nueva Incidencia</h2>
            <div style={{ background: 'white', borderRadius: '10px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '13px' }}>Tipo de Incidencia</label>
                  <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', color: '#1e293b' }}>
                    {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '13px' }}>Descripcion</label>
                  <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3} placeholder="Describe el problema con detalle"
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', outline: 'none', color: '#1e293b' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '13px' }}>Ubicacion</label>
                  <input value={ubicacion} onChange={e => setUbicacion(e.target.value)} placeholder="Calle, avenida o referencia"
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', color: '#1e293b' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#475569', fontSize: '13px' }}>Evidencia (imagen, video o audio)</label>
                  <input type="file" accept="image/*,video/*,audio/*" onChange={e => setArchivo(e.target.files[0])}
                    style={{ width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }} />
                  {archivo && <small style={{ color: '#2c3e6b', marginTop: '4px', display: 'block' }}>{archivo.name}</small>}
                </div>
                <button onClick={agregar} style={{ padding: '11px', background: '#2c3e6b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', marginTop: '4px' }}>
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
    if (!i.archivo) return <span style={{ color: '#94a3b8', fontSize: '12px' }}>Sin evidencia</span>
    const url = `http://localhost:5000/uploads/${i.archivo}`
    if (i.tipoArchivo === 'image') return <img src={url} alt="evidencia" style={{ width: '70px', height: '50px', objectFit: 'cover', borderRadius: '6px' }} />
    if (i.tipoArchivo === 'video') return <video src={url} style={{ width: '70px', height: '50px' }} controls />
    if (i.tipoArchivo === 'audio') return <audio src={url} controls style={{ width: '120px' }} />
    return <a href={url} target="_blank" rel="noreferrer">Ver archivo</a>
  }

  const incidenciasFiltradas = filtroEstado === 'todos' ? incidencias : incidencias.filter(i => i.estado === filtroEstado)

  return (
    <div style={{ fontFamily: 'Inter, Arial, sans-serif', minHeight: '100vh', background: '#eef2f7' }}>
      <div style={{ background: '#2c3e6b', color: 'white', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '44px' }}>
        <span style={{ fontSize: '13px', fontWeight: '500' }}>Erick Daniel Ortega Moran — Parcial de Desarrollo de Software</span>
        <span style={{ fontSize: '12px', opacity: 0.7 }}>Cod. 20210209H</span>
      </div>
      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '36px', height: '36px', background: '#2c3e6b', borderRadius: '8px' }}></div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '15px', color: '#1e293b' }}>IncidenciasVP</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Panel Administrador</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{usuario.nombre}</span>
          <button onClick={onLogout} style={{ padding: '6px 14px', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>Salir</button>
        </div>
      </div>

      <div style={{ background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', padding: '0 32px' }}>
        {['dashboard', 'incidencias'].map(v => (
          <button key={v} onClick={() => setVista(v)} style={{
            background: 'transparent', color: vista === v ? '#2c3e6b' : '#94a3b8',
            border: 'none', padding: '14px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
            borderBottom: vista === v ? '2px solid #2c3e6b' : '2px solid transparent'
          }}>
            {v === 'dashboard' ? 'Panel Principal' : 'Gestion de Incidencias'}
          </button>
        ))}
      </div>

      <div style={{ padding: '28px 32px' }}>
        {vista === 'dashboard' && (
          <div>
            <h2 style={{ color: '#1e293b', marginBottom: '20px', fontSize: '18px', fontWeight: '600' }}>Panel Principal</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
              {[
                { label: 'Total Incidencias', valor: resumen.total, color: '#2c3e6b' },
                { label: 'Pendientes', valor: resumen.pendientes, color: '#c0392b' },
                { label: 'En Proceso', valor: resumen.enProceso, color: '#e67e22' },
                { label: 'Resueltos', valor: resumen.resueltos, color: '#27ae60' },
              ].map(t => (
                <div key={t.label} style={{ background: 'white', borderRadius: '10px', padding: '20px', borderLeft: `4px solid ${t.color}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: t.color }}>{t.valor}</div>
                  <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{t.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h3 style={{ color: '#1e293b', marginBottom: '16px', fontSize: '15px', fontWeight: '600' }}>Ultimas Incidencias</h3>
              <table width="100%" style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Tipo', 'Descripcion', 'Ubicacion', 'Evidencia', 'Estado', 'Fecha'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incidencias.slice(0, 5).map((i) => (
                    <tr key={i._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}><span style={{ background: COLORES_TIPO[i.tipo] + '22', color: COLORES_TIPO[i.tipo], padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{i.tipo}</span></td>
                      <td style={{ padding: '12px', color: '#334155' }}>{i.descripcion}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{i.ubicacion}</td>
                      <td style={{ padding: '12px' }}>{renderArchivo(i)}</td>
                      <td style={{ padding: '12px' }}><span style={{ background: COLORES_ESTADO[i.estado] + '22', color: COLORES_ESTADO[i.estado], padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{i.estado}</span></td>
                      <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>{new Date(i.fecha).toLocaleDateString('es-PE')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {vista === 'incidencias' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: '#1e293b', fontSize: '18px', fontWeight: '600' }}>Gestion de Incidencias</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['todos', 'pendiente', 'en proceso', 'resuelto'].map(f => (
                  <button key={f} onClick={() => setFiltroEstado(f)} style={{
                    padding: '7px 14px', border: '1.5px solid', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer',
                    background: filtroEstado === f ? '#2c3e6b' : 'white',
                    color: filtroEstado === f ? 'white' : '#64748b',
                    borderColor: filtroEstado === f ? '#2c3e6b' : '#e2e8f0'
                  }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <table width="100%" style={{ borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Tipo', 'Descripcion', 'Ubicacion', 'Evidencia', 'Estado', 'Fecha', 'Accion'].map(h => (
                      <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: '#64748b', fontWeight: '500', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {incidenciasFiltradas.map((i) => (
                    <tr key={i._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}><span style={{ background: COLORES_TIPO[i.tipo] + '22', color: COLORES_TIPO[i.tipo], padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500' }}>{i.tipo}</span></td>
                      <td style={{ padding: '12px', color: '#334155' }}>{i.descripcion}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{i.ubicacion}</td>
                      <td style={{ padding: '12px' }}>{renderArchivo(i)}</td>
                      <td style={{ padding: '12px' }}>
                        <select value={i.estado} onChange={e => cambiarEstado(i._id, e.target.value)}
                          style={{ padding: '5px 10px', borderRadius: '8px', border: `1.5px solid ${COLORES_ESTADO[i.estado]}`, color: COLORES_ESTADO[i.estado], fontWeight: '500', fontSize: '12px', background: COLORES_ESTADO[i.estado] + '11', outline: 'none', cursor: 'pointer' }}>
                          {ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '12px', color: '#94a3b8', fontSize: '13px' }}>{new Date(i.fecha).toLocaleDateString('es-PE')}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => eliminar(i._id)} style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', padding: '5px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>
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