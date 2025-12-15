// === CONSTANTES ===
const API_BASE = 'http://localhost:3000/api';
const AUTH_USER_KEY = 'auth_user';
const AUTH_TOKEN_KEY = 'auth_token';
export const AUTH_CHANGE_EVENT = 'auth-change';

// === INTERFACES ===
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

interface TareaData {
  titulo: string;
  descripcion: string;
  estado: string;
  prioridad: string;
  fechaVencimiento?: string;
}

// === FUNCIONES DE SESIÓN ===
export function readStoredUser(): Usuario | null {
  const saved = localStorage.getItem(AUTH_USER_KEY);
  return saved ? JSON.parse(saved) : null;
}

export function writeAuthSession(user: Usuario, token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  notifyAuthChange();
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  notifyAuthChange();
}

function notifyAuthChange(): void {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

// === FUNCIONES HTTP ===
function buildHeaders(includeAuth: boolean = true): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (includeAuth) {
    const token = getAuthToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const config: RequestInit = {
    ...options,
    headers: { ...buildHeaders(), ...options.headers }
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

// === FUNCIONES DE AUTENTICACIÓN ===
export async function login(email: string, password: string): Promise<Usuario> {
  const data = await request<any>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const { token, ...user } = data;
  writeAuthSession(user, token);
  return user;
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
  if (!getAuthToken()) return null;
  try {
    return await request<Usuario>('/auth/verify');
  } catch (error) {
    clearAuthSession();
    return null;
  }
}

// === FUNCIONES DE TAREAS ===
export async function fetchTareas(): Promise<Tarea[]> {
  return request<Tarea[]>('/tareas');
}

export async function crearTarea(data: TareaData): Promise<Tarea> {
  return request<Tarea>('/tareas', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function updateTarea(id: number, data: TareaData): Promise<Tarea> {
  return request<Tarea>(`/tareas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

export async function eliminarTarea(id: number): Promise<void> {
  await request(`/tareas/${id}`, { method: 'DELETE' });
}
