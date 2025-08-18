<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h5">Оформление заказа</v-card-title>

      <v-card-text>
        <v-form ref="form" @submit.prevent="submitOrder">
          <!-- Контактная информация -->
          <h3 class="text-h6 mb-4">Контактная информация</h3>
          
          <v-text-field
            v-model="orderData.customer_name"
            label="Имя *"
            variant="outlined"
            :rules="nameRules"
            required
            class="mb-3"
          />

          <v-text-field
            v-model="orderData.customer_email"
            label="Email *"
            type="email"
            variant="outlined"
            :rules="emailRules"
            required
            class="mb-3"
          />

          <v-text-field
            v-model="orderData.customer_phone"
            label="Телефон *"
            variant="outlined"
            :rules="phoneRules"
            required
            class="mb-3"
          />

          <!-- Адрес доставки -->
          <v-textarea
            v-model="orderData.customer_address"
            label="Адрес доставки"
            variant="outlined"
            rows="3"
            class="mb-3"
          />

          <!-- Примечания -->
          <v-textarea
            v-model="orderData.notes"
            label="Примечания к заказу (необязательно)"
            variant="outlined"
            rows="2"
            class="mb-4"
          />

          <!-- Товары в заказе -->
          <h3 class="text-h6 mb-4">Товары в заказе</h3>
          
          <v-list class="mb-4">
            <v-list-item
              v-for="item in cartItems"
              :key="item.id"
              class="px-0"
            >
              <template #prepend>
                <v-avatar size="50" class="mr-3">
                  <v-img
                    :src="item.product.main_image || '/placeholder-image.svg'"
                    :alt="item.product.name"
                  />
                </v-avatar>
              </template>

              <v-list-item-title>{{ item.product.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ formatPrice(item.product.price) }} × {{ item.quantity }} {{ item.product.unit }}
              </v-list-item-subtitle>

              <template #append>
                <span class="font-weight-bold">
                  {{ formatPrice(item.product.price * item.quantity) }}
                </span>
              </template>
            </v-list-item>
          </v-list>

          <!-- Итого -->
          <v-divider class="mb-3" />
          <div class="d-flex justify-space-between align-center mb-4">
            <span class="text-h6">Итого:</span>
            <span class="text-h6 font-weight-bold">
              {{ formatPrice(totalPrice) }}
            </span>
          </div>

          <!-- Информация о заказе -->
          <v-alert
            type="info"
            variant="tonal"
            class="mb-4"
          >
            После оформления заказа с вами свяжется наш менеджер для подтверждения деталей и согласования доставки.
          </v-alert>

          <!-- Ошибки -->
          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ error }}
          </v-alert>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="$emit('update:modelValue', false)"
          :disabled="loading"
        >
          Отмена
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          @click="submitOrder"
        >
          Оформить заказ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { ordersApi } from '../services/api'

const props = defineProps({
  modelValue: Boolean,
  cartItems: Array,
  totalPrice: Number
})

const emit = defineEmits(['update:modelValue', 'order-created'])

const authStore = useAuthStore()
const form = ref(null)
const loading = ref(false)
const error = ref('')

const orderData = reactive({
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  customer_address: '',
  notes: ''
})

// Правила валидации
const nameRules = [
  v => !!v || 'Имя обязательно',
  v => (v && v.length >= 2) || 'Имя должно содержать минимум 2 символа'
]

const emailRules = [
  v => !!v || 'Email обязателен',
  v => /.+@.+\..+/.test(v) || 'Email должен быть корректным'
]

const phoneRules = [
  v => !!v || 'Телефон обязателен',
  v => (v && v.length >= 10) || 'Введите корректный номер телефона'
]

const submitOrder = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  loading.value = true
  error.value = ''

  try {
    const response = await ordersApi.create({
      ...orderData,
      items: props.cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }))
    })

    const order = response.data.data
    emit('order-created', order)
  } catch (err) {
    error.value = err.response?.data?.message || 'Ошибка при оформлении заказа'
    console.error('Order creation error:', err)
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

// Заполняем данные пользователя при открытии диалога
watch(() => props.modelValue, (newValue) => {
  if (newValue && authStore.user) {
    orderData.customer_name = authStore.user.name || ''
    orderData.customer_email = authStore.user.email || ''
    orderData.customer_phone = authStore.user.phone || ''
    orderData.customer_address = authStore.user.address || ''
  }
})
</script>
