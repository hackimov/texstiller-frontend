<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <h2 class="text-h5 mb-6">Популярные товары</h2>

      <!-- Загрузка -->
      <LoadingSpinner v-if="loading" />

      <!-- Товары не найдены -->
      <div v-else-if="products.length === 0" class="d-flex justify-center align-center my-16" style="min-height: 50vh;">
        <div class="text-center">
          <v-icon size="64" color="grey">mdi-package-variant</v-icon>
          <h3 class="text-h6 mt-4 mb-2">Товары не найдены</h3>
        </div>
      </div>

      <!-- Список товаров -->
      <template v-else>
        <v-row class="ma-0">
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
        <div class="d-flex justify-space-between align-center mt-4">
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
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productsApi } from '../services/api'
import ProductCard from '../components/ProductCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const products = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalProducts = ref(0)
const totalPages = ref(0)

const fetchProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      per_page: 12,
      popular: true
    }
    
    const response = await productsApi.getPopular(params)
    const data = response.data.data
    
    products.value = data.data
    totalProducts.value = data.total
    totalPages.value = data.last_page
    currentPage.value = data.current_page
  } catch (error) {
    console.error('Ошибка загрузки популярных товаров:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})
</script>
