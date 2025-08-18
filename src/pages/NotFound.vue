<template>
  <div class="not-found-container">
    <v-container fluid class="py-8 px-6">
      <div class="text-center py-12">
        <v-icon size="120" color="primary">mdi-emoticon-sad-outline</v-icon>
        <h1 class="text-h3 mt-6 mb-4">404</h1>
        <h3 class="text-h5 mb-6">Страница не найдена</h3>
        <p class="text-body-1 mb-8">
          К сожалению, запрашиваемая страница не существует или была перемещена.
        </p>
        
        <div class="d-flex justify-center gap-4 flex-wrap">
          <v-btn
            color="primary"
            size="large"
            to="/"
          >
            <v-icon start>mdi-home</v-icon>
            На главную
          </v-btn>
          
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            @click="$router.back()"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            Назад
          </v-btn>
        </div>
        
        <div class="mt-8">
          <h3 class="text-h6 mb-4">Полезные ссылки:</h3>
          <div class="d-flex justify-center gap-2 flex-wrap">
            <v-chip
              v-for="link in usefulLinks"
              :key="link.title"
              :to="link.to"
              color="primary"
              variant="outlined"
            >
              {{ link.title }}
            </v-chip>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
const usefulLinks = [
  { title: 'Каталог', to: '/' },
  { title: 'Популярные товары', to: '/popular' },
  { title: 'О нас', to: '/about' },
  { title: 'Контакты', to: '/contacts' },
  { title: 'Доставка', to: '/delivery' },
]
</script>

<style scoped>
.not-found-container {
  min-height: calc(100vh - 128px);
  display: flex;
  align-items: center;
}

.gap-4 {
  gap: 16px;
}

.gap-2 {
  gap: 8px;
}
</style>
