const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err));

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['ciudadano', 'admin'], default: 'ciudadano' }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

const incidenciaSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  descripcion: { type: String, required: true },
  ubicacion: { type: String, required: true },
  estado: { type: String, default: 'pendiente' },
  archivo: { type: String, default: null },
  tipoArchivo: { type: String, default: null },
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fecha: { type: Date, default: Date.now }
});

const Incidencia = mongoose.model('Incidencia', incidenciaSchema);

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
    next();
  } catch {
    res.status(401).json({ error: 'Token invalido' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') return res.status(403).json({ error: 'Acceso solo para administradores' });
  next();
};

// Registro
app.post('/api/auth/registro', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ error: 'El email ya esta registrado' });
    const hash = await bcrypt.hash(password, 10);
    const usuario = new Usuario({ nombre, email, password: hash, rol: rol || 'ciudadano' });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ error: 'Credenciales incorrectas' });
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(400).json({ error: 'Credenciales incorrectas' });
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '8h' }
    );
    res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener incidencias - ciudadano ve las suyas, admin ve todas
app.get('/api/incidencias', verificarToken, async (req, res) => {
  const filtro = req.usuario.rol === 'admin' ? {} : { usuario: req.usuario.id };
  const incidencias = await Incidencia.find(filtro).sort({ fecha: -1 });
  res.json(incidencias);
});

// Crear incidencia
app.post('/api/incidencias', verificarToken, upload.single('archivo'), async (req, res) => {
  try {
    const data = {
      tipo: req.body.tipo,
      descripcion: req.body.descripcion,
      ubicacion: req.body.ubicacion,
      usuario: req.usuario.id
    };
    if (req.file) {
      data.archivo = req.file.filename;
      data.tipoArchivo = req.file.mimetype.split('/')[0];
    }
    const incidencia = new Incidencia(data);
    await incidencia.save();
    res.status(201).json(incidencia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar estado - solo admin
app.put('/api/incidencias/:id', verificarToken, soloAdmin, async (req, res) => {
  const incidencia = await Incidencia.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(incidencia);
});

// Eliminar - solo admin
app.delete('/api/incidencias/:id', verificarToken, soloAdmin, async (req, res) => {
  await Incidencia.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Incidencia eliminada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Servidor en http://localhost:' + PORT));