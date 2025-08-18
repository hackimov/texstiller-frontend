<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <!-- Загрузка -->
      <LoadingSpinner v-if="cartStore.loading" />

      <!-- Пустая корзина -->
      <div v-else-if="cartStore.isEmpty" class="d-flex justify-center align-center my-16" style="min-height: 50vh;">
        <div class="text-center">
          <v-icon size="120" color="grey-lighten-2">mdi-cart-outline</v-icon>
          <h3 class="text-h5 mt-6 mb-4">Корзина пуста</h3>
          <p class="text-body-1 mb-6">Добавьте товары в корзину, чтобы оформить заказ</p>
          <v-btn
            color="primary"
            size="large"
            to="/"
          >
            Перейти к покупкам
          </v-btn>
        </div>
      </div>

      <!-- Товары в корзине -->
      <template v-else>
        <v-row>
          <v-col cols="12" lg="8">
            <v-card elevation="2">
              <v-card-title>Товары ({{ cartStore.itemsCount }})</v-card-title>
              
              <v-list>
                <template
                  v-for="(item, index) in cartStore.items"
                  :key="item.id"
                >
                  <v-list-item class="px-4 py-3">
                    <template #prepend>
                      <v-avatar size="80" class="mr-4">
                        <v-img
                          :src="item.product.main_image || '/placeholder-image.svg'"
                          :alt="item.product.name"
                          cover
                        />
                      </v-avatar>
                    </template>

                    <v-list-item-title class="text-h6 mb-2">
                      <router-link
                        :to="`/product/${item.product.slug}`"
                        class="text-decoration-none"
                      >
                        {{ item.product.name }}
                      </router-link>
                    </v-list-item-title>

                    <v-list-item-subtitle class="mb-2">
                      Артикул: {{ item.product.sku }}
                    </v-list-item-subtitle>

                    <div class="d-flex align-center justify-space-between">
                      <div class="d-flex align-center">
                        <span class="text-h6 font-weight-bold mr-2">
                          {{ formatPrice(item.product.price) }}
                        </span>
                        <span class="text-caption">/ {{ item.product.unit }}</span>
                      </div>

                      <div class="d-flex align-center">
                        <!-- Количество -->
                        <v-btn
                          icon
                          size="small"
                          variant="outlined"
                          :disabled="item.quantity <= 1 || cartStore.loading"
                          @click="decreaseQuantity(item)"
                        >
                          <v-icon>mdi-minus</v-icon>
                        </v-btn>

                        <v-text-field
                          :model-value="item.quantity"
                          type="number"
                          min="1"
                          variant="outlined"
                          density="compact"
                          hide-details
                          style="width: 80px"
                          class="mx-2"
                          @update:model-value="updateQuantity(item, $event)"
                        />

                        <v-btn
                          icon
                          size="small"
                          variant="outlined"
                          :disabled="cartStore.loading"
                          @click="increaseQuantity(item)"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>

                        <!-- Общая стоимость позиции -->
                        <span class="text-h6 font-weight-bold ml-4">
                          {{ formatPrice(item.product.price * item.quantity) }}
                        </span>

                        <!-- Удалить -->
                        <v-btn
                          icon
                          color="red"
                          variant="text"
                          class="ml-2"
                          @click="removeItem(item)"
                        >
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </div>
                    </div>
                  </v-list-item>

                  <v-divider v-if="index < cartStore.items.length - 1" />
                </template>
              </v-list>

              <v-card-actions class="justify-end pa-4">
                <v-btn
                  color="red"
                  variant="outlined"
                  @click="clearCart"
                >
                  Очистить корзину
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Итоговая информация -->
          <v-col cols="12" lg="4">
            <v-card elevation="2" class="sticky-card">
              <v-card-title>Итого</v-card-title>
              
              <v-card-text>
                <div class="d-flex justify-space-between mb-2">
                  <span>Товаров:</span>
                  <span>{{ cartStore.itemsCount }}</span>
                </div>
                
                <div class="d-flex justify-space-between mb-4">
                  <span class="text-h6">Сумма:</span>
                  <span class="text-h6 font-weight-bold">
                    {{ formatPrice(cartStore.totalPrice) }}
                  </span>
                </div>

                <v-alert
                  v-if="!authStore.isAuthenticated"
                  type="info"
                  variant="tonal"
                  class="mb-4"
                >
                  Для оформления заказа необходимо войти в аккаунт
                </v-alert>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-btn
                  v-if="authStore.isAuthenticated"
                  color="primary"
                  size="large"
                  block
                  @click="proceedToCheckout"
                >
                  Оформить заказ
                </v-btn>
                
                <v-btn
                  v-else
                  color="primary"
                  size="large"
                  block
                  @click="$router.push({ path: '/auth', query: { redirect: '/cart', from: 'cart' } })"
                >
                  Войти и оформить заказ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Диалог оформления заказа -->
        <checkout-dialog
          v-model="showCheckout"
          :cart-items="cartStore.items"
          :total-price="cartStore.totalPrice"
          @order-created="onOrderCreated"
        />

        <!-- Диалог подтверждения очистки корзины -->
        <confirm-dialog
          v-model="showClearConfirm"
          title="Очистить корзину"
          message="Вы уверены, что хотите удалить все товары из корзины? Это действие нельзя отменить."
          confirm-text="Да, очистить"
          cancel-text="Отмена"
          confirm-color="red"
          icon="mdi-delete-sweep"
          icon-color="red"
          :loading="cartStore.loading"
          @confirm="confirmClearCart"
          @cancel="showClearConfirm = false"
        />
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import CheckoutDialog from '../components/CheckoutDialog.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const showCheckout = ref(false)
const showClearConfirm = ref(false)

const updateQuantity = async (item, newQuantity) => {
  const quantity = parseInt(newQuantity)
  if (quantity <= 0) return
  
  await cartStore.updateQuantity(item.id, quantity)
}

const increaseQuantity = async (item) => {
  try {
    const result = await cartStore.updateQuantity(item.id, item.quantity + 1)
    if (!result.success) {
      console.error('Ошибка обновления количества:', result.message)
    }
  } catch (error) {
    console.error('Ошибка при увеличении количества:', error)
  }
}

const decreaseQuantity = async (item) => {
  if (item.quantity > 1) {
    await cartStore.updateQuantity(item.id, item.quantity - 1)
  }
}

const removeItem = async (item) => {
  await cartStore.removeFromCart(item.id)
}

const clearCart = () => {
  showClearConfirm.value = true
}

const confirmClearCart = async () => {
  await cartStore.clearCart()
  showClearConfirm.value = false
}

const proceedToCheckout = () => {
  showCheckout.value = true
}

const onOrderCreated = (order) => {
  showCheckout.value = false
  // Очищаем корзину после успешного оформления заказа
  cartStore.clearCart()
  // Перенаправляем на страницу благодарности с номером заказа
  router.push({
    path: '/order-success',
    query: { orderNumber: order.order_number }
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

onMounted(async () => {
  // Ждем инициализации авторизации, если она еще не завершена
  if (authStore.loading) {
    await new Promise(resolve => {
      const unwatch = authStore.$subscribe((mutation, state) => {
        if (!state.loading) {
          unwatch()
          resolve()
        }
      })
    })
  }
  
  // Теперь загружаем корзину
  await cartStore.fetchCart()
})
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 100px;
}

@media (max-width: 1280px) {
  .sticky-card {
    position: static;
  }
}
</style>
