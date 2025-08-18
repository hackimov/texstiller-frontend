<template>
  <div class="modern-side-menu">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">Загрузка меню...</p>
    </div>

    <!-- Menu Content -->
    <div v-else class="menu-content">


      <!-- Menu Items -->
      <div class="menu-items">
        <div
          v-for="category in categories"
          :key="category.id"
          class="menu-item-wrapper"
        >
          <!-- Parent Category -->
          <div
            class="menu-item"
            :class="{
              'has-children': category.children && category.children.length > 0,
              'expanded': expandedCategories.includes(category.id),
              'active': isActiveCategory(category.slug)
            }"
          >
            <!-- Основная кликабельная область (переход в категорию) -->
            <div 
              class="menu-item-content"
              @click="handleCategoryClick(category)"
            >
              <div class="menu-item-icon">
                <v-icon :color="getIconColor(category)" size="20">
                  {{ getCategoryIcon(category) }}
                </v-icon>
              </div>
              <span class="menu-item-text">{{ category.name }}</span>
            </div>
            
            <!-- Отдельная область для стрелки (разворачивание подменю) -->
            <div
              v-if="category.children && category.children.length > 0"
              class="menu-item-arrow-area"
              :class="{ 'rotated': expandedCategories.includes(category.id) }"
              @click="handleArrowClick($event, category.id)"
            >
              <div class="menu-item-arrow">
                <v-icon :color="themeStore.isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)'" size="18">mdi-chevron-right</v-icon>
              </div>
            </div>
            
            <div class="menu-item-hover-effect"></div>
          </div>

          <!-- Children Categories -->
          <transition name="slide-fade">
            <div
              v-if="category.children && category.children.length > 0 && expandedCategories.includes(category.id)"
              class="submenu"
            >
              <div
                v-for="child in category.children"
                :key="child.id"
                class="submenu-item"
                :class="{ 'active': isActiveCategory(child.slug) }"
                @click="navigateToCategory(child.slug)"
              >
                <div class="submenu-item-content">
                  <div class="submenu-item-dot"></div>
                  <span class="submenu-item-text">{{ child.name }}</span>
                </div>
                <div class="submenu-item-hover-effect"></div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Menu Footer -->
      <div class="menu-footer">
        <div class="menu-footer-decoration"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useThemeStore } from '../stores/theme'
import { categoriesApi } from '../services/api'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()

const categories = ref([])
const loading = ref(false)
const expandedCategories = ref([])

// Category icons mapping
const categoryIcons = {
  'default': 'mdi-folder',
  'electronics': 'mdi-laptop',
  'clothing': 'mdi-tshirt-crew',
  'books': 'mdi-book',
  'home': 'mdi-home',
  'sports': 'mdi-basketball',
  'beauty': 'mdi-face-woman',
  'toys': 'mdi-toy-brick',
  'automotive': 'mdi-car',
  'food': 'mdi-food'
}

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await categoriesApi.getTree()
    categories.value = response.data.data
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
  } finally {
    loading.value = false
  }
}

const getCategoryIcon = (category) => {
  // Try to match category name or slug to an icon
  const name = category.name.toLowerCase()
  const slug = category.slug.toLowerCase()
  
  for (const [key, icon] of Object.entries(categoryIcons)) {
    if (name.includes(key) || slug.includes(key)) {
      return icon
    }
  }
  
  return categoryIcons.default
}

const getIconColor = (category) => {
  if (isActiveCategory(category.slug)) {
    return themeStore.isDark ? '#FFD700' : '#1976D2'
  }
  return themeStore.isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.6)'
}

const isActiveCategory = (slug) => {
  return route.params.slug === slug
}

const handleCategoryClick = (category) => {
  // Всегда переходим в категорию при клике на основную область
  navigateToCategory(category.slug)
}

const handleArrowClick = (event, categoryId) => {
  // Останавливаем всплытие события, чтобы не сработал клик по категории
  event.stopPropagation()
  toggleCategory(categoryId)
}

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const navigateToCategory = (slug) => {
  router.push(`/category/${slug}`)
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.modern-side-menu {
  height: 100%;
  background: v-bind('themeStore.isDark ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" : "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)"');
  position: relative;
  overflow: hidden;
  border-right: 1px solid v-bind('themeStore.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"');
}

.modern-side-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: v-bind('themeStore.isDark ? "radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)" : "radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.01) 0%, transparent 50%)"');
  pointer-events: none;
}

/* Loading State */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: v-bind('themeStore.isDark ? "white" : "#333"');
}

.loading-spinner {
  position: relative;
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
}

.spinner-ring {
  width: 40px;
  height: 40px;
  border: 3px solid v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"');
  border-top: 3px solid v-bind('themeStore.isDark ? "white" : "#1976D2"');
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  opacity: 0.8;
  margin: 0;
}

/* Menu Content */
.menu-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Menu Items */
.menu-items {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.menu-item-wrapper {
  margin-bottom: 2px;
}

.menu-item {
  position: relative;
  margin: 0 12px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: stretch;
}

.menu-item:hover {
  transform: translateX(4px);
  box-shadow: v-bind('themeStore.isDark ? "0 4px 20px rgba(255, 255, 255, 0.1)" : "0 4px 20px rgba(0, 0, 0, 0.15)"');
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"');
}

.menu-item.active {
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(25, 118, 210, 0.1)"');
  box-shadow: v-bind('themeStore.isDark ? "0 4px 20px rgba(255, 255, 255, 0.1)" : "0 4px 20px rgba(25, 118, 210, 0.2)"');
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: v-bind('themeStore.isDark ? "linear-gradient(to bottom, #FFD700, #FFA500)" : "linear-gradient(to bottom, #1976D2, #1565C0)"');
  border-radius: 0 2px 2px 0;
}

.menu-item-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  gap: 12px;
  flex: 1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.menu-item.has-children .menu-item-content {
  padding-right: 56px; /* Оставляем место для стрелки */
}

.menu-item-content:hover .menu-item-text {
  color: v-bind('themeStore.isDark ? "#FFD700" : "#1976D2"');
}

.menu-item-icon {
  width: 32px;
  height: 32px;
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"');
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.menu-item-content:hover .menu-item-icon {
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(25, 118, 210, 0.1)"');
  transform: scale(1.1);
}

.menu-item-text {
  flex: 1;
  color: v-bind('themeStore.isDark ? "white" : "#333"');
  font-size: 15px;
  font-weight: 500;
  text-shadow: v-bind('themeStore.isDark ? "0 1px 2px rgba(0, 0, 0, 0.3)" : "none"');
  transition: all 0.3s ease;
}

/* Область стрелки для разворачивания подменю */
.menu-item-arrow-area {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0 12px 12px 0;
}

.menu-item-arrow-area:hover {
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"');
}

.menu-item-arrow-area.rotated .menu-item-arrow {
  transform: rotate(90deg);
}

.menu-item-arrow {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.menu-item-hover-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: v-bind('themeStore.isDark ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)" : "linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.1), transparent)"');
  transition: left 0.5s ease;
}

.menu-item:hover .menu-item-hover-effect {
  left: 100%;
}

/* Submenu */
.submenu {
  margin-left: 20px;
  margin-right: 12px;
  margin-top: 4px;
  border-left: 2px solid v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
  padding-left: 8px;
}

.submenu-item {
  position: relative;
  margin-bottom: 2px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submenu-item:hover {
  transform: translateX(2px);
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.05)"');
}

.submenu-item.active {
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(25, 118, 210, 0.1)"');
}

.submenu-item-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 10px 12px;
  gap: 10px;
}

.submenu-item-dot {
  width: 6px;
  height: 6px;
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.4)"');
  border-radius: 50%;
  transition: all 0.3s ease;
}

.submenu-item:hover .submenu-item-dot,
.submenu-item.active .submenu-item-dot {
  background: v-bind('themeStore.isDark ? "#FFD700" : "#1976D2"');
  transform: scale(1.3);
}

.submenu-item-text {
  color: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.7)"');
  font-size: 14px;
  font-weight: 400;
  transition: all 0.3s ease;
}

.submenu-item:hover .submenu-item-text,
.submenu-item.active .submenu-item-text {
  color: v-bind('themeStore.isDark ? "#FFD700" : "#1976D2"');
}

.submenu-item-hover-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: v-bind('themeStore.isDark ? "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)" : "linear-gradient(90deg, transparent, rgba(25, 118, 210, 0.05), transparent)"');
  transition: left 0.4s ease;
}

.submenu-item:hover .submenu-item-hover-effect {
  left: 100%;
}

/* Slide Fade Animation */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
  max-height: 0;
}

.slide-fade-leave-to {
  transform: translateY(-5px);
  opacity: 0;
  max-height: 0;
}

.slide-fade-enter-to,
.slide-fade-leave-from {
  transform: translateY(0);
  opacity: 1;
  max-height: 500px;
}

/* Menu Footer */
.menu-footer {
  padding: 16px 20px;
  border-top: 1px solid v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
}

.menu-footer-decoration {
  height: 3px;
  background: v-bind('themeStore.isDark ? "linear-gradient(90deg, #FFD700, #FFA500, #FF6B6B, #4ECDC4)" : "linear-gradient(90deg, #1976D2, #1565C0, #0D47A1, #42A5F5)"');
  border-radius: 2px;
  opacity: 0.8;
}

/* Scrollbar Styling */
.menu-items::-webkit-scrollbar {
  width: 4px;
}

.menu-items::-webkit-scrollbar-track {
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"');
  border-radius: 2px;
}

.menu-items::-webkit-scrollbar-thumb {
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"');
  border-radius: 2px;
}

.menu-items::-webkit-scrollbar-thumb:hover {
  background: v-bind('themeStore.isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"');
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-item-content {
    padding: 12px 14px;
  }
  
  .menu-item-text {
    font-size: 14px;
  }
}
</style>
