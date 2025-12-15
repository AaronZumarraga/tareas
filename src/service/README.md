# Service Layer
Capa que comunica entre frontend (Vue.js) y backend (Node.js).

## Estructura

```
src/service/
├── auth.js              (Lógica de seguridad: hashing y tokens)
├── constants.js         (Configuración y constantes globales)
├── database.js          (Conexión a BD - Singleton)
├── repository.js        (Capa de acceso a datos - SQL Queries)
├── server.js            (Entry point: Express App y Rutas)
└── README.md
```

## Responsabilidades por archivo

### server.js
- Punto de entrada del servidor backend.
- Configura Express, CORS y Middlewares (Logging, Error Handling).
- Define las rutas de la API (`/api/...`).
- Orquesta la respuesta HTTP usando los repositorios.

### repository.js
- **Data Access Object (DAO)**: Contiene toda la lógica SQL.
- `UserRepository`: Consultas relacionadas con usuarios.
- `TaskRepository`: CRUD de tareas.
- Separa la lógica de base de datos de la lógica de rutas.

### auth.js
- Manejo de contraseñas (hashing con `crypto.pbkdf2`).
- Gestión de tokens (generación, validación e invalidación).
- Middleware de protección de rutas (`validateTokenMiddleware`).

### database.js
- Conecta a SQL Server usando `mssql/msnodesqlv8`.
- Implementa patrón **Singleton** para el pool de conexiones.

### constants.js
- Centraliza configuraciones (DB, Hashing, Tokens).
- Define códigos de estado HTTP y valores por defecto.

## Flujo de datos

```
Vue.js Component
    ↓
HTTP Request (Fetch/Axios)
    ↓
server.js (Express Route + Auth Middleware)
    ↓
repository.js (SQL Logic)
    ↓
database.js (Connection Pool)
    ↓
SQL Server
```

## Instrucciones para ejecutar el servidor

1. Asegúrate de tener Node.js y npm instalados.
2. **Instala las dependencias del proyecto:**
   ```bash
   cd c:\Users\AaronZumarraga\Downloads\tareas
   npm install
   ```
3. **Ejecutar el servidor backend:**
   ```bash
   node src/service/server.js
   ```
   El servidor iniciará en el puerto 3000.

## Endpoints disponibles

### Públicos
- `GET /api/health` - Estado del servidor y conexión a BD.
- `POST /api/auth/register` - Registro de nuevos usuarios.
- `POST /api/auth/login` - Inicio de sesión (retorna token).

### Protegidos (Requieren Header `Authorization: Bearer <token>`)
- `POST /api/auth/logout` - Cerrar sesión (invalida token).
- `GET /api/auth/verify` - Verificar validez del token actual.
- `GET /api/tareas` - Obtener tareas del usuario autenticado.
- `POST /api/tareas` - Crear nueva tarea.
- `PUT /api/tareas/:id` - Actualizar tarea existente.
- `DELETE /api/tareas/:id` - Eliminar tarea.

## Consideraciones para Producción

Si deseas desplegar este backend en un entorno productivo, aplica las siguientes mejoras:

1. **Variables de Entorno (.env)**
   - Nunca dejes credenciales en el código (`constants.js`).
   - Usa la librería `dotenv` para cargar secretos (`DB_PASSWORD`, `JWT_SECRET`) desde el sistema.

2. **Seguridad**
   - **Tokens**: Actualmente se usa un almacenamiento en memoria (`Map`) y tokens base64 simples. Migrar a **JWT (JSON Web Tokens)** estándar con librería `jsonwebtoken` para statelessness.
   - **Headers**: Implementa `helmet`.
   - **Rate Limiting**: Usa `express-rate-limit`.

3. **Base de Datos**
   - El driver actual asume autenticación de Windows local (`msnodesqlv8`). En producción, usa autenticación SQL (usuario/password) si la BD está en otro servidor.

4. **Logging**
   - Reemplaza `console.log` por librerías como `winston` o `pino`.