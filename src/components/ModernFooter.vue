<template>
  <footer class="modern-footer">
    <!-- Main Footer Content -->
    <div class="footer-main">
      <v-container>
        <v-row>
          <!-- Company Info -->
          <v-col cols="12" md="4" class="footer-section">
            <div class="footer-brand">
              <h2 class="brand-title">{{ settingsStore.companyName }}</h2>
              <p class="brand-description">{{ settingsStore.companyDescription }}</p>
              
              <!-- Social Links -->
              <div class="social-links">
                <v-btn
                  v-for="social in socialLinks"
                  :key="social.name"
                  :href="social.url"
                  target="_blank"
                  icon
                  variant="text"
                  class="social-btn"
                  size="large"
                >
                  <v-icon>{{ social.icon }}</v-icon>
                </v-btn>
              </div>
            </div>
          </v-col>

          <!-- Quick Links -->
          <v-col cols="12" md="2" class="footer-section">
            <h3 class="footer-title">Навигация</h3>
            <ul class="footer-links">
              <li v-for="link in navigationLinks" :key="link.title">
                <router-link :to="link.to" class="footer-link">
                  {{ link.title }}
                </router-link>
              </li>
            </ul>
          </v-col>

          <!-- Services -->
          <v-col cols="12" md="2" class="footer-section">
            <h3 class="footer-title">Услуги</h3>
            <ul class="footer-links">
              <li v-for="service in serviceLinks" :key="service.title">
                <router-link :to="service.to" class="footer-link">
                  {{ service.title }}
                </router-link>
              </li>
            </ul>
          </v-col>

          <!-- Contact Info -->
          <v-col cols="12" md="4" class="footer-section">
            <h3 class="footer-title">Контакты</h3>
            <div class="contact-info">
              <div class="contact-item">
                <v-icon class="contact-icon">mdi-email</v-icon>
                <div class="contact-details">
                  <span class="contact-label">Email</span>
                  <a :href="`mailto:${settingsStore.contactEmail}`" class="contact-value">
                    {{ settingsStore.contactEmail }}
                  </a>
                </div>
              </div>
              
              <div class="contact-item">
                <v-icon class="contact-icon">mdi-phone</v-icon>
                <div class="contact-details">
                  <span class="contact-label">Телефон</span>
                  <a :href="`tel:${settingsStore.contactPhone}`" class="contact-value">
                    {{ settingsStore.contactPhone }}
                  </a>
                </div>
              </div>

              <div class="contact-item">
                <v-icon class="contact-icon">mdi-clock</v-icon>
                <div class="contact-details">
                  <span class="contact-label">Режим работы</span>
                  <span class="contact-value">{{ settingsStore.workingHours }}</span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Footer Bottom -->
    <div class="footer-bottom">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="6">
            <p class="copyright">
              © {{ currentYear }} <span class="company-name">{{ settingsStore.companyName }}</span>. Все права защищены.
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <div class="footer-bottom-links">
              <router-link to="/privacy" class="bottom-link">
                Политика конфиденциальности
              </router-link>
              <span class="divider">|</span>
              <router-link to="/terms" class="bottom-link">
                Условия использования
              </router-link>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Decorative Elements -->
    <div class="footer-decoration">
      <div class="decoration-line"></div>
      <div class="decoration-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'

const settingsStore = useSettingsStore()

const currentYear = computed(() => new Date().getFullYear())

const navigationLinks = [
  { title: 'Главная', to: '/' },
  { title: 'Каталог', to: '/catalog' },
  { title: 'О нас', to: '/about' },
  { title: 'Контакты', to: '/contacts' }
]

const serviceLinks = [
  { title: 'Доставка', to: '/delivery' },
  { title: 'Оплата', to: '/payment' },
  { title: 'Гарантия', to: '/warranty' },
  { title: 'Поддержка', to: '/support' }
]

// Получаем социальные сети из настроек
const socialLinks = computed(() => {
  const networks = settingsStore.socialNetworks
  return networks.map(network => {
    let icon = `mdi-${network.icon}`
    
    // Заменяем иконки для Telegram и VK на правильные
    if (network.icon === 'telegram') {
      icon = 'mdi-send' // Более подходящая иконка для Telegram
    } else if (network.icon === 'vk') {
      icon = 'mdi-alpha-v-circle' // Иконка V для VK
    }
    
    return {
      name: network.name,
      icon: icon,
      url: network.url
    }
  }).filter(network => network.url) // Показываем только заполненные социальные сети
})
</script>

<style scoped>
.modern-footer {
  background: rgb(var(--v-theme-primary));
  color: white;
  position: relative;
  overflow: hidden;
  width: calc(100% - 280px); /* Ширина минус navigation drawer */
  margin-top: auto;
  margin-left: 280px; /* Отступ для navigation drawer */
}

.modern-footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
}

.footer-main {
  padding: 2rem 0 1rem;
  position: relative;
  z-index: 2;
}

.footer-section {
  margin-bottom: 1rem;
}

/* Brand Section */
.footer-brand {
  max-width: 350px;
}

.brand-title {
  font-family: 'BrandFont', sans-serif;
  font-size: 2rem;
  font-weight: normal;
  margin-bottom: 1rem;
  color: white;
  line-height: 1.2;
}

.brand-description {
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.social-links {
  display: flex;
  gap: 0.5rem;
}

.social-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

/* Footer Titles */
.footer-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  position: relative;
  color: white;
}

.footer-title::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 2rem;
  height: 2px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 1px;
}

/* Links */
.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
}

.footer-link::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.8);
  transition: width 0.3s ease;
}

.footer-link:hover {
  color: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
}

.footer-link:hover::before {
  width: 100%;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;
  font-size: 1.25rem;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.contact-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.contact-value {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.contact-value:hover {
  color: white;
}

/* Footer Bottom */
.footer-bottom {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 0;
  position: relative;
  z-index: 2;
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 0;
}

.company-name {
  font-family: 'BrandFont', sans-serif;
}

.footer-bottom-links {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.bottom-link {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.bottom-link:hover {
  color: rgba(255, 255, 255, 0.9);
}

.divider {
  color: rgba(255, 255, 255, 0.3);
}

/* Decorative Elements */
.footer-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.decoration-line {
  position: absolute;
  top: 50%;
  right: -10%;
  width: 30%;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%);
  transform: translateY(-50%) rotate(-15deg);
}

.decoration-dots {
  position: absolute;
  bottom: 20%;
  left: 5%;
  display: flex;
  gap: 1rem;
}

.dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  animation: pulse 2s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.5s;
}

.dot:nth-child(3) {
  animation-delay: 1s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

/* Responsive Design */
@media (max-width: 960px) {
  .modern-footer {
    margin-left: 0 !important;
    width: 100% !important;
  }
  
  .footer-main {
    padding: 1.5rem 0 1rem;
  }
  
  .brand-title {
    font-size: 1.75rem;
  }
  
  .footer-bottom-links {
    justify-content: center;
    margin-top: 1rem;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .contact-info {
    align-items: center;
    text-align: center;
  }
  
  .contact-item {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .footer-main {
    padding: 1rem 0 0.5rem;
  }
  
  .brand-title {
    font-size: 1.5rem;
    text-align: center;
  }
  
  .brand-description {
    text-align: center;
  }
  
  .footer-title {
    text-align: center;
  }
  
  .footer-links {
    text-align: center;
  }
  
  .footer-bottom-links {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .divider {
    display: none;
  }
}

/* Темная тема - черный футер */
.v-theme--dark .modern-footer {
  background: linear-gradient(135deg, #121212 0%, #1e1e1e 50%, #2d2d2d 100%);
}

.v-theme--dark .footer-bottom {
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
