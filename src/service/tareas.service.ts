const API_BASE = 'http://localhost:3000/api';

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaCreacion: string;
}

export async function fetchTareas(): Promise<Tarea[]> {
  const response = await fetch(`${API_BASE}/tareas`);
  if (!response.ok) throw new Error('Error al obtener tareas');
  const tareas = await response.json();
  // Aquí puedes guardar las tareas en el estado si es necesario
  return tareas;
}

export async function crearTarea(data: Omit<Tarea, 'id' | 'fechaCreacion'>): Promise<Tarea> {
  const response = await fetch(`${API_BASE}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorText = await response.text(); // Obtener el texto del error
    throw new Error(`Error al crear tarea: ${errorText}`); // Incluir el texto del error en la excepción
  }
  return response.json(); // Asegúrate de que esto devuelva el objeto creado
}

export async function eliminarTarea(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/tareas/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar tarea');
}
