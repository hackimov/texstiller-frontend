# Texstiller Frontend - Vue 3 SPA

Фронтенд интернет-магазина тканей на Vue 3 с современным Material Design интерфейсом.

## Технологический стек

- **Vue 3** - основной фреймворк с Composition API
- **Vite** - сборщик и dev-сервер
- **Vue Router** - маршрутизация SPA
- **Pinia** - управление состоянием
- **Vuetify** - Material Design компоненты
- **Axios** - HTTP клиент для API
- **@vueuse/core** - композаблы и утилиты

## Быстрый старт

### 1. Установка зависимостей
```bash
# Установка Node.js зависимостей (требует Node.js 18+)
npm install --legacy-peer-deps
```

### 2. Настройка окружения
Создайте файл `.env` на основе `.env.example`:
```env
VITE_API_URL=http://texstiller.local/api
VITE_APP_NAME=Texstiller
```

### 3. Запуск dev-сервера
```bash
# Запуск Vite dev server
npm run dev

# Приложение будет доступно по адресу:
# http://localhost:5173
```

### 4. Сборка для продакшена
```bash
# Сборка оптимизированной версии
npm run build

# Предварительный просмотр сборки
npm run preview
```

## Архитектура приложения

### Структура проекта
```
frontend/
├── src/
│   ├── components/        # Переиспользуемые компоненты
│   │   ├── BannerCarousel.vue
│   │   ├── CategoryMenu.vue
│   │   ├── ProductCard.vue
│   │   └── CheckoutDialog.vue
│   ├── pages/            # Страницы приложения
│   │   ├── Home.vue
│   │   ├── Product.vue
│   │   ├── Cart.vue
│   │   ├── Auth.vue
│   │   └── Profile.vue
│   ├── stores/           # Pinia stores
│   │   ├── auth.js
│   │   ├── cart.js
│   │   ├── products.js
│   │   └── categories.js
│   ├── services/         # API сервисы
│   │   └── api.js
│   ├── composables/      # Композаблы
│   │   ├── useBanners.js
│   │   ├── useCart.js
│   │   └── useTokenRefresh.js
│   ├── router/           # Маршрутизация
│   │   └── index.js
│   ├── assets/           # Статические ресурсы
│   └── plugins/          # Плагины (Vuetify, etc.)
├── public/               # Публичные файлы
└── dist/                 # Собранная версия
```

## Основные компоненты

### App.vue - Главный компонент
- Основной layout с навигацией
- Responsive header с меню категорий
- Footer с контактной информацией
- Система уведомлений (snackbar)
- Переключатель темной/светлой темы

### Home.vue - Главная страница
- Карусель баннеров с автопрокруткой
- Сетка популярных товаров
- Быстрое добавление в корзину
- SEO оптимизация

### Product.vue - Страница товара
- Галерея изображений товара
- Детальное описание и характеристики
- Кнопка добавления в корзину
- Хлебные крошки навигации
- Динамические мета-теги

### Cart.vue - Корзина покупок
- Список товаров с возможностью изменения количества
- Подсчет общей стоимости
- Модальное окно оформления заказа
- Поддержка гостевых сессий

### Auth.vue - Авторизация
- Переключение между входом и регистрацией
- Валидация форм в реальном времени
- Интеграция с системой токенов
- Автоматическое перенаправление после входа

### Profile.vue - Личный кабинет
- Редактирование профиля пользователя
- Автокомплит адреса через Dadata
- История заказов
- Управление настройками аккаунта

## Управление состоянием (Pinia)

### Auth Store
```javascript
// Основные методы
login(credentials)      // Вход в систему
register(userData)      // Регистрация
logout()               // Выход
refreshToken()         // Обновление токена
updateProfile(data)    // Обновление профиля
```

### Cart Store
```javascript
// Управление корзиной
addToCart(product, quantity)    // Добавить товар
updateQuantity(itemId, qty)     // Изменить количество
removeFromCart(itemId)          // Удалить товар
clearCart()                     // Очистить корзину
createOrder(orderData)          // Создать заказ
```

### Products Store
```javascript
// Работа с товарами
fetchProducts(filters)          // Получить список товаров
fetchProduct(id)               // Получить товар по ID
searchProducts(query)          // Поиск товаров
```

### Categories Store
```javascript
// Управление категориями
fetchCategories()              // Получить дерево категорий
getCategoryProducts(id)        // Товары категории
```

## Композаблы (Composables)

### useBanners
Управление баннерами главной страницы:
```javascript
const { banners, loading, error } = useBannersAutoload()
```

### useCart
Логика работы с корзиной:
```javascript
const { 
  addToCart, 
  updateQuantity, 
  removeFromCart,
  cartTotal 
} = useCart()
```

### useTokenRefresh
Автоматическое обновление токенов:
```javascript
const { startTokenRefresh, stopTokenRefresh } = useTokenRefresh()
```

## Интеграции

### Dadata автокомплит адресов
Компонент `DadataAddressAutocomplete.vue` для подсказок адресов:

**Возможности:**
- Задержка 3 секунды перед запросом
- Кэширование результатов в памяти
- Отмена предыдущих запросов
- Автоматическое сохранение деталей адреса

**Использование:**
```vue
<dadata-address-autocomplete
  v-model="address"
  label="Адрес"
  :show-details="true"
  @selection-change="onAddressSelect"
/>
```

### Система автоматического обновления токенов
Axios interceptors автоматически обрабатывают:
- Заголовок `X-Token-Refresh-Required` для фонового обновления
- 401 ошибки с попыткой обновления токена
- Защита от дублирования запросов на обновление

### SEO оптимизация
- Динамические мета-теги через Vue Meta
- Open Graph теги для социальных сетей
- Структурированные данные для поисковых систем
- Canonical URLs для предотвращения дублирования

## Настройка шрифтов

### Подключение кастомных шрифтов
Для подключения шрифтов (например, Montserrat) добавьте в `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Затем настройте в Vuetify:
```javascript
// plugins/vuetify.js
const vuetify = createVuetify({
  theme: {
    themes: {
      light: {
        colors: { /* цвета */ }
      }
    }
  },
  defaults: {
    VBtn: {
      style: 'font-family: Montserrat, sans-serif;'
    }
  }
})
```

## Адаптивный дизайн

### Breakpoints Vuetify
- **xs**: < 600px (мобильные)
- **sm**: 600px - 960px (планшеты)
- **md**: 960px - 1264px (маленькие десктопы)
- **lg**: 1264px - 1904px (большие десктопы)
- **xl**: > 1904px (очень большие экраны)

### Responsive компоненты
```vue
<v-container>
  <v-row>
    <v-col cols="12" sm="6" md="4" lg="3">
      <!-- Адаптивная сетка товаров -->
    </v-col>
  </v-row>
</v-container>
```

## Темизация

### Поддержка темной/светлой темы
Автоматическое переключение тем с сохранением в localStorage:

```javascript
// В App.vue
const theme = useTheme()
const toggleTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}
```

### Кастомизация цветов
```javascript
// plugins/vuetify.js
const lightTheme = {
  dark: false,
  colors: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  }
}
```

## Производительность

### Оптимизации
- **Lazy loading** компонентов через `defineAsyncComponent`
- **Code splitting** по маршрутам
- **Tree shaking** неиспользуемого кода
- **Минификация** и сжатие в продакшене
- **Кэширование** API запросов

### Lazy loading маршрутов
```javascript
// router/index.js
const routes = [
  {
    path: '/product/:id',
    component: () => import('../pages/Product.vue')
  }
]
```

## Тестирование

### Настройка тестовой среды
```bash
# Установка зависимостей для тестирования
npm install --save-dev @vue/test-utils vitest jsdom

# Запуск тестов
npm run test

# Тесты с покрытием
npm run test:coverage
```

### Пример теста компонента
```javascript
// tests/components/ProductCard.test.js
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'

describe('ProductCard', () => {
  it('renders product information', () => {
    const product = { id: 1, name: 'Test Product', price: 100 }
    const wrapper = mount(ProductCard, { props: { product } })
    
    expect(wrapper.text()).toContain('Test Product')
    expect(wrapper.text()).toContain('100')
  })
})
```

## Развертывание

### Сборка для продакшена
```bash
# Сборка оптимизированной версии
npm run build

# Файлы будут созданы в папке dist/
```

### Настройка веб-сервера
Для SPA необходимо настроить fallback на `index.html`:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Docker продакшен
```dockerfile
# Dockerfile для продакшена
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
```

## Отладка

### Vue DevTools
Установите расширение Vue DevTools для браузера для отладки:
- Просмотр состояния компонентов
- Мониторинг Pinia stores
- Анализ производительности
- Отслеживание событий

### Полезные команды
```bash
# Анализ размера bundle
npm run build -- --analyze

# Проверка зависимостей
npm audit

# Обновление зависимостей
npm update
```

## Лучшие практики

### Структура компонентов
- Используйте Composition API для новых компонентов
- Выносите логику в композаблы для переиспользования
- Применяйте TypeScript для типизации (опционально)
- Следуйте принципам single responsibility

### Производительность
- Используйте `v-memo` для дорогих вычислений
- Применяйте `shallowRef` для больших объектов
- Оптимизируйте изображения (WebP, lazy loading)
- Минимизируйте количество watchers

### Доступность (a11y)
- Используйте семантические HTML теги
- Добавляйте `alt` атрибуты к изображениям
- Обеспечьте навигацию с клавиатуры
- Тестируйте с screen readers

## Поддержка

При возникновении проблем:
1. Проверьте консоль браузера на ошибки
2. Убедитесь в правильности настроек `.env`
3. Проверьте доступность API backend'а
4. Очистите кэш браузера и перезапустите dev-сервер

## Changelog

### v1.0.0 (текущая версия)
- ✅ Базовая архитектура Vue 3 + Vuetify
- ✅ Система каталога с категориями
- ✅ Корзина и оформление заказов
- ✅ Авторизация и личный кабинет
- ✅ Интеграция с Dadata
- ✅ Автообновление токенов
- ✅ SEO оптимизация
- ✅ Адаптивный дизайн
- ✅ Темная/светлая тема

### Планы развития
- 🔄 PWA поддержка
- 🔄 Офлайн режим
- 🔄 Push уведомления
- 🔄 Интеграция с картами
- 🔄 Расширенная фильтрация товаров
