import { authStore } from '../store/auth.store'
import { http } from '../helpers/http.helper'

export const useAuth = () => ({
  user: authStore.user,
  isAuthenticated: authStore.isAuthenticated,
  
  async login(email: string, password: string) {
    const { token, ...user } = await http<any>('/auth/login', { 
      method: 'POST', 
      body: { email, password } as any 
    })
    authStore.setAuth(user, token)
  },
  
  async register(data: any) {
    const { token, ...user } = await http<any>('/auth/register', { 
      method: 'POST', 
      body: data 
    })
    authStore.setAuth(user, token)
  },
  
  async logout() {
    try {
      await http('/auth/logout', { method: 'POST' })
    } catch (e) {
      console.error(e)
    } finally {
      authStore.clearAuth()
    }
  },

  async verifySession() {
    if (!authStore.token.value) return
    try {
      const user = await http<any>('/auth/verify')
      authStore.setAuth(user, authStore.token.value)
    } catch {
      authStore.clearAuth()
    }
  }
})
