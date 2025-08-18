import { defineStore } from 'pinia'
import { settingsApi } from '@/services/api'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null,
    loading: false,
    error: null,
  }),

  getters: {
    // Основная информация о компании
    companyName: (state) => state.settings?.company?.name || 'Texstiller',
    companyDescription: (state) => state.settings?.company?.description || 'Качественные ткани для дома и творчества',

    // Контактная информация
    contactPhone: (state) => state.settings?.contact?.phone || '+7 (999) 123-45-67',
    contactEmail: (state) => state.settings?.contact?.email || 'info@texstiller.ru',
    contactAddress: (state) => state.settings?.contact?.address || '123456, г. Москва, ул. Примерная, д. 123, офис 456',
    workingHours: (state) => state.settings?.contact?.working_hours || 'Пн-Пт: 9:00 - 18:00',

    // Социальные сети
    socialNetworks: (state) => {
      const social = state.settings?.social || {}
      const networks = []
      
      if (social.vk) networks.push({ name: 'ВКонтакте', url: social.vk, icon: 'vk' })
      if (social.telegram) networks.push({ name: 'Telegram', url: social.telegram, icon: 'telegram' })
      if (social.instagram) networks.push({ name: 'Instagram', url: social.instagram, icon: 'instagram' })
      if (social.whatsapp) networks.push({ name: 'WhatsApp', url: social.whatsapp, icon: 'whatsapp' })
      
      return networks
    },

    // О нас
    aboutText: (state) => state.settings?.about?.text || '',
    aboutImage: (state) => state.settings?.about?.image || null,

    // Карта
    mapCoordinates: (state) => ({
      latitude: state.settings?.map?.latitude || 55.751244,
      longitude: state.settings?.map?.longitude || 37.618423,
      zoom: state.settings?.map?.zoom || 15,
    }),

    // Юридические данные
    legalData: (state) => ({
      companyName: state.settings?.legal?.company_name || 'ООО "Текстиллер"',
      companyShortName: state.settings?.legal?.company_short_name || 'ООО "Текстиллер"',
      inn: state.settings?.legal?.inn || '1234567890',
      kpp: state.settings?.legal?.kpp || '123456789',
      ogrn: state.settings?.legal?.ogrn || '1234567890123',
      address: state.settings?.legal?.address || '123456, г. Москва, ул. Примерная, д. 123, офис 456',
      director: state.settings?.legal?.director || 'Иванов Иван Иванович',
      directorPosition: state.settings?.legal?.director_position || 'Генеральный директор',
      email: state.settings?.legal?.email || 'info@texstiller.ru',
      phone: state.settings?.legal?.phone || '+7 (999) 123-45-67',
    }),

    // Проверка загрузки настроек
    isLoaded: (state) => state.settings !== null,
  },

  actions: {
    async fetchSettings() {
      if (this.loading) return
      
      this.loading = true
      this.error = null

      try {
        const response = await settingsApi.getAll()
        
        if (response.data.success) {
          this.settings = response.data.data
        } else {
          throw new Error(response.data.message || 'Ошибка при загрузке настроек')
        }
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error)
        this.error = error.message || 'Ошибка при загрузке настроек'
        
        // Устанавливаем дефолтные настройки в случае ошибки
        this.settings = {
          company: {
            name: 'Texstiller',
            description: 'Качественные ткани для дома и творчества'
          },
          contact: {
            phone: '+7 (999) 123-45-67',
            email: 'info@texstiller.ru',
            address: '123456, г. Москва, ул. Примерная, д. 123, офис 456',
            working_hours: 'Пн-Пт: 9:00 - 18:00'
          },
          social: {
            vk: '',
            telegram: '',
            instagram: '',
            whatsapp: ''
          },
          about: {
            text: '',
            image: null
          },
          map: {
            latitude: 55.751244,
            longitude: 37.618423,
            zoom: 15
          },
          legal: {
            company_name: 'ООО "Текстиллер"',
            company_short_name: 'ООО "Текстиллер"',
            inn: '1234567890',
            kpp: '123456789',
            ogrn: '1234567890123',
            address: '123456, г. Москва, ул. Примерная, д. 123, офис 456',
            director: 'Иванов Иван Иванович',
            director_position: 'Генеральный директор',
            email: 'info@texstiller.ru',
            phone: '+7 (999) 123-45-67'
          }
        }
      } finally {
        this.loading = false
      }
    },

    async fetchGroup(group) {
      try {
        const response = await settingsApi.getGroup(group)
        
        if (response.data.success) {
          return response.data.data
        } else {
          throw new Error(response.data.message || `Ошибка при загрузке настроек группы ${group}`)
        }
      } catch (error) {
        console.error(`Ошибка при загрузке настроек группы ${group}:`, error)
        throw error
      }
    },

    async fetchSetting(key) {
      try {
        const response = await settingsApi.getSetting(key)
        
        if (response.data.success) {
          return response.data.data.value
        } else {
          throw new Error(response.data.message || `Ошибка при загрузке настройки ${key}`)
        }
      } catch (error) {
        console.error(`Ошибка при загрузке настройки ${key}:`, error)
        throw error
      }
    },

    // Инициализация настроек при запуске приложения
    async init() {
      if (!this.isLoaded) {
        await this.fetchSettings()
      }
    }
  }
})
