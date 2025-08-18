<template>
  <div class="osm-map-container">
    <!-- Заголовок карты -->
    <div class="map-header mb-3">
      <h4 class="text-h6 d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-map-marker</v-icon>
        {{ markerTitle }}
      </h4>
      <p class="text-body-2 text-grey-darken-1 ml-8" v-if="address">{{ address }}</p>
    </div>
    
    <!-- Карта или fallback -->
    <div class="map-frame" :style="{ height: height + 'px' }">
      <!-- Попробуем несколько вариантов карт -->
      <iframe
        v-if="!mapError && currentMapIndex === 0"
        :src="mapUrls[0]"
        width="100%"
        :height="height"
        style="border: none; border-radius: 8px;"
        loading="lazy"
        :title="`Карта местоположения: ${markerTitle}`"
        allowfullscreen
        @error="tryNextMap"
      />
      
      <img
        v-else-if="!mapError && currentMapIndex === 1"
        :src="mapUrls[1]"
        width="100%"
        :height="height"
        style="border: none; border-radius: 8px; object-fit: cover;"
        loading="lazy"
        :alt="`Карта местоположения: ${markerTitle}`"
        @error="tryNextMap"
      />
      
      <!-- Статическая карта как fallback -->
      <div v-else class="static-map-fallback">
        <div class="map-placeholder">
          <v-icon size="64" color="primary">mdi-map</v-icon>
          <h3 class="text-h6 mt-4 mb-2">{{ markerTitle }}</h3>
          <p class="text-body-1 mb-4">{{ address }}</p>
          <div class="coordinates mb-4">
            <p class="text-body-2">
              <v-icon size="16" class="mr-1">mdi-crosshairs-gps</v-icon>
              <strong>Координаты:</strong> {{ latitude.toFixed(6) }}, {{ longitude.toFixed(6) }}
            </p>
          </div>
          <div class="map-actions-fallback">
            <v-btn
              :href="yandexMapsUrl"
              target="_blank"
              color="primary"
              class="mr-2 mb-2"
            >
              <v-icon start>mdi-open-in-new</v-icon>
              Яндекс.Карты
            </v-btn>
            <v-btn
              :href="googleMapsUrl"
              target="_blank"
              color="secondary"
              class="mb-2"
            >
              <v-icon start>mdi-google-maps</v-icon>
              Google Maps
            </v-btn>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Информация под картой -->
    <div class="map-footer mt-4">
      <v-row align="center">
        <v-col cols="12" md="6">
          <div class="map-info">
            <p class="text-body-2 mb-1">
              <v-icon size="16" class="mr-1">mdi-crosshairs-gps</v-icon>
              <strong>Координаты:</strong> {{ latitude.toFixed(6) }}, {{ longitude.toFixed(6) }}
            </p>
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
          </div>
        </v-col>
      </v-row>
    </div>
    
    <!-- Дополнительная информация -->
    <div v-if="showDetails" class="map-details mt-4">
      <v-expansion-panels variant="accordion">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <v-icon class="mr-2">mdi-information</v-icon>
            Подробная информация
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <div v-html="markerContent"></div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

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
  },
  showDetails: {
    type: Boolean,
    default: true
  }
})

// Состояние для переключения между картами
const currentMapIndex = ref(0)
const mapError = ref(false)

// Массив альтернативных URL карт
const mapUrls = computed(() => {
  const zoom = Math.max(10, Math.min(props.zoom, 18))
  const offset = 0.005
  
  const bbox = {
    left: props.longitude - offset,
    bottom: props.latitude - offset,
    right: props.longitude + offset,
    top: props.latitude + offset
  }
  
  return [
    // OpenStreetMap (основной)
    `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.left},${bbox.bottom},${bbox.right},${bbox.top}&layer=mapnik&marker=${props.latitude},${props.longitude}`,
    
    // Статическая карта через MapBox (бесплатная)
    `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+1976D2(${props.longitude},${props.latitude})/${props.longitude},${props.latitude},${zoom}/400x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`,
  ]
})

// Функция для переключения на следующую карту при ошибке
const tryNextMap = () => {
  console.warn(`Карта ${currentMapIndex.value} не загрузилась, пробуем следующую...`)
  
  if (currentMapIndex.value < mapUrls.value.length - 1) {
    currentMapIndex.value++
    
    // Даем время на загрузку следующей карты
    setTimeout(() => {
      if (currentMapIndex.value >= mapUrls.value.length - 1) {
        console.warn('Все карты недоступны, показываем fallback')
        mapError.value = true
      }
    }, 3000)
  } else {
    mapError.value = true
  }
}

// Автоматическое переключение на fallback через таймаут
onMounted(() => {
  // Если через 5 секунд карта не загрузилась, показываем fallback
  setTimeout(() => {
    if (currentMapIndex.value === 0) {
      tryNextMap()
    }
  }, 5000)
})

// URL для Яндекс.Карт
const yandexMapsUrl = computed(() => {
  return `https://yandex.ru/maps/?pt=${props.longitude},${props.latitude}&z=${props.zoom}&l=map`
})

// URL для Google Maps
const googleMapsUrl = computed(() => {
  return `https://www.google.com/maps?q=${props.latitude},${props.longitude}&z=${props.zoom}`
})
</script>

<style scoped>
.osm-map-container {
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

.map-header h4 {
  margin-bottom: 4px;
  font-weight: 600;
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

.map-details {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding-top: 16px;
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
  
  .map-header h4 {
    font-size: 1.1rem;
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

/* Fallback карта */
.static-map-fallback {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-placeholder {
  text-align: center;
  padding: 40px 20px;
  max-width: 400px;
}

.map-placeholder h3 {
  color: #1976D2;
  font-weight: 600;
}

.coordinates {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 12px;
  display: inline-block;
}

.map-actions-fallback {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

/* Стили для expansion panel */
:deep(.v-expansion-panel-text__wrapper) {
  padding: 16px;
}

:deep(.v-expansion-panel-title) {
  font-weight: 500;
}
</style>
