import { useState, useEffect } from 'react'

function App() {
  const [productos, setProductos] = useState([])
  const [nombre, setNombre] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [precio, setPrecio] = useState('')

  const API = 'http://localhost:5000/api/productos'

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    const res = await fetch(API)
    const data = await res.json()
    setProductos(data)
  }

  const agregar = async () => {
    if (!nombre || !cantidad || !precio) return
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, cantidad: Number(cantidad), precio: Number(precio) })
    })
    setNombre('')
    setCantidad('')
    setPrecio('')
    fetchProductos()
  }

  const eliminar = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    fetchProductos()
  }

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'Arial' }}>
      <h1>🏭 Bodega</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        <input placeholder="Cantidad" type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} />
        <input placeholder="Precio" type="number" value={precio} onChange={e => setPrecio(e.target.value)} />
        <button onClick={agregar}>Agregar</button>
      </div>

      <table width="100%" border="1" cellPadding="8" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p._id}>
              <td>{p.nombre}</td>
              <td>{p.cantidad}</td>
              <td>${p.precio}</td>
              <td><button onClick={() => eliminar(p._id)}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App