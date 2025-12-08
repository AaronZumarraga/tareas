const API_BASE = 'http://localhost:3000/api';

export async function fetchTareas() {
  const response = await fetch(`${API_BASE}/tareas`);
  if (!response.ok) throw new Error('Error al obtener tareas');
  return response.json();
}

export async function crearTarea(payload: any) {
  const response = await fetch(`${API_BASE}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Error al crear tarea');
  return response.json();
}
