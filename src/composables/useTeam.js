import { ref, computed } from 'vue'
import { api } from '@/services/api'

export function useTeam() {
  
  const team = ref([])
  const loading = ref(false)
  const error = ref(null)

  /**
   * Получить список активных сотрудников команды
   */
  const fetchTeam = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get('/team')
      
      if (response.data.success) {
        team.value = response.data.data
      } else {
        throw new Error(response.data.message || 'Ошибка при получении данных команды')
      }
    } catch (err) {
      console.error('Error fetching team:', err)
      error.value = err.response?.data?.message || err.message || 'Ошибка при загрузке команды'
      team.value = []
    } finally {
      loading.value = false
    }
  }

  /**
   * Получить информацию о конкретном сотруднике
   */
  const fetchTeamMember = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get(`/team/${id}`)
      
      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.message || 'Ошибка при получении данных сотрудника')
      }
    } catch (err) {
      console.error('Error fetching team member:', err)
      error.value = err.response?.data?.message || err.message || 'Ошибка при загрузке сотрудника'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * Проверить, есть ли данные команды
   */
  const hasTeam = computed(() => team.value && team.value.length > 0)

  /**
   * Получить количество сотрудников
   */
  const teamCount = computed(() => team.value ? team.value.length : 0)

  return {
    team,
    loading,
    error,
    hasTeam,
    teamCount,
    fetchTeam,
    fetchTeamMember
  }
}
