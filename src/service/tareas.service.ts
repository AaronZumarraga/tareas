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

// Obtener token del localStorage
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Agregar token a headers
const getHeaders = () => {
  const token = getToken();
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Login (MODIFICADO)
export async function login(email: string, password: string): Promise<Usuario> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const errorText = (await response.text()) || 'Error al iniciar sesión';
    throw new Error(errorText);
  }
  const data = await response.json();
  // Guardar token
  localStorage.setItem('auth_token', data.token);
  const { token, ...user } = data;
  return user;
}

// Logout (NUEVO)
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getHeaders()
    });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}

// Verificar token (NUEVO)
export async function verifyToken(): Promise<Usuario | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      return null;
    }
    return response.json();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return null;
  }
}

// Tareas (MODIFICADAS para usar token)
export async function fetchTareas(): Promise<Tarea[]> {
  const response = await fetch(`${API_BASE}/tareas`, {
    headers: getHeaders()
  });
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
    headers: getHeaders(),
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
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar tarea: ${errorText}`);
  }
  return response.json();
}

export async function eliminarTarea(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/tareas/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!response.ok) throw new Error('Error al eliminar tarea');
}

export async function register(data: {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}): Promise<Usuario> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorText = (await response.text()) || 'Error al registrar usuario';
    throw new Error(errorText);
  }
  return response.json();
}
