# Router
Configuración de rutas (Vue Router).

## Archivo principal
- `index.ts`: define `createRouter`, historial y arreglo de rutas.

## Rutas configuradas
- `/` (inicio): Página de inicio de la aplicación
- `/tareas` (tareas): Vista principal de gestión de tareas
- `/acerca-de` (acerca-de): Información sobre la aplicación
- `/iniciar-sesion` (iniciar-sesion): Página de autenticación de usuarios

## Buenas prácticas
- Lazy load para vistas grandes (import dinámico)
- Nombrar cada ruta (`name`) para facilitar `router.push({ name: 'tareas' })`
- Centralizar guards (ej: auth) aquí o en un módulo dedicado

## Ejemplo de navegación
```typescript
// Por nombre de ruta
router.push({ name: 'tareas' })

// Por path
router.push('/acerca-de')
```