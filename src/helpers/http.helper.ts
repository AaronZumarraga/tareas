import { authStore } from '../store/auth.store'

const API_BASE = 'http://localhost:3000/api'

export async function http<T>(
  endpoint: string, 
  { method = 'GET', body }: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (authStore.token.value) {
    headers['Authorization'] = `Bearer ${authStore.token.value}`
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  if (res.status === 401) {
    authStore.clearAuth()
    throw new Error('Sesión expirada')
  }
  if (!res.ok) throw new Error(await res.text() || 'Error en la petición')
  if (res.status === 204) return null as T
  
  return res.json()
}
