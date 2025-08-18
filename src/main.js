import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import { createRouter, createWebHistory } from 'vue-router'
import { createHead } from '@vueuse/head'

// Vuetify
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Custom fonts
import './assets/fonts.css'

// Components
import App from './App.vue'
import { routes } from './router'

// Stores
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'
import { useSettingsStore } from './stores/settings'

// Create Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FFC107',
          background: '#FAFAFA',
          surface: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#616161',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FF9800',
          background: '#121212',
          surface: '#1E1E1E',
        },
      },
    },
  },
})

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Create Pinia store
const pinia = createPinia()

// Create head manager
const head = createHead()

// Create and mount app
const app = createApp(App)

app.use(pinia)
app.use(vuetify)
app.use(head)

// Add router guards
router.beforeEach(async (to, from, next) => {
  // Initialize auth if not done yet
  const authStore = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    const query = { redirect: to.fullPath }
    
    // Добавляем информацию о том, откуда пришел пользователь
    if (to.path.includes('/cart')) {
      query.from = 'cart'
    } else if (to.path.includes('/profile')) {
      query.from = 'profile'
    } else if (to.path.includes('/orders')) {
      query.from = 'orders'
    }
    
    next({
      path: '/auth',
      query
    })
    return
  }
  
  // Check if route requires guest (redirect authenticated users)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

app.use(router)

app.mount('#app')

// Initialize stores after app is mounted
app.runWithContext(async () => {
  const themeStore = useThemeStore()
  themeStore.initTheme()
  
  // Initialize settings store to load site settings
  const settingsStore = useSettingsStore()
  settingsStore.init()
  
  // Initialize auth store to restore user session from localStorage
  const authStore = useAuthStore()
  await authStore.initAuth()
  
  // После инициализации auth загружаем счетчик корзины
  const { useCartStore } = await import('./stores/cart')
  const cartStore = useCartStore()
  await cartStore.fetchCartCount()
})