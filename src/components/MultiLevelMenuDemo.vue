<template>
  <v-card class="multilevel-demo-card">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="mr-3">mdi-file-tree</v-icon>
      Многоуровневое меню - Демонстрация
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text>
      <v-alert
        type="success"
        variant="tonal"
        class="mb-4"
      >
        <v-alert-title>✅ Исправлено</v-alert-title>
        <ul class="mt-2">
          <li><strong>Кнопка треугольника</strong> теперь занимает всю высоту пункта меню</li>
          <li><strong>Поддержка неограниченной вложенности</strong> - 3, 4, 5+ уровней</li>
          <li><strong>Рекурсивная архитектура</strong> для масштабируемости</li>
        </ul>
      </v-alert>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="feature-card">
            <v-card-text>
              <div class="text-center mb-3">
                <v-icon size="48" color="primary">mdi-arrow-expand-vertical</v-icon>
              </div>
              <h4 class="text-center mb-2">Полная высота кнопки</h4>
              <p class="text-body-2 text-center">
                Треугольник теперь кликабелен по всей высоте пункта меню для удобства использования
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card variant="outlined" class="feature-card">
            <v-card-text>
              <div class="text-center mb-3">
                <v-icon size="48" color="secondary">mdi-file-tree-outline</v-icon>
              </div>
              <h4 class="text-center mb-2">Неограниченная вложенность</h4>
              <p class="text-body-2 text-center">
                Поддержка любого количества уровней вложенности категорий
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <v-card variant="outlined" class="mt-4">
        <v-card-title class="text-h6">
          <v-icon class="mr-2">mdi-cog</v-icon>
          Технические улучшения
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <div class="tech-feature">
                <v-icon color="green" class="mb-2">mdi-refresh</v-icon>
                <h5>Рекурсивный компонент</h5>
                <p class="text-caption">MenuItemRecursive.vue автоматически обрабатывает любую глубину вложенности</p>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="tech-feature">
                <v-icon color="blue" class="mb-2">mdi-resize</v-icon>
                <h5>Адаптивные размеры</h5>
                <p class="text-caption">Размеры иконок и текста уменьшаются с каждым уровнем вложенности</p>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="tech-feature">
                <v-icon color="orange" class="mb-2">mdi-gesture-tap</v-icon>
                <h5>Улучшенная кликабельность</h5>
                <p class="text-caption">Стрелка занимает всю высоту (40px × 100%) для точного клика</p>
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
        <v-alert-title>🎯 Структура данных</v-alert-title>
        <p class="mt-2">Меню теперь поддерживает структуру любой глубины:</p>
        <pre class="mt-2 text-caption">
{
  "id": 1,
  "name": "Электроника",
  "children": [
    {
      "id": 2,
      "name": "Компьютеры",
      "children": [
        {
          "id": 3,
          "name": "Ноутбуки",
          "children": [
            {
              "id": 4,
              "name": "Игровые ноутбуки"
            }
          ]
        }
      ]
    }
  ]
}
        </pre>
      </v-alert>
    </v-card-text>
  </v-card>
</template>

<script setup>
// Демонстрационный компонент для многоуровневого меню
</script>

<style scoped>
.multilevel-demo-card {
  max-width: 900px;
  margin: 20px auto;
}

.feature-card {
  height: 100%;
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
}

.tech-feature {
  text-align: center;
  padding: 16px;
}

.tech-feature h5 {
  margin-bottom: 8px;
  font-weight: 600;
}

pre {
  background: rgba(0, 0, 0, 0.05);
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
