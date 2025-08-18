<template>
  <div class="banner-carousel">
    <!-- Состояние загрузки -->
    <div v-if="loading" class="d-flex justify-center align-center banner-loading">
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />
    </div>
    
    <!-- Карусель с баннерами -->
    <v-carousel
      v-else-if="banners.length > 0"
      :height="height"
      show-arrows="hover"
      cycle
      :interval="interval"
      hide-delimiter-background
      delimiter-icon="mdi-circle"
      class="banner-carousel-container"
    >
      <v-carousel-item
        v-for="banner in banners"
        :key="banner.id"
        :src="banner.image"
        cover
        @click="handleBannerClick(banner)"
        class="banner-item"
      >
        <div class="d-flex align-end justify-start h-100 pa-6">
          <div 
            v-if="banner.show_title || banner.link_url"
            class="banner-content"
          >
            <div class="banner-content-inner">
              <h3 
                v-if="banner.show_title" 
                class="banner-title text-white"
              >
                {{ banner.title }}
              </h3>
              <v-btn
                v-if="banner.link_url"
                color="primary"
                size="large"
                variant="elevated"
                @click.stop="handleBannerClick(banner)"
                class="banner-button"
              >
                {{ buttonText }}
                <v-icon end>mdi-arrow-right</v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </v-carousel-item>
    </v-carousel>
    
    <!-- Заглушка если нет баннеров -->
    <div 
      v-else-if="!loading && banners.length === 0" 
      class="d-flex justify-center align-center text-center pa-12 banner-placeholder"
      :style="{ height: height + 'px' }"
    >
      <div class="text-white">
        <v-icon size="64" class="mb-4">mdi-image-multiple</v-icon>
        <h3 class="text-h4 mb-2">{{ placeholderTitle }}</h3>
        <p class="text-body-1">{{ placeholderSubtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

const $router = useRouter()
const themeStore = useThemeStore()

// Props
const props = defineProps({
  banners: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  height: {
    type: Number,
    default: 400
  },
  interval: {
    type: Number,
    default: 5000
  },
  buttonText: {
    type: String,
    default: 'Подробнее'
  },
  placeholderTitle: {
    type: String,
    default: 'Добро пожаловать в Texstiller'
  },
  placeholderSubtitle: {
    type: String,
    default: 'Качественные ткани для дома и творчества'
  }
})

// Events
const emit = defineEmits(['banner-click'])

// Methods
const handleBannerClick = (banner) => {
  if (!banner || !banner.link_url) {
    return
  }
  
  // Эмитим событие для родительского компонента
  emit('banner-click', banner)
  
  try {
    if (banner.link_type === 'external') {
      // Внешняя ссылка - открываем в новой вкладке
      window.open(banner.link_url, '_blank', 'noopener,noreferrer')
    } else {
      // Внутренняя ссылка - используем Vue Router
      if (banner.link_url.startsWith('/')) {
        // Локальная ссылка - используем router
        $router.push(banner.link_url)
      } else {
        // Полная ссылка - переходим напрямую
        window.location.href = banner.link_url
      }
    }
  } catch (error) {
    console.error('Ошибка при переходе по ссылке баннера:', error)
  }
}
</script>

<style scoped>
.banner-carousel {
  position: relative;
  overflow: hidden;
}

.banner-loading {
  height: 400px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.banner-carousel-container {
  border-radius: 0;
  overflow: hidden;
}

.banner-item {
  cursor: pointer;
  transition: transform 0.3s ease;
  position: relative;
}

.banner-item:hover {
  transform: scale(1.01);
}

.banner-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  transition: background 0.3s ease;
}

/* Светлая тема - градиент оверлей */
.v-theme--light .banner-item::before {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.05) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
}

/* Темная тема - градиент оверлей */
.v-theme--dark .banner-item::before {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.banner-content {
  padding: 32px;
  border-radius: 16px;
  backdrop-filter: blur(8px);
  max-width: 600px;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.banner-content-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}

/* Светлая тема - подложка заголовка */
.v-theme--light .banner-content {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Темная тема - подложка заголовка */
.v-theme--dark .banner-content {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.banner-title {
  font-size: 2.5rem !important;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 !important;
  transition: text-shadow 0.3s ease;
}

/* Светлая тема - тень заголовка */
.v-theme--light .banner-title {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
}

/* Темная тема - тень заголовка */
.v-theme--dark .banner-title {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
}

.banner-button {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.banner-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.banner-placeholder {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0;
}

/* Анимация для загрузки */
.v-progress-circular {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* Улучшенные стили для элементов управления карусели */
:deep(.v-carousel__controls) {
  background: transparent !important;
  border-radius: 0;
  margin: 20px;
  padding: 8px 20px;
  backdrop-filter: none;
}

/* Базовые стили для точек-индикаторов */
:deep(.v-carousel__controls .v-btn) {
  width: 12px !important;
  height: 12px !important;
  min-width: 12px !important;
  margin: 0 5px !important;
  border-radius: 50% !important;
  transition: all 0.2s ease !important;
  border: none !important;
  box-shadow: none !important;
  transform-origin: center !important;
}

/* Светлая тема - точки */
.v-theme--light :deep(.v-carousel__controls .v-btn) {
  background: rgba(0, 0, 0, 0.3) !important;
}

.v-theme--light :deep(.v-carousel__controls .v-btn:hover) {
  background: rgba(0, 0, 0, 0.5) !important;
}

.v-theme--light :deep(.v-carousel__controls .v-btn.v-btn--active) {
  background: rgba(0, 0, 0, 0.8) !important;
  transform: scale(1.2) !important;
}

/* Темная тема - точки */
.v-theme--dark :deep(.v-carousel__controls .v-btn) {
  background: rgba(255, 255, 255, 0.3) !important;
}

.v-theme--dark :deep(.v-carousel__controls .v-btn:hover) {
  background: rgba(255, 255, 255, 0.5) !important;
}

.v-theme--dark :deep(.v-carousel__controls .v-btn.v-btn--active) {
  background: rgba(255, 255, 255, 0.9) !important;
  transform: scale(1.2) !important;
}

/* Стрелки навигации */
:deep(.v-carousel .v-btn--icon) {
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

/* Светлая тема - стрелки */
.v-theme--light :deep(.v-carousel .v-btn--icon) {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: white !important;
}

.v-theme--light :deep(.v-carousel .v-btn--icon:hover) {
  background: rgba(0, 0, 0, 0.6) !important;
  border: 1px solid rgba(0, 0, 0, 0.4);
}

/* Темная тема - стрелки */
.v-theme--dark :deep(.v-carousel .v-btn--icon) {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white !important;
}

.v-theme--dark :deep(.v-carousel .v-btn--icon:hover) {
  background: rgba(255, 255, 255, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* Адаптивность */
@media (max-width: 768px) {
  .banner-content {
    padding: 24px;
    max-width: 90%;
    min-height: 60px;
  }
  
  .banner-content-inner {
    gap: 16px;
  }
  
  .banner-title {
    font-size: 2rem !important;
  }
  
  /* Точки на планшетах */
  :deep(.v-carousel__controls .v-btn) {
    width: 10px !important;
    height: 10px !important;
    min-width: 10px !important;
    margin: 0 4px !important;
  }
  
  :deep(.v-carousel__controls .v-btn.v-btn--active) {
    transform: scale(1.15) !important;
  }
}

@media (max-width: 480px) {
  .banner-content {
    padding: 20px;
    min-height: 50px;
  }
  
  .banner-content-inner {
    gap: 12px;
  }
  
  .banner-title {
    font-size: 1.5rem !important;
  }
  
  /* Точки на мобильных */
  :deep(.v-carousel__controls .v-btn) {
    width: 8px !important;
    height: 8px !important;
    min-width: 8px !important;
    margin: 0 3px !important;
  }
  
  :deep(.v-carousel__controls .v-btn.v-btn--active) {
    transform: scale(1.1) !important;
  }
}
</style>

