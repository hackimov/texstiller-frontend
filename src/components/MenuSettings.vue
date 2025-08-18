<template>
  <v-card class="menu-settings-card">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="mr-3">mdi-cog</v-icon>
      Настройки меню
    </v-card-title>
    
    <v-divider></v-divider>
    
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-switch
            v-model="settings.compactMode"
            label="Компактный режим"
            color="primary"
            hide-details
            @change="updateSettings"
          />
        </v-col>
        
        <v-col cols="12">
          <v-switch
            v-model="settings.showIcons"
            label="Показывать иконки"
            color="primary"
            hide-details
            @change="updateSettings"
          />
        </v-col>
        
        <v-col cols="12">
          <v-switch
            v-model="settings.autoExpand"
            label="Автоматически разворачивать"
            color="primary"
            hide-details
            @change="updateSettings"
          />
        </v-col>
        
        <v-col cols="12">
          <v-select
            v-model="settings.theme"
            :items="themeOptions"
            label="Тема меню"
            variant="outlined"
            density="compact"
            @update:model-value="updateSettings"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, reactive } from 'vue'

const settings = reactive({
  compactMode: false,
  showIcons: true,
  autoExpand: false,
  theme: 'gradient'
})

const themeOptions = [
  { title: 'Градиент (по умолчанию)', value: 'gradient' },
  { title: 'Темная тема', value: 'dark' },
  { title: 'Светлая тема', value: 'light' },
  { title: 'Материал', value: 'material' }
]

const updateSettings = () => {
  // Здесь можно добавить логику для сохранения настроек
  console.log('Настройки меню обновлены:', settings)
}
</script>

<style scoped>
.menu-settings-card {
  max-width: 400px;
  margin: 20px auto;
}
</style>
