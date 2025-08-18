<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <!-- Способы доставки -->
      <v-row class="mb-12">
        <v-col cols="12">
          <h3 class="text-h4 mb-6">Способы доставки</h3>
        </v-col>
        
        <v-col
          v-for="delivery in deliveryMethods"
          :key="delivery.id"
          cols="12"
          md="6"
        >
          <v-card elevation="2" class="h-100">
            <v-card-title class="d-flex align-center">
              <v-icon :color="delivery.color" size="32" class="mr-3">
                {{ delivery.icon }}
              </v-icon>
              {{ delivery.title }}
            </v-card-title>
            
            <v-card-text>
              <p class="text-body-1 mb-3">{{ delivery.description }}</p>
              
              <v-list density="compact">
                <v-list-item>
                  <template #prepend>
                    <v-icon color="green" size="small">mdi-clock</v-icon>
                  </template>
                  <v-list-item-title>Срок доставки: {{ delivery.time }}</v-list-item-title>
                </v-list-item>
                
                <v-list-item>
                  <template #prepend>
                    <v-icon color="blue" size="small">mdi-currency-rub</v-icon>
                  </template>
                  <v-list-item-title>Стоимость: {{ delivery.cost }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Зоны доставки -->
      <v-row class="mb-12">
        <v-col cols="12">
          <h3 class="text-h4 mb-6">Зоны доставки</h3>
          
          <v-card elevation="2">
            <v-card-text>
              <v-row>
                <v-col
                  v-for="zone in deliveryZones"
                  :key="zone.id"
                  cols="12"
                  md="4"
                >
                  <div class="text-center">
                    <v-icon :color="zone.color" size="48" class="mb-3">
                      {{ zone.icon }}
                    </v-icon>
                    <h3 class="text-h6 mb-2">{{ zone.title }}</h3>
                    <p class="text-body-2 mb-2">{{ zone.description }}</p>
                    <div class="text-caption text-grey">
                      Стоимость: {{ zone.cost }}
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Способы оплаты -->
      <v-row class="mb-12">
        <v-col cols="12">
          <h3 class="text-h4 mb-6">Способы оплаты</h3>
        </v-col>
        
        <v-col
          v-for="payment in paymentMethods"
          :key="payment.id"
          cols="12"
          sm="6"
          md="3"
        >
          <v-card elevation="2" class="text-center h-100">
            <v-card-text class="pa-6">
              <v-icon :color="payment.color" size="48" class="mb-3">
                {{ payment.icon }}
              </v-icon>
              <h3 class="text-h6 mb-2">{{ payment.title }}</h3>
              <p class="text-body-2">{{ payment.description }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Условия и гарантии -->
      <v-row>
        <v-col cols="12" md="6">
          <v-card elevation="2" color="green" dark class="h-100">
            <v-card-title>
              <v-icon start>mdi-shield-check</v-icon>
              Наши гарантии
            </v-card-title>
            <v-card-text>
              <v-list dark>
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-check</v-icon>
                  </template>
                  <v-list-item-title>Возврат товара в течение 14 дней</v-list-item-title>
                </v-list-item>
                
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-check</v-icon>
                  </template>
                  <v-list-item-title>Проверка качества перед отправкой</v-list-item-title>
                </v-list-item>
                
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-check</v-icon>
                  </template>
                  <v-list-item-title>Замена бракованного товара</v-list-item-title>
                </v-list-item>
                
                <v-list-item>
                  <template #prepend>
                    <v-icon>mdi-check</v-icon>
                  </template>
                  <v-list-item-title>Компенсация при повреждении при доставке</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card elevation="2" color="blue" dark class="h-100">
            <v-card-title>
              <v-icon start>mdi-information</v-icon>
              Важная информация
            </v-card-title>
            <v-card-text>
              <v-list dark>
                <v-list-item>
                  <v-list-item-title>Минимальная сумма заказа: 1000 ₽</v-list-item-title>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>Бесплатная доставка от 5000 ₽</v-list-item-title>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>Обработка заказов: пн-пт 9:00-18:00</v-list-item-title>
                </v-list-item>
                
                <v-list-item>
                  <v-list-item-title>Отправка заказов: пн-пт 10:00-17:00</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const deliveryMethods = [
  {
    id: 1,
    title: 'Курьерская доставка',
    description: 'Доставка до двери курьером в удобное для вас время',
    time: '1-3 рабочих дня',
    cost: 'от 300 ₽',
    icon: 'mdi-truck',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Пункт выдачи заказов',
    description: 'Получение заказа в удобном пункте выдачи',
    time: '1-2 рабочих дня',
    cost: 'от 150 ₽',
    icon: 'mdi-store',
    color: 'green'
  },
  {
    id: 3,
    title: 'Почта России',
    description: 'Доставка почтой России до ближайшего почтового отделения',
    time: '5-10 рабочих дней',
    cost: 'от 200 ₽',
    icon: 'mdi-email',
    color: 'blue'
  },
  {
    id: 4,
    title: 'Самовывоз',
    description: 'Забрать заказ самостоятельно из нашего офиса',
    time: 'в день заказа',
    cost: 'бесплатно',
    icon: 'mdi-car',
    color: 'orange'
  }
]

const deliveryZones = [
  {
    id: 1,
    title: 'Москва и МО',
    description: 'В пределах МКАД и Московской области',
    cost: 'от 300 ₽',
    icon: 'mdi-city',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Россия',
    description: 'Доставка по всей территории России',
    cost: 'от 400 ₽',
    icon: 'mdi-earth',
    color: 'green'
  },
  {
    id: 3,
    title: 'СНГ',
    description: 'Страны СНГ и ближнего зарубежья',
    cost: 'от 800 ₽',
    icon: 'mdi-airplane',
    color: 'blue'
  }
]

const paymentMethods = [
  {
    id: 1,
    title: 'Банковской картой',
    description: 'Visa, MasterCard, МИР',
    icon: 'mdi-credit-card',
    color: 'primary'
  },
  {
    id: 2,
    title: 'Наличными',
    description: 'При получении заказа',
    icon: 'mdi-cash',
    color: 'green'
  },
  {
    id: 3,
    title: 'Банковский перевод',
    description: 'Для юридических лиц',
    icon: 'mdi-bank',
    color: 'blue'
  },
  {
    id: 4,
    title: 'Электронные деньги',
    description: 'PayPal, Яндекс.Деньги',
    icon: 'mdi-wallet',
    color: 'orange'
  }
]
</script>
