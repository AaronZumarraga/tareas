# Views
Páginas completas conectadas al router. Representan rutas y flujos.

## Vistas disponibles
- `Inicio.vue` - Página de bienvenida
- `Tareas.vue` - Gestión y listado de tareas con filtros
- `AcercaDe.vue` - Información sobre la aplicación
- `IniciarSesion.vue` - Autenticación (login/registro) y perfil de usuario

## Características comunes
- Utilizan `GlassCard` para layout principal
- Usan `PageTitle` para títulos consistentes
- Implementan responsive design con media queries
- Delegan lógica de negocio a composables y servicios

## Buenas prácticas aplicadas
- Mantener vistas ligeras; lógica compleja en composables (`useAuth`, `taskService`)
- Nombrar según la ruta o propósito
- Separar presentación de lógica de negocio