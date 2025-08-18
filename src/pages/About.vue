<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <v-row>
        <v-col cols="12" md="6">
          <v-card elevation="0" class="h-100">
            <v-card-text class="pa-0">
              <h3 class="text-h5 mb-4"><span class="app-title">{{ settingsStore.companyName }}</span> - ваш надежный партнер в мире тканей</h3>
              <p class="text-body-1 mb-4">
                Мы специализируемся на продаже качественных тканей для дома и творчества. 
                Наша компания работает на рынке уже более 10 лет и зарекомендовала себя 
                как надежный поставщик высококачественных материалов.
              </p>
              <p class="text-body-1 mb-4">
                В нашем каталоге представлен широкий ассортимент тканей различных типов:
                хлопок, лен, шерсть, синтетические материалы и многое другое. Мы работаем 
                только с проверенными производителями и гарантируем качество каждого товара.
              </p>
              <p class="text-body-1">
                Наша цель - помочь вам воплотить в жизнь самые смелые творческие идеи, 
                предоставляя материалы высочайшего качества по доступным ценам.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-img
            src="/about-company.svg"
            alt="О компании Texstiller"
            max-height="400"
            contain
            class="rounded"
          />
          <!-- Логотип с частичным наложением на фото -->
          <div class="logo-container">
            <span class="app-title company-name-text">
              {{ settingsStore.companyName }}
            </span>
          </div>
        </v-col>
      </v-row>

      <!-- Наши преимущества -->
      <v-row class="mt-12">
        <v-col cols="12">
          <h3 class="text-h4 mb-8 text-center">Наши преимущества</h3>
        </v-col>
        
        <v-col
          v-for="advantage in advantages"
          :key="advantage.id"
          cols="12"
          md="4"
        >
          <v-card elevation="2" class="text-center h-100">
            <v-card-text class="pa-6">
              <v-icon
                :color="advantage.color"
                size="64"
                class="mb-4"
              >
                {{ advantage.icon }}
              </v-icon>
              <h3 class="text-h6 mb-3">{{ advantage.title }}</h3>
              <p class="text-body-2">{{ advantage.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Наша команда -->
      <v-row class="mt-12">
        <v-col cols="12">
          <h3 class="text-h4 mb-8 text-center">Наша команда</h3>
        </v-col>
        
        <!-- Загрузка -->
        <v-col v-if="teamLoading" cols="12">
          <LoadingSpinner height="30vh" />
        </v-col>

        <!-- Ошибка -->
        <v-col v-else-if="teamError" cols="12" class="text-center">
          <v-alert
            type="error"
            variant="tonal"
            class="mb-4"
          >
            {{ teamError }}
          </v-alert>
          <v-btn
            color="primary"
            variant="outlined"
            @click="loadTeam"
          >
            Попробовать снова
          </v-btn>
        </v-col>

        <!-- Команда -->
        <v-col
          v-else-if="hasTeam"
          v-for="member in team"
          :key="member.id"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card elevation="2" class="text-center h-100">
            <v-img
              :src="member.image_url || '/team/placeholder.jpg'"
              :alt="member.name"
              height="200"
              cover
              class="team-member-photo"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-icon size="64" color="grey-lighten-2">
                    mdi-account-circle
                  </v-icon>
                </div>
              </template>
            </v-img>
            <v-card-title class="text-h6">{{ member.name }}</v-card-title>
            <v-card-subtitle class="text-primary font-weight-medium">
              {{ member.position }}
            </v-card-subtitle>
            <v-card-text class="flex-grow-1">
              <p class="text-body-2">{{ member.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Нет данных -->
        <v-col v-else cols="12" class="text-center">
          <v-icon size="64" color="grey-lighten-2" class="mb-4">
            mdi-account-group-outline
          </v-icon>
          <p class="text-body-1 text-grey">
            Информация о команде временно недоступна
          </p>
        </v-col>
      </v-row>


    </v-container>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useTeam } from '@/composables/useTeam'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const settingsStore = useSettingsStore()

// Используем composable для работы с командой
const {
  team,
  loading: teamLoading,
  error: teamError,
  hasTeam,
  fetchTeam
} = useTeam()

const advantages = [
  {
    id: 1,
    icon: 'mdi-quality-high',
    title: 'Высокое качество',
    description: 'Работаем только с проверенными производителями и гарантируем качество каждого товара',
    color: 'green'
  },
  {
    id: 2,
    icon: 'mdi-truck-fast',
    title: 'Быстрая доставка',
    description: 'Доставляем заказы в кратчайшие сроки по всей России собственной службой доставки',
    color: 'blue'
  },
  {
    id: 3,
    icon: 'mdi-account-group',
    title: 'Профессиональная поддержка',
    description: 'Наши консультанты помогут выбрать подходящие материалы и ответят на все вопросы',
    color: 'orange'
  }
]

// Функция для загрузки команды
const loadTeam = async () => {
  await fetchTeam()
}

// Загружаем команду при монтировании компонента
onMounted(() => {
  loadTeam()
})
</script>

<style scoped>
.team-member-photo {
  transition: transform 0.3s ease;
}

.team-member-photo:hover {
  transform: scale(1.05);
}

.v-card.h-100 {
  display: flex;
  flex-direction: column;
}

.v-card.h-100 .v-card-text.flex-grow-1 {
  flex-grow: 1;
  display: flex;
  align-items: center;
}

/* Логотип с наложением на фото */
.logo-container {
  display: flex;
  justify-content: center;
  margin-top: -100px;
  position: relative;
  z-index: 2;
}

.company-name-text {
  font-size: 2.2rem !important;
  font-weight: normal !important;
  color: black !important;
  white-space: nowrap;
}

/* Адаптация для темной темы */
.v-theme--dark .company-name-text {
  color: white !important;
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .logo-container {
    margin-top: -80px;
  }
  
  .company-name-text {
    font-size: 1.8rem !important;
  }
}

@media (max-width: 480px) {
  .logo-container {
    margin-top: -65px;
  }
  
  .company-name-text {
    font-size: 1.5rem !important;
  }
}
</style>
