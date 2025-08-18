<template>
  <div class="profile-page">


    <v-container fluid class="py-8 px-6">
      <v-row>
        <!-- Main Profile Form -->
        <v-col cols="12" lg="8">
          <v-card 
            class="profile-card mb-6"
            :class="{ 'form-loading': authStore.loading }"
          >
            <v-card-title class="d-flex align-center pa-6">
              <v-icon color="primary" class="mr-3">mdi-account-edit</v-icon>
              <span class="text-h5">Персональная информация</span>
            </v-card-title>
            
            <v-divider></v-divider>
            
            <v-card-text class="pa-6">
              <v-form ref="form" @submit.prevent="updateProfile">
                <v-text-field
                  v-model="profileData.name"
                  label="Имя *"
                  variant="outlined"
                  :rules="nameRules"
                  required
                  class="mb-3 profile-field"
                />

                <v-text-field
                  v-model="profileData.email"
                  label="Email *"
                  type="email"
                  variant="outlined"
                  :rules="emailRules"
                  required
                  class="mb-3 profile-field"
                />

                <v-text-field
                  v-model="profileData.phone"
                  label="Телефон"
                  variant="outlined"
                  class="mb-3 profile-field"
                />

                <dadata-address-autocomplete
                  v-model="profileData.address"
                  label="Адрес"
                  placeholder="Начните вводить адрес для получения подсказок..."
                  variant="outlined"
                  class="mb-4 profile-field"
                  :show-details="true"
                  @selection-change="onAddressSelect"
                  @error="onAddressError"
                />

                <!-- Детали адреса -->
                <v-expand-transition>
                  <v-card
                    v-if="selectedAddressData && selectedAddressData.data"
                    class="mb-4 address-details-card"
                    variant="outlined"
                    density="compact"
                  >
                    <v-card-title class="d-flex align-center pa-4">
                      <v-icon color="primary" class="mr-2" size="small">mdi-map-marker-check</v-icon>
                      <span class="text-subtitle-1">Детали адреса</span>
                    </v-card-title>
                    
                    <v-divider></v-divider>
                    
                    <v-card-text class="pa-4">
                      <v-row dense>
                        <v-col cols="12" sm="6" v-if="selectedAddressData.data.postal_code">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-mailbox</v-icon>
                            <span class="text-caption text-grey">Индекс:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ selectedAddressData.data.postal_code }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="selectedAddressData.data.region">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-map</v-icon>
                            <span class="text-caption text-grey">Регион:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ selectedAddressData.data.region }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="selectedAddressData.data.city">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-city</v-icon>
                            <span class="text-caption text-grey">Город:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ selectedAddressData.data.city }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="selectedAddressData.data.street">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-road</v-icon>
                            <span class="text-caption text-grey">Улица:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ selectedAddressData.data.street }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="selectedAddressData.data.house">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-home</v-icon>
                            <span class="text-caption text-grey">Дом:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ selectedAddressData.data.house }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="selectedAddressData.data.flat">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-door</v-icon>
                            <span class="text-caption text-grey">Квартира:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ selectedAddressData.data.flat }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" v-if="selectedAddressData.data.geo_lat && selectedAddressData.data.geo_lon">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-crosshairs-gps</v-icon>
                            <span class="text-caption text-grey">Координаты:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">
                              {{ selectedAddressData.data.geo_lat }}, {{ selectedAddressData.data.geo_lon }}
                            </span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-expand-transition>

                <!-- Сохраненные детали адреса -->
                <v-expand-transition>
                  <v-card
                    v-if="!selectedAddressData && authStore.user && authStore.user.address_details"
                    class="mb-4 saved-address-details-card"
                    variant="outlined"
                    density="compact"
                  >
                    <v-card-title class="d-flex align-center pa-4">
                      <v-icon color="success" class="mr-2" size="small">mdi-content-save-check</v-icon>
                      <span class="text-subtitle-1">Сохраненные детали адреса</span>
                    </v-card-title>
                    
                    <v-divider></v-divider>
                    
                    <v-card-text class="pa-4">
                      <v-row dense>
                        <v-col cols="12" sm="6" v-if="authStore.user.postal_code">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-mailbox</v-icon>
                            <span class="text-caption text-grey">Индекс:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ authStore.user.postal_code }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="authStore.user.region">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-map</v-icon>
                            <span class="text-caption text-grey">Регион:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ authStore.user.region }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="authStore.user.city">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-city</v-icon>
                            <span class="text-caption text-grey">Город:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ authStore.user.city }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="authStore.user.street">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-road</v-icon>
                            <span class="text-caption text-grey">Улица:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ authStore.user.street }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="authStore.user.house">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-home</v-icon>
                            <span class="text-caption text-grey">Дом:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ authStore.user.house }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" sm="6" v-if="authStore.user.flat">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-door</v-icon>
                            <span class="text-caption text-grey">Квартира:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">{{ authStore.user.flat }}</span>
                          </div>
                        </v-col>
                        
                        <v-col cols="12" v-if="authStore.user.geo_lat && authStore.user.geo_lon">
                          <div class="address-detail-item">
                            <v-icon color="grey" size="small" class="mr-2">mdi-crosshairs-gps</v-icon>
                            <span class="text-caption text-grey">Координаты:</span>
                            <span class="text-body-2 ml-2 font-weight-medium">
                              {{ authStore.user.geo_lat }}, {{ authStore.user.geo_lon }}
                            </span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-expand-transition>

                <!-- Alerts -->
                <v-slide-y-transition>
                  <v-alert
                    v-if="updateError"
                    type="error"
                    variant="tonal"
                    class="mb-4"
                    closable
                    @click:close="updateError = ''"
                  >
                    <template #prepend>
                      <v-icon>mdi-alert-circle</v-icon>
                    </template>
                    {{ updateError }}
                  </v-alert>
                </v-slide-y-transition>

                <v-slide-y-transition>
                  <v-alert
                    v-if="updateSuccess"
                    type="success"
                    variant="tonal"
                    class="mb-4"
                  >
                    <template #prepend>
                      <v-icon>mdi-check-circle</v-icon>
                    </template>
                    Профиль успешно обновлен
                  </v-alert>
                </v-slide-y-transition>

                <v-slide-y-transition>
                  <v-alert
                    v-if="addressError"
                    type="warning"
                    variant="tonal"
                    class="mb-4"
                    closable
                    @click:close="addressError = ''"
                  >
                    <template #prepend>
                      <v-icon>mdi-map-marker-alert</v-icon>
                    </template>
                    {{ addressError }}
                  </v-alert>
                </v-slide-y-transition>

                <!-- Action Buttons -->
                <div class="d-flex gap-3">
                  <v-btn
                    type="submit"
                    color="success"
                    :loading="authStore.loading"
                    class="profile-btn-primary mr-3"
                  >
                    Сохранить изменения
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    @click="resetForm"
                    class="profile-btn-secondary"
                  >
                    Отменить
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" lg="4">
          <!-- Statistics Cards -->
          <v-card class="profile-card mb-6 stats-card">
            <v-card-title class="d-flex align-center pa-6">
              <v-icon color="primary" class="mr-3">mdi-chart-line</v-icon>
              <span class="text-h6">Статистика</span>
            </v-card-title>
            
            <v-divider></v-divider>
            
            <v-card-text class="pa-6">
              <v-list density="compact" class="stats-list">
                <v-list-item class="stats-item">
                  <template #prepend>
                    <v-icon color="primary">mdi-cart</v-icon>
                  </template>
                  <v-list-item-title class="stats-title">Всего заказов</v-list-item-title>
                  <template #append>
                    <span class="font-weight-bold stats-value">{{ userStats.totalOrders }}</span>
                  </template>
                </v-list-item>

                <v-list-item class="stats-item">
                  <template #prepend>
                    <v-icon color="green">mdi-currency-rub</v-icon>
                  </template>
                  <v-list-item-title class="stats-title">Сумма покупок</v-list-item-title>
                  <template #append>
                    <span class="font-weight-bold stats-value">{{ formatPrice(userStats.totalAmount) }}</span>
                  </template>
                </v-list-item>

                <v-list-item class="stats-item">
                  <template #prepend>
                    <v-icon color="orange">mdi-calendar</v-icon>
                  </template>
                  <v-list-item-title class="stats-title">Дата регистрации</v-list-item-title>
                  <template #append>
                    <span class="stats-value">{{ formatDate(authStore.user?.created_at) }}</span>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Quick Actions -->
          <v-card class="profile-card mb-6">
            <v-card-title class="d-flex align-center pa-6">
              <v-icon color="primary" class="mr-3">mdi-lightning-bolt</v-icon>
              <span class="text-h6">Быстрые действия</span>
            </v-card-title>
            
            <v-divider></v-divider>
            
            <v-card-text class="pa-6">
              <v-btn
                color="primary"
                variant="outlined"
                block
                class="mb-3 quick-action-btn"
                to="/orders"
              >
                <v-icon start>mdi-clipboard-list</v-icon>
                Мои заказы
              </v-btn>

              <v-btn
                color="primary"
                variant="outlined"
                block
                class="mb-3 quick-action-btn"
                to="/cart"
              >
                <v-icon start>mdi-cart</v-icon>
                Корзина ({{ cartStore.itemsCount }})
              </v-btn>

              <v-btn
                color="primary"
                variant="outlined"
                block
                class="quick-action-btn"
                to="/popular"
              >
                <v-icon start>mdi-fire</v-icon>
                Популярные товары
              </v-btn>
            </v-card-text>
          </v-card>


        </v-col>
      </v-row>
    </v-container>


  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { authApi } from '../services/api'
import DadataAddressAutocomplete from '../components/DadataAddressAutocomplete.vue'

const authStore = useAuthStore()
const cartStore = useCartStore()

const form = ref(null)
const updateError = ref('')
const updateSuccess = ref(false)

const profileData = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  address_details: null,
  postal_code: '',
  region: '',
  city: '',
  street: '',
  house: '',
  flat: '',
  geo_lat: null,
  geo_lon: null
})

const userStats = reactive({
  totalOrders: 0,
  totalAmount: 0
})

const addressError = ref('')
const selectedAddressData = ref(null)

// Правила валидации
const nameRules = [
  v => !!v || 'Имя обязательно',
  v => (v && v.length >= 2) || 'Имя должно содержать минимум 2 символа'
]

const emailRules = [
  v => !!v || 'Email обязателен',
  v => /.+@.+\..+/.test(v) || 'Email должен быть корректным'
]

const updateProfile = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  updateError.value = ''
  updateSuccess.value = false

  try {
    const result = await authStore.updateProfile(profileData)
    if (result.success) {
      updateSuccess.value = true
      setTimeout(() => {
        updateSuccess.value = false
      }, 3000)
    } else {
      updateError.value = result.message
    }
  } catch (error) {
    updateError.value = 'Произошла ошибка при обновлении профиля'
    console.error('Profile update error:', error)
  }
}

const resetForm = () => {
  if (authStore.user) {
    profileData.name = authStore.user.name || ''
    profileData.email = authStore.user.email || ''
    profileData.phone = authStore.user.phone || ''
    profileData.address = authStore.user.address || ''
    profileData.address_details = authStore.user.address_details || null
    profileData.postal_code = authStore.user.postal_code || ''
    profileData.region = authStore.user.region || ''
    profileData.city = authStore.user.city || ''
    profileData.street = authStore.user.street || ''
    profileData.house = authStore.user.house || ''
    profileData.flat = authStore.user.flat || ''
    profileData.geo_lat = authStore.user.geo_lat || null
    profileData.geo_lon = authStore.user.geo_lon || null
  }
  updateError.value = ''
  updateSuccess.value = false
}

const fetchUserStats = async () => {
  try {
    const response = await authApi.getStats()
    if (response.data.success) {
      userStats.totalOrders = response.data.data.total_orders
      userStats.totalAmount = response.data.data.total_amount
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    // Оставляем значения по умолчанию (0) при ошибке
    userStats.totalOrders = 0
    userStats.totalAmount = 0
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

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU')
}

// Обработчики для автокомплита адресов
const onAddressSelect = (addressData) => {
  selectedAddressData.value = addressData
  addressError.value = ''
  
  // Извлекаем детали адреса для сохранения
  if (addressData && addressData.data) {
    const data = addressData.data
    
    // Обновляем дополнительные поля профиля из данных Dadata
    profileData.postal_code = data.postal_code || ''
    profileData.region = data.region || ''
    profileData.city = data.city || ''
    profileData.street = data.street || ''
    profileData.house = data.house || ''
    profileData.flat = data.flat || ''
    profileData.geo_lat = data.geo_lat || null
    profileData.geo_lon = data.geo_lon || null
    profileData.address_details = data
  } else {
    // Очищаем детали адреса если адрес не выбран
    selectedAddressData.value = null
  }
}

const onAddressError = (error) => {
  addressError.value = error
  console.error('Ошибка автокомплита адреса:', error)
}

// Наблюдение за изменениями пользователя в store
watch(() => authStore.user, (newUser) => {
  if (newUser) {
    resetForm()
  }
}, { immediate: true })

// Lifecycle
onMounted(async () => {
  // Если пользователь еще не загружен, загружаем его
  if (!authStore.user) {
    await authStore.fetchUser()
  }
  resetForm()
  fetchUserStats()
})
</script>

<style scoped>
/* Profile Page Styles */
.profile-page {
  min-height: 100vh;
  /* Используем стандартный фон Vuetify для обеих тем */
}



/* Cards */
.profile-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  border-radius: 24px !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04) !important;
  border: 1px solid rgba(255, 255, 255, 0.8) !important;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: fadeInUp 0.6s ease-out;
}

.profile-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08) !important;
}

/* Темная тема для карточек */
html.dark .profile-card {
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%) !important;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

html.dark .profile-card:hover {
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.6),
    0 4px 16px rgba(0, 0, 0, 0.3) !important;
}

.form-loading {
  opacity: 0.7;
  pointer-events: none;
}

/* Заголовки карточек */
.profile-card .v-card-title {
  color: #1a1a1a;
}

html.dark .profile-card .v-card-title {
  color: #ffffff;
}

/* Form Fields */
.profile-field {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-field:hover {
  transform: translateY(-2px);
}

/* Buttons */
.profile-btn-primary {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%) !important;
  color: white !important;
  border: none !important;
  border-radius: 16px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.02em !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3) !important;
  padding: 12px 32px !important;
  font-size: 16px !important;
  min-height: 48px !important;
}

.profile-btn-primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.4) !important;
}

.profile-btn-secondary {
  border-radius: 16px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  letter-spacing: 0.02em !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  padding: 12px 32px !important;
  font-size: 16px !important;
  min-height: 48px !important;
}

.profile-btn-secondary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}



/* Statistics */
.stats-list {
  background: transparent !important;
}

.stats-item {
  background: transparent !important;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stats-item:hover {
  background: rgba(25, 118, 210, 0.04) !important;
}

.stats-title {
  color: #333 !important;
  font-weight: 500 !important;
}

.stats-value {
  color: #1a1a1a !important;
  font-size: 1.1rem !important;
}

/* Темная тема для статистики */
html.dark .stats-item:hover {
  background: rgba(255, 255, 255, 0.05) !important;
}

html.dark .stats-title {
  color: rgba(255, 255, 255, 0.9) !important;
}

html.dark .stats-value {
  color: white !important;
}

/* Quick Actions */
.quick-action-btn {
  border-radius: 12px !important;
  font-weight: 600 !important;
  text-transform: none !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.quick-action-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}



/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Responsive Design */
@media (max-width: 600px) {
  .profile-card {
    border-radius: 16px;
    margin: 0 8px;
  }
  
  .quick-action-btn:hover {
    transform: none !important;
  }
}



/* Loading States */
.v-skeleton-loader {
  border-radius: 12px;
}

/* Address Details Cards */
.address-details-card,
.saved-address-details-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%) !important;
  border: 1px solid rgba(25, 118, 210, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.address-details-card:hover,
.saved-address-details-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.15) !important;
}

.address-detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
  transition: all 0.2s ease;
}

.address-detail-item:hover {
  background: rgba(25, 118, 210, 0.04);
  border-radius: 8px;
  padding: 4px 8px;
}

/* Темная тема для карточек деталей адреса */
html.dark .address-details-card,
html.dark .saved-address-details-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
}

html.dark .address-details-card:hover,
html.dark .saved-address-details-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3) !important;
}

html.dark .address-detail-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

/* Custom Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
}
</style>
