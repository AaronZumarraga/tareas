# Src - Estructura del Proyecto

Este directorio contiene el código fuente principal de la aplicación de gestión de tareas construida con **Vue 3 + TypeScript**, conectada a un backend **Node.js/Express** y base de datos **SQL Server**.

## 🎯 Descripción del Proyecto

TaskManager es un sistema full-stack CRUD para administrar tareas con las siguientes características:

- ✅ **Gestión de tareas**: Crear, editar, completar y eliminar
- 📊 **Estadísticas en tiempo real**: Total, activas, completadas
- 🔍 **Filtrado avanzado**: Por estado (Todas, Activas, Completadas)
- 🎨 **Prioridades visuales**: Baja (verde), Media (amarilla), Alta (naranja), Urgente (roja)
- 👤 **Autenticación segura**: Registro/Login con hash de contraseñas (PBKDF2)
- 🎨 **UI moderna**: Diseño glassmorphism con animaciones fluidas
- 📱 **Responsive**: Mobile-first design

## 🏗️ Arquitectura

```
┌─────────────────┐      HTTP/REST      ┌──────────────┐      SQL      ┌──────────────┐
│   Frontend      │ ←─────────────────→ │   Backend    │ ←────────────→│  SQL Server  │
│   Vue 3 + TS    │   localhost:3000    │  Express.js  │               │   Database   │
│   Vite (5173)   │                     │  Node.js     │               │              │
└─────────────────┘                     └──────────────┘               └──────────────┘
```

## 📁 Estructura de Carpetas

```
src/
├── assets/          # Recursos estáticos (imágenes, iconos, fuentes)
├── components/      # Componentes reutilizables de UI
├── composables/     # Lógica reactiva (Composition API) - PENDIENTE
├── helpers/         # Funciones puras sin dependencia de Vue - PENDIENTE
├── router/          # Configuración de rutas (Vue Router)
├── service/         # Backend + Cliente HTTP
│   ├── server.js           # Servidor Express (API REST)
│   ├── database.js         # Conexión SQL Server
│   └── tareas.service.ts   # Cliente HTTP (fetch)
├── sql scripts/     # Scripts de base de datos
│   ├── sql1.sql           # Creación de tablas
│   ├── sql2.sql           # Datos de prueba
│   └── sql3.sql           # Consultas útiles
├── store/           # Estado global (Pinia) - PENDIENTE
└── views/           # Páginas completas conectadas al router
    ├── Inicio.vue         # Landing page
    ├── Tareas.vue         # CRUD principal
    ├── IniciarSesion.vue  # Auth (Login/Registro)
    └── AcercaDe.vue       # Información del proyecto
```

## 🎨 Assets
**Propósito**: Recursos estáticos usados en la interfaz.

**Contenido típico**:
- Imágenes (logos, ilustraciones)
- Iconos (SVG o conjuntos externos)
- Fuentes personalizadas (webfonts)
- Estilos estéticos puntuales (gradientes, patterns)

**Convenciones**:
- Nombres descriptivos: `logo.svg`, `hero-bg.png`
- Agrupar por tipo: `images/`, `icons/`, `fonts/`
- Optimizar imágenes (peso y formato moderno)

## 🧩 Components (Componentes Reutilizables)

### Componentes de Tareas
- **`TaskInput.vue`**: Formulario para crear nuevas tareas
  - Input de título + descripción
  - Selector de prioridad (Baja/Media/Alta/Urgente)
  - Fecha de vencimiento opcional
  
- **`TaskItem.vue`**: Tarjeta individual de tarea (editable)
  - Checkbox para marcar como completada
  - Edición inline de título/descripción
  - Selector de estado (Pendiente/En Progreso/Completada/Cancelada)
  - Indicador visual de prioridad (colores)
  - Botón de eliminar con confirmación

- **`TasksStats.vue`**: Panel de estadísticas
  - Total de tareas
  - Tareas activas (no completadas)
  - Tareas completadas
  - Actualización reactiva automática

- **`TasksFilters.vue`**: Barra de filtros
  - Botones: Todas / Activas / Completadas
  - Highlight del filtro activo

### Componentes Base (Reutilizables)
- **`GlassCard.vue`**: Contenedor con efecto glassmorphism
  - Backdrop blur
  - Fondo semi-transparente
  - Bordes suaves

- **`BaseButton.vue`**: Botón estilizado
  - Variantes: primary, secondary, danger
  - Estados: normal, hover, disabled
  - Soporte para iconos

- **`FormInput.vue`**: Input de formulario
  - Label + placeholder
  - Validación visual
  - Tipos: text, email, password, date, number

- **`PageTitle.vue`**: Título de página consistente
  - Tipografía unificada
  - Animaciones de entrada

- **`AuthForm.vue`**: Formulario de autenticación
  - Modo Login / Registro intercambiable
  - Validación de campos
  - Confirmación de contraseña
  - Mensajes de error

## 🔧 Composables (PENDIENTE)
**Propósito**: Funciones reutilizables que encapsulan lógica reactiva (Composition API).

**Ejemplos planeados**:
- `useTareas()` - Cargar, filtrar, agregar tareas con estado reactivo
- `useAuth()` - Estado de autenticación (usuario actual, logout)
- `useModal()` - Control de modales (abrir/cerrar)
- `useDebounce()` - Valor con retardo para búsquedas

**Buenas prácticas**:
- Prefijo `use`
- Retornar solo lo necesario (estado + métodos)
- Mantenerlos agnósticos de vistas específicas

**Migración recomendada**: Extraer lógica de `Tareas.vue` a `useTareas()`

## 🛠️ Helpers (PENDIENTE)
**Propósito**: Funciones puras sin dependencia de Vue. Reutilizables en varios lugares.

**Funciones útiles para crear**:
- `formatFecha(fecha: Date): string` - "15 Dic 2025"
- `mapearEstadoTarea(id: number): string` - ID → "Completada"
- `calcularProgreso(tareas: Tarea[]): number` - % de completadas
- `getPrioridadColor(nivel: number): string` - Nivel → Color hex
- `getIconoPrioridad(nivel: number): string` - Nivel → Emoji

**Buenas prácticas**:
- Sin efectos secundarios (funciones puras)
- Tipar parámetros y retornos (TypeScript)
- Agrupar por temática (`fecha.ts`, `tareas.ts`, `colores.ts`)

## 🗺️ Router
**Propósito**: Configuración de rutas (Vue Router).

**Archivo principal**: `index.ts` - Define `createRouter`, historial HTML5 y rutas.

### Rutas Configuradas

| Path | Nombre | Vista | Descripción |
|------|--------|-------|-------------|
| `/` | `inicio` | `Inicio.vue` | Landing page de bienvenida |
| `/tareas` | `tareas` | `Tareas.vue` | CRUD principal de tareas |
| `/acerca-de` | `acerca-de` | `AcercaDe.vue` | Información del proyecto |
| `/iniciar-sesion` | `iniciar-sesion` | `IniciarSesion.vue` | Login/Registro |

**Ejemplo de navegación**:
```typescript
// Por nombre de ruta
router.push({ name: 'tareas' })

// Por path con parámetros
router.push('/iniciar-sesion')

// Desde template
<router-link :to="{ name: 'tareas' }">Ir a Tareas</router-link>
```

**Buenas prácticas**:
- Lazy load para vistas grandes: `component: () => import('./views/Tareas.vue')`
- Nombrar cada ruta (`name`) para navegación tipo-segura
- **Próxima mejora**: Guard de autenticación para proteger `/tareas`

## 🌐 Service (Backend + Cliente HTTP)

### Backend - `server.js` (Express.js)

**Puerto**: 3000  
**Middlewares**: `express.json()`, `cors()`

#### Endpoints de Autenticación
```javascript
POST /api/auth/register
Body: { nombre, apellido, email, password }
Response: { success: true, usuario: {...} }

POST /api/auth/login
Body: { email, password }
Response: { success: true, usuario: {...} }
```

#### Endpoints de Tareas
```javascript
GET /api/tareas
Query: ?usuarioId=1
Response: Tarea[] con joins de estados/prioridades

POST /api/tareas
Body: { titulo, descripcion, usuarioId, estadoId, prioridadId, fechaVencimiento }
Response: { id, ...nuevaTarea }

PUT /api/tareas/:id
Body: { titulo?, descripcion?, estadoId?, prioridadId?, completed? }
Response: { success: true }

DELETE /api/tareas/:id
Response: { success: true }
```

**Seguridad**:
- Contraseñas hasheadas con `crypto.pbkdf2Sync` (100,000 iteraciones)
- Salt único por usuario (32 bytes)
- Timing-safe comparison para prevenir timing attacks

### Base de Datos - `database.js`

**Conexión**: SQL Server con `mssql`
```javascript
{
  server: 'DESKTOP-AV5HJMJ\\SQLEXPRESS',
  database: 'TasksDB',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
}
```

**Pool de conexiones**: Máximo 10, mínimo 0

### Cliente HTTP - `tareas.service.ts`

**Base URL**: `http://localhost:3000/api`

#### Interfaces TypeScript
```typescript
interface Tarea {
  id: number
  titulo: string
  descripcion: string
  usuarioId: number
  estadoId: number
  nombreEstado?: string
  prioridadId: number
  nombrePrioridad?: string
  completed: boolean
  fechaCreacion: string
  fechaVencimiento?: string
  fechaCompletacion?: string
}

interface Usuario {
  id: number
  nombre: string
  apellido: string
  email: string
  fechaCreacion: string
}
```

#### Funciones Exportadas
```typescript
// Tareas
fetchTareas(usuarioId: number): Promise<Tarea[]>
crearTarea(data: Partial<Tarea>): Promise<Tarea>
updateTarea(id: number, data: Partial<Tarea>): Promise<void>
eliminarTarea(id: number): Promise<void>

// Autenticación
login(email: string, password: string): Promise<Usuario>
register(data: RegisterData): Promise<Usuario>
```

**Manejo de errores**: Todos los métodos lanzan excepciones con mensajes descriptivos

## 📦 Store (Estado Global - PENDIENTE)
**Propósito**: Estado global compartido con Pinia (recomendado para Vue 3).

**Uso planeado**:
- **Auth Store**: Usuario actual, token, estado de sesión
  ```typescript
  const authStore = useAuthStore()
  authStore.currentUser // Usuario logueado
  authStore.isAuthenticated // boolean
  authStore.logout() // Método para cerrar sesión
  ```

- **Preferencias Store**: Tema (claro/oscuro), idioma
  ```typescript
  const prefsStore = usePreferencesStore()
  prefsStore.theme // 'light' | 'dark'
  prefsStore.toggleTheme()
  ```

**Buenas prácticas**:
- Evitar sobrecargar el store (localStorage para datos simples)
- Usar getters para estados derivados (ej: `fullName` desde `nombre + apellido`)
- Acciones asíncronas llaman a servicios y actualizan estado

**Estado actual**: Se usa `localStorage` directamente en componentes. **Refactorizar a Pinia es recomendado**.

## 📄 Views (Páginas Principales)

### `Inicio.vue` - Landing Page
- Hero section con título animado
- Descripción de funcionalidades
- Botón CTA → `/tareas`
- Diseño glassmorphism

### `Tareas.vue` - CRUD Principal ⭐
**Componentes usados**:
- `<PageTitle>` - "Mis Tareas"
- `<TasksStats>` - Estadísticas (total, activas, completadas)
- `<TaskInput>` - Formulario crear tarea
- `<TasksFilters>` - Filtros (todas/activas/completadas)
- `<TaskItem>` - Lista de tareas (v-for)

**Estado reactivo**:
```typescript
const tareas = ref<Tarea[]>([])
const filtroActivo = ref<'todas' | 'activas' | 'completadas'>('todas')
const usuario = ref<Usuario | null>(null)

const tareasFiltradas = computed(() => {
  // Lógica de filtrado
})
```

**Funciones principales**:
- `cargarTareas()` - Fetch inicial desde API
- `agregarTarea(nuevaTarea)` - POST + actualizar lista
- `actualizarTarea(id, cambios)` - PUT + re-fetch
- `eliminarTareaLocal(id)` - DELETE + filtrar array

**Ciclo de vida**:
```typescript
onMounted(async () => {
  usuario.value = JSON.parse(localStorage.getItem('usuario'))
  if (usuario.value) {
    await cargarTareas()
  }
})
```

### `IniciarSesion.vue` - Autenticación
**Modos**: Login / Registro (toggle)

**Formulario Login**:
- Email (requerido)
- Contraseña (requerido)

**Formulario Registro**:
- Nombre + Apellido
- Email (validación formato)
- Contraseña (mínimo 6 caracteres)
- Confirmar contraseña (debe coincidir)

**Flujo exitoso**:
1. Llamada a `login()` o `register()`
2. Guardar usuario en `localStorage`
3. Redireccionar a `/tareas` con `router.push()`

### `AcercaDe.vue` - Información
- Stack tecnológico (Vue, Express, SQL Server)
- Funcionalidades principales
- Autor y fecha
- Links útiles

## 🗄️ Base de Datos (SQL Scripts)

### `sql1.sql` - Creación de Esquema

**Tablas**:
```sql
Estados (id, nombre)
├─ 1: Pendiente
├─ 2: En Progreso
├─ 3: Completada
└─ 4: Cancelada

Prioridades (id, nombre, nivel)
├─ 1: Baja (1)
├─ 2: Media (2)
├─ 3: Alta (3)
└─ 4: Urgente (4)

Usuarios (id, nombre, apellido, email UNIQUE, password, salt, fechaCreacion, activo)

Tareas (id, titulo, descripcion, usuarioId FK, estadoId FK, prioridadId FK,
        completed BIT, fechaCreacion, fechaVencimiento, fechaCompletacion)
```

**Índices**:
- `IDX_Tareas_Usuario` en `usuarioId`
- `IDX_Tareas_Estado` en `estadoId`

### `sql2.sql` - Datos de Prueba
- Usuario demo: `demo@example.com` (password hasheada)
- 5 tareas de ejemplo con diferentes estados/prioridades

### `sql3.sql` - Consultas Útiles
- SELECT de tareas con JOINs
- Estadísticas por usuario
- Tareas próximas a vencer

## 🎯 Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────────┐
│ USUARIO INTERACTÚA CON UI                                       │
└────────────────┬────────────────────────────────────────────────┘
                 ▼
        ┌────────────────┐
        │ Views          │ Tareas.vue, IniciarSesion.vue
        │ (Orchestration)│ - Maneja eventos de usuario
        └────────┬───────┘ - Actualiza estado local (ref/reactive)
                 │
                 ▼
        ┌────────────────┐
        │ Composables    │ (FUTURO) useTareas(), useAuth()
        │ (Lógica React.)│ - Estado compartido
        └────────┬───────┘ - Lógica de negocio
                 │
                 ▼
        ┌────────────────┐
        │ Services       │ tareas.service.ts
        │ (HTTP Client)  │ - fetchTareas(), crearTarea()
        └────────┬───────┘ - Tipado TypeScript
                 │
                 │ HTTP/REST
                 ▼
        ┌────────────────┐
        │ Backend        │ server.js (Express)
        │ (API REST)     │ - Validación de datos
        └────────┬───────┘ - Seguridad (hash passwords)
                 │
                 ▼
        ┌────────────────┐
        │ Database Layer │ database.js
        │ (SQL Queries)  │ - Pool de conexiones
        └────────┬───────┘ - Prepared statements
                 │
                 ▼
        ┌────────────────┐
        │ SQL Server     │ TasksDB
        │ (Persistence)  │ - Tablas relacionales
        └────────────────┘ - Integridad referencial

        ┌────────────────┐
        │ Helpers        │ (FUTURO) formatFecha(), getPriorityColor()
        │ (Pure Funcs)   │ - Sin efectos secundarios
        └────────────────┘ - Usadas en múltiples capas

        ┌────────────────┐
        │ Store (Pinia)  │ (FUTURO) authStore, preferencesStore
        │ (Global State) │ - Estado compartido entre vistas
        └────────────────┘ - Persistencia con plugins
```

### Ejemplo Práctico: Crear Tarea

```
1. Usuario escribe en <TaskInput> y presiona "Agregar"
2. Tareas.vue llama a agregarTarea({ titulo, descripcion, ... })
3. tareas.service.ts ejecuta:
   fetch('http://localhost:3000/api/tareas', {
     method: 'POST',
     body: JSON.stringify(nuevaTarea)
   })
4. server.js recibe POST /api/tareas
5. Valida datos (titulo requerido, usuarioId válido)
6. database.js ejecuta:
   INSERT INTO Tareas (titulo, descripcion, ...)
   OUTPUT INSERTED.id
7. Respuesta viaja hacia arriba: DB → server → service → view
8. Tareas.vue agrega la tarea al array local
9. <TaskItem> se renderiza con transición fade-in
```

## 🚀 Comandos de Ejecución

### Desarrollo (2 opciones)

**Opción 1: Manual (2 terminales)**
```bash
# Terminal 1 - Backend
cd c:\Users\AaronZumarraga\Downloads\tareas
node src/service/server.js
# → Servidor corriendo en http://localhost:3000

# Terminal 2 - Frontend
npm run dev
# → Vite dev server en http://localhost:5173
```

**Opción 2: Simultáneo (package.json configurado)**
```bash
npm run serve
# Ejecuta ambos con 'concurrently'
```

### Otros Comandos
```bash
npm run build      # Compilar para producción
npm run preview    # Preview del build de producción
npm run lint       # Linting con ESLint
```

## 🔐 Autenticación - Flujo Detallado

### Registro
```
1. Usuario completa formulario en IniciarSesion.vue
2. Validación frontend:
   - Email formato válido
   - Contraseña mínimo 6 caracteres
   - Contraseñas coinciden
3. POST /api/auth/register
4. Backend:
   a. Genera salt único (32 bytes random)
   b. Hashea contraseña con PBKDF2:
      crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512')
   c. INSERT en tabla Usuarios
5. Respuesta con datos del usuario (sin password)
6. Frontend guarda en localStorage
7. Redirect a /tareas
```

### Login
```
1. Usuario ingresa email + password
2. POST /api/auth/login
3. Backend:
   a. SELECT usuario WHERE email = ?
   b. Hashea password ingresada con salt guardado
   c. Compara hashes con timingSafeEqual()
   d. Si coincide, retorna usuario
4. Frontend guarda en localStorage
5. Actualiza estado global (usuario logueado)
6. Redirect a /tareas
```

### Logout (Frontend)
```typescript
function cerrarSesion() {
  localStorage.removeItem('usuario')
  router.push('/iniciar-sesion')
}
```

## 🎨 Diseño UI - Glassmorphism

**Características**:
- `backdrop-filter: blur(10px)` - Efecto difuminado
- `background: rgba(255, 255, 255, 0.1)` - Transparencia
- `border: 1px solid rgba(255, 255, 255, 0.2)` - Bordes suaves
- Gradiente de fondo animado en `App.vue`

**Colores por Prioridad**:
```css
.prioridad-1 { color: #10b981 } /* Verde - Baja */
.prioridad-2 { color: #f59e0b } /* Amarillo - Media */
.prioridad-3 { color: #f97316 } /* Naranja - Alta */
.prioridad-4 { color: #ef4444 } /* Rojo - Urgente */
```

**Transiciones**:
```vue
<TransitionGroup name="list" tag="div">
  <TaskItem v-for="tarea in tareas" :key="tarea.id" />
</TransitionGroup>

<style>
.list-enter-active { transition: all 0.3s ease }
.list-leave-active { transition: all 0.3s ease }
.list-enter-from { opacity: 0; transform: translateY(-30px) }
.list-leave-to { opacity: 0; transform: translateY(30px) }
</style>
```

## 📊 Características Técnicas

### Frontend
- **Framework**: Vue 3.5.13
- **Build Tool**: Vite 6.0.1
- **Lenguaje**: TypeScript 5.6.2
- **Router**: Vue Router 4.x
- **Composables**: `ref`, `reactive`, `computed`, `watch`, `onMounted`
- **Validación**: HTML5 + lógica custom

### Backend
- **Runtime**: Node.js
- **Framework**: Express 4.x
- **Database**: mssql 11.0.1
- **Crypto**: crypto (nativo Node.js)
- **CORS**: cors middleware
- **Security**: PBKDF2 con 100,000 iteraciones

### Base de Datos
- **RDBMS**: SQL Server (Express Edition)
- **Integridad**: Foreign Keys, Unique constraints
- **Índices**: En columnas frecuentemente consultadas
- **Triggers**: Auto-actualización de fechaCompletacion

## 🔄 Estados de una Tarea

```
┌─────────────┐
│  CREACIÓN   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     usuario         ┌──────────────┐
│  Pendiente  │ ──comienza trabajo─→│ En Progreso  │
└──────┬──────┘                     └──────┬───────┘
       │                                   │
       │                                   │
       │         usuario completa          │
       └──────────────┬────────────────────┘
                      ▼
              ┌──────────────┐
              │  Completada  │ (completed = true, fechaCompletacion)
              └──────────────┘
       
              ┌──────────────┐
       ┌─────→│  Cancelada   │
       │      └──────────────┘
       │
   usuario decide no continuar
```

**Auto-actualización**:
- Cuando `estadoId` cambia a 3 (Completada):
  - `completed` → `true`
  - `fechaCompletacion` → `GETDATE()`

## 📝 Próximas Mejoras Recomendadas

### Alta Prioridad
1. **Implementar Pinia Store**
   - `authStore` para manejo de sesión
   - Reemplazar localStorage directo

2. **Crear Composables**
   - `useTareas()` - Extraer lógica de Tareas.vue
   - `useAuth()` - Login/logout centralizado

3. **Guards de Rutas**
   ```typescript
   router.beforeEach((to, from, next) => {
     const usuario = localStorage.getItem('usuario')
     if (to.name === 'tareas' && !usuario) {
       next({ name: 'iniciar-sesion' })
     } else {
       next()
     }
   })
   ```

4. **Helpers de Utilidad**
   - `fecha.ts` - Formato de fechas
   - `tareas.ts` - Cálculos de progreso
   - `validaciones.ts` - Validadores reutilizables

### Media Prioridad
5. **Búsqueda de Tareas** - Input con filtro por texto
6. **Ordenamiento** - Por fecha, prioridad, estado
7. **Paginación** - Para listas grandes (>50 tareas)
8. **Toast Notifications** - Feedback de acciones (guardar, eliminar)
9. **Dark Mode** - Toggle de tema claro/oscuro
10. **Edición de Perfil** - Cambiar nombre, email, contraseña

### Baja Prioridad
11. **Exportar Tareas** - CSV/PDF
12. **Recordatorios** - Notificaciones push
13. **Subtareas** - Checklist dentro de una tarea
14. **Etiquetas/Categorías** - Organización adicional
15. **Testing** - Vitest + Vue Test Utils

## 📖 Recursos y Documentación

- [Vue 3 Docs](https://vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Express.js](https://expressjs.com/)
- [mssql npm](https://www.npmjs.com/package/mssql)

## 👤 Autor

**Aaron Zumarraga**  
Proyecto académico de desarrollo web full-stack  
Diciembre 2025

---

**Estado del Proyecto**: ✅ Funcional | 🚧 Mejoras pendientes (composables, store, guards)