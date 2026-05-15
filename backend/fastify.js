const fastify = require('fastify')({ logger: false });
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const incidenciaSchema = new mongoose.Schema({
  tipo: String,
  descripcion: String,
  ubicacion: String,
  estado: { type: String, default: 'pendiente' },
  archivo: { type: String, default: null },
  tipoArchivo: { type: String, default: null },
  fecha: { type: Date, default: Date.now }
});

const Incidencia = mongoose.models.Incidencia || mongoose.model('Incidencia', incidenciaSchema);

// Workflow: obtener resumen de incidencias por estado
fastify.get('/workflow/resumen', async (req, reply) => {
  const pendientes = await Incidencia.countDocuments({ estado: 'pendiente' });
  const enProceso = await Incidencia.countDocuments({ estado: 'en proceso' });
  const resueltos = await Incidencia.countDocuments({ estado: 'resuelto' });
  return { pendientes, enProceso, resueltos, total: pendientes + enProceso + resueltos };
});

// Workflow: obtener incidencias por tipo
fastify.get('/workflow/por-tipo', async (req, reply) => {
  const tipos = ['bache', 'alumbrado', 'basura', 'seguridad', 'emergencia'];
  const resultado = {};
  for (const tipo of tipos) {
    resultado[tipo] = await Incidencia.countDocuments({ tipo });
  }
  return resultado;
});

const start = async () => {
  try {
    await fastify.listen({ port: 5001, host: '0.0.0.0' });
    console.log('Servidor Fastify corriendo en http://localhost:5001');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();