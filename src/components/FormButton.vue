<script setup>

import { RouterLink } from 'vue-router'

const props = defineProps({
  title: String,
  mode: {
    type: String,
    default: 'primary',
  },
  routeName: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    v-if="mode === 'primary'"
    type="submit"
    :disabled="loading"
    class="w-full bg-button hover:bg-button text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 flex justify-center items-center min-h-12"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else>{{ title }}</span>
  </button>
  <template v-else-if="mode === 'secondary'">
    <RouterLink
      v-if="routeName"
      :to="{ name: routeName }"
      class="w-full border border-gray-400 hover:bg-button text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 flex justify-center items-center min-h-12"
    >
      {{ title }}
    </RouterLink>

    <button
      v-else
      type="button"
       v-bind="$attrs"
      @click="$emit('click')"
      class="w-full border border-gray-400 hover:bg-button text-gray-700 font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 flex justify-center items-center min-h-12"
    >
      {{ title }}
    </button>
  </template>
    <template v-else-if="mode === 'tertiary'">
    <button
    @click="$emit('click')"
    :disabled="loading"
    class="w-full bg-button hover:bg-button text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-button focus:ring-offset-2 flex justify-center items-center min-h-12"
  >
    <span v-if="loading" class="spinner"></span>
    <span v-else>{{ title }}</span>
  </button>
  </template>
</template>

<style scoped>
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
