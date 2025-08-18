<template>
  <v-dialog
    v-model="dialog"
    max-width="400"
    persistent
  >
    <v-card class="confirm-dialog">
      <v-card-title class="text-h6 pa-4">
        <v-icon 
          :color="iconColor" 
          class="mr-2"
          size="28"
        >
          {{ icon }}
        </v-icon>
        {{ title }}
      </v-card-title>

      <v-card-text class="pa-4 pt-2">
        <p class="text-body-1 mb-0">{{ message }}</p>
      </v-card-text>

      <v-card-actions class="pa-4 pt-2">
        <v-spacer />
        
        <v-btn
          variant="outlined"
          color="grey"
          @click="onCancel"
          :disabled="loading"
        >
          {{ cancelText }}
        </v-btn>

        <v-btn
          :color="confirmColor"
          variant="flat"
          @click="onConfirm"
          :loading="loading"
          class="ml-2"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Подтверждение'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Да'
  },
  cancelText: {
    type: String,
    default: 'Отмена'
  },
  confirmColor: {
    type: String,
    default: 'red'
  },
  icon: {
    type: String,
    default: 'mdi-help-circle'
  },
  iconColor: {
    type: String,
    default: 'orange'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const dialog = ref(props.modelValue)

watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
})

watch(dialog, (newValue) => {
  emit('update:modelValue', newValue)
})

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  dialog.value = false
  emit('cancel')
}
</script>

<style scoped>
.confirm-dialog {
  border-radius: 12px !important;
}

.confirm-dialog .v-card-title {
  background: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.confirm-dialog .v-card-actions {
  background: rgba(0, 0, 0, 0.01);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
