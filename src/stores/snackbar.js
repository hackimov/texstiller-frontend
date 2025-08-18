import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const visible = ref(false)
  const message = ref('')
  const color = ref('success')
  const timeout = ref(3000)

  const show = ({ message: msg, color: colorType = 'success', timeout: timeoutMs = 3000 }) => {
    message.value = msg
    color.value = colorType
    timeout.value = timeoutMs
    visible.value = true
  }

  const hide = () => {
    visible.value = false
  }

  return {
    visible,
    message,
    color,
    timeout,
    show,
    hide
  }
})
