const API_BASE = 'http://localhost:3000/api';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fechaCreacion?: string;
}

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

// Helper privado para peticiones
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = {
    ...options,
    headers: { ...headers, ...options.headers }
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  
  if (!response.ok) {
    const errorText = (await response.text()) || 'Error en la petición';
    throw new Error(errorText);
  }

  // Retornar null para 204 No Content
  if (response.status === 204) return null as T;
  
  return response.json();
}

export async function login(email: string, password: string): Promise<Usuario> {
  const data = await request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  
  localStorage.setItem('auth_token', data.token);
  const { token, ...user } = data;
  return user;
}

export async function logout(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

export async function verifyToken(): Promise<Usuario | null> {
  if (!localStorage.getItem('auth_token')) return null;
  try {
    return await request<Usuario>('/auth/verify');
  } catch (error) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    return null;
  }
}

export async function fetchTareas(): Promise<Tarea[]> {
  return request<Tarea[]>('/tareas');
}

export async function crearTarea(data: {
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: string;
}): Promise<Tarea> {
  return request<Tarea>('/tareas', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateTarea(id: number, data: {
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: string;
}): Promise<Tarea> {
  return request<Tarea>(`/tareas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function eliminarTarea(id: number): Promise<void> {
  await request(`/tareas/${id}`, { method: 'DELETE' });
}

export async function register(data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}): Promise<Usuario> {
  return request<Usuario>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}
