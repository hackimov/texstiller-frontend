<template>
  <v-card class="menu-demo-card">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="mr-3">mdi-information</v-icon>
      Как работает новое меню
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text>
      <v-alert
        type="info"
        variant="tonal"
        class="mb-4"
      >
        <v-alert-title>Улучшенная навигация</v-alert-title>
        Теперь меню поддерживает два типа взаимодействия для категорий с подкатегориями:
      </v-alert>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="demo-card">
            <v-card-text class="text-center">
              <v-icon size="48" color="primary" class="mb-3">mdi-cursor-default-click</v-icon>
              <h4 class="mb-2">Клик по названию</h4>
              <p class="text-body-2">
                Переход в родительскую категорию для просмотра всех товаров этого раздела
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="demo-card">
            <v-card-text class="text-center">
              <v-icon size="48" color="secondary" class="mb-3">mdi-chevron-right</v-icon>
              <h4 class="mb-2">Клик по стрелке</h4>
              <p class="text-body-2">
                Разворачивание/сворачивание подкатегорий для детальной навигации
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-alert
        type="success"
        variant="tonal"
        class="mt-4"
      >
        <v-alert-title>Преимущества</v-alert-title>
        <ul class="mt-2">
          <li>Быстрый доступ к родительским категориям</li>
          <li>Удобная навигация по подкатегориям</li>
          <li>Интуитивно понятный интерфейс</li>
          <li>Адаптивный дизайн для всех устройств</li>
        </ul>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Демонстрационный компонент для объяснения функциональности меню
</script>

<style scoped>
.menu-demo-card {
  max-width: 800px;
  margin: 20px auto;
}

.demo-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.demo-card:hover {
  transform: translateY(-2px);
}
</style>
