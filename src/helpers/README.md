# Helpers
Funciones puras sin dependencia de Vue. Reutilizables en varios lugares.

## Ejemplos
- `formatFecha(fecha: Date): string`
- `mapearEstadoTarea(codigo: string): string`
- `calcularProgreso(lista: Tarea[]): number`

## Buenas prácticas
- Sin efectos secundarios
- Tipar parámetros y retornos
- Agrupar por temática (`fecha.ts`, `tareas.ts`)