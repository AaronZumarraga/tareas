# Composables
Funciones reutilizables que encapsulan lógica reactiva (Composition API).

## Ejemplos
- `useTareas()` (cargar, filtrar, agregar tareas)
- `useModal()` (estado abierto/cerrado)
- `useFetch()` (wrapper genérico de peticiones)
- `useDebounce()` (valor con retardo)

## Buenas prácticas
- Prefijo `use`
- Retornar solo lo necesario (estado + métodos)
- Mantenerlos agnósticos de vistas específicas