import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const query = ref('')
  const isSearching = ref(false)
  const results = ref([])
  const totalResults = ref(0)
  const currentPage = ref(1)
  const totalPages = ref(0)

  const setQuery = (newQuery) => {
    query.value = newQuery
  }

  const clearQuery = () => {
    query.value = ''
    results.value = []
    totalResults.value = 0
    currentPage.value = 1
    totalPages.value = 0
  }

  const setResults = (data) => {
    results.value = data.data || []
    totalResults.value = data.total || 0
    currentPage.value = data.current_page || 1
    totalPages.value = data.last_page || 0
  }

  const setSearching = (status) => {
    isSearching.value = status
  }

  return {
    query,
    isSearching,
    results,
    totalResults,
    currentPage,
    totalPages,
    setQuery,
    clearQuery,
    setResults,
    setSearching
  }
})
