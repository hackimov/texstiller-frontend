<template>
  <div class="d-flex justify-center align-center my-16" :style="containerStyle">
    <v-progress-circular
      indeterminate
      color="primary"
      :size="size"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: [String, Number],
    default: 48
  },
  height: {
    type: String,
    default: '50vh'
  }
})

const containerStyle = computed(() => ({
  minHeight: props.height
}))
</script>
