<template>
  <div>
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    />
    
    <template v-for="category in categories" :key="category.id">
      <v-list-group
        v-if="category.children && category.children.length > 0"
        :value="category.id"
      >
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="category.name"
            @click.stop="$router.push(`/category/${category.slug}`)"
          />
        </template>
        
        <v-list-item
          v-for="child in category.children"
          :key="child.id"
          :title="child.name"
          :to="`/category/${child.slug}`"
          class="ml-4"
        />
      </v-list-group>
      
      <v-list-item
        v-else
        :title="category.name"
        :to="`/category/${category.slug}`"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { categoriesApi } from '../services/api'

const categories = ref([])
const loading = ref(false)

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

onMounted(() => {
  fetchCategories()
})
</script>
