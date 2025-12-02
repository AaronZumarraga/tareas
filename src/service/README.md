# Service
Capa que habla con el backend. Encapsula llamadas HTTP y endpoints.

## Responsabilidades
- Definir funciones como `fetchTareas()`, `crearTarea(payload)`
- Manejar errores y parsing de respuestas
- No formatear datos para UI (eso va en helpers/composables)

## Buenas prácticas
- Un archivo por dominio: `tareas.service.ts`, `auth.service.ts`
- Usar `fetch` o librería (Axios) envuelta en un cliente central
- Retornar siempre datos tipados (TypeScript interfaces)