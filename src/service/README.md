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

- `GET http://localhost:3000/api` - Información de la API
- `GET http://localhost:3000/api/health` - Estado del servidor
- `GET http://localhost:3000/api/tareas` - Obtener todas las tareas
- `POST http://localhost:3000/api/tareas` - Crear nueva tarea