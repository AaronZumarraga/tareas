import { reactive, computed } from 'vue';

// === CONSTANTES ===
const API_BASE = 'http://localhost:3000/api';
const STORAGE_KEYS = { USER: 'auth_user', TOKEN: 'auth_token' };

// === STATE MANAGEMENT (Patrón Store/Singleton) ===
const state = reactive({
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
  token: localStorage.getItem(STORAGE_KEYS.TOKEN)
});

// Sincronizar con localStorage automáticamente
const setAuth = (user: any, token: string | null) => {
  state.user = user;
  state.token = token;
  if (user && token) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  } else {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }
};

// === CLIENTE HTTP (Patrón Facade para fetch) ===
async function http<T>(endpoint: string, { method = 'GET', body }: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (res.status === 401) { setAuth(null, null); throw new Error('Sesión expirada'); }
  if (!res.ok) throw new Error(await res.text() || 'Error en la petición');
  if (res.status === 204) return null as T;
  
  return res.json();
}

// === EXPORTABLE COMPOSABLE (Patrón Hook) ===
export const useAuth = () => ({
  user: computed(() => state.user),
  isAuthenticated: computed(() => !!state.user),
  
  login: async (email: string, password: string) => {
    const { token, ...user } = await http<any>('/auth/login', { method: 'POST', body: { email, password } as any });
    setAuth(user, token);
  },
  
  register: async (data: any) => {
    const { token, ...user } = await http<any>('/auth/register', { method: 'POST', body: data });
    setAuth(user, token);
  },
  
  logout: async () => {
    try { await http('/auth/logout', { method: 'POST' }); } 
    catch (e) { console.error(e); } 
    finally { setAuth(null, null); }
  },

  verifySession: async () => {
    if (!state.token) return;
    try {
      const user = await http<any>('/auth/verify');
      setAuth(user, state.token);
    } catch { setAuth(null, null); }
  }
});

// === SERVICIOS DE DATOS ===
export const taskService = {
  getAll: () => http<any[]>('/tareas'),
  create: (data: any) => http<any>('/tareas', { method: 'POST', body: data }),
  update: (id: number, data: any) => http<any>(`/tareas/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) => http(`/tareas/${id}`, { method: 'DELETE' })
};

// Tipos exportados para compatibilidad
export type Tarea = any; 
export type Usuario = any;
