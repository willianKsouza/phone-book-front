<script setup>
const model = defineModel()

const inputOptions = {
  styleClasses:
    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition',
  placeholder: '1199999-9999',
  maxlength: 15,
}
defineProps({
  label: String,
  type: String,
  placeholder: String,
  error: String,
})
</script>
<template>
  <div v-if="label == 'Phone'">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <vue-tel-input
      :inputOptions="inputOptions"
      v-model="model"
      mode="international"
    ></vue-tel-input>
  </div>
  <div v-else>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      v-model="model"
      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
    />
    <p
      v-if="error"
      class="text-red-500 text-sm mt-1"
    >
      {{ error }}
    </p>
  </div>
</template>
