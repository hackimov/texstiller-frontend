<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <!-- Хлебные крошки -->
      <v-breadcrumbs
        v-if="breadcrumbs.length > 0"
        :items="breadcrumbs"
        class="pa-0 mb-1 text-caption"
        density="compact"
      >
        <template #divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>

      <!-- Загрузка -->
      <LoadingSpinner v-if="loading" />

      <template v-else-if="category">
        <!-- Описание категории -->
        <div v-if="category.description && category.description !== 'Корневая'" class="mb-2">
          <p class="text-body-2 mb-1">
            {{ category.description }}
          </p>
        </div>

        <!-- Подкатегории убраны по требованию пользователя -->

        <!-- Товары -->
        <section>
          <LoadingSpinner v-if="loadingProducts" height="30vh" />

          <div v-else-if="products.length === 0" class="d-flex justify-center align-center my-16" style="min-height: 50vh;">
            <div class="text-center">
              <v-icon size="64" color="grey">mdi-package-variant</v-icon>
              <h3 class="text-h6 mt-4 mb-2">Товары не найдены</h3>
            </div>
          </div>

          <v-row v-else class="ma-0">
            <v-col
              v-for="product in products"
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
          <div v-if="products.length > 0" class="d-flex justify-space-between align-center mt-4">
            <span class="text-caption">
              Найдено: {{ totalProducts }} товаров
            </span>
            <v-pagination
              v-if="totalPages > 1"
              v-model="currentPage"
              :length="totalPages"
              @update:model-value="fetchProducts"
            />
          </div>
        </section>
      </template>

      <!-- Ошибка -->
      <div v-else class="d-flex justify-center align-center my-16" style="min-height: 50vh;">
        <div class="text-center">
          <v-icon size="64" color="red">mdi-alert-circle</v-icon>
          <h3 class="text-h6 mt-4 mb-2">Категория не найдена</h3>
          <p class="text-body-2">Возможно, категория была удалена или перемещена</p>
          <v-btn
            color="primary"
            to="/"
            class="mt-4"
          >
            На главную
          </v-btn>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categoriesApi, productsApi } from '../services/api'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()

const category = ref(null)
const breadcrumbs = ref([])
const products = ref([])
const loading = ref(false)
const loadingProducts = ref(false)
const currentPage = ref(1)
const totalProducts = ref(0)
const totalPages = ref(0)

const fetchCategory = async () => {
  loading.value = true
  try {
    const [categoryResponse, breadcrumbsResponse] = await Promise.all([
      categoriesApi.getBySlug(route.params.slug),
      categoriesApi.getBreadcrumbs(route.params.slug)
    ])
    
    category.value = categoryResponse.data.data
    breadcrumbs.value = breadcrumbsResponse.data.data
      .filter(item => item.name !== 'Корневая') // Исключаем категории с названием "Корневая"
      .map(item => ({
        title: item.name,
        to: item.slug === route.params.slug ? undefined : `/category/${item.slug}`,
        disabled: item.slug === route.params.slug
      }))
    
    // Добавляем главную страницу в начало
    breadcrumbs.value.unshift({
      title: 'Главная',
      to: '/',
      disabled: false
    })
  } catch (error) {
    console.error('Ошибка загрузки категории:', error)
    category.value = null
  } finally {
    loading.value = false
  }
}

const fetchProducts = async () => {
  if (!category.value) return
  
  loadingProducts.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: 12,
    }
    
    const response = await productsApi.getByCategory(route.params.slug, params)
    const data = response.data.data
    
    products.value = data.data
    totalProducts.value = data.total
    totalPages.value = data.last_page
    currentPage.value = data.current_page
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  } finally {
    loadingProducts.value = false
  }
}



// Следим за изменением slug в URL
watch(() => route.params.slug, () => {
  if (route.params.slug) {
    currentPage.value = 1
    fetchCategory().then(() => {
      fetchProducts()
    })
  }
}, { immediate: true })

onMounted(() => {
  // Начальная загрузка происходит в watcher
})
</script>

<style scoped>
/* Компактные хлебные крошки */
:deep(.v-breadcrumbs) {
  padding: 0 !important;
  min-height: 24px !important;
}

:deep(.v-breadcrumbs-item) {
  font-size: 0.75rem !important;
  padding: 0 4px !important;
}

:deep(.v-breadcrumbs-divider) {
  padding: 0 4px !important;
  font-size: 0.75rem !important;
}
</style>
