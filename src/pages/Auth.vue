<template>
  <div>
    <v-container fluid class="py-8 px-6 auth-container">
      <v-row justify="center">
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-card elevation="8" class="auth-card">
            <v-card-title class="text-center pa-6">
              <h1 class="text-h4">{{ isLogin ? 'Вход' : 'Регистрация' }}</h1>
            </v-card-title>

            <v-card-text class="pa-6">
              <v-form ref="form" @submit.prevent="handleSubmit">
                <!-- Имя (только для регистрации) -->
                <v-text-field
                  v-if="!isLogin"
                  v-model="formData.name"
                  label="Имя"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  :rules="nameRules"
                  required
                  class="mb-3"
                />

                <!-- Email -->
                <v-text-field
                  v-model="formData.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  prepend-inner-icon="mdi-email"
                  :rules="emailRules"
                  required
                  class="mb-3"
                />

                <!-- Телефон (только для регистрации) -->
                <v-text-field
                  v-if="!isLogin"
                  v-model="formData.phone"
                  label="Телефон (необязательно)"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  class="mb-3"
                />

                <!-- Пароль -->
                <v-text-field
                  v-model="formData.password"
                  label="Пароль"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="passwordRules"
                  required
                  class="mb-3"
                  @click:append-inner="showPassword = !showPassword"
                />

                <!-- Подтверждение пароля (только для регистрации) -->
                <v-text-field
                  v-if="!isLogin"
                  v-model="formData.password_confirmation"
                  label="Подтвердите пароль"
                  :type="showPasswordConfirm ? 'text' : 'password'"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="passwordConfirmRules"
                  required
                  class="mb-3"
                  @click:append-inner="showPasswordConfirm = !showPasswordConfirm"
                />

                <!-- Адрес (только для регистрации) -->
                <v-textarea
                  v-if="!isLogin"
                  v-model="formData.address"
                  label="Адрес (необязательно)"
                  variant="outlined"
                  prepend-inner-icon="mdi-map-marker"
                  rows="2"
                  class="mb-3"
                />

                <!-- Согласие на обработку персональных данных (только для регистрации) -->
                <v-checkbox
                  v-if="!isLogin"
                  v-model="formData.personalDataConsent"
                  :rules="consentRules"
                  required
                  class="mb-3"
                >
                  <template #label>
                    <span class="text-body-2">
                      Я согласен(а) с 
                      <router-link 
                        to="/personal-data-consent" 
                        target="_blank" 
                        class="text-primary text-decoration-none"
                        @click.stop
                      >
                        обработкой персональных данных
                      </router-link>
                      и 
                      <router-link 
                        to="/privacy" 
                        target="_blank" 
                        class="text-primary text-decoration-none"
                        @click.stop
                      >
                        политикой конфиденциальности
                      </router-link>
                    </span>
                  </template>
                </v-checkbox>

                <!-- Ошибки -->
                <v-alert
                  v-if="error"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>

                <!-- Кнопка отправки -->
                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  :loading="isSubmitting"
                  :disabled="isSubmitting"
                  class="mb-4"
                >
                  <span v-if="!isSubmitting">
                    {{ isLogin ? 'Войти' : 'Зарегистрироваться' }}
                  </span>
                  <span v-else>
                    {{ authStore.loading ? (isLogin ? 'Вход...' : 'Регистрация...') : 'Объединение корзины...' }}
                  </span>
                </v-btn>

                <!-- Переключение между входом и регистрацией -->
                <div class="text-center">
                  <span class="text-body-2">
                    {{ isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?' }}
                  </span>
                  <v-btn
                    variant="text"
                    color="primary"
                    @click="toggleMode"
                  >
                    {{ isLogin ? 'Зарегистрироваться' : 'Войти' }}
                  </v-btn>
                </div>

                <!-- Забыли пароль (только для входа) -->
                <div v-if="isLogin" class="text-center mt-2">
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="showForgotPassword = true"
                  >
                    Забыли пароль?
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Диалог восстановления пароля -->
      <v-dialog v-model="showForgotPassword" max-width="400">
        <v-card>
          <v-card-title>Восстановление пароля</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="forgotEmail"
              label="Email"
              type="email"
              variant="outlined"
              required
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="showForgotPassword = false">Отмена</v-btn>
            <v-btn
              color="primary"
              :loading="forgotLoading"
              @click="handleForgotPassword"
            >
              Отправить
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { useThemeStore } from '../stores/theme'
import { authApi } from '../services/api'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const themeStore = useThemeStore()

const isLogin = ref(true)
const showPassword = ref(false)
const showPasswordConfirm = ref(false)
const showForgotPassword = ref(false)
const forgotEmail = ref('')
const forgotLoading = ref(false)
const error = ref('')
const form = ref(null)
const isSubmitting = ref(false)

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  address: '',
  personalDataConsent: false
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

const passwordRules = [
  v => !!v || 'Пароль обязателен',
  v => (v && v.length >= 6) || 'Пароль должен содержать минимум 6 символов'
]

const passwordConfirmRules = [
  v => !!v || 'Подтверждение пароля обязательно',
  v => v === formData.password || 'Пароли должны совпадать'
]

const consentRules = [
  v => !!v || 'Необходимо согласие на обработку персональных данных'
]

const handleSubmit = async () => {
  const { valid } = await form.value.validate()
  if (!valid) return

  error.value = ''
  isSubmitting.value = true

  try {
    let result
    if (isLogin.value) {
      result = await authStore.login({
        email: formData.email,
        password: formData.password
      })
    } else {
      result = await authStore.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        address: formData.address
      })
    }

    if (result.success) {
      // Объединяем корзину гостя с корзиной пользователя
      await cartStore.mergeGuestCart()
      
      // Определяем куда перенаправить пользователя
      let redirect = route.query.redirect || '/'
      
      // Если пользователь пришел из корзины, возвращаем его туда
      if (route.query.from === 'cart' || redirect.includes('/cart')) {
        redirect = '/cart'
      }
      
      router.push(redirect)
    } else {
      error.value = result.message
    }
  } catch (err) {
    error.value = 'Произошла ошибка. Попробуйте еще раз.'
    console.error('Auth error:', err)
  } finally {
    isSubmitting.value = false
  }
}

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  resetForm()
}

const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.password = ''
  formData.password_confirmation = ''
  formData.address = ''
  formData.personalDataConsent = false
  form.value?.resetValidation()
}

const handleForgotPassword = async () => {
  if (!forgotEmail.value) return

  forgotLoading.value = true
  try {
    await authApi.forgotPassword(forgotEmail.value)
    showForgotPassword.value = false
    // Показать уведомление об отправке письма
    alert('Инструкции по восстановлению пароля отправлены на ваш email')
  } catch (error) {
    console.error('Forgot password error:', error)
    alert('Ошибка отправки письма')
  } finally {
    forgotLoading.value = false
  }
}

onMounted(() => {
  // Если пользователь уже авторизован, перенаправляем его
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>

<style scoped>
.auth-container {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
}

.auth-card {
  backdrop-filter: blur(10px);
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

@media (max-width: 600px) {
  .auth-container {
    padding: 16px;
  }
}
</style>
