<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <!-- Заголовок поиска -->
      <div class="mb-6">
        <h1 class="text-h4 mb-2">Результаты поиска</h1>
        <p v-if="searchStore.query" class="text-body-1">
          По запросу: <strong>"{{ searchStore.query }}"</strong>
        </p>
      </div>

      <!-- Результаты поиска -->
      <section>
        <LoadingSpinner v-if="searchStore.isSearching" />

        <div v-else-if="searchStore.results.length === 0 && searchStore.query" class="d-flex justify-center align-center my-16" style="min-height: 50vh;">
          <div class="text-center">
            <v-icon size="64" color="grey">mdi-magnify</v-icon>
            <h3 class="text-h6 mt-4 mb-2">Ничего не найдено</h3>
            <p class="text-body-2">Попробуйте изменить поисковый запрос или параметры поиска</p>
          </div>
        </div>

        <div v-else-if="!searchStore.query" class="d-flex justify-center align-center my-16" style="min-height: 50vh;">
          <div class="text-center">
            <v-icon size="64" color="grey">mdi-magnify</v-icon>
            <h3 class="text-h6 mt-4 mb-2">Введите поисковый запрос</h3>
            <p class="text-body-2">Используйте поле поиска выше для поиска товаров</p>
          </div>
        </div>

        <template v-else>
          <v-row class="ma-0">
            <v-col
              v-for="product in searchStore.results"
              :key="product.id"
              cols="4"
              sm="3"
              md="2"
              lg="2"
              xl="1"
              class="pa-1"
            >
              <product-card :product="product" />
            </v-col>
          </v-row>

          <!-- Пагинация и счетчик -->
          <div class="d-flex justify-space-between align-center mt-4">
            <span class="text-caption">
              Найдено: {{ searchStore.totalResults }} товаров
            </span>
            <v-pagination
              v-if="searchStore.totalPages > 1"
              v-model="currentPage"
              :length="searchStore.totalPages"
              @update:model-value="performSearch"
            />
          </div>
        </template>
      </section>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { productsApi } from '../services/api'
import { useSearchStore } from '../stores/search'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

const currentPage = ref(1)

const performSearch = async () => {
  const query = route.query.q
  
  if (!query) {
    searchStore.clearQuery()
    return
  }

  searchStore.setQuery(query)
  searchStore.setSearching(true)

  try {
    const params = {
      page: currentPage.value,
      per_page: 12,
      sort: 'name',
    }

    const response = await productsApi.search(query, params)
    const data = response.data.data

    searchStore.setResults(data)
  } catch (error) {
    console.error('Ошибка поиска:', error)
    searchStore.setResults({ data: [], total: 0, current_page: 1, last_page: 0 })
  } finally {
    searchStore.setSearching(false)
  }
}

// Setup SEO meta tags
useHead({
  title: () => {
    if (searchStore.query) {
      return `Поиск: ${searchStore.query} - Результаты поиска`
    }
    return 'Поиск товаров'
  },
  meta: [
    { name: 'description', content: 'Поиск товаров в каталоге. Найдите нужные ткани и материалы.' },
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

// Следим за изменениями в URL
watch(() => route.query, (newQuery) => {
  if (newQuery.q) {
    searchStore.setQuery(newQuery.q)
    currentPage.value = parseInt(newQuery.page) || 1
    performSearch()
  } else {
    searchStore.clearQuery()
  }
}, { immediate: true })

onMounted(() => {
  // Инициализация происходит в watcher
})
</script>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
