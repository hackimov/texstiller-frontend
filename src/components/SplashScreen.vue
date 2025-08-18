<template>
  <div v-if="visible" class="splash-screen">
    <div class="splash-content">
      <div class="company-name pulse-glow">
        Текстиллер
      </div>
      <div class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)

// Экспортируем функцию для ручного скрытия
const hideSplash = () => {
  // Добавляем класс для плавного исчезновения
  const splashElement = document.querySelector('.splash-screen')
  if (splashElement) {
    splashElement.style.opacity = '0'
    splashElement.style.transform = 'scale(1.1)'
    
    // Скрываем элемент после завершения анимации
    setTimeout(() => {
      visible.value = false
    }, 800)
  } else {
    visible.value = false
  }
}

// Автоматически скрыть сплешскрин через 4 секунды как fallback
onMounted(() => {
  setTimeout(() => {
    if (visible.value) {
      hideSplash()
    }
  }, 4000)
})

defineExpose({
  hideSplash
})
</script>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.8s ease-in-out, transform 0.8s ease-in-out;
}

.splash-content {
  text-align: center;
  color: white;
}

.company-name {
  font-family: 'BrandFont', sans-serif;
  font-size: 4rem;
  font-weight: normal;
  margin-bottom: 2rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Pulse + Glow анимация */
.pulse-glow {
  animation: pulseGlow 2s ease-in-out infinite;
}

@keyframes pulseGlow {
  0% {
    transform: scale(1);
    text-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 255, 255, 0.3);
  }
  50% {
    transform: scale(1.05);
    text-shadow: 
      0 6px 12px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(255, 255, 255, 0.6),
      0 0 40px rgba(255, 255, 255, 0.4),
      0 0 50px rgba(255, 255, 255, 0.2);
  }
  100% {
    transform: scale(1);
    text-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 255, 255, 0.3);
  }
}

/* Анимация загрузочных точек */
.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1rem;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: dotPulse 1.4s infinite ease-in-out;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

.dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes dotPulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Анимация исчезновения сплешскрина */
@keyframes fadeOut {
  0% {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
  }
  80% {
    opacity: 0.2;
    transform: scale(1.05);
  }
  100% {
    opacity: 0;
    visibility: hidden;
    transform: scale(1.1);
  }
}

/* Адаптивные стили */
@media (max-width: 768px) {
  .company-name {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .company-name {
    font-size: 2.5rem;
  }
}

/* Темная тема */
.v-theme--dark .splash-screen {
  background: linear-gradient(135deg, #0D47A1 0%, #1976D2 100%);
}
</style>
