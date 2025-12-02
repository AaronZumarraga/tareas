# Src - Estructura del Proyecto

Este directorio contiene el código fuente principal de la aplicación de gestión de tareas construida con Vue 3.

## 📁 Estructura de Carpetas

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizables
├── composables/     # Lógica reactiva (Composition API)
├── helpers/         # Funciones puras sin dependencia de Vue
├── router/          # Configuración de rutas
├── service/         # Capa de comunicación con backend
├── store/           # Estado global (Pinia)
└── views/           # Páginas completas conectadas al router
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

## 🔧 Composables
**Propósito**: Funciones reutilizables que encapsulan lógica reactiva (Composition API).

**Ejemplos**:
- `useTareas()` - cargar, filtrar, agregar tareas
- `useModal()` - estado abierto/cerrado
- `useFetch()` - wrapper genérico de peticiones
- `useDebounce()` - valor con retardo

**Buenas prácticas**:
- Prefijo `use`
- Retornar solo lo necesario (estado + métodos)
- Mantenerlos agnósticos de vistas específicas

## 🛠️ Helpers
**Propósito**: Funciones puras sin dependencia de Vue. Reutilizables en varios lugares.

**Ejemplos**:
- `formatFecha(fecha: Date): string`
- `mapearEstadoTarea(codigo: string): string`
- `calcularProgreso(lista: Tarea[]): number`

**Buenas prácticas**:
- Sin efectos secundarios
- Tipar parámetros y retornos
- Agrupar por temática (`fecha.ts`, `tareas.ts`)

## 🗺️ Router
**Propósito**: Configuración de rutas (Vue Router).

**Archivo principal**: `index.ts` - define `createRouter`, historial y arreglo de rutas.

**Rutas configuradas**:
- `/` (inicio) - Página de inicio de la aplicación
- `/tareas` (tareas) - Vista principal de gestión de tareas
- `/acerca-de` (acerca-de) - Información sobre la aplicación
- `/iniciar-sesion` (iniciar-sesion) - Página de autenticación de usuarios

**Ejemplo de navegación**:
```typescript
// Por nombre de ruta
router.push({ name: 'tareas' })

// Por path
router.push('/acerca-de')
```

**Buenas prácticas**:
- Lazy load para vistas grandes (import dinámico)
- Nombrar cada ruta (`name`) para facilitar navegación
- Centralizar guards (ej: auth) aquí o en módulo dedicado

## 🌐 Service
**Propósito**: Capa que habla con el backend. Encapsula llamadas HTTP y endpoints.

**Responsabilidades**:
- Definir funciones como `fetchTareas()`, `crearTarea(payload)`
- Manejar errores y parsing de respuestas
- No formatear datos para UI (eso va en helpers/composables)

**Buenas prácticas**:
- Un archivo por dominio: `tareas.service.ts`, `auth.service.ts`
- Usar `fetch` o librería (Axios) envuelta en un cliente central
- Retornar siempre datos tipados (TypeScript interfaces)

## 📦 Store
**Propósito**: Estado global compartido (Pinia recomendado).

**Uso típico**:
- Autenticación (usuario actual, token)
- Preferencias (tema, idioma)
- Cache ligera (listas ya cargadas)

**Buenas prácticas**:
- Evitar sobrecargar el store con todo
- Derivar estados complejos con getters en vez de duplicar
- Acciones asíncronas llaman servicios y actualizan estado

## 📄 Views
**Propósito**: Páginas completas conectadas al router. Representan rutas y flujos.

**Vistas actuales**:
- `Inicio.vue` - Página de bienvenida
- `Tareas.vue` - Gestión principal de tareas
- `AcercaDe.vue` - Información de la aplicación

**Características**:
- Componen layout + componentes reutilizables
- Pueden orquestar llamadas a servicios y composables
- No deben contener helpers puros

**Buenas prácticas**:
- Mantener la vista ligera; delegar lógica repetida a composables
- Nombrar según la ruta o propósito (`PerfilUsuario.vue`)

## 🎯 Flujo de Datos Recomendado

```
Views → Composables → Services → Backend
  ↓         ↓
Store ← Helpers (formateo/validación)
```

1. **Views** orquestan la UI y utilizan composables
2. **Composables** manejan lógica reactiva y llaman services
3. **Services** se comunican con el backend
4. **Helpers** procesan/formatean datos puros
5. **Store** mantiene estado global cuando es necesario