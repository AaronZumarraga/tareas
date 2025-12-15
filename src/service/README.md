# Service Layer
Capa que comunica entre frontend (Vue.js) y backend (Node.js).

## Estructura

```
src/service/
├── database.js          (Conexión a BD - Node.js/Backend)
├── tareas.service.ts    (Cliente HTTP - Vue.js/Frontend)
└── README.md
```

## Responsabilidades por archivo

### database.js (Backend - Node.js)
- Conecta directamente a SQL Server usando `mssql`
- Gestiona el pool de conexiones
- **Solo se ejecuta en el servidor** (nunca en el navegador)
- Exports: `connectDB()`, `getPool()`, `closePool()`

### tareas.service.ts (Frontend - Vue.js)
- Cliente HTTP que consume APIs del backend
- **Nunca accede directamente a la BD**
- Comunica vía HTTP/REST con Node.js
- Encapsula llamadas como `fetchTareas()`, `crearTarea(payload)`

## Flujo de datos

```
Vue.js Component
    ↓
tareas.service.ts (HTTP request)
    ↓
Node.js API Route
    ↓
database.js (SQL Query)
    ↓
SQL Server
```

## Buenas prácticas
- Un archivo service por dominio: `tareas.service.ts`, `auth.service.ts`, etc.
- Manejar errores y parsing de respuestas en el service
- Retornar siempre datos tipados (TypeScript interfaces)
- No formatear datos para UI en el service (eso va en helpers/composables)
- **Seguridad**: El backend valida y controla acceso a la BD

## Instrucciones para ejecutar el servidor

1. Asegúrate de tener Node.js y npm instalados.
2. **Instala las dependencias del proyecto:**
   ```bash
   cd c:\Users\AaronZumarraga\Downloads\tareas
   npm install
   ```
3. Navega a la carpeta raíz del proyecto:
   ```bash
   cd c:\Users\AaronZumarraga\Downloads\tareas
   ```
4. **Opción 1: Ejecutar manualmente en dos terminales**
   - Terminal 1 - Desde la raíz del proyecto, inicia el servidor Node.js:
     ```bash
     cd c:\Users\AaronZumarraga\Downloads\tareas
     node src/service/server.js
     ```
   - Terminal 2 - Desde la raíz del proyecto, inicia Vue.js:
     ```bash
     cd c:\Users\AaronZumarraga\Downloads\tareas
     npm run dev
     ```
5. **Opción 2: Ejecutar con un único comando desde la raíz (si está configurado)**
   ```bash
   cd c:\Users\AaronZumarraga\Downloads\tareas
   npm run serve
   ```
6. Accede a la aplicación en `http://localhost:5173/` y verifica la consola del navegador para mensajes.

## Comandos disponibles

Todos los comandos deben ejecutarse desde la **raíz del proyecto** (`c:\Users\AaronZumarraga\Downloads\tareas`):

- `npm run dev` - Inicia el servidor de desarrollo de Vue.js (puerto 5173)
- `npm run serve` - Inicia ambos servidores (Node.js + Vue.js) simultáneamente
- `node src/service/server.js` - Inicia solo el servidor Node.js (puerto 3000)

## Endpoints disponibles

- `GET http://localhost:3000/` - Estado simple del servidor (respuesta: `{ "status": "running" }`)
- `GET http://localhost:3000/api` - Información de la API (nombre, versión, uptime)
- `GET http://localhost:3000/api/health` - Estado del servidor y base de datos
- `GET http://localhost:3000/api/tareas` - Obtener todas las tareas
- `POST http://localhost:3000/api/tareas` - Crear nueva tarea

## Consideraciones para Producción

Si deseas desplegar este backend en un entorno productivo, aplica las siguientes mejoras:

1. **Variables de Entorno (.env)**
   - Nunca dejes credenciales en el código (`constants.js`).
   - Usa la librería `dotenv` para cargar secretos (`DB_PASSWORD`, `JWT_SECRET`) desde el sistema.

2. **Seguridad**
   - **Tokens**: Reemplaza el almacenamiento en memoria (`Map`) por **JWT (JSON Web Tokens)** firmados con librería `jsonwebtoken`. Esto permite que el servidor escale horizontalmente.
   - **Headers**: Implementa `helmet` para proteger contra vulnerabilidades web comunes.
   - **Rate Limiting**: Usa `express-rate-limit` para evitar ataques de fuerza bruta o DoS.
   - **CORS**: Restringe los orígenes permitidos a tu dominio real, no uses `*`.

3. **Base de Datos**
   - El driver actual asume autenticación de Windows local. En producción, usa autenticación SQL (usuario/password) si la BD está en otro servidor.

4. **Logging y Monitoreo**
   - Reemplaza `console.log` por librerías como `winston` o `pino` para logs estructurados.
   - Usa **PM2** o **Docker** para gestionar el proceso de Node.js y asegurar que se reinicie si falla.