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
2. Navega a la carpeta del proyecto.
3. Ejecuta el siguiente comando para iniciar el servidor:
   ```bash
   node src/service/server.js
   ```
4. Luego, en otra terminal, ejecuta:
   ```bash
   npm run dev
   ```
5. Accede a la aplicación en `http://localhost:5173/` y verifica la consola del navegador para mensajes.