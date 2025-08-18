<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <div class="d-flex justify-center align-center" style="min-height: 60vh;">
        <div class="text-center">
          <!-- Иконка успеха -->
          <v-icon 
            size="120" 
            color="success"
            class="mb-6"
          >
            mdi-check-circle
          </v-icon>
          
          <!-- Заголовок -->
          <h1 class="text-h3 mb-4 font-weight-bold">
            Спасибо за заказ!
          </h1>
          
          <!-- Описание -->
          <p class="text-h6 mb-6 text-medium-emphasis">
            Ваш заказ успешно оформлен и принят в обработку.
          </p>
          
          <p class="text-body-1 mb-8 text-medium-emphasis">
            В ближайшее время с вами свяжется наш менеджер для подтверждения деталей заказа.
            <br>
            Информация о заказе также отправлена на указанную вами электронную почту.
          </p>
          
          <!-- Номер заказа, если передан -->
          <v-card 
            v-if="orderNumber" 
            class="mx-auto mb-8" 
            max-width="400"
            elevation="2"
          >
            <v-card-text class="text-center">
              <div class="text-caption text-medium-emphasis mb-1">
                Номер заказа
              </div>
              <div class="text-h5 font-weight-bold">
                {{ orderNumber }}
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Кнопки действий -->
          <div class="d-flex flex-column flex-sm-row gap-4 justify-center">
            <v-btn
              color="primary"
              size="large"
              variant="elevated"
              to="/"
              class="px-8"
            >
              <v-icon left>mdi-home</v-icon>
              На главную
            </v-btn>
            
            <v-btn
              v-if="authStore.isAuthenticated"
              color="primary"
              size="large"
              variant="outlined"
              to="/orders"
              class="px-8"
            >
              <v-icon left>mdi-clipboard-list</v-icon>
              Мои заказы
            </v-btn>
            
            <v-btn
              color="primary"
              size="large"
              variant="outlined"
              to="/"
              class="px-8"
            >
              <v-icon left>mdi-shopping</v-icon>
              Продолжить покупки
            </v-btn>
          </div>
          

        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const orderNumber = ref(null)

onMounted(() => {
  // Получаем номер заказа из query параметров
  if (route.query.orderNumber) {
    orderNumber.value = route.query.orderNumber
  }
})
</script>

<style scoped>
.gap-4 {
  gap: 1rem;
}

@media (max-width: 600px) {
  .d-flex.flex-column.flex-sm-row {
    flex-direction: column;
  }
}
</style>
