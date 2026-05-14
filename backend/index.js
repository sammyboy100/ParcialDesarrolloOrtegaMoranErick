const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar:', err));

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true }
});

const Producto = mongoose.model('Producto', productoSchema);

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  const productos = await Producto.find();
  res.json(productos);
});

// Agregar producto
app.post('/api/productos', async (req, res) => {
  const producto = new Producto(req.body);
  await producto.save();
  res.status(201).json(producto);
});

// Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  await Producto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Producto eliminado' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));