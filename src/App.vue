<template>
  <v-app>
    <!-- Splash Screen -->
    <splash-screen ref="splashScreen" />
    
    <!-- App Bar -->
    <v-app-bar
      app
      :color="themeStore.isDark ? 'black' : 'primary'"
      dark
      elevation="1"
      clipped-left
      class="app-bar-padding custom-app-bar"
    >
      <div class="d-flex align-center flex-grow-1">
        <v-toolbar-title class="flex-shrink-0">
          <router-link to="/" class="text-decoration-none text-white app-title">
            {{ settingsStore.companyName }}
          </router-link>
        </v-toolbar-title>

        <!-- Navigation buttons -->
        <div class="header-nav-horizontal">
          <v-btn
            v-for="link in footerLinks"
            :key="link.title"
            :to="link.to"
            variant="text"
            color="white"
            size="small"
            class="header-nav-btn"
          >
            {{ link.title }}
          </v-btn>
        </div>

        <v-spacer />

        <!-- Search -->
        <div class="search-container">
          <v-text-field
            v-model="searchQuery"
            label="Поиск товаров"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            clearable
            hide-details
            class="search-field"
            @keyup.enter="performSearch"
            @click:clear="clearSearch"
          />
        </div>
      </div>

      <!-- Theme Toggle -->
      <v-btn
        icon
        @click="toggleTheme"
      >
        <v-icon>{{ themeStore.isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>

      <!-- Cart -->
      <v-btn
        icon
        @click="$router.push('/cart')"
      >
        <v-badge
          :content="cartStore.itemsCount"
          :value="cartStore.itemsCount > 0"
          color="red"
          :model-value="cartStore.itemsCount > 0"
        >
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>

      <!-- Auth -->
      <v-btn
        v-if="!authStore.isAuthenticated"
        color="white"
        variant="outlined"
        @click="$router.push('/auth')"
      >
        Войти
      </v-btn>

      <v-menu v-else>
        <template #activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="$router.push('/profile')">
            <v-list-item-title>Профиль</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push('/orders')">
            <v-list-item-title>Мои заказы</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="authStore.logout">
            <v-list-item-title>Выйти</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer
      permanent
      width="280"
      app
      clipped
      class="navigation-drawer modern-drawer"
    >
      <modern-side-menu />
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Footer -->
    <modern-footer />

    <!-- Global Snackbar -->
    <v-snackbar
      v-model="snackbarStore.visible"
      :color="snackbarStore.color"
      :timeout="snackbarStore.timeout"
      location="top right"
    >
      {{ snackbarStore.message }}
      <template #actions>
        <v-btn
          icon="mdi-close"
          size="small"
          @click="snackbarStore.hide()"
        />
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'
import { useCartStore } from './stores/cart'
import { useSnackbarStore } from './stores/snackbar'
import { useSettingsStore } from './stores/settings'
import { useSearchStore } from './stores/search'
import { useTokenRefresh } from './composables/useTokenRefresh'
import ModernSideMenu from './components/ModernSideMenu.vue'
import ModernFooter from './components/ModernFooter.vue'
import SplashScreen from './components/SplashScreen.vue'

const router = useRouter()
const themeStore = useThemeStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const snackbarStore = useSnackbarStore()
const settingsStore = useSettingsStore()
const searchStore = useSearchStore()

// Инициализируем автоматическое обновление токенов
useTokenRefresh()

const searchQuery = ref('')
const splashScreen = ref(null)

const footerLinks = [
  { title: 'О нас', to: '/about' },
  { title: 'Доставка', to: '/delivery' },
  { title: 'Оплата', to: '/payment' },
  { title: 'Контакты', to: '/contacts' },
]

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const performSearch = () => {
  if (!searchQuery.value.trim()) {
    return
  }
  
  searchStore.setQuery(searchQuery.value.trim())
  router.push({
    name: 'Search',
    query: { q: searchQuery.value.trim() }
  })
}

const clearSearch = () => {
  searchQuery.value = ''
  searchStore.clearQuery()
}

// Скрыть сплешскрин после полной загрузки приложения
const hideSplashAfterLoad = () => {
  // Инициализация уже выполнена в main.js
  // Добавляем небольшую задержку для плавности
  setTimeout(() => {
    if (splashScreen.value) {
      splashScreen.value.hideSplash()
    }
  }, 1500) // Увеличиваем задержку, чтобы дать время на загрузку
}

// Инициализируем скрытие сплешскрина при монтировании
onMounted(() => {
  hideSplashAfterLoad()
})
</script>

<style scoped>
.text-decoration-none {
  text-decoration: none;
}

/* Navigation drawer ограничиваем чтобы не мешал футеру */
.navigation-drawer :deep(.v-navigation-drawer__content) {
  overflow-y: auto !important;
}

/* Modern drawer styles */
.modern-drawer {
  border-right: none !important;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1) !important;
}

.modern-drawer :deep(.v-navigation-drawer__content) {
  padding: 0 !important;
  background: transparent !important;
}

/* Горизонтальное расположение навигации в хедере */
.header-nav-horizontal {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.header-nav-btn {
  background: transparent !important;
}

/* Стили для темной темы - черный хедер */
.v-theme--dark .custom-app-bar {
  background-color: #000000 !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.v-theme--dark .custom-app-bar .v-btn {
  color: white !important;
}

.v-theme--dark .custom-app-bar .v-text-field {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.v-theme--dark .custom-app-bar .v-text-field .v-field__input {
  color: white !important;
}

.v-theme--dark .custom-app-bar .v-text-field .v-field__outline {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.v-theme--dark .custom-app-bar .v-text-field:hover .v-field__outline {
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.v-theme--dark .custom-app-bar .v-text-field.v-field--focused .v-field__outline {
  border-color: #2196F3 !important;
}

.header-nav-btn {
  color: white !important;
  text-transform: none !important;
  font-weight: normal !important;
  padding: 4px 12px !important;
  min-width: auto !important;
  font-size: 14px !important;
}

.header-nav-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: white !important;
}

/* Добавляем отступы для app-bar */
.app-bar-padding {
  padding-left: 24px !important;
  padding-right: 24px !important;
}

/* Кастомные стили для app-bar */
.custom-app-bar .v-toolbar__content {
  padding: 0 !important;
}

/* Увеличиваем размер логотипа на 70% */
.app-title {
  font-size: 1.7em !important; /* 170% от базового размера */
  font-weight: normal !important;
}

/* Обеспечиваем правильное позиционирование футера */
.v-app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.v-main {
  flex: 1;
  min-height: calc(120vh - 76.8px); /* Увеличено на 20%: 120vh и 64px * 1.2 = 76.8px */
}

/* Старый класс больше не нужен - используем Vuetify классы напрямую */

/* Стили для поиска в хэдере */
.search-container {
  max-width: 450px;
  min-width: 350px;
  margin-right: 16px;
}

.search-field {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.search-field :deep(.v-field) {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.search-field :deep(.v-field__input) {
  color: white !important;
}

.search-field :deep(.v-field__outline) {
  border-color: rgba(255, 255, 255, 0.3) !important;
}

.search-field :deep(.v-field__outline:hover) {
  border-color: rgba(255, 255, 255, 0.5) !important;
}

.search-field :deep(.v-field--focused .v-field__outline) {
  border-color: white !important;
}

.search-field :deep(.v-label) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.search-field :deep(.v-field__prepend-inner .v-icon) {
  color: rgba(255, 255, 255, 0.7) !important;
}

.search-field :deep(.v-field__clearable .v-icon) {
  color: rgba(255, 255, 255, 0.7) !important;
}

/* Адаптивные стили для мобильных устройств */
@media (max-width: 960px) {
  .search-container {
    min-width: 200px;
    max-width: 300px;
  }
  
  .header-nav-horizontal {
    display: none;
  }
  
  /* Корректируем минимальную высоту для планшетов */
  .v-main {
    min-height: calc(120vh - 67.2px); /* Увеличено на 20%: 120vh и 56px * 1.2 = 67.2px */
  }
}

@media (max-width: 600px) {
  .app-title {
    font-size: 1.2em !important;
  }
  
  .search-container {
    min-width: 150px;
    max-width: 200px;
  }
  
  /* Корректируем минимальную высоту для мобильных */
  .v-main {
    min-height: calc(120vh - 67.2px); /* Увеличено на 20%: 120vh и 56px * 1.2 = 67.2px */
  }
}
</style>
