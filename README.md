# Sistema de Incidencias Ciudadanas
Aplicacion web para reportar y gestionar incidencias en la via publica (baches, alumbrado, basura, seguridad, emergencia).

## Tecnologias
- Backend: Node.js + Express + Mongoose
- Servidor Workflow: Fastify
- Frontend: React + Vite
- Base de datos: MongoDB Atlas

## Instalacion

### Backend
cd backend
npm install
npm start

### Fastify (Workflow)
cd backend
node fastify.js

### Frontend
cd frontend
npm install
npm run dev

## Historias de Usuario

### HU-01: Reportar Incidencia
Como ciudadano quiero reportar una incidencia en la via publica para que las autoridades puedan atenderla.

Criterios de aceptacion:
- El ciudadano puede seleccionar el tipo de incidencia (bache, alumbrado, basura, seguridad, emergencia)
- El ciudadano puede ingresar una descripcion y ubicacion
- El ciudadano puede adjuntar una imagen, video o audio como evidencia
- La incidencia queda registrada con estado pendiente

### HU-02: Gestionar Estado de Incidencia
Como administrador quiero actualizar el estado de una incidencia para informar el progreso de atencion al ciudadano.

Criterios de aceptacion:
- El administrador puede cambiar el estado entre pendiente, en proceso y resuelto
- El cambio se refleja en tiempo real en la lista de incidencias
- La informacion se actualiza en la base de datos MongoDB

### HU-03: Consultar Incidencias
Como administrador quiero ver todas las incidencias registradas para priorizar y asignar recursos de atencion.

Criterios de aceptacion:
- Se muestran todas las incidencias con tipo, descripcion, ubicacion, evidencia, estado y fecha
- Se puede ver el resumen por estado en http://localhost:5001/workflow/resumen
- Se puede ver el resumen por tipo en http://localhost:5001/workflow/por-tipo

## Modelo GaFlow

### Escenario: Reporte y Atencion de Bache

Ciudadano --> [Formulario] --> POST /api/incidencias --> MongoDB
                                      |
                              Guarda archivo en /uploads
                                      |
Administrador --> [Lista] --> GET /api/incidencias --> Muestra incidencias
                                      |
                              PUT /api/incidencias/:id --> Actualiza estado
                                      |
                         Fastify /workflow/resumen --> Resumen estadistico

### Flujo del sistema
1. El ciudadano accede al sistema en http://localhost:5173
2. Llena el formulario con tipo, descripcion, ubicacion y evidencia
3. El frontend envia los datos al backend Express en http://localhost:5000
4. El backend guarda la incidencia en MongoDB Atlas
5. El administrador revisa la lista y cambia el estado
6. Fastify en http://localhost:5001 provee estadisticas del workflow

## Casos de Prueba

### CP-01: Crear incidencia con imagen
- Entrada: tipo=bache, descripcion=Bache en avenida, ubicacion=Av. Principal, archivo=foto.jpg
- Esperado: La incidencia aparece en la lista con la imagen visible
- Resultado: Correcto

### CP-02: Crear incidencia sin archivo
- Entrada: tipo=basura, descripcion=Basura acumulada, ubicacion=Calle 5
- Esperado: La incidencia aparece con Sin archivo
- Resultado: Correcto

### CP-03: Cambiar estado de incidencia
- Entrada: Seleccionar en proceso en el dropdown de una incidencia
- Esperado: El estado se actualiza en MongoDB
- Resultado: Correcto

### CP-04: Eliminar incidencia
- Entrada: Clic en boton Eliminar de una incidencia
- Esperado: La incidencia desaparece de la lista y de MongoDB
- Resultado: Correcto

### CP-05: Consultar resumen workflow
- Entrada: GET http://localhost:5001/workflow/resumen
- Esperado: JSON con conteo de incidencias por estado
- Resultado: Correcto

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | /api/incidencias | Obtener todas las incidencias |
| POST | /api/incidencias | Crear nueva incidencia (soporta archivos) |
| PUT | /api/incidencias/:id | Actualizar estado de incidencia |
| DELETE | /api/incidencias/:id | Eliminar incidencia |
| GET | /workflow/resumen | Resumen por estado (Fastify) |
| GET | /workflow/por-tipo | Resumen por tipo (Fastify) |

## Repositorio
https://github.com/sammyboy100/ParcialDesarrolloOrtegaMoranErick
