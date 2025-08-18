<template>
  <div class="dadata-autocomplete">
    <v-combobox
      v-model="searchInput"
      :items="suggestions"
      :loading="loading"
      :label="label"
      :placeholder="placeholder"
      :variant="variant"
      :density="density"
      :clearable="clearable"
      :hide-details="hideDetails"
      :error-messages="errorMessages"
      item-title="value"
      item-value="value"
      return-object
      no-filter
      hide-no-data
      @update:search="onSearchUpdate"
      @update:model-value="onComboboxChange"
      class="dadata-field"
    >
      <template #item="{ props, item }">
        <v-list-item
          v-bind="props"
          :title="item.raw.value"
          :subtitle="getSubtitle(item.raw)"
          class="suggestion-item"
        >
          <template #prepend>
            <v-icon color="primary" size="small">mdi-map-marker</v-icon>
          </template>
        </v-list-item>
      </template>

      <template #no-data>
        <v-list-item v-if="searchInput && searchInput.length >= 3 && !loading">
          <v-list-item-title class="text-grey">
            Нет подсказок для "{{ searchInput }}"
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-else-if="searchInput && searchInput.length < 3">
          <v-list-item-title class="text-grey">
            Введите минимум 3 символа
          </v-list-item-title>
        </v-list-item>
      </template>

      <template #append-inner>
        <v-icon 
          v-if="!loading && searchInput" 
          color="grey" 
          size="small"
          @click="clearSearch"
        >
          mdi-close
        </v-icon>
      </template>
    </v-combobox>

    <!-- Дополнительная информация о выбранном адресе -->
    <v-expand-transition>
      <v-card
        v-if="selectedValue && showDetails"
        class="mt-2 address-details"
        variant="outlined"
        density="compact"
      >
        <v-card-text class="py-2">
          <div class="text-caption text-grey mb-1">Детали адреса:</div>
          <div class="text-body-2">
            <div v-if="selectedValue.data?.postal_code" class="mb-1">
              <strong>Индекс:</strong> {{ selectedValue.data.postal_code }}
            </div>
            <div v-if="selectedValue.data?.region_with_type" class="mb-1">
              <strong>Регион:</strong> {{ selectedValue.data.region_with_type }}
            </div>
            <div v-if="selectedValue.data?.city_with_type" class="mb-1">
              <strong>Город:</strong> {{ selectedValue.data.city_with_type }}
            </div>
            <div v-if="selectedValue.data?.geo_lat && selectedValue.data?.geo_lon" class="mb-1">
              <strong>Координаты:</strong> {{ selectedValue.data.geo_lat }}, {{ selectedValue.data.geo_lon }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { api } from '../services/api'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'Адрес'
  },
  placeholder: {
    type: String,
    default: 'Начните вводить адрес...'
  },
  variant: {
    type: String,
    default: 'outlined'
  },
  density: {
    type: String,
    default: 'default'
  },
  clearable: {
    type: Boolean,
    default: true
  },
  hideDetails: {
    type: Boolean,
    default: false
  },
  errorMessages: {
    type: Array,
    default: () => []
  },
  showDetails: {
    type: Boolean,
    default: false
  },
  maxSuggestions: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:modelValue', 'selection-change', 'error'])

const searchInput = ref('')
const selectedValue = ref(null)
const suggestions = ref([])
const loading = ref(false)
const searchTimeout = ref(null)
const lastSearchQuery = ref('')
const searchCache = ref(new Map())
const abortController = ref(null)

// Инициализация значения
searchInput.value = props.modelValue || ''

// Наблюдение за изменениями внешнего значения
watch(() => props.modelValue, (newValue) => {
  searchInput.value = newValue || ''
  selectedValue.value = null
}, { immediate: true })

// Получение подсказок от Dadata с кэшированием и оптимизацией
const fetchSuggestions = async (query) => {
  // Проверяем минимальную длину запроса
  if (!query || query.length < 3) {
    suggestions.value = []
    return
  }

  // Нормализуем запрос для кэширования
  const normalizedQuery = query.trim().toLowerCase()
  
  // Проверяем кэш
  if (searchCache.value.has(normalizedQuery)) {
    suggestions.value = searchCache.value.get(normalizedQuery)
    return
  }

  // Отменяем предыдущий запрос если он есть
  if (abortController.value) {
    abortController.value.abort()
  }

  // Создаем новый контроллер для отмены запроса
  abortController.value = new AbortController()

  loading.value = true
  lastSearchQuery.value = normalizedQuery
  
  try {
    const response = await api.post('/dadata/address/suggestions', {
      query: query,
      count: props.maxSuggestions
    }, {
      signal: abortController.value.signal
    })

    // Проверяем, что это все еще актуальный запрос
    if (normalizedQuery !== lastSearchQuery.value) {
      return
    }

    if (response.data.success) {
      const suggestionsData = response.data.data || []
      suggestions.value = suggestionsData
      
      // Кэшируем результат (ограничиваем размер кэша)
      if (searchCache.value.size >= 50) {
        // Удаляем самый старый элемент
        const firstKey = searchCache.value.keys().next().value
        searchCache.value.delete(firstKey)
      }
      searchCache.value.set(normalizedQuery, suggestionsData)
    } else {
      suggestions.value = []
      emit('error', response.data.message || 'Ошибка получения подсказок')
    }
  } catch (error) {
    // Игнорируем ошибки отмененных запросов
    if (error.name === 'AbortError') {
      return
    }
    
    console.error('Dadata suggestions error:', error)
    suggestions.value = []
    emit('error', 'Не удалось получить подсказки адресов')
  } finally {
    loading.value = false
    abortController.value = null
  }
}

// Обработка изменения поискового запроса с улучшенным дебаунсом
const onSearchUpdate = (value) => {
  const searchValue = typeof value === 'string' ? value : (value?.value || '')
  
  // Очищаем предыдущий таймаут
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  // Если запрос слишком короткий, очищаем подсказки сразу
  if (!searchValue || searchValue.length < 3) {
    suggestions.value = []
    return
  }

  // Устанавливаем таймаут на 1.5 секунды для экономии запросов
  searchTimeout.value = setTimeout(() => {
    // Дополнительная проверка перед отправкой запроса
    if (searchValue && searchValue.length >= 3) {
      fetchSuggestions(searchValue)
    }
  }, 1500) // Уменьшено до 1.5 секунд
}

// Обработка выбора подсказки
const onSelectionChange = (value) => {
  selectedValue.value = value
  
  if (value) {
    searchInput.value = value.value
    emit('update:modelValue', value.value)
    emit('selection-change', value)
  }
}

// Обработка изменений в combobox
const onComboboxChange = (value) => {
  if (typeof value === 'string') {
    // Пользователь ввел текст вручную
    searchInput.value = value
    emit('update:modelValue', value)
  } else if (value && value.value) {
    // Пользователь выбрал подсказку
    searchInput.value = value.value
    selectedValue.value = value
    emit('update:modelValue', value.value)
    emit('selection-change', value)
  }
}

// Получение подзаголовка для элемента списка
const getSubtitle = (item) => {
  const parts = []
  
  if (item.data?.postal_code) {
    parts.push(item.data.postal_code)
  }
  
  if (item.data?.region && item.data?.city) {
    parts.push(`${item.data.region}, ${item.data.city}`)
  } else if (item.data?.region_with_type) {
    parts.push(item.data.region_with_type)
  }
  
  return parts.join(' • ')
}

// Очистка поиска
const clearSearch = () => {
  searchInput.value = ''
  selectedValue.value = null
  suggestions.value = []
  emit('update:modelValue', '')
  
  // Очищаем таймаут если он есть
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
    searchTimeout.value = null
  }
}

// Вычисляемые свойства
const hasValidSearch = computed(() => {
  return searchInput.value && searchInput.value.length >= 3
})

// Очистка ресурсов при размонтировании компонента
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  if (abortController.value) {
    abortController.value.abort()
  }
  // Очищаем кэш при размонтировании
  searchCache.value.clear()
})
</script>

<style scoped>
.dadata-autocomplete {
  position: relative;
}

.dadata-field {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.suggestion-item {
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: rgba(25, 118, 210, 0.04);
}

.address-details {
  border: 1px solid rgba(25, 118, 210, 0.2);
  background: rgba(25, 118, 210, 0.02);
}

/* Темная тема */
html.dark .address-details {
  border-color: rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.02);
}

html.dark .suggestion-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* Анимации */
.v-autocomplete {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-list-item {
  border-radius: 8px;
  margin: 2px 8px;
}

/* Стили для загрузки */
.v-autocomplete .v-progress-linear {
  border-radius: 0 0 4px 4px;
}
</style>
