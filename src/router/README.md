# Router
Configuración de rutas (Vue Router).

## Archivo principal
- `index.ts`: define `createRouter`, historial y arreglo de rutas.

## Buenas prácticas
- Lazy load para vistas grandes (import dinámico)
- Nombrar cada ruta (`name`) para facilitar `router.push({ name: 'tareas' })`
- Centralizar guards (ej: auth) aquí o en un módulo dedicado