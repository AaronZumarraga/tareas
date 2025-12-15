const API_BASE = 'http://localhost:3000/api';
const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_CHANGE_EVENT = 'auth-change';

export function readStoredUser(): Usuario | null {
  const saved = localStorage.getItem(AUTH_USER_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function writeAuthSession(user: Usuario, token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

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
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
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
  const { token, ...user } = data;
  writeAuthSession(user, token);
  return user;
}

export async function logout(): Promise<void> {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    clearAuthSession();
  }
}

export async function verifyToken(): Promise<Usuario | null> {
  if (!localStorage.getItem(AUTH_TOKEN_KEY)) return null;
  try {
    return await request<Usuario>('/auth/verify');
  } catch (error) {
    clearAuthSession();
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
  const result = await request<any>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data)
  });
  const { token, ...user } = result;
  if (token) writeAuthSession(user, token);
  return user;
}
