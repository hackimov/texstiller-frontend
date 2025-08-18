<template>
  <v-card class="two-level-demo-card">
    <v-card-title class="d-flex align-center">
      <v-icon color="success" class="mr-3">mdi-check-circle</v-icon>
      Финальная версия - Двухуровневое меню
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text>
      <v-alert
        type="success"
        variant="tonal"
        class="mb-4"
      >
        <v-alert-title>✅ Реализовано</v-alert-title>
        <ul class="mt-2">
          <li><strong>Двухуровневая структура</strong> - корневые категории + подкатегории</li>
          <li><strong>Красивый дизайн подпунктов</strong> - точки вместо иконок</li>
          <li><strong>Полная высота кнопки треугольника</strong> - удобное управление</li>
          <li><strong>Защита в админке</strong> - ограничение на создание 3+ уровней</li>
        </ul>
      </v-alert>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="feature-card">
            <v-card-title class="text-h6">
              <v-icon color="primary" class="mr-2">mdi-view-list</v-icon>
              Структура меню
            </v-card-title>
            <v-card-text>
              <div class="menu-structure">
                <div class="menu-level-0">
                  <v-icon class="mr-2">mdi-folder</v-icon>
                  <span>Электроника</span>
                  <v-icon class="ml-auto">mdi-chevron-right</v-icon>
                </div>
                <div class="menu-level-1">
                  <div class="submenu-dot"></div>
                  <span>Ноутбуки</span>
                </div>
                <div class="menu-level-1">
                  <div class="submenu-dot"></div>
                  <span>Смартфоны</span>
                </div>
                <div class="menu-level-0 mt-3">
                  <v-icon class="mr-2">mdi-tshirt-crew</v-icon>
                  <span>Одежда</span>
                  <v-icon class="ml-auto">mdi-chevron-right</v-icon>
                </div>
                <div class="menu-level-1">
                  <div class="submenu-dot"></div>
                  <span>Мужская</span>
                </div>
                <div class="menu-level-1">
                  <div class="submenu-dot"></div>
                  <span>Женская</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="feature-card">
            <v-card-title class="text-h6">
              <v-icon color="orange" class="mr-2">mdi-shield-check</v-icon>
              Защита в админке
            </v-card-title>
            <v-card-text>
              <v-list density="compact">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="green" size="small">mdi-check</v-icon>
                  </template>
                  <v-list-item-title>Валидация в экране редактирования</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon color="green" size="small">mdi-check</v-icon>
                  </template>
                  <v-list-item-title>Проверка на уровне модели</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon color="green" size="small">mdi-check</v-icon>
                  </template>
                  <v-list-item-title>Ограничение выбора родителей</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <template #prepend>
                    <v-icon color="green" size="small">mdi-check</v-icon>
                  </template>
                  <v-list-item-title>Понятные сообщения об ошибках</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-card variant="outlined" class="mt-4">
        <v-card-title class="text-h6">
          <v-icon class="mr-2" color="blue">mdi-cog</v-icon>
          Технические детали
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <div class="tech-detail">
                <h6 class="mb-2">Frontend</h6>
                <ul class="text-caption">
                  <li>ModernSideMenu.vue - основной компонент</li>
                  <li>Двухуровневая структура без рекурсии</li>
                  <li>Красивые точки для подпунктов</li>
                  <li>Полная высота кнопки стрелки</li>
                </ul>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="tech-detail">
                <h6 class="mb-2">Backend - Экран</h6>
                <ul class="text-caption">
                  <li>MenuEditScreen.php</li>
                  <li>Проверка глубины в save()</li>
                  <li>Toast сообщения об ошибках</li>
                  <li>Валидация parent_id</li>
                </ul>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="tech-detail">
                <h6 class="mb-2">Backend - Модель</h6>
                <ul class="text-caption">
                  <li>Category.php</li>
                  <li>boot() метод с валидацией</li>
                  <li>getDepth() и canHaveChildren()</li>
                  <li>InvalidArgumentException</li>
                </ul>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      
      <v-alert
        type="info"
        variant="tonal"
        class="mt-4"
      >
        <v-alert-title>🎯 Преимущества двухуровневой структуры</v-alert-title>
        <ul class="mt-2">
          <li><strong>Простота использования</strong> - интуитивно понятная навигация</li>
          <li><strong>Производительность</strong> - быстрая загрузка без глубокой рекурсии</li>
          <li><strong>Поддержка</strong> - легче поддерживать и развивать</li>
          <li><strong>UX</strong> - пользователи не теряются в глубокой иерархии</li>
          <li><strong>Мобильность</strong> - отлично работает на мобильных устройствах</li>
        </ul>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Демонстрационный компонент финальной версии двухуровневого меню
</script>

<style scoped>
.two-level-demo-card {
  max-width: 1000px;
  margin: 20px auto;
}

.feature-card {
  height: 100%;
}

.menu-structure {
  background: rgba(0, 0, 0, 0.02);
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #1976D2;
}

.menu-level-0 {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: rgba(25, 118, 210, 0.1);
  border-radius: 8px;
  margin-bottom: 4px;
  font-weight: 500;
}

.menu-level-1 {
  display: flex;
  align-items: center;
  padding: 6px 12px 6px 24px;
  margin-bottom: 2px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.7);
}

.submenu-dot {
  width: 6px;
  height: 6px;
  background: #1976D2;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
}

.tech-detail h6 {
  color: #1976D2;
  font-weight: 600;
}

.tech-detail ul {
  list-style-type: disc;
  padding-left: 16px;
}

.tech-detail li {
  margin-bottom: 2px;
}
</style>
