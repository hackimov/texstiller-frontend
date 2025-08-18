import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { cartApi } from '../services/api'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const loading = ref(false)
  const count = ref(0) // Отдельное состояние для счетчика

  const itemsCount = computed(() => {
    // Если items загружены, используем их для подсчета
    if (Array.isArray(items.value) && items.value.length > 0) {
      return items.value.reduce((total, item) => total + item.quantity, 0)
    }
    // Иначе используем отдельный счетчик
    return count.value
  })

  const totalPrice = computed(() => {
    if (!Array.isArray(items.value)) return 0
    return items.value.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  })

  const isEmpty = computed(() => !Array.isArray(items.value) || items.value.length === 0)

  const fetchCart = async () => {
    loading.value = true
    try {
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        const response = await cartApi.get()
        // Бэкенд возвращает данные в формате { data: { items: [...], total: ..., count: ... } }
        const cartData = response.data.data
        items.value = Array.isArray(cartData?.items) ? cartData.items : []
      } else {
        // Для неавторизованных пользователей используем localStorage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          // Получаем актуальную информацию о товарах
          if (cartItems.length > 0) {
            const productIds = cartItems.map(item => item.product_id)
            const { productsApi } = await import('../services/api')
            const response = await productsApi.getByIds(productIds)
            const products = response.data.data
            
            items.value = cartItems.map(cartItem => {
              const product = products.find(p => p.id === cartItem.product_id)
              return {
                id: cartItem.id || `temp_${cartItem.product_id}`,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                product
              }
            }).filter(item => item.product) // Убираем товары, которые не найдены
          } else {
            items.value = []
          }
        } else {
          items.value = []
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error)
      items.value = [] // Устанавливаем пустой массив при ошибке
    } finally {
      loading.value = false
    }
  }

  const fetchCartCount = async () => {
    try {
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        const response = await cartApi.getCount()
        count.value = response.data.data.count || 0
      } else {
        // Для неавторизованных пользователей считаем из localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        count.value = savedCart.reduce((total, item) => total + (item.quantity || 0), 0)
      }
    } catch (error) {
      console.error('Ошибка загрузки счетчика корзины:', error)
      count.value = 0
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    loading.value = true
    try {
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        const response = await cartApi.add(productId, quantity)
        
        // Обновляем локальную корзину
        const existingItemIndex = items.value.findIndex(item => item.product_id === productId)
        if (existingItemIndex !== -1) {
          items.value[existingItemIndex] = response.data.data
        } else {
          items.value.push(response.data.data)
        }
        // Обновляем счетчик
        await fetchCartCount()
      } else {
        // Для неавторизованных пользователей сохраняем в localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        const existingItemIndex = savedCart.findIndex(item => item.product_id === productId)
        
        if (existingItemIndex !== -1) {
          savedCart[existingItemIndex].quantity += quantity
        } else {
          savedCart.push({
            id: `temp_${productId}`,
            product_id: productId,
            quantity
          })
        }
        
        localStorage.setItem('cart', JSON.stringify(savedCart))
        await fetchCartCount() // Обновляем только счетчик для неавторизованных
      }
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка добавления в корзину' 
      }
    } finally {
      loading.value = false
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId)
    }

    loading.value = true
    try {
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        const response = await cartApi.update(itemId, quantity)
        
        // Обновляем локальную корзину
        const itemIndex = items.value.findIndex(item => item.id === itemId)
        if (itemIndex !== -1) {
          items.value[itemIndex] = response.data.data
        }
        // Обновляем счетчик
        await fetchCartCount()
      } else {
        // Для неавторизованных пользователей обновляем localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        const itemIndex = savedCart.findIndex(item => item.id === itemId)
        
        if (itemIndex !== -1) {
          savedCart[itemIndex].quantity = quantity
          localStorage.setItem('cart', JSON.stringify(savedCart))
          await fetchCartCount()
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Ошибка в updateQuantity:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка обновления корзины' 
      }
    } finally {
      loading.value = false
    }
  }

  const removeFromCart = async (itemId) => {
    loading.value = true
    try {
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        await cartApi.remove(itemId)
      } else {
        // Для неавторизованных пользователей удаляем из localStorage
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
        const filteredCart = savedCart.filter(item => item.id !== itemId)
        localStorage.setItem('cart', JSON.stringify(filteredCart))
      }
      
      // Удаляем из локальной корзины
      items.value = items.value.filter(item => item.id !== itemId)
      
      // Обновляем счетчик
      await fetchCartCount()
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка удаления из корзины' 
      }
    } finally {
      loading.value = false
    }
  }

  const clearCart = async () => {
    loading.value = true
    try {
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()
      
      if (authStore.isAuthenticated) {
        await cartApi.clear()
      } else {
        localStorage.removeItem('cart')
      }
      
      items.value = []
      count.value = 0 // Сбрасываем счетчик
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка очистки корзины' 
      }
    } finally {
      loading.value = false
    }
  }

  const mergeGuestCart = async () => {
    const { useAuthStore } = await import('./auth')
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return

    const guestCart = JSON.parse(localStorage.getItem('cart') || '[]')
    if (guestCart.length === 0) return

    try {
      await cartApi.merge(guestCart)
      localStorage.removeItem('cart')
      await fetchCartCount() // Обновляем счетчик после объединения
    } catch (error) {
      console.error('Ошибка объединения корзин:', error)
    }
  }

  return {
    items,
    loading,
    count,
    itemsCount,
    totalPrice,
    isEmpty,
    fetchCart,
    fetchCartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    mergeGuestCart
  }
})
