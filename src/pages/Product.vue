<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <!-- Хлебные крошки -->
      <v-breadcrumbs
        v-if="breadcrumbs.length > 0"
        :items="breadcrumbs"
        class="pa-0 mb-4"
      >
        <template #divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>

      <!-- Загрузка -->
      <LoadingSpinner v-if="loading" />

      <template v-else-if="product">
        <v-row>
          <!-- Изображения товара -->
          <v-col cols="12" md="6">
            <v-card elevation="2">
              <v-img
                :src="selectedImage"
                :alt="product.name"
                height="400"
                cover
              >
                <template #placeholder>
                  <v-skeleton-loader type="image" />
                </template>
              </v-img>
              
              <!-- Миниатюры -->
              <v-card-text v-if="product.images && product.images.length > 1">
                <v-row>
                  <v-col
                    v-for="(image, index) in product.images"
                    :key="index"
                    cols="3"
                  >
                    <v-img
                      :src="image"
                      :alt="`${product.name} ${index + 1}`"
                      height="80"
                      cover
                      class="cursor-pointer"
                      :class="{ 'selected-image': selectedImage === image }"
                      @click="selectedImage = image"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Информация о товаре -->
          <v-col cols="12" md="6">
            <div class="product-info">
              <h1 class="text-h4 mb-4">{{ product.name }}</h1>
              
              <!-- Артикул -->
              <div class="text-caption text-grey mb-2">
                Артикул: {{ product.sku }}
              </div>

              <!-- Цена -->
              <div class="d-flex align-center mb-4">
                <v-chip
                  v-if="product.old_price && product.old_price > product.price"
                  color="red"
                  size="small"
                  class="mr-3"
                >
                  -{{ getDiscountPercent() }}%
                </v-chip>
                
                <span
                  v-if="product.old_price && product.old_price > product.price"
                  class="text-decoration-line-through text-grey mr-3 text-h6"
                >
                  {{ formatPrice(product.old_price) }}
                </span>
                
                <span class="text-h4 font-weight-bold primary--text">
                  {{ formatPrice(product.price) }}
                </span>
                
                <span class="text-body-1 ml-2">/ {{ product.unit }}</span>
              </div>

              <!-- Статус наличия -->
              <v-alert
                :type="product.quantity > 0 ? 'success' : 'error'"
                :icon="product.quantity > 0 ? 'mdi-check-circle' : 'mdi-close-circle'"
                variant="tonal"
                class="mb-4"
              >
                {{ product.quantity > 0 ? `В наличии (${product.quantity} ${product.unit})` : 'Товара нет в наличии' }}
              </v-alert>

              <!-- Рекомендуемый товар -->
              <v-chip
                v-if="product.is_featured"
                color="orange"
                class="mb-4"
              >
                <v-icon start>mdi-star</v-icon>
                Рекомендуем
              </v-chip>

              <!-- Количество и добавление в корзину -->
              <div class="cart-controls mb-6">
                <div class="quantity-wrapper">
                  <v-text-field
                    v-model.number="quantity"
                    type="number"
                    min="1"
                    :max="product.quantity"
                    label="Количество"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    class="quantity-input"
                  />
                </div>
                
                <v-btn
                  :disabled="product.quantity === 0 || quantity < 1"
                  :loading="addingToCart"
                  color="primary"
                  size="large"
                  elevation="2"
                  class="add-to-cart-btn"
                  @click="addToCart"
                >
                  <v-icon start>mdi-cart-plus</v-icon>
                  В корзину
                </v-btn>
              </div>

              <!-- Краткое описание -->
              <div v-if="product.short_description" class="mb-4">
                <h3 class="text-h6 mb-2">Краткое описание</h3>
                <p class="text-body-1">{{ product.short_description }}</p>
              </div>

              <!-- Характеристики -->
              <div v-if="product.attributes" class="mb-4">
                <h3 class="text-h6 mb-2">Характеристики</h3>
                <v-list density="compact">
                  <v-list-item
                    v-for="(value, key) in product.attributes"
                    :key="key"
                  >
                    <template #prepend>
                      <span class="font-weight-medium">{{ key }}:</span>
                    </template>
                    <span class="ml-2">{{ value }}</span>
                  </v-list-item>
                </v-list>
              </div>

              <!-- Категории -->
              <div v-if="product.categories && product.categories.length > 0" class="mb-4">
                <h3 class="text-h6 mb-2">Категории</h3>
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    v-for="category in product.categories"
                    :key="category.id"
                    :to="`/category/${category.slug}`"
                    variant="outlined"
                    size="small"
                  >
                    {{ category.name }}
                  </v-chip>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Подробное описание -->
        <v-row v-if="product.description" class="mt-8">
          <v-col cols="12">
            <v-card elevation="2">
              <v-card-title>
                <h3 class="text-h5">Описание</h3>
              </v-card-title>
              <v-card-text>
                <div class="text-body-1" v-html="product.description" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Похожие товары -->
        <section v-if="relatedProducts.length > 0" class="mt-12">
          <h3 class="text-h5 mb-6">Похожие товары</h3>
          <v-row>
            <v-col
              v-for="relatedProduct in relatedProducts"
              :key="relatedProduct.id"
              cols="12"
              sm="6"
              md="4"
              lg="3"
            >
              <product-card :product="relatedProduct" />
            </v-col>
          </v-row>
        </section>
      </template>

      <!-- Ошибка -->
      <div v-else class="d-flex justify-center align-center my-16" style="min-height: 50vh;">
        <div class="text-center">
          <v-icon size="64" color="red">mdi-alert-circle</v-icon>
          <h3 class="text-h6 mt-4 mb-2">Товар не найден</h3>
          <p class="text-body-2">Возможно, товар был удален или URL неверный</p>
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@vueuse/head'
import { productsApi, categoriesApi } from '../services/api'
import { useCartStore } from '../stores/cart'
import { useSnackbarStore } from '../stores/snackbar'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ProductCard from '../components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const snackbarStore = useSnackbarStore()

const product = ref(null)
const breadcrumbs = ref([])
const relatedProducts = ref([])
const loading = ref(false)
const addingToCart = ref(false)
const quantity = ref(1)
const selectedImage = ref('')

const selectedImageComputed = computed(() => {
  if (!product.value) return '/placeholder-image.svg'
  return selectedImage.value || product.value.main_image || (product.value.images && product.value.images[0]) || '/placeholder-image.svg'
})

const fetchProduct = async () => {
  loading.value = true
  try {
    const response = await productsApi.getBySlug(route.params.slug)
    product.value = response.data.data
    
    // Устанавливаем изображение по умолчанию
    selectedImage.value = product.value.main_image || (product.value.images && product.value.images[0]) || ''
    
    // Загружаем хлебные крошки
    await fetchBreadcrumbs()
    
    // Загружаем похожие товары
    await fetchRelatedProducts()
    
    // Увеличиваем счетчик просмотров
    await incrementViews()
  } catch (error) {
    console.error('Ошибка загрузки товара:', error)
    product.value = null
  } finally {
    loading.value = false
  }
}

const fetchBreadcrumbs = async () => {
  if (!product.value.categories || product.value.categories.length === 0) {
    breadcrumbs.value = [
      { title: 'Главная', to: '/', disabled: false }
    ]
    return
  }
  
  try {
    const mainCategory = product.value.categories[0]
    const response = await categoriesApi.getBreadcrumbs(mainCategory.slug)
    breadcrumbs.value = [
      { title: 'Главная', to: '/', disabled: false },
      ...response.data.data.map(item => ({
        title: item.name,
        to: `/category/${item.slug}`,
        disabled: false
      })),
      { title: product.value.name, disabled: true }
    ]
  } catch (error) {
    console.error('Ошибка загрузки хлебных крошек:', error)
  }
}

const fetchRelatedProducts = async () => {
  if (!product.value.categories || product.value.categories.length === 0) return
  
  try {
    const mainCategory = product.value.categories[0]
    const response = await productsApi.getByCategory(mainCategory.slug, {
      limit: 4,
      exclude: product.value.id
    })
    relatedProducts.value = response.data.data.data || []
  } catch (error) {
    console.error('Ошибка загрузки похожих товаров:', error)
  }
}

const incrementViews = async () => {
  try {
    await productsApi.incrementViews(product.value.id)
  } catch (error) {
    console.error('Ошибка увеличения счетчика просмотров:', error)
  }
}

const addToCart = async () => {
  addingToCart.value = true
  try {
    const result = await cartStore.addToCart(product.value.id, quantity.value)
    if (result.success) {
      snackbarStore.show({
        message: `${quantity.value} ${product.value.unit} товара "${product.value.name}" добавлено в корзину`,
        color: 'success'
      })
    } else {
      snackbarStore.show({
        message: result.message || 'Ошибка добавления в корзину',
        color: 'error'
      })
    }
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
    snackbarStore.show({
      message: 'Произошла ошибка при добавлении товара',
      color: 'error'
    })
  } finally {
    addingToCart.value = false
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

const getDiscountPercent = () => {
  if (!product.value.old_price || product.value.old_price <= product.value.price) {
    return 0
  }
  return Math.round(((product.value.old_price - product.value.price) / product.value.old_price) * 100)
}

// Setup reactive SEO meta tags
useHead({
  title: computed(() => {
    if (!product.value) return 'Товар'
    return product.value.meta_title || product.value.name
  }),
  meta: computed(() => {
    if (!product.value) return []
    
    return [
      { name: 'description', content: product.value.meta_description || product.value.short_description },
      { name: 'keywords', content: product.value.meta_keywords ? product.value.meta_keywords.join(', ') : '' },
      // Open Graph
      { property: 'og:title', content: product.value.name },
      { property: 'og:description', content: product.value.short_description || product.value.description },
      { property: 'og:image', content: product.value.main_image },
      { property: 'og:type', content: 'product' },
      { property: 'product:price:amount', content: product.value.price },
      { property: 'product:price:currency', content: 'RUB' },
      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: product.value.name },
      { name: 'twitter:description', content: product.value.short_description },
      { name: 'twitter:image', content: product.value.main_image },
    ]
  })
})

// Следим за изменением slug в URL
watch(() => route.params.slug, () => {
  if (route.params.slug) {
    quantity.value = 1
    fetchProduct()
  }
}, { immediate: true })

onMounted(() => {
  // Начальная загрузка происходит в watcher
})
</script>

<style scoped>
.selected-image {
  border: 2px solid #1976D2;
}

.cursor-pointer {
  cursor: pointer;
}

.gap-2 {
  gap: 8px;
}

.cart-controls {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-wrap: wrap;
}

.quantity-wrapper {
  min-width: 120px;
  max-width: 150px;
}

.quantity-input {
  flex-shrink: 0;
}

.add-to-cart-btn {
  height: 56px !important;
  min-width: 140px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 600px) {
  .cart-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .quantity-wrapper {
    max-width: 100%;
  }
  
  .add-to-cart-btn {
    width: 100%;
    min-width: unset;
  }
}
</style>
