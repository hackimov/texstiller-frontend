<template>
  <div>
    <!-- Баннеры / Карусель -->
    <BannerCarousel
      :banners="banners"
      :loading="loadingBanners"
      :height="400"
      :interval="5000"
      button-text="Подробнее"
      placeholder-title="Добро пожаловать в Texstiller"
      placeholder-subtitle="Качественные ткани для дома и творчества"
      @banner-click="onBannerClick"
    />

    <v-container fluid class="py-8 px-6">
      <!-- Рекомендуемые товары -->
      <section class="mb-12">
        <h3 class="text-h4 mb-6">Рекомендуемые товары</h3>
        
        <LoadingSpinner v-if="loadingFeatured" height="30vh" />
        
        <v-row v-else>
          <v-col
            v-for="product in featuredProducts"
            :key="product?.id || `product-${Math.random()}`"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <product-card v-if="product" :product="product" />
          </v-col>
        </v-row>

        <div class="text-center mt-6">
          <v-btn
            color="primary"
            variant="outlined"
            to="/popular"
          >
            Посмотреть все
          </v-btn>
        </div>
      </section>

      <!-- Популярные категории -->
      <section class="mb-12">
        <h3 class="text-h4 mb-6">Популярные категории</h3>
        
        <LoadingSpinner v-if="loadingCategories" height="30vh" />
        
        <v-row v-else>
          <v-col
            v-for="category in popularCategories"
            :key="category?.id || `category-${Math.random()}`"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              v-if="category"
              elevation="2"
              @click="$router.push(`/category/${category.slug}`)"
              class="category-card"
            >
              <v-img
                :src="category.image || '/placeholder-category.jpg'"
                :alt="category.name"
                height="200"
                cover
              >
                <div class="d-flex align-end justify-center h-100 pa-4">
                  <h3 class="text-h5 text-white text-center category-title">
                    {{ category.name }}
                  </h3>
                </div>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- О нас -->
      <section class="mb-12">
        <v-row align="center">
          <v-col cols="12" md="6">
            <h3 class="text-h4 mb-4">Добро пожаловать в Texstiller</h3>
            <p class="text-body-1 mb-4">
              Мы специализируемся на продаже качественных тканей для дома и творчества. 
              В нашем каталоге вы найдете широкий ассортимент материалов для любых задач.
            </p>
            <p class="text-body-1 mb-6">
              Наш опыт и профессионализм помогут вам выбрать именно то, что нужно для 
              воплощения ваших идей в жизнь.
            </p>
            <v-btn
              color="primary"
              size="large"
              to="/about"
            >
              Узнать больше
            </v-btn>
          </v-col>
          <v-col cols="12" md="6">
            <v-img
              src="https://via.placeholder.com/600x300/E0E0E0/757575?text=О+нас"
              alt="О нас"
              height="300"
              cover
            />
          </v-col>
        </v-row>
      </section>

      <!-- Преимущества -->
      <section>
        <h3 class="text-h4 mb-6 text-center">Наши преимущества</h3>
        
        <v-row>
          <v-col
            v-for="advantage in advantages"
            :key="advantage.id"
            cols="12"
            md="4"
          >
            <v-card
              elevation="1"
              class="text-center pa-6"
            >
              <v-icon
                :color="advantage.color"
                size="48"
                class="mb-4"
              >
                {{ advantage.icon }}
              </v-icon>
              <h3 class="text-h6 mb-2">{{ advantage.title }}</h3>
              <p class="text-body-2">{{ advantage.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </section>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productsApi, categoriesApi } from '../services/api'
import { useBannersAutoload } from '../composables/useBanners'
import ProductCard from '../components/ProductCard.vue'
import BannerCarousel from '../components/BannerCarousel.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

// Используем композабл для баннеров
const { banners, loading: loadingBanners } = useBannersAutoload()

const featuredProducts = ref([])
const popularCategories = ref([])
const loadingFeatured = ref(false)
const loadingCategories = ref(false)

const advantages = [
  {
    id: 1,
    icon: 'mdi-quality-high',
    title: 'Высокое качество',
    description: 'Только проверенные производители и качественные материалы',
    color: 'green'
  },
  {
    id: 2,
    icon: 'mdi-truck-fast',
    title: 'Быстрая доставка',
    description: 'Доставляем заказы в кратчайшие сроки по всей России',
    color: 'blue'
  },
  {
    id: 3,
    icon: 'mdi-account-group',
    title: 'Профессиональная поддержка',
    description: 'Наши консультанты помогут выбрать подходящие материалы',
    color: 'orange'
  }
]

// Функция fetchBanners теперь не нужна, так как используется композабл

const fetchFeaturedProducts = async () => {
  loadingFeatured.value = true
  try {
    const response = await productsApi.getAll({ 
      is_featured: true, 
      limit: 8 
    })
    featuredProducts.value = response.data.data || []
  } catch (error) {
    console.error('Ошибка загрузки рекомендуемых товаров:', error)
    featuredProducts.value = []
  } finally {
    loadingFeatured.value = false
  }
}

const fetchPopularCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await categoriesApi.getAll({ 
      limit: 6,
      has_products: true 
    })
    popularCategories.value = response.data.data || []
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
    popularCategories.value = []
  } finally {
    loadingCategories.value = false
  }
}

const onBannerClick = (banner) => {
  console.log('Клик по баннеру:', banner.title)
  // Дополнительная логика обработки клика по баннеру
  // Например, отправка аналитики
}

onMounted(() => {
  // Баннеры загружаются автоматически через useBannersAutoload
  fetchFeaturedProducts()
  fetchPopularCategories()
})
</script>

<style scoped>
.category-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.category-card:hover {
  transform: translateY(-4px);
}

.category-title {
  background: rgba(0, 0, 0, 0.5);
  padding: 12px 16px;
  border-radius: 8px;
}
</style>
