<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <!-- Загрузка -->
      <LoadingSpinner v-if="loading" />

      <!-- Нет заказов -->
      <div v-else-if="!orders || orders.length === 0" class="d-flex justify-center align-center my-16" style="min-height: 50vh;">
        <div class="text-center">
          <v-icon size="120" color="grey-lighten-2">mdi-clipboard-list-outline</v-icon>
          <h3 class="text-h5 mt-6 mb-4">У вас пока нет заказов</h3>
          <p class="text-body-1 mb-6">Оформите первый заказ, чтобы начать покупки</p>
          <v-btn
            color="primary"
            size="large"
            to="/"
          >
            Перейти к покупкам
          </v-btn>
        </div>
      </div>

      <!-- Список заказов -->
      <template v-else>
        <v-card
          v-for="order in (orders || [])"
          :key="order.id"
          elevation="2"
          class="mb-4"
        >
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <span class="text-h6">Заказ {{ order.order_number }}</span>
              <div class="text-caption text-grey">
                {{ formatDate(order.created_at) }}
              </div>
            </div>
            
            <v-chip
              :color="getStatusColor(order.status)"
              variant="tonal"
            >
              {{ order.status_label || getStatusLabel(order.status) }}
            </v-chip>
          </v-card-title>

          <v-card-text>
            <!-- Товары в заказе -->
            <v-list density="compact">
              <v-list-item
                v-for="item in (order.items || [])"
                :key="item.id"
                class="px-0"
              >
                <template #prepend>
                  <v-avatar size="40" class="mr-3">
                    <v-img
                      :src="item.product?.main_image || item.product?.image_urls?.thumbnail || '/placeholder-image.svg'"
                      :alt="item.product_name"
                    />
                  </v-avatar>
                </template>

                <v-list-item-title>{{ item.product_name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatPrice(item.price) }} × {{ item.quantity }}
                </v-list-item-subtitle>

                <template #append>
                  <span class="font-weight-bold">
                    {{ formatPrice(item.total) }}
                  </span>
                </template>
              </v-list-item>
            </v-list>

            <!-- Информация о доставке -->
            <v-divider class="my-3" />
            
            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-2">
                  <strong>Контактная информация:</strong>
                </div>
                <div>{{ order.customer_name }}</div>
                <div>{{ order.customer_email }}</div>
                <div>{{ order.customer_phone }}</div>
              </v-col>
              
              <v-col cols="12" md="6">
                <div class="mb-2">
                  <strong>Адрес доставки:</strong>
                </div>
                <div>{{ order.customer_address || 'Не указан' }}</div>
              </v-col>
            </v-row>

            <!-- Примечания -->
            <div v-if="order.notes" class="mt-3">
              <strong>Примечания:</strong>
              <p class="mt-1">{{ order.notes }}</p>
            </div>
          </v-card-text>

          <v-card-actions class="justify-space-between">
            <div class="text-h6 font-weight-bold">
              Итого: {{ formatPrice(order.total_amount) }}
            </div>
            
            <div>
              <v-btn
                v-if="order.can_be_cancelled"
                color="red"
                variant="outlined"
                size="small"
                @click="cancelOrder(order)"
              >
                Отменить
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>

        <!-- Пагинация -->
        <v-pagination
          v-if="totalPages > 1"
          v-model="currentPage"
          :length="totalPages"
          class="mt-8"
          @update:model-value="fetchOrders"
        />
      </template>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ordersApi } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const router = useRouter()

const orders = ref([])
const loading = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)

const statusLabels = {
  new: 'Новый',
  confirmation: 'Подтверждение',
  confirmed: 'Подтверждено',
  delivering: 'Доставляется',
  delivered: 'Доставлено',
  cancelled: 'Отменено'
}

const statusColors = {
  new: 'blue',
  confirmation: 'orange',
  confirmed: 'green',
  delivering: 'purple',
  delivered: 'success',
  cancelled: 'red'
}

const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await ordersApi.getAll({
      page: currentPage.value,
      per_page: 10
    })
    
    // response.data.data содержит массив заказов напрямую
    const data = response.data.data
    orders.value = data || []
    
    // Если API возвращает пагинацию, обновляем соответствующие поля
    // В противном случае устанавливаем базовые значения
    totalPages.value = response.data.last_page || 1
    currentPage.value = response.data.current_page || 1
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
    orders.value = []
  } finally {
    loading.value = false
  }
}

const cancelOrder = async (order) => {
  if (!confirm(`Вы уверены, что хотите отменить заказ ${order.order_number}?`)) {
    return
  }

  try {
    await ordersApi.cancel(order.id)
    // Обновляем статус локально
    order.status = 'cancelled'
  } catch (error) {
    console.error('Ошибка отмены заказа:', error)
    alert('Ошибка при отмене заказа')
  }
}



const getStatusLabel = (status) => {
  return statusLabels[status] || status
}

const getStatusColor = (status) => {
  return statusColors[status] || 'grey'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchOrders()
})
</script>
