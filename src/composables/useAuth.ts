import { authStore } from '../store/auth.store'
import { AuthService } from '../service/api.services'

export const useAuth = () => ({
  user: authStore.user,
  isAuthenticated: authStore.isAuthenticated,
  
  async login(email: string, password: string) {
    const { token, ...user } = await AuthService.login({ email, password })
    authStore.setAuth(user, token)
  },
  
  async register(data: any) {
    const { token, ...user } = await AuthService.register(data)
    authStore.setAuth(user, token)
  },
  
  async logout() {
    try {
      await AuthService.logout()
    } catch (e) {
      console.error(e)
    } finally {
      authStore.clearAuth()
    }
  },

  async verifySession() {
    if (!authStore.token.value) return
    try {
      const user = await AuthService.verify()
      authStore.setAuth(user, authStore.token.value)
    } catch {
      authStore.clearAuth()
    }
  }
})
