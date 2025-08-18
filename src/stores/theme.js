import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(false)
  const theme = useTheme()

  const currentTheme = computed(() => isDark.value ? 'dark' : 'light')

  const initTheme = () => {
    // Загружаем сохраненную тему из localStorage
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // Используем системную тему по умолчанию
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    applyTheme()
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
    applyTheme()
    saveTheme()
  }

  const setTheme = (dark) => {
    isDark.value = dark
    applyTheme()
    saveTheme()
  }

  const applyTheme = () => {
    // Используем новый метод для изменения темы в Vuetify 3
    if (theme && theme.global) {
      // Используем рекомендованный метод theme.change() согласно предупреждению в консоли
      if (typeof theme.global.name === 'object' && theme.global.name.value) {
        theme.global.name.value = currentTheme.value
      }
    }
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  const saveTheme = () => {
    localStorage.setItem('theme', currentTheme.value)
  }

  return {
    isDark,
    currentTheme,
    initTheme,
    toggleTheme,
    setTheme
  }
})
