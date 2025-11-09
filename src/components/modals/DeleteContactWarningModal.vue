<script setup>
import { defineEmits, defineProps } from 'vue'
import FormButton from '../FormButton.vue'

// Props recebidas do componente pai
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['close-warning', 'confirm-warning'])
</script>

<template>
  <div class="bg-primary rounded-lg shadow-lg p-6 w-full text-center">
    <h2 class="text-lg text-white font-semibold mb-4">Confirmar exclusão</h2>
    <p class="mb-6 text-white">Tem certeza que deseja deletar este contato?</p>
    <div class="flex justify-between gap-4">
      <FormButton
      class="text-white"
        mode="secondary"
        title="Cancel"
        @click="$emit('close-warning')"
      />
      <FormButton
        @click="$emit('confirm-warning')"
        :loading="show"
        mode="tertiary"
        title="Confirm"
      />
    </div>
  </div>
</template>
