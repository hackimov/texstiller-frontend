// Pages
import Home from '../pages/Home.vue'
import Category from '../pages/Category.vue'
import Product from '../pages/Product.vue'
import Search from '../pages/Search.vue'
import Cart from '../pages/Cart.vue'
import Auth from '../pages/Auth.vue'
import Profile from '../pages/Profile.vue'
import Orders from '../pages/Orders.vue'
import Popular from '../pages/Popular.vue'
import About from '../pages/About.vue'
import Delivery from '../pages/Delivery.vue'
import Payment from '../pages/Payment.vue'
import Contacts from '../pages/Contacts.vue'
import Privacy from '../pages/Privacy.vue'
import Terms from '../pages/Terms.vue'
import PersonalDataConsent from '../pages/PersonalDataConsent.vue'
import Warranty from '../pages/Warranty.vue'
import Support from '../pages/Support.vue'
import OrderSuccess from '../pages/OrderSuccess.vue'
import NotFound from '../pages/NotFound.vue'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Texstiller - Главная',
      description: 'Интернет-магазин качественных тканей для дома и творчества'
    }
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: Category,
    meta: {
      title: 'Каталог тканей'
    }
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: Category,
    meta: {
      title: 'Каталог тканей'
    }
  },
  {
    path: '/product/:slug',
    name: 'Product',
    component: Product,
    meta: {
      title: 'Товар'
    }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: {
      title: 'Поиск товаров'
    }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: {
      title: 'Корзина'
    }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: {
      title: 'Вход / Регистрация',
      requiresGuest: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: 'Профиль',
      requiresAuth: true
    }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: Orders,
    meta: {
      title: 'Мои заказы',
      requiresAuth: true
    }
  },
  {
    path: '/popular',
    name: 'Popular',
    component: Popular,
    meta: {
      title: 'Популярные товары'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: {
      title: 'О нас'
    }
  },
  {
    path: '/delivery',
    name: 'Delivery',
    component: Delivery,
    meta: {
      title: 'Доставка'
    }
  },
  {
    path: '/payment',
    name: 'Payment',
    component: Payment,
    meta: {
      title: 'Оплата'
    }
  },
  {
    path: '/contacts',
    name: 'Contacts',
    component: Contacts,
    meta: {
      title: 'Контакты'
    }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
    meta: {
      title: 'Политика конфиденциальности'
    }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
    meta: {
      title: 'Условия использования'
    }
  },
  {
    path: '/personal-data-consent',
    name: 'PersonalDataConsent',
    component: PersonalDataConsent,
    meta: {
      title: 'Согласие на обработку персональных данных'
    }
  },
  {
    path: '/warranty',
    name: 'Warranty',
    component: Warranty,
    meta: {
      title: 'Гарантия'
    }
  },
  {
    path: '/support',
    name: 'Support',
    component: Support,
    meta: {
      title: 'Поддержка'
    }
  },
  {
    path: '/order-success',
    name: 'OrderSuccess',
    component: OrderSuccess,
    meta: {
      title: 'Заказ оформлен'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Страница не найдена'
    }
  }
]
