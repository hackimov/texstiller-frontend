import { ref, onMounted } from 'vue'
import { bannersApi } from '../services/api'

/**
 * Композабл для работы с баннерами
 */
export function useBanners() {
  const banners = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Загрузить активные баннеры
   */
  const fetchBanners = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await bannersApi.getActive()
      banners.value = response.data.data || []
    } catch (err) {
      console.error('Ошибка загрузки баннеров:', err)
      error.value = err.message || 'Ошибка загрузки баннеров'
      banners.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Обновить список баннеров
   */
  const refreshBanners = () => {
    return fetchBanners()
  }

  /**
   * Получить баннер по ID
   */
  const getBannerById = (id) => {
    return banners.value.find(banner => banner.id === id)
  }

  /**
   * Получить активные баннеры (дополнительная фильтрация на клиенте)
   */
  const getActiveBanners = () => {
    return banners.value.filter(banner => banner.is_currently_active)
  }

  return {
    banners,
    loading,
    error,
    fetchBanners,
    refreshBanners,
    getBannerById,
    getActiveBanners
  }
}

/**
 * Композабл для автоматической загрузки баннеров при монтировании
 */
export function useBannersAutoload() {
  const bannersComposable = useBanners()

  onMounted(() => {
    bannersComposable.fetchBanners()
  })

  return bannersComposable
}

