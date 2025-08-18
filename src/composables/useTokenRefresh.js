import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'

export function useTokenRefresh() {
  const authStore = useAuthStore()
  const intervalId = ref(null)
  
  // Проверяем токен каждые 30 минут
  const CHECK_INTERVAL = 30 * 60 * 1000 // 30 минут в миллисекундах
  
  const startTokenRefreshCheck = () => {
    if (!authStore.isAuthenticated) return
    
    intervalId.value = setInterval(async () => {
      if (authStore.isAuthenticated) {
        try {
          await authStore.refreshToken()
        } catch (error) {
          console.error('Ошибка при периодической проверке токена:', error)
        }
      } else {
        stopTokenRefreshCheck()
      }
    }, CHECK_INTERVAL)
  }
  
  const stopTokenRefreshCheck = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
    }
  }
  
  onMounted(() => {
    startTokenRefreshCheck()
  })
  
  onUnmounted(() => {
    stopTokenRefreshCheck()
  })
  
  return {
    startTokenRefreshCheck,
    stopTokenRefreshCheck
  }
}
