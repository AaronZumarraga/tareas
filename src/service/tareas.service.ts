const API_BASE = 'http://localhost:3000/api';

export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  prioridadId: number;
  completed: boolean;
  fechaVencimiento?: string;
  fechaCreacion?: string;
  fechaCompletacion?: string;
  fechaModificacion?: string;
}

export async function fetchTareas(): Promise<Tarea[]> {
  const response = await fetch(`${API_BASE}/tareas`);
  if (!response.ok) throw new Error('Error al obtener tareas');
  return response.json();
}

export async function crearTarea(data: {
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: string;
}): Promise<Tarea> {
  const response = await fetch(`${API_BASE}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear tarea: ${errorText}`);
  }
  return response.json();
}

export async function updateTarea(id: number, data: {
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: string;
}): Promise<Tarea> {
  const response = await fetch(`${API_BASE}/tareas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar tarea: ${errorText}`);
  }
  return response.json();
}

export async function eliminarTarea(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/tareas/${id}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Error al eliminar tarea');
}
