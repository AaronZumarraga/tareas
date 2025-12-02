# Views
Páginas completas conectadas al router. Representan rutas y flujos.

## Ejemplos actuales
- `Inicio.vue`
- `Tareas.vue`
- `AcercaDe.vue`

## Características
- Componen layout + componentes reutilizables
- Pueden orquestar llamadas a servicios y composables
- No deben contener helpers puros

## Buenas prácticas
- Mantener la vista ligera; delegar lógica repetida a composables
- Nombrar según la ruta o propósito (`PerfilUsuario.vue`)