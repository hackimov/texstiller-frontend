import axios from 'axios'

// Создаем экземпляр axios с базовой конфигурацией
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://texstiller.local/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 60000, // 60 секунд
})

// Интерцептор для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Флаг для предотвращения множественных запросов на обновление токена
let isRefreshing = false
let refreshSubscribers = []

// Функция для добавления подписчиков на обновление токена
const subscribeTokenRefresh = (callback) => {
  refreshSubscribers.push(callback)
}

// Функция для уведомления всех подписчиков о новом токене
const onTokenRefreshed = (newToken) => {
  refreshSubscribers.forEach(callback => callback(newToken))
  refreshSubscribers = []
}

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => {
    // Проверяем заголовок на необходимость обновления токена
    if (response.headers['x-token-refresh-required'] === 'true') {
      // Запускаем обновление токена в фоне, не блокируя текущий запрос
      if (!isRefreshing) {
        isRefreshing = true
        
        api.post('/auth/refresh-token')
          .then(refreshResponse => {
            if (refreshResponse.data.success && refreshResponse.data.data.needs_refresh) {
              const newToken = refreshResponse.data.data.token
              localStorage.setItem('token', newToken)
              api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
              
              // Уведомляем подписчиков о новом токене
              onTokenRefreshed(newToken)
              
              // Обновляем пользователя в store
              if (window.authStore) {
                window.authStore.user = refreshResponse.data.data.user
                window.authStore.token = newToken
              }
            }
          })
          .catch(error => {
            console.error('Ошибка обновления токена:', error)
            // При ошибке обновления токена выходим из системы
            localStorage.removeItem('token')
            delete api.defaults.headers.common['Authorization']
            if (window.location.pathname !== '/auth') {
              window.location.href = '/auth'
            }
          })
          .finally(() => {
            isRefreshing = false
          })
      }
    }
    
    return response
  },
  (error) => {
    const originalRequest = error.config
    
    // Если получили 401 ошибку и это не запрос на обновление токена
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token') {
      if (isRefreshing) {
        // Если токен уже обновляется, ждем его обновления
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            originalRequest._retry = true
            resolve(api(originalRequest))
          })
        })
      }
      
      // Пытаемся обновить токен
      isRefreshing = true
      
      return api.post('/auth/refresh-token')
        .then(refreshResponse => {
          if (refreshResponse.data.success) {
            const newToken = refreshResponse.data.data.token
            localStorage.setItem('token', newToken)
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
            
            // Повторяем оригинальный запрос с новым токеном
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            originalRequest._retry = true
            
            // Уведомляем подписчиков о новом токене
            onTokenRefreshed(newToken)
            
            return api(originalRequest)
          } else {
            throw new Error('Token refresh failed')
          }
        })
        .catch(() => {
          // При ошибке обновления токена выходим из системы
          localStorage.removeItem('token')
          delete api.defaults.headers.common['Authorization']
          if (window.location.pathname !== '/auth') {
            window.location.href = '/auth'
          }
          return Promise.reject(error)
        })
        .finally(() => {
          isRefreshing = false
        })
    }
    
    return Promise.reject(error)
  }
)

// API методы для работы с категориями
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  getTree: () => api.get('/categories/tree'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  getBreadcrumbs: (slug) => api.get(`/categories/${slug}/breadcrumbs`),
}

// API методы для работы с товарами
export const productsApi = {
  getAll: (params = {}) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  getByCategory: (categorySlug, params = {}) => api.get(`/categories/${categorySlug}/products`, { params }),
  getPopular: (params = {}) => api.get('/products/popular', { params }),
  search: (query, params = {}) => api.get('/products/search', { params: { q: query, ...params } }),
  getByIds: (ids) => api.post('/products/by-ids', { ids }),
  incrementViews: (productId) => api.post(`/products/${productId}/views`),
}

// API методы для работы с корзиной
export const cartApi = {
  get: () => api.get('/cart'),
  getCount: () => api.get('/cart/count'),
  add: (productId, quantity) => api.post('/cart', { product_id: productId, quantity }),
  update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }),
  remove: (itemId) => api.delete(`/cart/${itemId}`),
  clear: () => api.delete('/cart'),
  merge: (items) => api.post('/cart/merge', { items }),
}

// API методы для работы с заказами
export const ordersApi = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
}

// API методы для работы с баннерами
export const bannersApi = {
  getActive: () => api.get('/banners/active'),
}

// API методы для авторизации
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getUser: () => api.get('/auth/user'),
  getStats: () => api.get('/auth/stats'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  refreshToken: () => api.post('/auth/refresh-token'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
}

// API методы для обратной связи
export const contactApi = {
  send: (contactData) => api.post('/contact', contactData),
}

// API методы для работы с настройками сайта
export const settingsApi = {
  getAll: () => api.get('/settings'),
  getGroup: (group) => api.get(`/settings/group/${group}`),
  getSetting: (key) => api.get(`/settings/${key}`),
}