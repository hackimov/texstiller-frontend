import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await api.post('/auth/login', credentials)
      const { user: userData, token: userToken } = response.data.data
      
      user.value = userData
      token.value = userToken
      
      localStorage.setItem('token', userToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка входа' 
      }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    try {
      const response = await api.post('/auth/register', userData)
      const { user: newUser, token: userToken } = response.data.data
      
      user.value = newUser
      token.value = userToken
      
      localStorage.setItem('token', userToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка регистрации' 
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    } finally {
      user.value = null
      token.value = null
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    }
  }

  const fetchUser = async () => {
    if (!token.value) return
    
    loading.value = true
    try {
      const response = await api.get('/auth/user')
      user.value = response.data.data
    } catch (error) {
      console.error('Ошибка получения пользователя:', error)
      logout()
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    try {
      const response = await api.put('/auth/profile', profileData)
      user.value = response.data.data
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка обновления профиля' 
      }
    } finally {
      loading.value = false
    }
  }

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh-token')
      if (response.data.success && response.data.data.needs_refresh) {
        const newToken = response.data.data.token
        token.value = newToken
        localStorage.setItem('token', newToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        
        // Обновляем данные пользователя если они пришли
        if (response.data.data.user) {
          user.value = response.data.data.user
        }
        
        return { success: true, token: newToken }
      }
      return { success: true, token: token.value } // Токен еще актуален
    } catch (error) {
      console.error('Ошибка обновления токена:', error)
      // При ошибке выходим из системы
      await logout()
      return { success: false, message: 'Ошибка обновления токена' }
    }
  }



  const initAuth = async () => {
    if (token.value) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
      await fetchUser()
      
      // Если пользователь успешно авторизован, объединяем корзину
      if (user.value) {
        // Импортируем store динамически, чтобы избежать циклических зависимостей
        const { useCartStore } = await import('./cart')
        const cartStore = useCartStore()
        await cartStore.mergeGuestCart()
      }
    }
  }

  const authStore = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
    updateProfile,
    refreshToken,
    initAuth
  }

  // Делаем store доступным глобально для interceptor
  if (typeof window !== 'undefined') {
    window.authStore = authStore
  }

  return authStore
})
