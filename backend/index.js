const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Carpeta para archivos subidos
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use('/uploads', express.static(uploadsDir));

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|avi|mov|mp3|wav|ogg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    ext ? cb(null, true) : cb(new Error('Tipo de archivo no permitido'));
  }
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar:', err));

const incidenciaSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  descripcion: { type: String, required: true },
  ubicacion: { type: String, required: true },
  estado: { type: String, default: 'pendiente' },
  archivo: { type: String, default: null },
  tipoArchivo: { type: String, default: null },
  fecha: { type: Date, default: Date.now }
});

const Incidencia = mongoose.model('Incidencia', incidenciaSchema);

// Obtener todas las incidencias
app.get('/api/incidencias', async (req, res) => {
  const incidencias = await Incidencia.find().sort({ fecha: -1 });
  res.json(incidencias);
});

// Crear incidencia con archivo
app.post('/api/incidencias', upload.single('archivo'), async (req, res) => {
  try {
    const data = {
      tipo: req.body.tipo,
      descripcion: req.body.descripcion,
      ubicacion: req.body.ubicacion,
    };
    if (req.file) {
      data.archivo = req.file.filename;
      data.tipoArchivo = req.file.mimetype.split('/')[0]; // image, video, audio
    }
    const incidencia = new Incidencia(data);
    await incidencia.save();
    res.status(201).json(incidencia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar estado
app.put('/api/incidencias/:id', async (req, res) => {
  const incidencia = await Incidencia.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(incidencia);
});

// Eliminar incidencia
app.delete('/api/incidencias/:id', async (req, res) => {
  await Incidencia.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Incidencia eliminada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Servidor en http://localhost:${PORT}`));