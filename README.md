# Sistema de Gestion de Incidencias Ciudadanas
Aplicacion web para reportar y gestionar incidencias en la via publica (baches, alumbrado, basura, seguridad, emergencia). Cuenta con autenticacion de usuarios, panel de ciudadano y panel de administrador.

## Tecnologias
- Backend: Node.js + Express + Mongoose + JWT + Bcrypt + Multer
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

## Credenciales de prueba

### Administrador
- Email: admin@municipalidad.com
- Password: admin123

### Ciudadano
- Registrarse desde la pantalla de login

## Roles del sistema

### Ciudadano
- Puede registrarse e iniciar sesion
- Puede reportar incidencias con evidencia (imagen, video, audio)
- Solo puede ver sus propias incidencias
- Puede ver el estado actualizado de sus reportes

### Administrador
- Puede ver todas las incidencias de todos los ciudadanos
- Puede cambiar el estado de cada incidencia (pendiente, en proceso, resuelto)
- Puede eliminar incidencias
- Tiene acceso al panel con estadisticas en tiempo real

## Historias de Usuario

### HU-01: Reportar Incidencia
Como ciudadano quiero reportar una incidencia en la via publica para que las autoridades puedan atenderla.

Criterios de aceptacion:
- El ciudadano puede registrarse e iniciar sesion en el sistema
- El ciudadano puede seleccionar el tipo de incidencia (bache, alumbrado, basura, seguridad, emergencia)
- El ciudadano puede ingresar una descripcion y ubicacion detallada
- El ciudadano puede adjuntar una imagen, video o audio como evidencia
- La incidencia queda registrada con estado pendiente y asociada a su cuenta

### HU-02: Gestionar Estado de Incidencia
Como administrador quiero actualizar el estado de una incidencia para informar el progreso de atencion al ciudadano.

Criterios de aceptacion:
- El administrador inicia sesion con credenciales de administrador
- El administrador puede ver todas las incidencias de todos los ciudadanos
- El administrador puede cambiar el estado entre pendiente, en proceso y resuelto
- El cambio se refleja en tiempo real en el panel y en la vista del ciudadano
- La informacion se actualiza en la base de datos MongoDB Atlas

### HU-03: Consultar Estado de mis Reportes
Como ciudadano quiero ver el estado de mis incidencias reportadas para saber si fueron atendidas.

Criterios de aceptacion:
- El ciudadano puede iniciar sesion y ver solo sus incidencias
- Se muestra el estado actual de cada incidencia con colores diferenciados
- El ciudadano puede ver la evidencia que adjunto en cada reporte
- Se muestran todos los detalles: tipo, descripcion, ubicacion, estado y fecha

## Modelo GaFlow

### Escenario: Reporte y Atencion de Incidencia Ciudadana

Ciudadano --> [Login/Registro] --> JWT Token
                                      |
                              [Formulario de Reporte]
                                      |
                              POST /api/incidencias --> MongoDB (coleccion incidencias)
                                      |
                              Guarda archivo en /uploads
                                      |
Administrador --> [Login Admin] --> JWT Token (rol admin)
                                      |
                              GET /api/incidencias --> Todas las incidencias
                                      |
                              PUT /api/incidencias/:id --> Actualiza estado
                                      |
Ciudadano --> [Mis Incidencias] --> Ve estado actualizado
                                      |
                         Fastify /workflow/resumen --> Resumen estadistico

### Flujo del sistema
1. El ciudadano accede al sistema en http://localhost:5173
2. Se registra o inicia sesion con su cuenta
3. Llena el formulario con tipo, descripcion, ubicacion y evidencia
4. El frontend envia los datos con el token JWT al backend en http://localhost:5000
5. El backend valida el token, guarda la incidencia en MongoDB Atlas y el archivo en /uploads
6. El administrador inicia sesion y ve todas las incidencias en su panel
7. El administrador cambia el estado segun la atencion
8. El ciudadano puede ver el estado actualizado al ingresar a su panel
9. Fastify en http://localhost:5001 provee estadisticas del workflow en tiempo real

## Casos de Prueba

### CP-01: Registro de ciudadano
- Entrada: nombre=Juan Perez, email=juan@test.com, password=123456
- Esperado: Usuario creado, redirige al login
- Resultado: Correcto

### CP-02: Login de ciudadano
- Entrada: email=juan@test.com, password=123456
- Esperado: Accede al panel de ciudadano con sus incidencias
- Resultado: Correcto

### CP-03: Login de administrador
- Entrada: email=admin@municipalidad.com, password=admin123
- Esperado: Accede al panel de administrador con todas las incidencias
- Resultado: Correcto

### CP-04: Crear incidencia con imagen
- Entrada: tipo=bache, descripcion=Bache en avenida, ubicacion=Av. Principal, archivo=foto.jpg
- Esperado: La incidencia aparece en la lista con la imagen visible
- Resultado: Correcto

### CP-05: Crear incidencia sin archivo
- Entrada: tipo=basura, descripcion=Basura acumulada, ubicacion=Calle 5
- Esperado: La incidencia aparece con Sin evidencia
- Resultado: Correcto

### CP-06: Cambiar estado de incidencia
- Entrada: Administrador selecciona en proceso en el dropdown de una incidencia
- Esperado: El estado se actualiza en MongoDB y el ciudadano lo ve en su panel
- Resultado: Correcto

### CP-07: Eliminar incidencia
- Entrada: Administrador hace clic en boton Eliminar
- Esperado: La incidencia desaparece de la lista y de MongoDB
- Resultado: Correcto

### CP-08: Consultar resumen workflow
- Entrada: GET http://localhost:5001/workflow/resumen
- Esperado: JSON con conteo de incidencias por estado
- Resultado: Correcto

### CP-09: Ciudadano no puede ver incidencias de otros
- Entrada: Ciudadano inicia sesion y va a Mis Incidencias
- Esperado: Solo ve sus propias incidencias
- Resultado: Correcto

### CP-10: Ciudadano no puede cambiar estado
- Entrada: Ciudadano intenta hacer PUT /api/incidencias/:id
- Esperado: El servidor responde con error 403 Acceso solo para administradores
- Resultado: Correcto

## API Endpoints

| Metodo | Ruta | Descripcion | Acceso |
|--------|------|-------------|--------|
| POST | /api/auth/registro | Registrar nuevo ciudadano | Publico |
| POST | /api/auth/login | Iniciar sesion | Publico |
| GET | /api/incidencias | Obtener incidencias | Autenticado |
| POST | /api/incidencias | Crear nueva incidencia con archivo | Autenticado |
| PUT | /api/incidencias/:id | Actualizar estado | Solo Admin |
| DELETE | /api/incidencias/:id | Eliminar incidencia | Solo Admin |
| GET | /workflow/resumen | Resumen por estado | Publico (Fastify) |
| GET | /workflow/por-tipo | Resumen por tipo | Publico (Fastify) |

## Repositorio
https://github.com/sammyboy100/ParcialDesarrolloOrtegaMoranErick
