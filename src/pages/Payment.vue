<template>
  <div>
    <v-container fluid class="py-8 px-6">
      <!-- Основные способы оплаты -->
      <v-row class="mb-12">
        <v-col cols="12">
          <h3 class="text-h4 mb-6">Доступные способы оплаты</h3>
        </v-col>
        
        <v-col
          v-for="method in paymentMethods"
          :key="method.id"
          cols="12"
          md="6"
        >
          <v-card elevation="2" class="h-100">
            <v-card-title class="d-flex align-center">
              <v-icon :color="method.color" size="40" class="mr-4">
                {{ method.icon }}
              </v-icon>
              <div>
                <div class="text-h6">{{ method.title }}</div>
                <div class="text-caption text-grey">{{ method.subtitle }}</div>
              </div>
            </v-card-title>
            
            <v-card-text>
              <p class="text-body-1 mb-4">{{ method.description }}</p>
              
              <div class="mb-3">
                <h4 class="text-subtitle-1 mb-2">Преимущества:</h4>
                <v-list density="compact">
                  <v-list-item
                    v-for="advantage in method.advantages"
                    :key="advantage"
                  >
                    <template #prepend>
                      <v-icon color="green" size="small">mdi-check</v-icon>
                    </template>
                    <v-list-item-title>{{ advantage }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
              
              <v-alert
                v-if="method.note"
                type="info"
                variant="tonal"
                density="compact"
              >
                {{ method.note }}
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Безопасность -->
      <v-row class="mb-12">
        <v-col cols="12">
          <v-card elevation="2" color="green" dark>
            <v-card-title class="text-h5">
              <v-icon start size="32">mdi-shield-lock</v-icon>
              Безопасность платежей
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <h3 class="text-h6 mb-3">Защита данных</h3>
                  <v-list dark>
                    <v-list-item>
                      <template #prepend>
                        <v-icon>mdi-lock</v-icon>
                      </template>
                      <v-list-item-title>SSL-шифрование данных</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template #prepend>
                        <v-icon>mdi-certificate</v-icon>
                      </template>
                      <v-list-item-title>PCI DSS сертификация</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template #prepend>
                        <v-icon>mdi-eye-off</v-icon>
                      </template>
                      <v-list-item-title>Данные карт не сохраняются</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col cols="12" md="6">
                  <h3 class="text-h6 mb-3">Гарантии</h3>
                  <v-list dark>
                    <v-list-item>
                      <template #prepend>
                        <v-icon>mdi-shield-check</v-icon>
                      </template>
                      <v-list-item-title>Защита от мошенничества</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template #prepend>
                        <v-icon>mdi-credit-card-refund</v-icon>
                      </template>
                      <v-list-item-title>Возврат средств при отмене</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <template #prepend>
                        <v-icon>mdi-headset</v-icon>
                      </template>
                      <v-list-item-title>Поддержка 24/7</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- FAQ по оплате -->
      <v-row>
        <v-col cols="12">
          <h3 class="text-h4 mb-6">Часто задаваемые вопросы</h3>
          
          <v-expansion-panels variant="accordion">
            <v-expansion-panel
              v-for="faq in paymentFaq"
              :key="faq.id"
            >
              <v-expansion-panel-title>
                {{ faq.question }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ faq.answer }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
const paymentMethods = [
  {
    id: 1,
    title: 'Банковской картой онлайн',
    subtitle: 'Visa, MasterCard, МИР',
    description: 'Самый быстрый и удобный способ оплаты. Оплата происходит мгновенно через защищенное соединение.',
    icon: 'mdi-credit-card',
    color: 'primary',
    advantages: [
      'Мгновенная оплата',
      'Максимальная безопасность',
      'Возможность рассрочки',
      'Кэшбэк от банка'
    ],
    note: 'Принимаются карты всех российских и международных банков'
  },
  {
    id: 2,
    title: 'Наличными при получении',
    subtitle: 'Курьеру или в пункте выдачи',
    description: 'Оплатите заказ наличными при получении товара. Удобно для тех, кто предпочитает традиционные способы оплаты.',
    icon: 'mdi-cash',
    color: 'green',
    advantages: [
      'Не нужна банковская карта',
      'Оплата при осмотре товара',
      'Привычный способ оплаты',
      'Без комиссии'
    ],
    note: 'Возможна доплата за услугу наложенного платежа'
  },
  {
    id: 3,
    title: 'Банковский перевод',
    subtitle: 'Для юридических лиц',
    description: 'Безналичная оплата по счету для организаций и ИП. Возможна отсрочка платежа для постоянных клиентов.',
    icon: 'mdi-bank',
    color: 'blue',
    advantages: [
      'Документооборот для отчетности',
      'Возможная отсрочка платежа',
      'Скидки для оптовых покупок',
      'Персональный менеджер'
    ],
    note: 'Требуется предварительное согласование условий'
  },
  {
    id: 4,
    title: 'Электронные кошельки',
    subtitle: 'PayPal, Яндекс.Деньги, WebMoney',
    description: 'Быстрая оплата через электронные платежные системы. Удобно для постоянных пользователей этих сервисов.',
    icon: 'mdi-wallet',
    color: 'orange',
    advantages: [
      'Быстрая оплата',
      'Дополнительная защита',
      'История операций',
      'Возможность возврата'
    ],
    note: 'Некоторые системы берут комиссию за перевод'
  }
]

const paymentFaq = [
  {
    id: 1,
    question: 'Безопасно ли платить картой на сайте?',
    answer: 'Да, абсолютно безопасно. Мы используем SSL-шифрование и соответствуем стандартам PCI DSS. Данные вашей карты не сохраняются на наших серверах и передаются напрямую в банк.'
  },
  {
    id: 2,
    question: 'Можно ли оплатить заказ частично?',
    answer: 'К сожалению, частичная оплата заказа не предусмотрена. Необходимо оплатить полную стоимость заказа одним платежом.'
  },
  {
    id: 3,
    question: 'Что делать, если списались деньги, но заказ не оформился?',
    answer: 'Обратитесь в нашу службу поддержки по телефону или email. Мы разберем ситуацию и либо оформим заказ, либо вернем средства в течение 3-5 рабочих дней.'
  },
  {
    id: 4,
    question: 'Можно ли вернуть деньги при отмене заказа?',
    answer: 'Да, при отмене заказа деньги возвращаются тем же способом, которым была произведена оплата, в течение 3-10 рабочих дней в зависимости от банка.'
  },
  {
    id: 5,
    question: 'Есть ли скидки при определенных способах оплаты?',
    answer: 'Да, при оплате банковской картой онлайн предоставляется скидка 2% от суммы заказа. Также действуют накопительные скидки для постоянных клиентов.'
  },
  {
    id: 6,
    question: 'Можно ли оплатить заказ в рассрочку?',
    answer: 'Да, при оплате банковской картой доступна рассрочка на 3, 6 или 12 месяцев без переплаты через партнерские банки.'
  }
]
</script>
