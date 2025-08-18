<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <v-row class="contact-section">
        <!-- Контактная информация -->
        <v-col cols="12" md="6">
          <div class="contact-info-card">
            <div class="contact-info-header">
              <div class="contact-info-icon">
                <v-icon size="32" color="white">mdi-account-group</v-icon>
              </div>
              <div>
                <h2 class="contact-info-title">Наши контакты</h2>
                <p class="contact-info-description">
                  Выберите удобный способ связи
                </p>
              </div>
            </div>

            <div class="contact-items">
              <div class="contact-item" @click="callPhone">
                <div class="contact-item-icon phone-icon">
                  <v-icon size="24" color="white">mdi-phone</v-icon>
                </div>
                <div class="contact-item-content">
                  <h3 class="contact-item-title">Телефон</h3>
                  <a 
                    :href="`tel:${settingsStore.contactPhone.replace(/[^\d+]/g, '')}`" 
                    class="contact-item-value phone-link"
                  >
                      {{ settingsStore.contactPhone }}
                    </a>
                  <p class="contact-item-hint">Звоните в любое время</p>
                </div>
              </div>

              <div class="contact-item" @click="sendEmail">
                <div class="contact-item-icon email-icon">
                  <v-icon size="24" color="white">mdi-email</v-icon>
                </div>
                <div class="contact-item-content">
                  <h3 class="contact-item-title">Email</h3>
                  <a 
                    :href="`mailto:${settingsStore.contactEmail}`" 
                    class="contact-item-value email-link"
                  >
                      {{ settingsStore.contactEmail }}
                    </a>
                  <p class="contact-item-hint">Ответим в течение часа</p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-item-icon address-icon">
                  <v-icon size="24" color="white">mdi-map-marker</v-icon>
                </div>
                <div class="contact-item-content">
                  <h3 class="contact-item-title">Адрес</h3>
                  <p class="contact-item-value">
                    {{ settingsStore.contactAddress }}
                  </p>
                  <p class="contact-item-hint">Приходите к нам в офис</p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-item-icon schedule-icon">
                  <v-icon size="24" color="white">mdi-clock-outline</v-icon>
                </div>
                <div class="contact-item-content">
                  <h3 class="contact-item-title">Режим работы</h3>
                  <div class="contact-item-value" v-html="settingsStore.workingHours.replace(/\n/g, '<br>')">
                  </div>
                  <p class="contact-item-hint">Уточняйте актуальное расписание</p>
                </div>
              </div>
            </div>

              <!-- Социальные сети -->
            <div v-if="settingsStore.socialNetworks.length > 0" class="social-networks">
              <h3 class="social-title">Мы в социальных сетях</h3>
              <div class="social-buttons">
                  <v-btn
                    v-for="social in settingsStore.socialNetworks"
                    :key="social.name"
                    :color="getSocialColor(social.icon)"
                    :href="social.url"
                    target="_blank"
                  class="social-btn"
                  size="large"
                  elevation="2"
                  :title="social.name"
                  >
                  <v-icon size="20">{{ getSocialIcon(social.icon) }}</v-icon>
                  <span class="social-btn-text">{{ getSocialName(social.icon) }}</span>
                  </v-btn>
                </div>
              </div>
          </div>
        </v-col>

        <!-- Форма обратной связи -->
        <v-col cols="12" md="6">
          <div class="contact-form-card">
            <div class="contact-form-header">
              <h2 class="contact-form-title">Напишите нам</h2>
              <p class="contact-form-description">
                Заполните форму, и мы свяжемся с вами в ближайшее время
              </p>
            </div>

            <v-form ref="form" @submit.prevent="sendMessage" class="contact-form">
              <div class="form-row">
                <v-text-field
                  v-model="formData.name"
                  label="Ваше имя"
                  variant="outlined"
                  :rules="nameRules"
                  required
                  class="form-field"
                  prepend-inner-icon="mdi-account-outline"
                  color="primary"
                  hide-details="auto"
                />

                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  :rules="emailRules"
                  required
                  class="form-field"
                  prepend-inner-icon="mdi-email-outline"
                  color="primary"
                  hide-details="auto"
                />
              </div>

              <div class="form-row">
                <v-text-field
                  v-model="formData.phone"
                  label="Телефон"
                  variant="outlined"
                  class="form-field"
                  prepend-inner-icon="mdi-phone-outline"
                  color="primary"
                  hide-details="auto"
                />

                <v-select
                  v-model="formData.subject"
                  :items="subjects"
                  label="Тема сообщения"
                  variant="outlined"
                  :rules="subjectRules"
                  required
                  class="form-field"
                  prepend-inner-icon="mdi-tag-outline"
                  color="primary"
                  hide-details="auto"
                />
              </div>

                <v-textarea
                  v-model="formData.message"
                label="Ваше сообщение"
                  variant="outlined"
                  :rules="messageRules"
                  required
                rows="5"
                class="form-field-full"
                prepend-inner-icon="mdi-message-text-outline"
                color="primary"
                hide-details="auto"
                />

                <v-alert
                  v-if="submitError"
                  type="error"
                  variant="tonal"
                class="form-alert"
                closable
                >
                  {{ submitError }}
                </v-alert>

                <v-alert
                  v-if="submitSuccess"
                  type="success"
                  variant="tonal"
                class="form-alert"
                closable
                >
                <div class="success-content">
                  <v-icon size="24" class="me-2">mdi-check-circle</v-icon>
                  Сообщение отправлено! Мы свяжемся с вами в ближайшее время.
                </div>
                </v-alert>

                <v-btn
                  type="submit"
                class="submit-btn"
                  :loading="submitting"
                size="large"
                elevation="2"
                >
                <v-icon start>mdi-send</v-icon>
                  Отправить сообщение
                </v-btn>
              </v-form>
          </div>
        </v-col>
      </v-row>

      <!-- Карта -->
      <v-row class="mt-12">
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title class="text-h5">Как нас найти</v-card-title>
            <v-card-text>
              <LoadingSpinner v-if="settingsStore.loading" height="20vh" />
              <smart-map
                v-else
                :latitude="settingsStore.mapCoordinates.latitude"
                :longitude="settingsStore.mapCoordinates.longitude"
                :zoom="settingsStore.mapCoordinates.zoom"
                :height="400"
                :marker-title="settingsStore.companyName"
                :address="settingsStore.contactAddress"
                :working-hours="settingsStore.workingHours"
                :marker-content="mapMarkerContent"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Дополнительная информация -->
      <v-row class="mt-8 info-cards-row">
        <v-col cols="12" md="4">
          <v-card elevation="2" color="primary" dark class="text-center info-card">
            <v-card-text class="pa-6 info-card-content">
              <v-icon size="48" class="mb-3">mdi-truck-fast</v-icon>
              <h3 class="text-h6 mb-2">Быстрая доставка</h3>
              <p class="text-body-2">
                Доставляем по Москве в день заказа, по России за 1-3 дня
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card elevation="2" color="green" dark class="text-center info-card">
            <v-card-text class="pa-6 info-card-content">
              <v-icon size="48" class="mb-3">mdi-headset</v-icon>
              <h3 class="text-h6 mb-2">Поддержка 24/7</h3>
              <p class="text-body-2">
                Наша служба поддержки работает круглосуточно для вашего удобства
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card elevation="2" color="orange" dark class="text-center info-card">
            <v-card-text class="pa-6 info-card-content">
              <v-icon size="48" class="mb-3">mdi-shield-check</v-icon>
              <h3 class="text-h6 mb-2">Гарантия качества</h3>
              <p class="text-body-2">
                100% гарантия качества товара или возврат денег
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { contactApi } from '@/services/api'
import { useSettingsStore } from '@/stores/settings'
import { useThemeStore } from '@/stores/theme'
import SmartMap from '@/components/SmartMap.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const settingsStore = useSettingsStore()
const themeStore = useThemeStore()

const form = ref(null)
const submitting = ref(false)
const submitError = ref('')
const submitSuccess = ref(false)

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

const subjects = [
  'Вопрос о товаре',
  'Статус заказа',
  'Возврат/обмен',
  'Сотрудничество',
  'Техническая поддержка',
  'Другое'
]

// Computed свойство для содержимого маркера карты
const mapMarkerContent = computed(() => {
  if (!settingsStore.isLoaded) return ''
  
  return `
    <div style="max-width: 300px; font-family: Arial, sans-serif;">
      <h3 style="margin: 0 0 12px 0; color: #1976D2;">${settingsStore.companyName}</h3>
      <p style="margin: 8px 0;"><strong>📍 Адрес:</strong><br>${settingsStore.contactAddress}</p>
      <p style="margin: 8px 0;"><strong>📞 Телефон:</strong><br><a href="tel:${settingsStore.contactPhone.replace(/[^\d+]/g, '')}" style="color: #1976D2; text-decoration: none;">${settingsStore.contactPhone}</a></p>
      <p style="margin: 8px 0;"><strong>✉️ Email:</strong><br><a href="mailto:${settingsStore.contactEmail}" style="color: #1976D2; text-decoration: none;">${settingsStore.contactEmail}</a></p>
      <p style="margin: 8px 0;"><strong>🕒 Режим работы:</strong><br>${settingsStore.workingHours.replace(/\n/g, '<br>')}</p>
    </div>
  `
})

// Методы для социальных сетей
const getSocialIcon = (iconName) => {
  const iconMap = {
    'vk': 'mdi-alpha-v-circle',
    'vkontakte': 'mdi-alpha-v-circle',
    'telegram': 'mdi-send',
    'instagram': 'mdi-instagram',
    'whatsapp': 'mdi-whatsapp',
    'facebook': 'mdi-facebook',
    'twitter': 'mdi-twitter',
    'youtube': 'mdi-youtube',
    'linkedin': 'mdi-linkedin',
    'tiktok': 'mdi-music-note',
    'discord': 'mdi-discord',
    'skype': 'mdi-skype',
    'viber': 'mdi-phone',
    'odnoklassniki': 'mdi-alpha-o-circle',
    'ok': 'mdi-alpha-o-circle'
  }
  return iconMap[iconName.toLowerCase()] || 'mdi-web'
}

const getSocialColor = (iconName) => {
  const colorMap = {
    'vk': 'blue',
    'vkontakte': 'blue',
    'telegram': 'blue',
    'instagram': 'pink',
    'whatsapp': 'green',
    'facebook': 'blue',
    'twitter': 'blue',
    'youtube': 'red',
    'linkedin': 'blue',
    'tiktok': 'purple',
    'discord': 'purple',
    'skype': 'blue',
    'viber': 'purple',
    'odnoklassniki': 'orange',
    'ok': 'orange'
  }
  return colorMap[iconName.toLowerCase()] || 'primary'
}

const getSocialName = (iconName) => {
  const nameMap = {
    'vk': 'ВК',
    'vkontakte': 'ВКонтакте',
    'telegram': 'Telegram',
    'instagram': 'Instagram',
    'whatsapp': 'WhatsApp',
    'facebook': 'Facebook',
    'twitter': 'Twitter',
    'youtube': 'YouTube',
    'linkedin': 'LinkedIn',
    'tiktok': 'TikTok',
    'discord': 'Discord',
    'skype': 'Skype',
    'viber': 'Viber',
    'odnoklassniki': 'Одноклассники',
    'ok': 'ОК'
  }
  return nameMap[iconName.toLowerCase()] || iconName
}

// Правила валидации
const nameRules = [
  v => !!v || 'Имя обязательно',
  v => (v && v.length >= 2) || 'Имя должно содержать минимум 2 символа'
]

const emailRules = [
  v => !!v || 'Email обязателен',
  v => /.+@.+\..+/.test(v) || 'Email должен быть корректным'
]

const subjectRules = [
  v => !!v || 'Выберите тему сообщения'
]

const messageRules = [
  v => !!v || 'Сообщение обязательно',
  v => (v && v.length >= 10) || 'Сообщение должно содержать минимум 10 символов'
]

// Методы для обработки кликов
const callPhone = () => {
  window.location.href = `tel:${settingsStore.contactPhone.replace(/[^\d+]/g, '')}`
}

const sendEmail = () => {
  window.location.href = `mailto:${settingsStore.contactEmail}`
}

const sendMessage = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  submitting.value = true
  submitError.value = ''
  submitSuccess.value = false

  try {
    const response = await contactApi.send({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message
    })
    
    if (response.data.success) {
      submitSuccess.value = true
      
      // Очищаем форму
      Object.keys(formData).forEach(key => {
        formData[key] = ''
      })
      form.value.resetValidation()
      
      // Скрываем сообщение об успехе через 8 секунд
      setTimeout(() => {
        submitSuccess.value = false
      }, 8000)
    } else {
      submitError.value = response.data.message || 'Произошла ошибка при отправке сообщения.'
    }
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    // Обрабатываем ошибки валидации
    if (error.response?.status === 422 && error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat()
      submitError.value = errorMessages.join(' ')
    } else if (error.response?.data?.message) {
      submitError.value = error.response.data.message
    } else {
      submitError.value = 'Произошла ошибка при отправке сообщения. Попробуйте еще раз.'
    }
  } finally {
    submitting.value = false
  }
}

// Инициализация настроек при монтировании
onMounted(async () => {
  await settingsStore.init()
})
</script>

<style scoped>
/* Основные стили */
.contact-section {
  align-items: stretch;
}



/* Карточка контактной информации */
.contact-info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Темная тема для карточки контактной информации */
html.dark .contact-info-card {
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-info-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08);
}

html.dark .contact-info-card:hover {
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.6),
    0 4px 16px rgba(0, 0, 0, 0.3);
}

.contact-info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(25, 118, 210, 0.1);
}

html.dark .contact-info-header {
  border-bottom: 2px solid rgba(33, 150, 243, 0.2);
}

.contact-info-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3);
}

.contact-info-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.01em;
}

html.dark .contact-info-title {
  color: #ffffff;
}

.contact-info-description {
  font-size: 1rem;
  color: #666;
  margin: 0.25rem 0 0 0;
  font-weight: 400;
}

html.dark .contact-info-description {
  color: #b0b0b0;
}

/* Элементы контактов */
.contact-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  border: 1px solid rgba(25, 118, 210, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

html.dark .contact-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(33, 150, 243, 0.15);
}

.contact-item:hover {
  background: rgba(25, 118, 210, 0.04);
  border-color: rgba(25, 118, 210, 0.2);
  transform: translateX(4px);
}

html.dark .contact-item:hover {
  background: rgba(33, 150, 243, 0.08);
  border-color: rgba(33, 150, 243, 0.3);
}

.contact-item-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.phone-icon {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
}

.email-icon {
  background: linear-gradient(135deg, #2196f3 0%, #42a5f5 100%);
}

.address-icon {
  background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
}

.schedule-icon {
  background: linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%);
}

.contact-item-content {
  flex: 1;
}

.contact-item-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

html.dark .contact-item-title {
  color: #ffffff;
}

.contact-item-value {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 0.25rem 0;
  line-height: 1.5;
}

html.dark .contact-item-value {
  color: #e0e0e0;
}

.contact-item-hint {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
  font-style: italic;
}

html.dark .contact-item-hint {
  color: #a0a0a0;
}

.phone-link, .email-link {
  color: #1976d2;
  text-decoration: none;
  transition: color 0.2s ease;
}

html.dark .phone-link,
html.dark .email-link {
  color: #42a5f5;
}

.phone-link:hover, .email-link:hover {
  color: #1565c0;
  text-decoration: underline;
}

html.dark .phone-link:hover,
html.dark .email-link:hover {
  color: #64b5f6;
}

/* Социальные сети */
.social-networks {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(25, 118, 210, 0.1);
}

html.dark .social-networks {
  border-top: 2px solid rgba(33, 150, 243, 0.2);
}

.social-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1rem 0;
  text-align: center;
}

html.dark .social-title {
  color: #ffffff;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-btn {
  border-radius: 12px !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  min-width: 120px !important;
  height: 48px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.social-btn:hover {
  transform: translateY(-2px) scale(1.05);
}

.social-btn-text {
  font-size: 0.875rem;
  font-weight: 500;
  margin-left: 4px;
}

/* Адаптивность для кнопок социальных сетей */
@media (max-width: 600px) {
  .social-btn {
    min-width: 100px !important;
    height: 44px !important;
  }
  
  .social-btn-text {
    font-size: 0.8rem;
  }
}

/* Карточка формы */
.contact-form-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

html.dark .contact-form-card {
  background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-form-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08);
}

html.dark .contact-form-card:hover {
  box-shadow: 
    0 16px 48px rgba(0, 0, 0, 0.6),
    0 4px 16px rgba(0, 0, 0, 0.3);
}

.contact-form-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid rgba(25, 118, 210, 0.1);
}

html.dark .contact-form-header {
  border-bottom: 2px solid rgba(33, 150, 243, 0.2);
}

.contact-form-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
}

html.dark .contact-form-title {
  color: #ffffff;
}

.contact-form-description {
  font-size: 1rem;
  color: #666;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

html.dark .contact-form-description {
  color: #b0b0b0;
}

/* Форма */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-field {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-field-full {
  grid-column: 1 / -1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-field :deep(.v-field:hover) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.form-field :deep(.v-field--focused) {
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
}

.form-field-full :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-field-full :deep(.v-field:hover) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.form-field-full :deep(.v-field--focused) {
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.2);
}

/* Алерты */
.form-alert {
  border-radius: 12px;
  margin: 0;
}

.success-content {
  display: flex;
  align-items: center;
}

/* Кнопка отправки */
.submit-btn {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%) !important;
  color: white !important;
  border-radius: 16px !important;
  padding: 0.75rem 2rem !important;
  font-weight: 600 !important;
  font-size: 1rem !important;
  text-transform: none !important;
  letter-spacing: 0.02em !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: 0 4px 16px rgba(25, 118, 210, 0.3) !important;
}

.submit-btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 8px 24px rgba(25, 118, 210, 0.4) !important;
}

.submit-btn:active {
  transform: translateY(0) !important;
}

/* Адаптивность */
@media (max-width: 960px) {
  .contact-info-card,
  .contact-form-card {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  
  .contact-info-card,
  .contact-form-card {
    padding: 1rem;
    border-radius: 16px;
  }
  
  .contact-info-header {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .contact-item {
    padding: 1rem;
  }
  
  .contact-item-icon {
    width: 40px;
    height: 40px;
  }
  
  .social-buttons {
    gap: 0.5rem;
  }
  
  .info-card-content {
    min-height: 180px;
    padding: 1.5rem !important;
  }
  
  .info-card-content .v-icon {
    font-size: 40px !important;
  }
}

/* Информационные карточки */
.info-cards-row {
  align-items: stretch;
}

.info-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.info-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  text-align: center;
}

.info-card-content .v-icon {
  flex-shrink: 0;
}

.info-card-content h3 {
  flex-shrink: 0;
  margin-bottom: 1rem !important;
}

.info-card-content p {
  flex: 1;
  display: flex;
  align-items: center;
  margin: 0;
  line-height: 1.5;
}

/* Анимации */
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

.contact-info-card,
.contact-form-card {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.contact-item {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.contact-item:nth-child(1) { animation-delay: 0.1s; }
.contact-item:nth-child(2) { animation-delay: 0.2s; }
.contact-item:nth-child(3) { animation-delay: 0.3s; }
.contact-item:nth-child(4) { animation-delay: 0.4s; }

.info-card {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-card:nth-child(1) .info-card { animation-delay: 0.5s; }
.info-card:nth-child(2) .info-card { animation-delay: 0.6s; }
.info-card:nth-child(3) .info-card { animation-delay: 0.7s; }
</style>
