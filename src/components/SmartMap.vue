<template>
  <div class="smart-map-container">
    <!-- Заголовок карты -->
    <div class="map-header mb-3">
      <h4 class="text-h6 d-flex align-center app-title">
        <v-icon class="mr-2" color="primary">mdi-map-marker</v-icon>
        {{ markerTitle }}
      </h4>
      <p class="text-body-2 text-grey-darken-1 ml-8" v-if="address">{{ address }}</p>
    </div>
    
    <!-- Состояние загрузки -->
    <div v-if="isLoading" class="map-loading" :style="{ height: height + 'px' }">
      <div class="loading-content">
        <v-progress-circular
          indeterminate
          color="primary"
          size="48"
        />
        <p class="mt-3 text-body-1">Загрузка карты...</p>
        <p class="text-body-2 text-grey">Проверяем доступность OpenStreetMap</p>
      </div>
    </div>
    
    <!-- OpenStreetMap iframe (если загрузилась) -->
    <div v-else-if="mapLoaded && !mapError" class="map-frame" :style="{ height: height + 'px' }">
      <iframe
        ref="mapIframe"
        :src="openStreetMapUrl"
        width="100%"
        :height="height"
        style="border: none; border-radius: 8px;"
        :title="`Карта местоположения: ${markerTitle}`"
        allowfullscreen
        @load="onMapLoad"
        @error="onMapError"
      />
    </div>
    
    <!-- Заглушка (если карта не загрузилась) -->
    <div v-else class="fallback-card" :style="{ height: height + 'px' }">
      <v-card elevation="4" class="h-100">
        <div class="location-visual h-100">
          <!-- Декоративная карта-иллюстрация -->
          <div class="map-illustration">
            <div class="map-grid">
              <div v-for="i in 16" :key="i" class="grid-line" :style="gridLineStyle(i)"></div>
            </div>
            <div class="location-pin">
              <v-icon size="48" color="error">mdi-map-marker</v-icon>
            </div>

            <div class="map-status-overlay">
              <v-chip color="warning" size="small">
                <v-icon start size="16">mdi-wifi-off</v-icon>
                Карта недоступна
              </v-chip>
            </div>
          </div>
        </div>
      </v-card>
    </div>
    
    <!-- Информация под картой -->
    <div class="map-footer mt-4">
      <v-row align="center">
        <v-col cols="12" md="6">
          <div class="map-info">
            <p class="text-body-2" v-if="workingHours">
              <v-icon size="16" class="mr-1">mdi-clock</v-icon>
              <strong>Режим работы:</strong> {{ workingHours }}
            </p>
          </div>
        </v-col>
        <v-col cols="12" md="6">
          <div class="map-actions d-flex justify-end gap-2">
            <v-btn
              :href="yandexMapsUrl"
              target="_blank"
              color="primary"
              variant="outlined"
              size="small"
            >
              <v-icon start>mdi-open-in-new</v-icon>
              Яндекс.Карты
            </v-btn>
            <v-btn
              :href="googleMapsUrl"
              target="_blank"
              color="secondary"
              variant="outlined"
              size="small"
            >
              <v-icon start>mdi-google-maps</v-icon>
              Google Maps
            </v-btn>
            <v-btn
              v-if="mapError"
              @click="retryMap"
              color="warning"
              variant="outlined"
              size="small"
            >
              <v-icon start>mdi-refresh</v-icon>
              Повторить
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    

  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  zoom: {
    type: Number,
    default: 15
  },
  height: {
    type: Number,
    default: 400
  },
  markerTitle: {
    type: String,
    default: 'Наше местоположение'
  },
  address: {
    type: String,
    default: ''
  },
  workingHours: {
    type: String,
    default: ''
  },
  markerContent: {
    type: String,
    default: ''
  }
})

// Состояние компонента
const isLoading = ref(true)
const mapLoaded = ref(false)
const mapError = ref(false)
const mapIframe = ref(null)

// URL для встраиваемой OpenStreetMap
const openStreetMapUrl = computed(() => {
  const zoom = Math.max(10, Math.min(props.zoom, 18))
  const offset = 0.005
  
  const bbox = {
    left: props.longitude - offset,
    bottom: props.latitude - offset,
    right: props.longitude + offset,
    top: props.latitude + offset
  }
  
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}&layer=mapnik&marker=${props.latitude},${props.longitude}`
})

// URL для внешних карт
const yandexMapsUrl = computed(() => {
  return `https://yandex.ru/maps/?pt=${props.longitude},${props.latitude}&z=${props.zoom}&l=map`
})

const googleMapsUrl = computed(() => {
  return `https://www.google.com/maps?q=${props.latitude},${props.longitude}&z=${props.zoom}`
})

// Стили для сетки
const gridLineStyle = (index) => {
  const isVertical = index % 2 === 1
  const position = Math.floor(index / 2) * 25
  
  if (isVertical) {
    return {
      width: '1px',
      height: '100%',
      left: `${position}%`,
      top: '0'
    }
  } else {
    return {
      height: '1px',
      width: '100%',
      top: `${position}%`,
      left: '0'
    }
  }
}

// Обработчики событий iframe
const onMapLoad = () => {
  console.log('OpenStreetMap успешно загружена')
  isLoading.value = false
  mapLoaded.value = true
  mapError.value = false
}

const onMapError = () => {
  console.warn('Ошибка загрузки OpenStreetMap, показываем заглушку')
  isLoading.value = false
  mapLoaded.value = false
  mapError.value = true
}

// Повторная попытка загрузки карты
const retryMap = async () => {
  isLoading.value = true
  mapLoaded.value = false
  mapError.value = false
  
  await nextTick()
  
  // Принудительно перезагружаем iframe
  if (mapIframe.value) {
    mapIframe.value.src = mapIframe.value.src
  }
}

// Проверка доступности OpenStreetMap при монтировании
const checkMapAvailability = async () => {
  try {
    // Пробуем загрузить основную страницу OpenStreetMap
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 секунд таймаут
    
    const response = await fetch('https://www.openstreetmap.org/', {
      method: 'HEAD',
      signal: controller.signal,
      mode: 'no-cors' // Избегаем CORS проблем
    })
    
    clearTimeout(timeoutId)
    
    // Если дошли до сюда, значит сайт доступен
    console.log('OpenStreetMap доступен, загружаем карту')
    
    // Небольшая задержка для плавности
    setTimeout(() => {
      isLoading.value = false
      mapLoaded.value = true
    }, 1000)
    
  } catch (error) {
    console.warn('OpenStreetMap недоступен:', error.message)
    
    // Показываем заглушку
    setTimeout(() => {
      isLoading.value = false
      mapLoaded.value = false
      mapError.value = true
    }, 1500)
  }
}

onMounted(() => {
  checkMapAvailability()
})
</script>

<style scoped>
.smart-map-container {
  width: 100%;
}

.map-frame {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

.map-frame:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.map-frame iframe {
  border-radius: 8px;
  display: block;
}

.map-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
}

.loading-content {
  text-align: center;
}

.fallback-card {
  border-radius: 8px;
  overflow: hidden;
}

.location-visual {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-illustration {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
}

.grid-line {
  position: absolute;
  background: white;
}

.location-pin {
  position: relative;
  z-index: 2;
  animation: bounce 2s infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.map-status-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 3;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.map-header h4 {
  margin-bottom: 4px;
  font-weight: normal;
}

.app-title {
  font-family: 'BrandFont', sans-serif !important;
  font-size: 1.7em !important;
  font-weight: normal !important;
}

.map-footer {
  padding: 8px 0;
}

.map-info {
  flex: 1;
}

.map-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Адаптивность */
@media (max-width: 768px) {
  .map-actions {
    justify-content: flex-start !important;
    width: 100%;
    margin-top: 12px;
  }
  
  .map-actions .v-btn {
    flex: 1;
    min-width: 0;
  }
  
  .map-status-overlay {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .map-actions {
    flex-direction: column;
  }
  
  .map-actions .v-btn {
    width: 100%;
  }
}


</style>
