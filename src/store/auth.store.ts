import { reactive, computed } from 'vue'

const STORAGE_KEYS = { USER: 'auth_user', TOKEN: 'auth_token' }

const state = reactive({
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
  token: localStorage.getItem(STORAGE_KEYS.TOKEN)
})

export const authStore = {
  state,
  
  user: computed(() => state.user),
  token: computed(() => state.token),
  isAuthenticated: computed(() => !!state.user),

  setAuth(user: any, token: string | null) {
    state.user = user
    state.token = token
    if (user && token) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
      localStorage.setItem(STORAGE_KEYS.TOKEN, token)
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
    }
  },

  clearAuth() {
    this.setAuth(null, null)
  }
}
