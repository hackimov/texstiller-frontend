<template>
  <v-card
    v-if="product"
    class="product-card"
    elevation="2"
    @click="goToProduct"
  >
    <v-img
      :src="product.main_image || '/placeholder-image.svg'"
      :alt="product.name || 'Товар'"
      height="120"
      cover
    >
      <template #placeholder>
        <v-skeleton-loader type="image" />
      </template>
    </v-img>

    <v-card-title class="text-caption py-0 px-2">
      {{ product.name || 'Название товара' }}
    </v-card-title>



    <v-card-text class="py-0 px-2">
      <div class="d-flex align-center mb-1">
        <v-chip
          v-if="product.old_price && product.old_price > product.price"
          color="red"
          size="x-small"
          class="mr-2"
        >
          -{{ getDiscountPercent(product) }}%
        </v-chip>
        
        <span
          v-if="product.old_price && product.old_price > product.price"
          class="text-decoration-line-through text-grey mr-2 text-caption"
        >
          {{ formatPrice(product.old_price) }}
        </span>
        
        <span class="text-body-2 font-weight-bold">
          {{ formatPrice(product.price || 0) }}
        </span>
        
        <span class="text-overline ml-1">/ {{ product.unit || 'шт' }}</span>
      </div>

      <v-chip
        v-if="product.is_featured"
        color="orange"
        size="x-small"
        class="mb-0"
      >
        Рекомендуем
      </v-chip>

      <div class="d-flex align-center">
        <v-icon
          :color="(product.quantity || 0) > 0 ? 'green' : 'red'"
          size="small"
          class="mr-1"
        >
          {{ (product.quantity || 0) > 0 ? 'mdi-check-circle' : 'mdi-close-circle' }}
        </v-icon>
        <span class="text-overline">
          {{ (product.quantity || 0) > 0 ? 'В наличии' : 'Нет в наличии' }}
        </span>
      </div>
    </v-card-text>

    <v-card-actions class="pt-0 px-2 pb-1">
      <v-btn
        :disabled="loading"
        :loading="loading"
        color="primary"
        variant="outlined"
        size="x-small"
        block
        @click.stop="addToCart"
        class="text-caption"
      >
        В корзину
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useSnackbarStore } from '../stores/snackbar'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()
const cartStore = useCartStore()
const snackbarStore = useSnackbarStore()
const loading = ref(false)

const goToProduct = () => {
  if (props.product && props.product.slug) {
    router.push(`/product/${props.product.slug}`)
  }
}

const addToCart = async () => {
  if (!props.product || !props.product.id) {
    return
  }
  
  loading.value = true
  try {
    const result = await cartStore.addToCart(props.product.id, 1)
    if (result.success) {
      snackbarStore.show({
        message: 'Товар добавлен в корзину',
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
    loading.value = false
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

const getDiscountPercent = (product) => {
  if (!product.old_price || product.old_price <= product.price) {
    return 0
  }
  return Math.round(((product.old_price - product.price) / product.old_price) * 100)
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  height: 250px; /* Фиксированная высота карточки */
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-card .v-card-text {
  flex: 1;
  overflow: hidden;
}

.product-card .v-card-title {
  height: 24px; /* Фиксированная высота заголовка */
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}



.product-card .v-card-actions {
  flex-shrink: 0;
}
</style>
