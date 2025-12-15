import { http } from '../helpers/http.helper'

export type Tarea = {
  id: number
  titulo: string
  descripcion?: string
  estado: string
  prioridad?: string
  completed: boolean
  fechaVencimiento?: string
  fechaCreacion: string
}

export const AuthService = {
  login: (credentials: any) => http<any>('/auth/login', { method: 'POST', body: credentials }),
  register: (data: any) => http<any>('/auth/register', { method: 'POST', body: data }),
  logout: () => http('/auth/logout', { method: 'POST' }),
  verify: () => http<any>('/auth/verify')
}

export const TaskService = {
  getAll: () => http<Tarea[]>('/tareas'),
  create: (data: any) => http<Tarea>('/tareas', { method: 'POST', body: data }),
  update: (id: number, data: any) => http<Tarea>(`/tareas/${id}`, { method: 'PUT', body: data }),
  delete: (id: number) => http(`/tareas/${id}`, { method: 'DELETE' })
}
