<template>
  <div class="location-card">
    <!-- Заголовок -->
    <div class="location-header mb-4">
      <h4 class="text-h6 d-flex align-center">
        <v-icon class="mr-2" color="primary">mdi-map-marker</v-icon>
        {{ markerTitle }}
      </h4>
    </div>
    
    <!-- Основная карточка с информацией -->
    <v-card elevation="4" class="location-main-card">
      <div class="location-visual" :style="{ height: height + 'px' }">
        <!-- Декоративная карта-иллюстрация -->
        <div class="map-illustration">
          <div class="map-grid">
            <div v-for="i in 20" :key="i" class="grid-line"></div>
          </div>
          <div class="location-pin">
            <v-icon size="48" color="error">mdi-map-marker</v-icon>
          </div>
          <div class="location-info-overlay">
            <v-chip color="primary" class="mb-2">
              <v-icon start>mdi-crosshairs-gps</v-icon>
              {{ latitude.toFixed(4) }}, {{ longitude.toFixed(4) }}
            </v-chip>
          </div>
        </div>
      </div>
      
      <v-card-text>
        <!-- Адрес -->
        <div class="location-details mb-4">
          <div class="detail-item mb-3">
            <v-icon color="primary" class="mr-3">mdi-home-map-marker</v-icon>
            <div>
              <div class="text-subtitle2 font-weight-bold">Адрес</div>
              <div class="text-body-2">{{ address }}</div>
            </div>
          </div>
          
          <!-- Режим работы -->
          <div v-if="workingHours" class="detail-item mb-3">
            <v-icon color="green" class="mr-3">mdi-clock</v-icon>
            <div>
              <div class="text-subtitle2 font-weight-bold">Режим работы</div>
              <div class="text-body-2" v-html="workingHours.replace(/\n/g, '<br>')"></div>
            </div>
          </div>
          
          <!-- Координаты -->
          <div class="detail-item">
            <v-icon color="blue" class="mr-3">mdi-crosshairs-gps</v-icon>
            <div>
              <div class="text-subtitle2 font-weight-bold">Координаты</div>
              <div class="text-body-2 font-mono">
                {{ latitude.toFixed(6) }}, {{ longitude.toFixed(6) }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Действия -->
        <div class="location-actions">
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                :href="yandexMapsUrl"
                target="_blank"
                color="primary"
                variant="elevated"
                block
                class="mb-2"
              >
                <v-icon start>mdi-open-in-new</v-icon>
                Яндекс.Карты
              </v-btn>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn
                :href="googleMapsUrl"
                target="_blank"
                color="secondary"
                variant="elevated"
                block
                class="mb-2"
              >
                <v-icon start>mdi-google-maps</v-icon>
                Google Maps
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
    
    <!-- Дополнительная информация -->
    <div v-if="showDetails && markerContent" class="mt-4">
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
import { computed } from 'vue'

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
.location-card {
  width: 100%;
}

.location-main-card {
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

.grid-line:nth-child(odd) {
  width: 1px;
  height: 100%;
  left: calc(var(--i) * 10%);
}

.grid-line:nth-child(even) {
  height: 1px;
  width: 100%;
  top: calc(var(--i) * 10%);
}

.location-pin {
  position: relative;
  z-index: 2;
  animation: bounce 2s infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.location-info-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
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

.location-details {
  border-left: 4px solid #1976D2;
  padding-left: 16px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.detail-item .v-icon {
  margin-top: 2px;
}

.font-mono {
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 4px;
}

.location-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding-top: 16px;
}

/* Адаптивность */
@media (max-width: 600px) {
  .location-visual {
    height: 250px !important;
  }
  
  .location-info-overlay {
    bottom: 10px;
    left: 10px;
  }
  
  .location-info-overlay .v-chip {
    font-size: 0.8rem;
  }
}

/* Стили для expansion panel */
:deep(.v-expansion-panel-text__wrapper) {
  padding: 16px;
}

:deep(.v-expansion-panel-title) {
  font-weight: 500;
}
</style>
