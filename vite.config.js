import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    // Полностью убираем vite-plugin-vuetify чтобы избежать автогенерации неправильных импортов
    // Все компоненты Vuetify импортируются глобально в main.js
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'localhost',
      'texstiller.local',
      '127.0.0.1',
      '0.0.0.0'
    ],
    watch: {
      usePolling: true
    }
  }
})
